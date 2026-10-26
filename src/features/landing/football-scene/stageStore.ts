export const PHASES = ['initial', 'goals-dropped', 'players-dropped', 'complete'] as const;

export type ScenePhase = (typeof PHASES)[number];

export const phaseIndex = (phase: ScenePhase) => PHASES.indexOf(phase);

export type PhaseListener = (phase: ScenePhase, animate: boolean) => void;

export type StageStore = {
    getPhase: () => ScenePhase;
    /**
     * Moves forward to `next`. Phases only ever advance, so going back up the
     * page never replays or reverts anything. Returns false if nothing changed.
     */
    advance: (next: ScenePhase, animate: boolean) => boolean;
    subscribe: (listener: PhaseListener) => () => void;
};

/**
 * Tiny framework-free state machine shared by the scroll controller and the
 * renderer. Lives outside React state so scroll events never cause re-renders,
 * and outlives the canvas so a remount (e.g. rotation) keeps the scene's state.
 */
export function createStageStore(): StageStore {
    let phase: ScenePhase = 'initial';
    const listeners = new Set<PhaseListener>();
    return {
        getPhase: () => phase,
        advance(next, animate) {
            if (phaseIndex(next) <= phaseIndex(phase)) return false;
            phase = next;
            listeners.forEach((listener) => listener(next, animate));
            return true;
        },
        subscribe(listener) {
            listeners.add(listener);
            return () => {
                listeners.delete(listener);
            };
        },
    };
}
