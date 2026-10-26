/**
 * Every tunable value of the football scene lives in this file:
 * pitch size, colours, object positions, camera and animation timing.
 *
 * World units are arbitrary. Axes:
 *   x = across the pitch (touchline to touchline)
 *   y = up (pitch surface is y = 0)
 *   z = along the pitch (near goal at +z, far goal at -z)
 */

export type Vec3 = [number, number, number];

export const PITCH = {
    /** Goal line to goal line. */
    length: 20,
    /** Touchline to touchline. */
    width: 13,
    /** Grass run-off around the lines (must be deeper than GOAL.depth). */
    margin: 1.3,
    /** Height of the pitch slab (its sides form the visible edge). */
    thickness: 0.5,
    /** Plan-view radius of the slab's rounded corners. */
    cornerRadius: 0.8,
    /** Number of alternating mowing bands along the length. */
    bandCount: 6,
    lineWidth: 0.11,
    centreCircleRadius: 2,
    penaltyArea: { width: 7.4, depth: 3.2 },
    goalArea: { width: 4.4, depth: 1.25 },
    penaltySpotDistance: 2.3,
    spotRadius: 0.13,
    cornerArcRadius: 0.55,
} as const;

export const GOAL = {
    /** Inner width between the posts. */
    width: 3.4,
    height: 1.25,
    /** How far the net reaches behind the goal line. */
    depth: 1.0,
    postSize: 0.13,
} as const;

export const PLAYER_SCALE: number = 1.2;
export const BALL_RADIUS: number = 0.26;

export const COLORS = {
    grassDark: '#2e7a3c',
    grassLight: '#378a45',
    pitchEdge: '#1d5228',
    lines: '#f3f1e7',
    goal: '#f3f1e7',
    net: '#ffffff',
    shadow: '#0b1f12',
    skin: '#e2ae86',
    boots: '#1c1d24',
    ballLight: '#f7f7f2',
    ballDark: '#1c1d24',
    teams: {
        blue: { shirt: '#2f6ad8', shorts: '#f1f1ec', socks: '#2f6ad8' },
        red: { shirt: '#d8433a', shorts: '#f1f1ec', socks: '#d8433a' },
    },
} as const;

export type Team = keyof typeof COLORS.teams;

export type PlayerSpec = {
    team: Team;
    /** Final [x, z] on the pitch. */
    position: [number, number];
    /** Facing direction in radians (0 = facing the near goal / camera side). */
    rotationY: number;
    hair: string;
};

/**
 * Hard-coded formation. Blue occupies the near half (z > 0),
 * red the far half (z < 0). Edit freely; keep each team in its own half.
 */
export const PLAYERS: PlayerSpec[] = [
    { team: 'blue', position: [-2.2, 2.4], rotationY: Math.PI + 0.35, hair: '#3a2a20' },
    { team: 'blue', position: [3.1, 5.4], rotationY: Math.PI - 0.5, hair: '#c99a4a' },
    { team: 'red', position: [1.9, -2.3], rotationY: 0.4, hair: '#1f1a17' },
    { team: 'red', position: [-3.3, -5.6], rotationY: -0.25, hair: '#6b3b22' },
];

/** Final [x, z] of the ball, near midfield on the blue side. */
export const BALL_POSITION: [number, number] = [-0.9, 1.1];

export type CameraConfig = {
    position: Vec3;
    target: Vec3;
    /** Vertical field of view in degrees. */
    fov: number;
    /**
     * Minimum horizontal field of view in degrees. On narrow portrait screens
     * the vertical FOV is widened so the whole pitch stays in frame.
     */
    minHorizontalFov: number;
};

/**
 * Behind and to the right (+x) of the near goal, ~33 degrees above the
 * horizon, looking diagonally down the pitch toward the far goal.
 */
export const DEFAULT_CAMERA: CameraConfig = {
    position: [12.9, 22.5, 33.6],
    target: [-1.2, 0, -0.4],
    fov: 40,
    minHorizontalFov: 36,
};

export type TimingConfig = {
    /** Seconds each goal takes to fall. */
    goalsDuration: number;
    /** Delay between the near and far goal starting. */
    goalsStagger: number;
    /** Seconds each player takes to fall. */
    playersDuration: number;
    /** Delay between consecutive players starting. */
    playersStagger: number;
    /** Extra delay before the ball starts falling (after the first player). */
    ballDelay: number;
    ballDuration: number;
};

export const DEFAULT_TIMING: TimingConfig = {
    goalsDuration: 0.9,
    goalsStagger: 0.1,
    playersDuration: 0.8,
    playersStagger: 0.09,
    ballDelay: 0.22,
    ballDuration: 0.75,
};

/** Subtle pitch idle: a slow vertical breath plus random eased yaw twists. */
export const IDLE = {
    /** Vertical pitch translation in world units. */
    breathAmplitude: 0.35,
    /** Radians per second; one breath cycle is about 7 seconds. */
    breathSpeed: 0.9,
    /** Maximum yaw offset in radians (±1.4°). */
    twistAmplitude: 1 * (Math.PI / 180),
    /** Seconds to ease toward a new random twist target. */
    twistDuration: 1.5,
    /** Random interval between twist targets, in seconds. */
    twistIntervalMin: 2,
    twistIntervalMax: 4,
} as const;

/** Upper bound for renderer pixel ratio. */
export const MAX_PIXEL_RATIO = 1.75;
