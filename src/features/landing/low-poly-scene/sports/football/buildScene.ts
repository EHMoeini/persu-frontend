import {
    BufferGeometry,
    CircleGeometry,
    DirectionalLight,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    HemisphereLight,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

import {
    arc,
    box,
    buildPanelBallGeometry,
    buildPlayerGeometry,
    disposeObject,
    FlatShape,
    roundedRectShape,
    type Pt,
} from '../../buildUtils';
import type { LowPolyModel } from '../../types';
import {
    BALL_POSITION,
    BALL_RADIUS,
    COLORS,
    GOAL,
    PITCH,
    PLAYERS,
    PLAYER_SCALE,
} from './sceneConfig';

const LINE_Y = 0.008;
const BAND_Y = 0.003;
const SHADOW_Y = 0.014;

/**
 * Builds the complete low-poly football scene graph. Pure three.js, no React.
 * Geometries and materials are shared wherever possible; draw calls stay
 * around 20 for the whole scene.
 */
export function buildFootballScene(): LowPolyModel {
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

    const shadowGeo = new CircleGeometry(1, 10).rotateX(-Math.PI / 2);
    const shadowMat = new MeshBasicMaterial({
        color: COLORS.shadow,
        transparent: true,
        opacity: 0.28,
        depthWrite: false,
    });
    const makeShadow = (x: number, z: number, sx: number, sz: number, rotationY = 0) => {
        const shadow = new Mesh(shadowGeo, shadowMat);
        shadow.position.set(x, SHADOW_Y, z);
        shadow.rotation.y = rotationY;
        shadow.scale.set(sx, 1, sz);
        pitch.add(shadow);
    };

    // ---------------------------------------------------------------- pitch
    const surfaceW = PITCH.width + PITCH.margin * 2;
    const surfaceL = PITCH.length + PITCH.margin * 2;

    const edgeMat = new MeshBasicMaterial({ color: COLORS.pitchEdge });
    const grassDarkMat = new MeshBasicMaterial({ color: COLORS.grassDark });

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
    const slab = new Mesh(slabGeo, [grassDarkMat, edgeMat]);
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
            bands.build(),
            new MeshBasicMaterial({ color: COLORS.grassLight, side: DoubleSide }),
        ),
    );

    pitch.add(
        new Mesh(buildMarkings(), new MeshBasicMaterial({ color: COLORS.lines, side: DoubleSide })),
    );

    // ---------------------------------------------------------------- goals
    const goalFrameGeo = buildGoalFrame();
    const netPanelGeo = buildNetPanels();
    const netLineGeo = buildNetLines();
    const goalMat = new MeshLambertMaterial({ color: COLORS.goal, flatShading: true });
    const netPanelMat = new MeshBasicMaterial({
        color: COLORS.net,
        transparent: true,
        opacity: 0.16,
        side: DoubleSide,
        depthWrite: false,
    });
    const netLineMat = new LineBasicMaterial({
        color: COLORS.net,
        transparent: true,
        opacity: 0.6,
    });

    for (const side of [1, -1]) {
        const goal = new Group();
        goal.add(
            new Mesh(goalFrameGeo, goalMat),
            new Mesh(netPanelGeo, netPanelMat),
            new LineSegments(netLineGeo, netLineMat),
        );
        // Goals are built with the net extending toward local +z (behind the goal line).
        goal.position.set(0, 0, (side * PITCH.length) / 2);
        goal.rotation.y = side > 0 ? 0 : Math.PI;
        pitch.add(goal);
        makeShadow(
            0,
            side * (PITCH.length / 2 + GOAL.depth * 0.45),
            GOAL.width / 2 + 0.35,
            GOAL.depth * 0.75,
        );
    }

    // -------------------------------------------------------------- players
    const playerMat = new MeshLambertMaterial({ vertexColors: true, flatShading: true });
    const playerGeoCache = new Map<string, BufferGeometry>();
    for (const spec of PLAYERS) {
        const key = `${spec.team}|${spec.hair}`;
        let geo = playerGeoCache.get(key);
        if (!geo) {
            geo = buildPlayerGeometry({
                kit: COLORS.teams[spec.team],
                hair: spec.hair,
                scale: PLAYER_SCALE,
                skin: COLORS.skin,
                boots: COLORS.boots,
            });
            playerGeoCache.set(key, geo);
        }
        const player = new Mesh(geo, playerMat);
        const [x, z] = spec.position;
        player.position.set(x, 0, z);
        player.rotation.y = spec.rotationY;
        pitch.add(player);
        makeShadow(x, z, 0.38 * PLAYER_SCALE, 0.3 * PLAYER_SCALE, spec.rotationY);
    }

    // ----------------------------------------------------------------- ball
    const ballMesh = new Mesh(
        buildPanelBallGeometry(BALL_RADIUS, COLORS.ballLight, COLORS.ballDark),
        new MeshLambertMaterial({ vertexColors: true, flatShading: true }),
    );
    const [bx, bz] = BALL_POSITION;
    ballMesh.position.set(bx, BALL_RADIUS, bz);
    pitch.add(ballMesh);
    makeShadow(bx, bz, BALL_RADIUS * 1.1, BALL_RADIUS * 1.1);

    return {
        root,
        content: pitch,
        dispose: () => {
            disposeObject(root);
            root.clear();
        },
    };
}

// ------------------------------------------------------------------ pitch

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
        for (const boxShape of [PITCH.penaltyArea, PITCH.goalArea]) {
            const bx = boxShape.width / 2;
            const bz = s * (hl - boxShape.depth);
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
