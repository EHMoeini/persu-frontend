import type { Group } from 'three';

import type { CameraConfig } from './engineConfig';

export type LowPolyModel = {
    root: Group;
    /** Everything that breathes/twists together; lights stay outside this group. */
    content: Group;
    dispose: () => void;
};

export type SceneProps = {
    /** Subtle model breathing and random twists. Default true. */
    idle?: boolean;
    className?: string;
};

export type LowPolySceneProps = SceneProps & {
    build: () => LowPolyModel;
    camera: CameraConfig;
};
