import {
    BoxGeometry,
    BufferGeometry,
    CircleGeometry,
    Color,
    CylinderGeometry,
    DoubleSide,
    Float32BufferAttribute,
    Group,
    IcosahedronGeometry,
    Line,
    LineSegments,
    Material,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    Object3D,
    Shape,
    SphereGeometry,
    TorusGeometry,
    Vector3,
} from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

export type Pt = [number, number];

/** Collects flat triangles on a horizontal plane into one geometry. */
export class FlatShape {
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

export function arc(
    cx: number,
    cz: number,
    r: number,
    a0: number,
    a1: number,
    segments: number,
): Pt[] {
    const pts: Pt[] = [];
    for (let i = 0; i <= segments; i++) {
        const a = a0 + ((a1 - a0) * i) / segments;
        pts.push([cx + Math.cos(a) * r, cz + Math.sin(a) * r]);
    }
    return pts;
}

export function box(sx: number, sy: number, sz: number, x: number, y: number, z: number) {
    return new BoxGeometry(sx, sy, sz).translate(x, y, z);
}

/** Centered rounded rectangle used for the extruded court slab. */
export function roundedRectShape(width: number, depth: number, radius: number) {
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

export function paint(geo: BufferGeometry, hex: string) {
    const c = new Color(hex);
    const count = geo.getAttribute('position').count;
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) colors.set([c.r, c.g, c.b], i * 3);
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
}

export type PlayerKit = {
    shirt: string;
    shorts: string;
    socks: string;
};

export type PlayerLook = {
    kit: PlayerKit;
    hair: string;
    scale?: number;
    skin?: string;
    boots?: string;
    kneePads?: string;
};

/**
 * One merged, vertex-coloured geometry per player look, so every player is a
 * single draw call. The player faces local +z.
 */
export function buildPlayerGeometry({
    kit,
    hair,
    scale = 1,
    skin = '#e2ae86',
    boots = '#1c1d24',
    kneePads,
}: PlayerLook) {
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
        part(0.15, 0.09, 0.25, s * 0.1, 0.045, 0.04, boots);
        part(0.12, 0.24, 0.12, s * 0.1, 0.21, 0, kit.socks);
        part(0.12, 0.14, 0.12, s * 0.1, 0.4, 0, skin);
        part(0.12, 0.16, 0.13, s * 0.29, 1.04, 0, kit.shirt, s * 0.12);
        part(0.1, 0.26, 0.1, s * 0.315, 0.83, 0, skin, s * 0.12);
        if (kneePads) part(0.13, 0.07, 0.13, s * 0.1, 0.335, 0.005, kneePads);
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
    part(0.3, 0.3, 0.3, 0, 1.29, 0, skin);
    part(0.32, 0.09, 0.32, 0, 1.44, -0.01, hair);
    part(0.32, 0.18, 0.07, 0, 1.36, -0.135, hair);

    const merged = mergeGeometries(parts)!;
    parts.forEach((p) => p.dispose());
    if (scale !== 1) merged.scale(scale, scale, scale);
    return merged;
}

/**
 * Faceted volleyball: six longitudinal sections, each split into three
 * latitude panels, cycling through white, blue and yellow. The flat-shaded
 * colour breaks read as the stitched panel seams.
 */
export function buildVolleyballGeometry(
    radius: number,
    white: string,
    blue: string,
    yellow: string,
) {
    const sphere = new SphereGeometry(radius, 24, 12);
    const geo = sphere.toNonIndexed();
    sphere.dispose();
    geo.deleteAttribute('uv');

    const pos = geo.getAttribute('position');
    const colors = new Float32Array(pos.count * 3);
    const palette = [new Color(blue), new Color(white), new Color(yellow)];
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();

    for (let i = 0; i < pos.count; i += 3) {
        a.fromBufferAttribute(pos, i);
        b.fromBufferAttribute(pos, i + 1);
        c.fromBufferAttribute(pos, i + 2);
        const centroid = a.add(b).add(c).divideScalar(3);

        const longitude = Math.atan2(centroid.z, centroid.x);
        const latitude = Math.asin(Math.min(1, Math.max(-1, centroid.y / radius)));
        const section = Math.floor(((longitude + Math.PI) / (2 * Math.PI)) * 6) % 6;
        const band = Math.min(2, Math.max(0, Math.floor(((latitude + Math.PI / 2) / Math.PI) * 3)));
        const col = palette[(section + band) % 3];

        for (let k = 0; k < 3; k++) colors.set([col.r, col.g, col.b], (i + k) * 3);
    }

    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    return geo;
}

/** Faceted icosphere; faces around the 12 icosahedron vertices form dark panels. */
export function buildPanelBallGeometry(
    radius: number,
    light: string,
    dark: string,
    panelThreshold = 0.955,
) {
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
    const lightColor = new Color(light);
    const darkColor = new Color(dark);
    const a = new Vector3();
    const b = new Vector3();
    const c = new Vector3();
    for (let i = 0; i < pos.count; i += 3) {
        a.fromBufferAttribute(pos, i);
        b.fromBufferAttribute(pos, i + 1);
        c.fromBufferAttribute(pos, i + 2);
        const centroid = a.add(b).add(c).normalize();
        const isPanel = dirs.some((d) => d.dot(centroid) > panelThreshold);
        const col = isPanel ? darkColor : lightColor;
        for (let k = 0; k < 3; k++) colors.set([col.r, col.g, col.b], (i + k) * 3);
    }
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));
    return geo;
}

/** Simple low-poly tennis racket. The grip sits at the group origin. */
export function buildRacket(frameColor: string, stringColor: string, gripColor = '#1c1d24') {
    const group = new Group();
    const headGeo = new TorusGeometry(0.26, 0.032, 4, 12);
    const head = new Mesh(
        headGeo,
        new MeshLambertMaterial({ color: frameColor, flatShading: true }),
    );
    head.scale.set(0.85, 1.15, 1);
    head.position.y = 0.34;
    group.add(head);

    const strings = new Mesh(
        new CircleGeometry(0.26, 12),
        new MeshBasicMaterial({
            color: stringColor,
            transparent: true,
            opacity: 0.35,
            side: DoubleSide,
            depthWrite: false,
        }),
    );
    strings.scale.set(0.85, 1.15, 1);
    strings.position.y = 0.34;
    group.add(strings);

    const grip = new Mesh(
        new BoxGeometry(0.06, 0.32, 0.06),
        new MeshLambertMaterial({ color: gripColor, flatShading: true }),
    );
    grip.position.y = 0.09;
    group.add(grip);

    return group;
}

/** Disposes every unique geometry and material under `root`. */
export function disposeObject(root: Object3D) {
    const geometries = new Set<BufferGeometry>();
    const materials = new Set<Material>();
    root.traverse((child) => {
        if (child instanceof Mesh || child instanceof Line || child instanceof LineSegments) {
            geometries.add(child.geometry);
            const material = child.material;
            if (Array.isArray(material)) material.forEach((m) => materials.add(m));
            else if (material) materials.add(material);
        }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
}
