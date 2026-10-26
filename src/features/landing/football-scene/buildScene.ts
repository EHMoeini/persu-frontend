import {
    BoxGeometry,
    BufferGeometry,
    CircleGeometry,
    Color,
    CylinderGeometry,
    DirectionalLight,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    HemisphereLight,
    IcosahedronGeometry,
    LineBasicMaterial,
    LineSegments,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    Object3D,
    Shape,
    Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import {
    BALL_POSITION,
    BALL_RADIUS,
    COLORS,
    GOAL,
    PITCH,
    PLAYERS,
    PLAYER_SCALE,
    type PlayerSpec,
} from './sceneConfig';

/** An object that starts hidden above the pitch and falls to `restY`. */
export type DropTarget = {
    object: Object3D;
    /** Blob shadow on the pitch; grows as the object approaches. */
    shadow: Object3D;
    restY: number;
    /** Distance from the object's origin down to its lowest point. */
    bottomOffset: number;
    spin: boolean;
};

export type FootballScene = {
    root: Group;
    /** Everything that moves with the pitch; lights stay outside this group. */
    pitch: Group;
    goals: DropTarget[];
    players: DropTarget[];
    ball: DropTarget;
    dispose: () => void;
};

const LINE_Y = 0.008;
const BAND_Y = 0.003;
const SHADOW_Y = 0.014;

/**
 * Builds the complete low-poly scene graph. Pure three.js, no React.
 * Geometries and materials are shared wherever possible; draw calls stay
 * around 20 for the whole scene.
 */
export function buildFootballScene(): FootballScene {
    const geometries: BufferGeometry[] = [];
    const materials: Material[] = [];
    const keepGeo = <T extends BufferGeometry>(g: T) => (geometries.push(g), g);
    const keepMat = <T extends Material>(m: T) => (materials.push(m), m);

    const root = new Group();
    root.name = 'football-scene';

    const pitch = new Group();
    pitch.name = 'football-pitch';
    root.add(pitch);

    // Lighting: one sky/ground fill plus one key light. No real-time shadows.
    // Lights stay on the root so the pitch catches the light as it moves.
    root.add(new HemisphereLight('#ffffff', '#41604a', 1.7));
    const sun = new DirectionalLight('#fff6e8', 2.1);
    sun.position.set(5, 12, 7);
    root.add(sun);

    const shadowGeo = keepGeo(new CircleGeometry(1, 10).rotateX(-Math.PI / 2));
    const shadowMat = keepMat(
        new MeshBasicMaterial({
            color: COLORS.shadow,
            transparent: true,
            opacity: 0.28,
            depthWrite: false,
        }),
    );
    const makeShadow = (x: number, z: number, sx: number, sz: number, rotationY = 0) => {
        const shadow = new Mesh(shadowGeo, shadowMat);
        shadow.position.set(x, SHADOW_Y, z);
        shadow.rotation.y = rotationY;
        shadow.scale.set(sx, 1, sz);
        shadow.visible = false;
        pitch.add(shadow);
        return shadow;
    };

    // ---------------------------------------------------------------- pitch
    const surfaceW = PITCH.width + PITCH.margin * 2;
    const surfaceL = PITCH.length + PITCH.margin * 2;

    const edgeMat = keepMat(new MeshBasicMaterial({ color: COLORS.pitchEdge }));
    const grassDarkMat = keepMat(new MeshBasicMaterial({ color: COLORS.grassDark }));

    // A thick extruded rounded rectangle: rounded plan corners, softly beveled
    // top/bottom edges, and a visible grass edge instead of a paper-thin plane.
    const slabShape = roundedRectShape(surfaceW, surfaceL, PITCH.cornerRadius);
    const slabGeo = new ExtrudeGeometry(slabShape, {
        depth: PITCH.thickness,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.08,
        bevelSegments: 2,
        curveSegments: 12,
        steps: 1,
    });
    slabGeo.rotateX(-Math.PI / 2);
    slabGeo.computeBoundingBox();
    slabGeo.translate(0, -(slabGeo.boundingBox?.max.y ?? 0), 0);
    const slab = new Mesh(keepGeo(slabGeo), [grassDarkMat, edgeMat]);
    pitch.add(slab);

    // Keep the mowing bands inside the rounded top cap so their square corners
    // never overhang the rounded plan silhouette.
    const stripeInset = PITCH.cornerRadius + 0.1;
    const bands = new FlatShape(BAND_Y);
    const bandLength = surfaceL / PITCH.bandCount;
    for (let i = 0; i < PITCH.bandCount; i += 2) {
        const z0 = -surfaceL / 2 + i * bandLength + (i === 0 ? stripeInset : 0);
        bands.rect(-surfaceW / 2 + stripeInset, z0, surfaceW / 2 - stripeInset, z0 + bandLength);
    }
    pitch.add(
        new Mesh(
            keepGeo(bands.build()),
            keepMat(new MeshBasicMaterial({ color: COLORS.grassLight, side: DoubleSide })),
        ),
    );

    pitch.add(
        new Mesh(
            keepGeo(buildMarkings()),
            keepMat(new MeshBasicMaterial({ color: COLORS.lines, side: DoubleSide })),
        ),
    );

    // ---------------------------------------------------------------- goals
    const goalFrameGeo = keepGeo(buildGoalFrame());
    const netPanelGeo = keepGeo(buildNetPanels());
    const netLineGeo = keepGeo(buildNetLines());
    const goalMat = keepMat(new MeshLambertMaterial({ color: COLORS.goal, flatShading: true }));
    const netPanelMat = keepMat(
        new MeshBasicMaterial({
            color: COLORS.net,
            transparent: true,
            opacity: 0.16,
            side: DoubleSide,
            depthWrite: false,
        }),
    );
    const netLineMat = keepMat(
        new LineBasicMaterial({ color: COLORS.net, transparent: true, opacity: 0.6 }),
    );

    const goals: DropTarget[] = [1, -1].map((side) => {
        const goal = new Group();
        goal.add(
            new Mesh(goalFrameGeo, goalMat),
            new Mesh(netPanelGeo, netPanelMat),
            new LineSegments(netLineGeo, netLineMat),
        );
        // Goals are built with the net extending toward local +z (behind the goal line).
        goal.position.set(0, 0, (side * PITCH.length) / 2);
        goal.rotation.y = side > 0 ? 0 : Math.PI;
        goal.visible = false;
        pitch.add(goal);
        const shadow = makeShadow(
            0,
            side * (PITCH.length / 2 + GOAL.depth * 0.45),
            GOAL.width / 2 + 0.35,
            GOAL.depth * 0.75,
        );
        return { object: goal, shadow, restY: 0, bottomOffset: 0, spin: false };
    });

    // -------------------------------------------------------------- players
    const playerMat = keepMat(new MeshLambertMaterial({ vertexColors: true, flatShading: true }));
    const playerGeoCache = new Map<string, BufferGeometry>();
    const players: DropTarget[] = PLAYERS.map((spec) => {
        const key = `${spec.team}|${spec.hair}`;
        let geo = playerGeoCache.get(key);
        if (!geo) {
            geo = keepGeo(buildPlayerGeometry(spec));
            playerGeoCache.set(key, geo);
        }
        const player = new Mesh(geo, playerMat);
        const [x, z] = spec.position;
        player.position.set(x, 0, z);
        player.rotation.y = spec.rotationY;
        player.visible = false;
        pitch.add(player);
        const shadow = makeShadow(x, z, 0.38 * PLAYER_SCALE, 0.3 * PLAYER_SCALE, spec.rotationY);
        return { object: player, shadow, restY: 0, bottomOffset: 0, spin: false };
    });

    // ----------------------------------------------------------------- ball
    const ballMesh = new Mesh(
        keepGeo(buildBallGeometry(BALL_RADIUS)),
        keepMat(new MeshLambertMaterial({ vertexColors: true, flatShading: true })),
    );
    const [bx, bz] = BALL_POSITION;
    ballMesh.position.set(bx, BALL_RADIUS, bz);
    ballMesh.visible = false;
    pitch.add(ballMesh);
    const ball: DropTarget = {
        object: ballMesh,
        shadow: makeShadow(bx, bz, BALL_RADIUS * 1.1, BALL_RADIUS * 1.1),
        restY: BALL_RADIUS,
        bottomOffset: BALL_RADIUS,
        spin: true,
    };

    return {
        root,
        pitch,
        goals,
        players,
        ball,
        dispose: () => {
            geometries.forEach((g) => g.dispose());
            materials.forEach((m) => m.dispose());
            root.clear();
        },
    };
}

// ------------------------------------------------------------------ pitch

/** Centered rounded rectangle used for the extruded pitch slab. */
function roundedRectShape(width: number, depth: number, radius: number) {
    const r = Math.min(radius, width / 2, depth / 2);
    const hw = width / 2;
    const hd = depth / 2;
    const shape = new Shape();
    shape.moveTo(-hw + r, -hd);
    shape.lineTo(hw - r, -hd);
    shape.quadraticCurveTo(hw, -hd, hw, -hd + r);
    shape.lineTo(hw, hd - r);
    shape.quadraticCurveTo(hw, hd, hw - r, hd);
    shape.lineTo(-hw + r, hd);
    shape.quadraticCurveTo(-hw, hd, -hw, hd - r);
    shape.lineTo(-hw, -hd + r);
    shape.quadraticCurveTo(-hw, -hd, -hw + r, -hd);
    return shape;
}

/** Collects flat triangles on a horizontal plane into one geometry. */
class FlatShape {
    private positions: number[] = [];
    constructor(private y: number) {}

    private quad(a: Pt, b: Pt, c: Pt, d: Pt) {
        const y = this.y;
        this.positions.push(
            a[0],
            y,
            a[1],
            b[0],
            y,
            b[1],
            c[0],
            y,
            c[1],
            a[0],
            y,
            a[1],
            c[0],
            y,
            c[1],
            d[0],
            y,
            d[1],
        );
    }

    rect(x0: number, z0: number, x1: number, z1: number) {
        this.quad([x0, z0], [x1, z0], [x1, z1], [x0, z1]);
    }

    /** A line of width `w` from a to b, extended by w/2 at both ends so joints close. */
    segment(a: Pt, b: Pt, w: number) {
        const dx = b[0] - a[0];
        const dz = b[1] - a[1];
        const len = Math.hypot(dx, dz) || 1;
        const ux = dx / len;
        const uz = dz / len;
        const h = w / 2;
        const ax = a[0] - ux * h;
        const az = a[1] - uz * h;
        const bx = b[0] + ux * h;
        const bz = b[1] + uz * h;
        const nx = -uz * h;
        const nz = ux * h;
        this.quad([ax + nx, az + nz], [bx + nx, bz + nz], [bx - nx, bz - nz], [ax - nx, az - nz]);
    }

    polyline(points: Pt[], w: number, closed = false) {
        for (let i = 0; i < points.length - 1; i++) this.segment(points[i], points[i + 1], w);
        if (closed) this.segment(points[points.length - 1], points[0], w);
    }

    disc(cx: number, cz: number, r: number, segments = 8) {
        const y = this.y;
        for (let i = 0; i < segments; i++) {
            const a0 = (i / segments) * Math.PI * 2;
            const a1 = ((i + 1) / segments) * Math.PI * 2;
            this.positions.push(
                cx,
                y,
                cz,
                cx + Math.cos(a0) * r,
                y,
                cz + Math.sin(a0) * r,
                cx + Math.cos(a1) * r,
                y,
                cz + Math.sin(a1) * r,
            );
        }
    }

    build() {
        const geo = new BufferGeometry();
        geo.setAttribute('position', new Float32BufferAttribute(this.positions, 3));
        return geo;
    }
}

type Pt = [number, number];

function arc(cx: number, cz: number, r: number, a0: number, a1: number, segments: number): Pt[] {
    const pts: Pt[] = [];
    for (let i = 0; i <= segments; i++) {
        const a = a0 + ((a1 - a0) * i) / segments;
        pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
    }
    return pts;
}

function buildMarkings() {
    const hw = PITCH.width / 2;
    const hl = PITCH.length / 2;
    const w = PITCH.lineWidth;
    const m = new FlatShape(LINE_Y);

    m.polyline(
        [
            [-hw, -hl],
            [hw, -hl],
            [hw, hl],
            [-hw, hl],
        ],
        w,
        true,
    );
    m.segment([-hw, 0], [hw, 0], w);
    m.polyline(arc(0, 0, PITCH.centreCircleRadius, 0, Math.PI * 2, 28), w);
    m.disc(0, 0, PITCH.spotRadius);

    for (const s of [1, -1]) {
        for (const box of [PITCH.penaltyArea, PITCH.goalArea]) {
            const bx = box.width / 2;
            const bz = s * (hl - box.depth);
            m.polyline(
                [
                    [-bx, s * hl],
                    [-bx, bz],
                    [bx, bz],
                    [bx, s * hl],
                ],
                w,
            );
        }
        m.disc(0, s * (hl - PITCH.penaltySpotDistance), PITCH.spotRadius);
    }

    for (const sx of [1, -1]) {
        for (const sz of [1, -1]) {
            const r = PITCH.cornerArcRadius;
            const pts: Pt[] = [];
            for (let i = 0; i <= 5; i++) {
                const t = (i / 5) * (Math.PI / 2);
                pts.push([sx * hw - sx * r * Math.cos(t), sz * hl - sz * r * Math.sin(t)]);
            }
            m.polyline(pts, w * 0.9);
        }
    }
    return m.build();
}

// ------------------------------------------------------------------ goals

function box(sx: number, sy: number, sz: number, x: number, y: number, z: number) {
    return new BoxGeometry(sx, sy, sz).translate(x, y, z);
}

function buildGoalFrame() {
    const { width: gw, height: h, depth: d, postSize: ps } = GOAL;
    const px = gw / 2 + ps / 2;
    const thin = ps * 0.5;
    const parts = [
        box(ps, h, ps, -px, h / 2, 0),
        box(ps, h, ps, px, h / 2, 0),
        box(gw + ps * 2, ps, ps, 0, h - ps / 2, 0),
        // Ground frame holding the net.
        box(gw + ps * 2, thin, thin, 0, thin / 2, d),
        box(thin, thin, d, -px, thin / 2, d / 2),
        box(thin, thin, d, px, thin / 2, d / 2),
    ];
    const merged = mergeGeometries(parts)!;
    parts.forEach((p) => p.dispose());
    return merged;
}

function netShape() {
    const { width: gw, height: h, depth: d, postSize: ps } = GOAL;
    return { xs: gw / 2 + ps / 2, h, hb: h * 0.78, d };
}

function buildNetPanels() {
    const { xs, h, hb, d } = netShape();
    const p: number[] = [];
    const quad = (a: number[], b: number[], c: number[], e: number[]) =>
        p.push(...a, ...b, ...c, ...a, ...c, ...e);
    quad([-xs, h, 0], [xs, h, 0], [xs, hb, d], [-xs, hb, d]); // roof
    quad([-xs, hb, d], [xs, hb, d], [xs, 0, d], [-xs, 0, d]); // back
    for (const s of [-1, 1]) quad([s * xs, 0, 0], [s * xs, h, 0], [s * xs, hb, d], [s * xs, 0, d]); // sides
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(p, 3));
    return geo;
}

/** A sparse grid of lines over the net panels. */
function buildNetLines() {
    const { xs, h, hb, d } = netShape();
    const p: number[] = [];
    const line = (a: number[], b: number[]) => p.push(...a, ...b);
    const columns = 5;
    for (let i = 0; i <= columns; i++) {
        const x = -xs + (2 * xs * i) / columns;
        line([x, h, 0], [x, hb, d]);
        line([x, hb, d], [x, 0, d]);
    }
    for (const y of [hb / 3, (2 * hb) / 3]) {
        line([-xs, y, d], [xs, y, d]);
        for (const s of [-1, 1]) line([s * xs, y, 0], [s * xs, y, d]);
    }
    const midY = (h + hb) / 2;
    line([-xs, midY, d / 2], [xs, midY, d / 2]);
    for (const s of [-1, 1]) line([s * xs, 0, d / 2], [s * xs, midY, d / 2]);
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(p, 3));
    return geo;
}

// ---------------------------------------------------------------- players

function paint(geo: BufferGeometry, hex: string) {
    const c = new Color(hex);
    const count = geo.getAttribute('position').count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) colors.set([c.r, c.g, c.b], i * 3);
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
}

/** One merged, vertex-coloured geometry per player look (one draw call per player). */
function buildPlayerGeometry(spec: PlayerSpec) {
    const kit = COLORS.teams[spec.team];
    const parts: BufferGeometry[] = [];
    const add = (geo: BufferGeometry, color: string) => {
        const flat = geo.index ? geo.toNonIndexed() : geo;
        if (flat !== geo) geo.dispose();
        flat.deleteAttribute('uv');
        paint(flat, color);
        parts.push(flat);
    };
    const part = (
        sx: number,
        sy: number,
        sz: number,
        x: number,
        y: number,
        z: number,
        color: string,
        rz = 0,
    ) => add(new BoxGeometry(sx, sy, sz).rotateZ(rz).translate(x, y, z), color);

    for (const s of [-1, 1]) {
        part(0.15, 0.09, 0.25, s * 0.1, 0.045, 0.04, COLORS.boots);
        part(0.12, 0.24, 0.12, s * 0.1, 0.21, 0, kit.socks);
        part(0.12, 0.14, 0.12, s * 0.1, 0.4, 0, COLORS.skin);
        part(0.12, 0.16, 0.13, s * 0.29, 1.04, 0, kit.shirt, s * 0.12);
        part(0.1, 0.26, 0.1, s * 0.315, 0.83, 0, COLORS.skin, s * 0.12);
    }
    part(0.36, 0.2, 0.22, 0, 0.57, 0, kit.shorts);
    // Tapered four-sided torso.
    add(
        new CylinderGeometry(0.33, 0.26, 0.46, 4)
            .rotateY(Math.PI / 4)
            .scale(1, 1, 0.6)
            .translate(0, 0.9, 0),
        kit.shirt,
    );
    part(0.3, 0.3, 0.3, 0, 1.29, 0, COLORS.skin);
    part(0.32, 0.09, 0.32, 0, 1.44, -0.01, spec.hair);
    part(0.32, 0.18, 0.07, 0, 1.36, -0.135, spec.hair);

    const merged = mergeGeometries(parts)!;
    parts.forEach((p) => p.dispose());
    if (PLAYER_SCALE !== 1) merged.scale(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
    return merged;
}

// ------------------------------------------------------------------- ball

/** Faceted icosphere; faces around the 12 icosahedron vertices are dark "panels". */
function buildBallGeometry(radius: number) {
    const geo = new IcosahedronGeometry(radius, 2);
    geo.deleteAttribute('uv');

    const base = new IcosahedronGeometry(1, 0);
    const basePos = base.getAttribute('position');
    const dirs: Vector3[] = [];
    for (let i = 0; i < basePos.count; i++) {
        const v = new Vector3().fromBufferAttribute(basePos, i).normalize();
        if (!dirs.some((d) => d.distanceToSquared(v) < 1e-6)) dirs.push(v);
    }
    base.dispose();

    const pos = geo.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const light = new Color(COLORS.ballLight);
    const dark = new Color(COLORS.ballDark);
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    for (let i = 0; i < pos.count; i += 3) {
        a.fromBufferAttribute(pos, i);
        b.fromBufferAttribute(pos, i + 1);
        c.fromBufferAttribute(pos, i + 2);
        const centroid = a.add(b).add(c).normalize();
        const isPanel = dirs.some((d) => d.dot(centroid) > 0.955);
        const col = isPanel ? dark : light;
        for (let k = 0; k < 3; k++) colors.set([col.r, col.g, col.b], (i + k) * 3);
    }
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    return geo;
}
