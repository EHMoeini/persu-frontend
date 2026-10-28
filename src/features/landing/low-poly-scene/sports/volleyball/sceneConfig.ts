import { GROUND } from '../../engineConfig';

/**
 * Indoor volleyball laid out on the shared 20 × 13 stylised ground. Axes:
 *   x = across the court (sideline to sideline)
 *   y = up (court surface is y = 0)
 *   z = along the court (blue side at +z, red side at -z)
 */
export const COURT = {
    /** End line to end line. */
    length: GROUND.length,
    /** Sideline to sideline. */
    width: GROUND.width,
    /** Run-off around the playing court. */
    freeZone: GROUND.margin,
    /** Height of the court slab (its sides form the visible edge). */
    thickness: GROUND.thickness,
    /** Plan-view radius of the slab's rounded corners. */
    cornerRadius: GROUND.cornerRadius,
    lineWidth: GROUND.lineWidth,
    /** Attack line distance from the centre line (scaled with the court). */
    attackLineDistance: (GROUND.length * 3) / 18,
} as const;

export const NET = {
    width: COURT.width,
    height: 2.35,
    /** Height of the mesh below the top band. */
    meshDrop: 1,
    postSize: 0.1,
    /** How far outside the sideline the posts stand. */
    postOffset: 0.5,
    antennaHeight: 0.8,
} as const;

export const PLAYER_SCALE: number = 1.2;
export const BALL_RADIUS: number = 0.36;
/** Final [x, y, z] of the airborne ball. */
export const BALL_POSITION: [number, number, number] = [3.18, 3.3, 4.44];

export const COLORS = {
    // The free zone uses the same blue as the back zones so the whole slab
    // reads as ground, not as a separate margin.
    freeZone: '#2f6fb3',
    court: '#2f6fb3',
    attackZone: '#e8863a',
    edge: '#15466f',
    lines: '#f8fafc',
    net: '#f8fafc',
    netMesh: '#dbeafe',
    post: '#1e293b',
    shadow: '#071a2a',
    skin: '#e2ae86',
    boots: '#1c1d24',
    ballLight: '#f8fafc',
    ballDark: '#1d4ed8',
    teams: {
        blue: { shirt: '#2f6ad8', shorts: '#f1f1ec', socks: '#2f6ad8' },
        red: { shirt: '#d8433a', shorts: '#f1f1ec', socks: '#d8433a' },
    },
} as const;

export type Team = keyof typeof COLORS.teams;

export type PlayerSpec = {
    team: Team;
    /** Final [x, z] on the court. */
    position: [number, number];
    /** Facing direction in radians (0 = facing the near side). */
    rotationY: number;
    hair: string;
};

/**
 * Two players per side: one front-row near the net, one back-row. Positions
 * are stretched with the court to the shared ground footprint.
 */
export const PLAYERS: PlayerSpec[] = [
    { team: 'blue', position: [-3.18, 3.56], rotationY: Math.PI, hair: '#3a2a20' },
    { team: 'blue', position: [2.6, 8.0], rotationY: Math.PI, hair: '#c99a4a' },
    { team: 'red', position: [3.18, -3.56], rotationY: 0, hair: '#1f1a17' },
    { team: 'red', position: [-2.6, -8.0], rotationY: 0, hair: '#6b3b22' },
];
