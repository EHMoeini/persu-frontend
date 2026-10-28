export type Vec3 = [number, number, number];

/**
 * Shared ground footprint for every sport. The dimensions are intentionally
 * stylised, not real-world: all three swiper scenes use the same playing area
 * and run-off, so they read at exactly the same size.
 */
export const GROUND = {
    /** Playing area length along z. */
    length: 20,
    /** Playing area width along x. */
    width: 13,
    /** Run-off around the playing area. */
    margin: 1.3,
    /** Slab thickness. */
    thickness: 0.5,
    /** Plan-view radius of the slab's rounded corners. */
    cornerRadius: 0.8,
    /** Painted line width. */
    lineWidth: 0.11,
} as const;

export type CameraConfig = {
    position: Vec3;
    target: Vec3;
    /** Vertical field of view in degrees. */
    fov: number;
    /**
     * Minimum horizontal field of view in degrees. On narrow containers the
     * vertical FOV is widened so the whole model stays in frame.
     */
    minHorizontalFov: number;
};

/**
 * One camera for every sport. The target sits slightly below the ground so the
 * near slab corner has breathing room instead of touching the canvas bottom.
 */
export const DEFAULT_CAMERA: CameraConfig = {
    position: [8.92, 16.15, 23.98],
    target: [-1.2, -2.4, -0.4],
    fov: 40,
    minHorizontalFov: 36,
};

/** Subtle model idle: a slow vertical breath plus random eased yaw twists. */
export const IDLE = {
    /** Vertical translation in world units. */
    breathAmplitude: 0.35,
    /** Radians per second; one breath cycle is about 7 seconds. */
    breathSpeed: 0.9,
    /** Maximum yaw offset in radians (±1°). */
    twistAmplitude: 1 * (Math.PI / 180),
    /** Seconds to ease toward a new random twist target. */
    twistDuration: 1.5,
    /** Random interval between twist targets, in seconds. */
    twistIntervalMin: 2,
    twistIntervalMax: 4,
} as const;

/** Upper bound for renderer pixel ratio. */
export const MAX_PIXEL_RATIO = 1.75;
