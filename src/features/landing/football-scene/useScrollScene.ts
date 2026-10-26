'use client';

import { useEffect, type RefObject } from 'react';

import { phaseIndex, type StageStore } from './stageStore';

/** Class put on <html> while the intro screens snap. */
export const SNAP_CLASS = 'fs-snap-intro';

/** Fallback for browsers without `scrollend` (e.g. older Safari). */
const SETTLE_DELAY_MS = 160;

type Options = {
    store: StageStore;
    /** Only true once the scene has rendered its first frame. */
    active: boolean;
    /** False under reduced motion: stages still advance, objects appear in place. */
    animate: boolean;
    /** Reduced motion "skip" mode: assemble immediately, never listen to scroll. */
    skip: boolean;
    /** Height of the fixed shell header. */
    topOffset: number;
    /** Empty viewport-heights rendered after the children. */
    scrollScreens: number;
    /** The trailing spacer; its measured height defines one intro step. */
    scrollSpaceRef: RefObject<HTMLElement | null>;
};

/**
 * Advances the pitch from empty → goals → players as the page scrolls.
 *
 * The scroll runway is an empty spacer appended after the page content, so the
 * scene is a pure background: callers can put any content in the page without
 * expressing it as intro panels. While the intro runs, the entry screen and the
 * runway screens snap; once the players land and scrolling settles, snapping is
 * removed, every listener detaches, and the scene stays complete.
 */
export function useScrollScene({
    store,
    active,
    animate,
    skip,
    topOffset,
    scrollScreens,
    scrollSpaceRef,
}: Options) {
    useEffect(() => {
        if (!active) return;
        if (skip) {
            store.advance('complete', false);
            return;
        }
        if (store.getPhase() === 'complete') return;

        const getStep = () => {
            const spacer = scrollSpaceRef.current;
            const screens = Math.max(1, scrollScreens);
            if (spacer) {
                const height = spacer.getBoundingClientRect().height;
                if (height > 0) return height / screens;
            }
            return Math.max(1, window.innerHeight - Math.max(0, topOffset));
        };
        const getThresholds = () => {
            const step = getStep();
            const maxScroll = Math.max(
                0,
                document.documentElement.scrollHeight - window.innerHeight,
            );
            return {
                goals: Math.min(step, maxScroll),
                players: Math.min(step * 2, maxScroll),
            };
        };

        // Landed mid-page (scroll restoration, anchor): sync without animating.
        const start = getThresholds();
        const startY = window.scrollY;
        if (startY >= start.players) {
            store.advance('complete', false);
            return;
        }
        if (startY >= start.goals) store.advance('goals-dropped', false);

        const root = document.documentElement;
        root.classList.add(SNAP_CLASS);

        let timer: ReturnType<typeof setTimeout> | undefined;
        let detached = false;

        const onScroll = () => {
            const { goals, players } = getThresholds();
            const y = window.scrollY;
            if (y >= players) store.advance('players-dropped', animate);
            else if (y >= goals) store.advance('goals-dropped', animate);
            clearTimeout(timer);
            timer = setTimeout(onSettle, SETTLE_DELAY_MS);
        };

        const onSettle = () => {
            if (phaseIndex(store.getPhase()) < phaseIndex('players-dropped')) return;
            detach();
            store.advance('complete', animate);
        };

        const detach = () => {
            if (detached) return;
            detached = true;
            clearTimeout(timer);
            root.classList.remove(SNAP_CLASS);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('scrollend', onSettle);
            window.removeEventListener('resize', onScroll);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('scrollend', onSettle);
        window.addEventListener('resize', onScroll);
        return detach;
    }, [active, animate, skip, store, topOffset, scrollScreens, scrollSpaceRef]);
}
