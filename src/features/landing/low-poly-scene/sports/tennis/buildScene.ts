import {
    BufferGeometry,
    CircleGeometry,
    DirectionalLight,
    DoubleSide,
    ExtrudeGeometry,
    Float32BufferAttribute,
    Group,
    HemisphereLight,
    IcosahedronGeometry,
    LineBasicMaterial,
    LineSegments,
    Mesh,
    MeshBasicMaterial,
    MeshLambertMaterial,
    PlaneGeometry,
    TorusGeometry,
} from 'three';

import {
    box,
    buildPlayerGeometry,
    buildRacket,
    disposeObject,
    FlatShape,
    roundedRectShape,
} from '../../buildUtils';
import type { LowPolyModel } from '../../types';
import {
    BALL_POSITION,
    BALL_RADIUS,
    COLORS,
    COURT,
    NET,
    PLAYERS,
    PLAYER_SCALE,
} from './sceneConfig';

const COURT_Y = 0.004;
const LINE_Y = 0.009;
const SHADOW_Y = 0.014;

/** Builds the outdoor hard tennis court, net, players, rackets and ball. */
export function buildTennisScene(): LowPolyModel {
    const root = new Group();
    root.name = 'tennis-scene';

    const court = new Group();
    court.name = 'tennis-court';
    root.add(court);

    root.add(new HemisphereLight('#ffffff', '#3e5f47', 1.8));
    const sun = new DirectionalLight('#fff6e8', 2.05);
    sun.position.set(5, 12, 7);
    root.add(sun);

    const shadowGeo = new CircleGeometry(1, 10).rotateX(-Math.PI / 2);
    const shadowMat = new MeshBasicMaterial({
        color: COLORS.shadow,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
    });
    const makeShadow = (x: number, z: number, sx: number, sz: number, rotationY = 0) => {
        const shadow = new Mesh(shadowGeo, shadowMat);
        shadow.position.set(x, SHADOW_Y, z);
        shadow.rotation.y = rotationY;
        shadow.scale.set(sx, 1, sz);
        court.add(shadow);
    };

    // ----------------------------------------------------------------- slab
    const surfaceW = COURT.doublesWidth + COURT.freeZone * 2;
    const surfaceL = COURT.length + COURT.freeZone * 2;
    const slabGeo = new ExtrudeGeometry(roundedRectShape(surfaceW, surfaceL, COURT.cornerRadius), {
        depth: COURT.thickness,
        bevelEnabled: true,
        bevelThickness: 0.07,
        bevelSize: 0.07,
        bevelSegments: 2,
        curveSegments: 8,
        steps: 1,
    });
    slabGeo.rotateX(-Math.PI / 2);
    slabGeo.computeBoundingBox();
    slabGeo.translate(0, -(slabGeo.boundingBox?.max.y ?? 0), 0);
    court.add(
        new Mesh(slabGeo, [
            new MeshBasicMaterial({ color: COLORS.ground }),
            new MeshBasicMaterial({ color: COLORS.edge }),
        ]),
    );

    // ------------------------------------------------------------- surface
    const playing = new FlatShape(COURT_Y);
    playing.rect(
        -COURT.doublesWidth / 2,
        -COURT.length / 2,
        COURT.doublesWidth / 2,
        COURT.length / 2,
    );
    court.add(
        new Mesh(playing.build(), new MeshBasicMaterial({ color: COLORS.court, side: DoubleSide })),
    );

    // ---------------------------------------------------------------- lines
    const lines = new FlatShape(LINE_Y);
    const dw = COURT.doublesWidth / 2;
    const sw = COURT.singlesWidth / 2;
    const hl = COURT.length / 2;
    const service = COURT.serviceLineDistance;
    const lw = COURT.lineWidth;

    // Doubles court and both baselines.
    lines.polyline(
        [
            [-dw, -hl],
            [dw, -hl],
            [dw, hl],
            [-dw, hl],
        ],
        lw,
        true,
    );
    // Singles sidelines.
    lines.segment([-sw, -hl], [-sw, hl], lw);
    lines.segment([sw, -hl], [sw, hl], lw);
    // Service lines and the centre service line.
    lines.segment([-sw, service], [sw, service], lw);
    lines.segment([-sw, -service], [sw, -service], lw);
    lines.segment([0, -service], [0, service], lw);
    // Centre marks on the baselines.
    lines.segment([0, hl], [0, hl - 0.35], lw);
    lines.segment([0, -hl], [0, -hl + 0.35], lw);

    court.add(
        new Mesh(lines.build(), new MeshBasicMaterial({ color: COLORS.lines, side: DoubleSide })),
    );

    // ------------------------------------------------------------------ net
    const postMat = new MeshLambertMaterial({ color: COLORS.post, flatShading: true });
    const bandMat = new MeshBasicMaterial({ color: COLORS.net });
    const netWidth = NET.width;
    const postX = netWidth / 2;
    const netTop = NET.heightCenter;
    const postHeight = NET.heightPost + 0.06;

    for (const s of [-1, 1]) {
        court.add(
            new Mesh(
                box(NET.postSize, postHeight, NET.postSize, s * postX, postHeight / 2, 0),
                postMat,
            ),
        );
        court.add(new Mesh(box(0.3, 0.05, 0.3, s * postX, 0.025, 0), postMat));
    }

    court.add(new Mesh(box(netWidth, 0.055, 0.04, 0, netTop, 0), bandMat));
    court.add(new Mesh(box(netWidth, 0.04, 0.035, 0, 0.02, 0), bandMat));
    court.add(new Mesh(box(NET.centerStrapWidth, netTop, 0.035, 0, netTop / 2, 0.008), bandMat));

    const netPanel = new Mesh(
        new PlaneGeometry(netWidth, netTop),
        new MeshBasicMaterial({
            color: COLORS.netMesh,
            transparent: true,
            opacity: 0.07,
            side: DoubleSide,
            depthWrite: false,
        }),
    );
    netPanel.position.set(0, netTop / 2, 0);
    court.add(netPanel);

    const netLinePositions: number[] = [];
    const line = (a: number[], b: number[]) => netLinePositions.push(...a, ...b);
    for (let i = 0; i <= 24; i++) {
        const x = -netWidth / 2 + (netWidth * i) / 24;
        line([x, 0, 0.006], [x, netTop, 0.006]);
    }
    for (let i = 0; i <= 3; i++) {
        const y = (netTop * i) / 3;
        line([-netWidth / 2, y, 0.006], [netWidth / 2, y, 0.006]);
    }
    const netLineGeo = new BufferGeometry();
    netLineGeo.setAttribute('position', new Float32BufferAttribute(netLinePositions, 3));
    court.add(
        new LineSegments(
            netLineGeo,
            new LineBasicMaterial({
                color: COLORS.netMesh,
                transparent: true,
                opacity: 0.55,
            }),
        ),
    );

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

        const player = new Group();
        player.add(new Mesh(geo, playerMat));
        const racket = buildRacket('#1f2937', COLORS.net, COLORS.teams[spec.team].shirt);
        racket.position.set(0.55, 0.82, 0.18);
        racket.rotation.set(-0.2, 0, -0.35);
        player.add(racket);

        const [x, z] = spec.position;
        player.position.set(x, 0, z);
        player.rotation.y = spec.rotationY;
        court.add(player);
        makeShadow(x, z, 0.38 * PLAYER_SCALE, 0.3 * PLAYER_SCALE, spec.rotationY);
    }

    // ----------------------------------------------------------------- ball
    const [bx, by, bz] = BALL_POSITION;
    const ball = new Group();
    ball.add(
        new Mesh(
            new IcosahedronGeometry(BALL_RADIUS, 1),
            new MeshLambertMaterial({ color: COLORS.ball, flatShading: true }),
        ),
    );
    const seam = new Mesh(
        new TorusGeometry(BALL_RADIUS * 1.01, 0.011, 3, 18),
        new MeshBasicMaterial({ color: COLORS.ballSeam }),
    );
    seam.rotation.set(1.0, 0.4, 0.2);
    ball.add(seam);
    ball.position.set(bx, by, bz);
    ball.rotation.set(0.25, 0.6, 0.35);
    court.add(ball);
    makeShadow(bx, bz, BALL_RADIUS * 1.4, BALL_RADIUS * 1.4);

    return {
        root,
        content: court,
        dispose: () => {
            disposeObject(root);
            root.clear();
        },
    };
}
