import type { Object3D } from 'three';

import { IDLE } from './engineConfig';

export type IdleController = {
    /** Applies the idle breath/twist to the model for this frame. */
    apply: (now: number) => void;
    /** Restores the base model transform when idle motion is off. */
    reset: () => void;
};

/**
 * A very subtle idle animation on the model group itself: it floats up and down
 * and occasionally twists a degree or so around its centre. Lights stay fixed,
 * so the model catches the light differently as it moves.
 */
export function createIdleController(content: Object3D): IdleController {
    const baseY = content.position.y;
    const baseRotationY = content.rotation.y;

    let twist = 0;
    let twistFrom = 0;
    let twistTo = 0;
    let twistStart = 0;
    let nextTwistAt = 0;

    const pickTwist = (now: number) => {
        twistFrom = twist;
        twistTo = (Math.random() * 2 - 1) * IDLE.twistAmplitude;
        twistStart = now;
        nextTwistAt =
            now +
            IDLE.twistIntervalMin +
            Math.random() * (IDLE.twistIntervalMax - IDLE.twistIntervalMin);
    };

    return {
        apply(now) {
            if (now >= nextTwistAt) pickTwist(now);

            const progress = Math.min(1, Math.max(0, (now - twistStart) / IDLE.twistDuration));
            const eased = progress * progress * (3 - 2 * progress);
            twist = twistFrom + (twistTo - twistFrom) * eased;

            content.position.y = baseY + Math.sin(now * IDLE.breathSpeed) * IDLE.breathAmplitude;
            content.rotation.y = baseRotationY + twist;
            content.updateMatrixWorld();
        },
        reset() {
            twist = 0;
            twistFrom = 0;
            twistTo = 0;
            twistStart = 0;
            nextTwistAt = 0;
            content.position.y = baseY;
            content.rotation.y = baseRotationY;
            content.updateMatrixWorld();
        },
    };
}
