import { GROUND } from '../../engineConfig';

/**
 * Outdoor clay tennis court squashed onto the shared 20 × 13 stylised ground.
 * Real court proportions are intentionally not preserved; the tennis scene
 * matches the football pitch footprint. Axes:
 *   x = across the court (sideline to sideline)
 *   y = up (court surface is y = 0)
 *   z = along the court (blue player at +z, red player at -z)
 */
export const COURT = {
    /** Baseline to baseline. */
    length: GROUND.length,
    /** Doubles sideline to doubles sideline. */
    doublesWidth: GROUND.width,
    /** Singles sideline to singles sideline, scaled with the court. */
    singlesWidth: 8.23 * (GROUND.width / 10.97),
    /** Service line distance from the net, scaled with the court. */
    serviceLineDistance: 6.4 * (GROUND.length / 23.77),
    /** Run-off around the playing court. */
    freeZone: GROUND.margin,
    thickness: GROUND.thickness,
    cornerRadius: GROUND.cornerRadius,
    lineWidth: GROUND.lineWidth,
} as const;

export const NET = {
    /** Real doubles-net span, scaled with the squashed court width. */
    width: 12.8 * (GROUND.width / 10.97),
    heightCenter: 0.914,
    heightPost: 1.07,
    postSize: 0.09,
    centerStrapWidth: 0.05,
} as const;

export const PLAYER_SCALE: number = 1.2;
export const BALL_RADIUS: number = 0.22;
/** Final [x, y, z] of the airborne ball, mid-rally near the net. */
export const BALL_POSITION: [number, number, number] = [-1.66, 2.1, 1.01];

export const COLORS = {
    // The whole slab is clay, so there is no contrasting surround/margin.
    ground: '#b95f3f',
    court: '#b95f3f',
    edge: '#78371f',
    lines: '#fff7ee',
    net: '#fff7ee',
    netMesh: '#f5e6da',
    post: '#2b201b',
    shadow: '#3f1b10',
    skin: '#e2ae86',
    boots: '#1c1d24',
    ball: '#dcef4a',
    ballSeam: '#ffffff',
    racketGrip: '#1c1d24',
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

/** Singles: one player per side, waiting on the baselines. */
export const PLAYERS: PlayerSpec[] = [
    { team: 'blue', position: [-0.95, 8.25], rotationY: Math.PI, hair: '#3a2a20' },
    { team: 'red', position: [0.95, -8.25], rotationY: 0, hair: '#1f1a17' },
];
