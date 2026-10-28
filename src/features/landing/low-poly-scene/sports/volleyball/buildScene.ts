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
    PlaneGeometry,
} from 'three';

import {
    box,
    buildPanelBallGeometry,
    buildPlayerGeometry,
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
const ATTACK_Y = 0.006;
const LINE_Y = 0.009;
const SHADOW_Y = 0.014;

/** Builds the indoor volleyball court, net, players and ball. */
export function buildVolleyballScene(): LowPolyModel {
    const root = new Group();
    root.name = 'volleyball-scene';

    const court = new Group();
    court.name = 'volleyball-court';
    root.add(court);

    root.add(new HemisphereLight('#ffffff', '#2b4a63', 1.8));
    const sun = new DirectionalLight('#fff6e8', 2.0);
    sun.position.set(5, 12, 7);
    root.add(sun);

    const shadowGeo = new CircleGeometry(1, 10).rotateX(-Math.PI / 2);
    const shadowMat = new MeshBasicMaterial({
        color: COLORS.shadow,
        transparent: true,
        opacity: 0.26,
        depthWrite: false,
    });
    const makeShadow = (x: number, z: number, sx: number, sz: number) => {
        const shadow = new Mesh(shadowGeo, shadowMat);
        shadow.position.set(x, SHADOW_Y, z);
        shadow.scale.set(sx, 1, sz);
        court.add(shadow);
    };

    // ----------------------------------------------------------------- slab
    const surfaceW = COURT.width + COURT.freeZone * 2;
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
            new MeshBasicMaterial({ color: COLORS.freeZone }),
            new MeshBasicMaterial({ color: COLORS.edge }),
        ]),
    );

    // ------------------------------------------------------------- surface
    const playing = new FlatShape(COURT_Y);
    playing.rect(-COURT.width / 2, -COURT.length / 2, COURT.width / 2, COURT.length / 2);
    court.add(
        new Mesh(playing.build(), new MeshBasicMaterial({ color: COLORS.court, side: DoubleSide })),
    );

    const attack = new FlatShape(ATTACK_Y);
    attack.rect(-COURT.width / 2, 0, COURT.width / 2, COURT.attackLineDistance);
    attack.rect(-COURT.width / 2, -COURT.attackLineDistance, COURT.width / 2, 0);
    court.add(
        new Mesh(
            attack.build(),
            new MeshBasicMaterial({ color: COLORS.attackZone, side: DoubleSide }),
        ),
    );

    const lines = new FlatShape(LINE_Y);
    const hw = COURT.width / 2;
    const hl = COURT.length / 2;
    lines.polyline(
        [
            [-hw, -hl],
            [hw, -hl],
            [hw, hl],
            [-hw, hl],
        ],
        COURT.lineWidth,
        true,
    );
    lines.segment([-hw, 0], [hw, 0], COURT.lineWidth);
    lines.segment([-hw, COURT.attackLineDistance], [hw, COURT.attackLineDistance], COURT.lineWidth);
    lines.segment(
        [-hw, -COURT.attackLineDistance],
        [hw, -COURT.attackLineDistance],
        COURT.lineWidth,
    );
    court.add(
        new Mesh(lines.build(), new MeshBasicMaterial({ color: COLORS.lines, side: DoubleSide })),
    );

    // ------------------------------------------------------------------ net
    const postMat = new MeshLambertMaterial({ color: COLORS.post, flatShading: true });
    const bandMat = new MeshBasicMaterial({ color: COLORS.net });
    const netWidth = NET.width + NET.postOffset * 2;
    const postX = COURT.width / 2 + NET.postOffset;
    const postHeight = NET.height + 0.15;
    for (const s of [-1, 1]) {
        court.add(
            new Mesh(
                box(NET.postSize, postHeight, NET.postSize, s * postX, postHeight / 2, 0),
                postMat,
            ),
        );
        court.add(new Mesh(box(0.35, 0.06, 0.35, s * postX, 0.03, 0), postMat));
    }

    const netTop = NET.height;
    const netBottom = NET.height - NET.meshDrop;
    court.add(new Mesh(box(netWidth, 0.1, 0.06, 0, netTop, 0), bandMat));
    court.add(new Mesh(box(netWidth, 0.06, 0.05, 0, netBottom, 0), bandMat));
    for (const s of [-1, 1]) {
        court.add(
            new Mesh(
                box(0.06, NET.meshDrop, 0.05, s * (netWidth / 2), netTop - NET.meshDrop / 2, 0),
                bandMat,
            ),
        );
    }

    const netPanel = new Mesh(
        new PlaneGeometry(netWidth, NET.meshDrop),
        new MeshBasicMaterial({
            color: COLORS.netMesh,
            transparent: true,
            opacity: 0.14,
            side: DoubleSide,
            depthWrite: false,
        }),
    );
    netPanel.position.set(0, netTop - NET.meshDrop / 2, 0);
    court.add(netPanel);

    const netLinePositions: number[] = [];
    const line = (a: number[], b: number[]) => netLinePositions.push(...a, ...b);
    for (let i = 0; i <= 25; i++) {
        const x = -netWidth / 2 + (netWidth * i) / 25;
        line([x, netBottom, 0.006], [x, netTop, 0.006]);
    }
    for (let i = 0; i <= 5; i++) {
        const y = netBottom + (NET.meshDrop * i) / 5;
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
                opacity: 0.8,
            }),
        ),
    );

    const antennaMat = new MeshBasicMaterial({ color: COLORS.net });
    const antennaRedMat = new MeshBasicMaterial({ color: '#d8433a' });
    for (const s of [-1, 1]) {
        const x = s * hw;
        court.add(
            new Mesh(
                box(0.05, NET.antennaHeight, 0.05, x, netTop + NET.antennaHeight / 2, 0),
                antennaMat,
            ),
        );
        for (const offset of [0.16, 0.52]) {
            court.add(new Mesh(box(0.06, 0.12, 0.06, x, netTop + offset, 0), antennaRedMat));
        }
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
                kneePads: COLORS.teams[spec.team].socks,
            });
            playerGeoCache.set(key, geo);
        }
        const player = new Mesh(geo, playerMat);
        const [x, z] = spec.position;
        player.position.set(x, 0, z);
        player.rotation.y = spec.rotationY;
        court.add(player);
        makeShadow(x, z, 0.38 * PLAYER_SCALE, 0.3 * PLAYER_SCALE);
    }

    // ----------------------------------------------------------------- ball
    const [bx, by, bz] = BALL_POSITION;
    const ball = new Mesh(
        buildPanelBallGeometry(BALL_RADIUS, COLORS.ballLight, COLORS.ballDark),
        new MeshLambertMaterial({ vertexColors: true, flatShading: true }),
    );
    ball.position.set(bx, by, bz);
    ball.rotation.set(0.4, 0.8, 0.2);
    court.add(ball);
    makeShadow(bx, bz, BALL_RADIUS * 1.1, BALL_RADIUS * 1.1);

    return {
        root,
        content: court,
        dispose: () => {
            disposeObject(root);
            root.clear();
        },
    };
}
