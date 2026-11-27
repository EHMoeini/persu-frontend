'use client';

import { useEffect, useLayoutEffect } from 'react';

import { useBottomNavStore } from '@/stores/bottom-nav.store';

const SCROLL_DIRECTION_THRESHOLD = 32;
const TOP_REVEAL_OFFSET = 64;

/**
 * Reports whether floating shell chrome should hide. The chrome hides after a
 * downward scroll, returns after an upward scroll, is always visible near the
 * top, and resets whenever `revealKey` changes (route navigation).
 *
 * The state lives in the BottomNav store, so sticky elements anchored to the
 * nav move with it instead of being left behind when it slides away.
 */
export function useHideOnScroll(revealKey: string) {
    const hidden = useBottomNavStore((state) => state.hidden);
    const setHidden = useBottomNavStore((state) => state.setHidden);

    // Before paint, so a new route never flashes the previous route's state.
    useLayoutEffect(() => {
        setHidden(false);
    }, [revealKey, setHidden]);

    useEffect(() => {
        let lastScrollY = window.scrollY;
        let animationFrame = 0;

        const updateVisibility = () => {
            animationFrame = 0;

            const scrollY = Math.max(0, window.scrollY);

            if (scrollY <= TOP_REVEAL_OFFSET) {
                lastScrollY = scrollY;
                setHidden(false);
                return;
            }

            const delta = scrollY - lastScrollY;

            if (Math.abs(delta) < SCROLL_DIRECTION_THRESHOLD) {
                return;
            }

            lastScrollY = scrollY;
            setHidden(delta > 0);
        };

        const handleScroll = () => {
            if (animationFrame !== 0) {
                return;
            }

            animationFrame = window.requestAnimationFrame(updateVisibility);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.cancelAnimationFrame(animationFrame);
        };
    }, [revealKey, setHidden]);

    return hidden;
}
