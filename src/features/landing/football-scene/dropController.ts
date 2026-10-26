import { Vector3, type PerspectiveCamera } from 'three';
import type { DropTarget, FootballScene } from './buildScene';
import type { TimingConfig } from './sceneConfig';
import { phaseIndex, type ScenePhase } from './stageStore';

type GroupName = 'goals' | 'players';

type Tween = {
    target: DropTarget;
    delay: number;
    duration: number;
    startY: number;
};

type DropGroup = {
    state: 'hidden' | 'animating' | 'settled';
    startAt: number;
    endAt: number;
    tweens: Tween[];
};

/** Same curve as GSAP's `power2.out`. */
const easeOut = (t: number) => 1 - (1 - t) ** 3;

const BALL_SPIN = Math.PI * 1.5;
const SHADOW_MIN_SCALE = 0.35;

export type DropController = {
    /** Brings the scene in line with `phase`, animating newly reached groups if `animate`. */
    apply: (phase: ScenePhase, animate: boolean, camera: PerspectiveCamera, now: number) => void;
    /** Advances running tweens. Returns true while anything is still moving. */
    update: (now: number) => boolean;
};

/**
 * Drives the staged drop animations with plain time-based tweens.
 * Each group plays at most once; after that its objects are frozen.
 */
export function createDropController(scene: FootballScene, timing: TimingConfig): DropController {
    const groups: Record<GroupName, DropGroup> = {
        goals: { state: 'hidden', startAt: 0, endAt: 0, tweens: [] },
        players: { state: 'hidden', startAt: 0, endAt: 0, tweens: [] },
    };
    const shadowScale = new Map<DropTarget, Vector3>();
    for (const t of [...scene.goals, ...scene.players, scene.ball])
        shadowScale.set(t, t.shadow.scale.clone());

    const plan = (name: GroupName) =>
        name === 'goals'
            ? scene.goals.map((target, i) => ({
                  target,
                  delay: i * timing.goalsStagger,
                  duration: timing.goalsDuration,
              }))
            : [
                  ...scene.players.map((target, i) => ({
                      target,
                      delay: i * timing.playersStagger,
                      duration: timing.playersDuration,
                  })),
                  { target: scene.ball, delay: timing.ballDelay, duration: timing.ballDuration },
              ];

    const pose = (target: DropTarget, startY: number, progress: number) => {
        const e = easeOut(progress);
        const { object, shadow } = target;
        object.visible = true;
        object.position.y = startY + (target.restY - startY) * e;
        if (target.spin) {
            object.rotation.x = BALL_SPIN * (1 - e);
            object.rotation.z = BALL_SPIN * 0.35 * (1 - e);
        }
        shadow.visible = true;
        shadow.scale
            .copy(shadowScale.get(target)!)
            .multiplyScalar(SHADOW_MIN_SCALE + (1 - SHADOW_MIN_SCALE) * e);
    };

    const settle = (name: GroupName) => {
        const group = groups[name];
        if (group.state === 'settled') return;
        plan(name).forEach(({ target }) => pose(target, target.restY, 1));
        group.state = 'settled';
    };

    const reach = (name: GroupName, animate: boolean, camera: PerspectiveCamera, now: number) => {
        const group = groups[name];
        if (group.state !== 'hidden') return;
        if (!animate) {
            // Never leave an earlier group mid-air behind a later, instantly placed one.
            if (name === 'players') settle('goals');
            settle(name);
            return;
        }
        // Players always wait for the goals to land, even on a very fast double swipe.
        const startAt =
            name === 'players' && groups.goals.state === 'animating'
                ? Math.max(now, groups.goals.endAt)
                : now;
        group.tweens = plan(name).map((t) => ({ ...t, startY: offscreenY(camera, t.target) }));
        group.startAt = startAt;
        group.endAt = startAt + Math.max(...group.tweens.map((t) => t.delay + t.duration));
        group.state = 'animating';
    };

    return {
        apply(phase, animate, camera, now) {
            const index = phaseIndex(phase);
            if (index >= phaseIndex('goals-dropped')) reach('goals', animate, camera, now);
            if (index >= phaseIndex('players-dropped')) reach('players', animate, camera, now);
        },
        update(now) {
            let running = false;
            for (const group of Object.values(groups)) {
                if (group.state !== 'animating') continue;
                let done = true;
                for (const t of group.tweens) {
                    const local = now - group.startAt - t.delay;
                    if (local < 0) {
                        done = false;
                        continue;
                    }
                    const progress = Math.min(1, local / t.duration);
                    pose(t.target, t.startY, progress);
                    if (progress < 1) done = false;
                }
                if (done) group.state = 'settled';
                else running = true;
            }
            return running;
        },
    };
}

const probe = new Vector3();

/**
 * Lowest start height at which the object is fully above the top edge of the
 * viewport, so it falls into view instead of popping into existence.
 */
function offscreenY(camera: PerspectiveCamera, target: DropTarget) {
    const { x, z } = target.object.position;
    const parent = target.object.parent;
    // Include the idle pitch transform when projecting the fall start.
    parent?.updateWorldMatrix(true, false);
    const ndcY = (y: number) => {
        probe.set(x, y - target.bottomOffset, z);
        if (parent) probe.applyMatrix4(parent.matrixWorld);
        return probe.project(camera).y;
    };
    const rest = probe.set(x, target.restY, z);
    if (parent) rest.applyMatrix4(parent.matrixWorld);
    const horizontal = Math.hypot(rest.x - camera.position.x, rest.z - camera.position.z);
    // Stay well inside the camera's forward hemisphere so projection is monotonic.
    let lo = target.restY;
    let hi = camera.position.y + horizontal * 0.8;
    if (ndcY(hi) < 1) return hi;
    for (let i = 0; i < 18; i++) {
        const mid = (lo + hi) / 2;
        if (ndcY(mid) > 1.02) hi = mid;
        else lo = mid;
    }
    return hi + 0.5;
}
