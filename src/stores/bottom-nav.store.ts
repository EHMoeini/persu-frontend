'use client';

import { create } from 'zustand';

interface IBottomNavState {
    /** True while the floating BottomNav is tucked away after a downward scroll. */
    hidden: boolean;
    setHidden: (hidden: boolean) => void;
}

/**
 * Scroll visibility of the floating BottomNav, shared with screens that anchor a
 * sticky CTA above it: when the nav steps aside, the CTA docks into its space
 * instead of floating over the gap.
 */
export const useBottomNavStore = create<IBottomNavState>((set) => ({
    hidden: false,
    setHidden: (hidden) => set((state) => (state.hidden === hidden ? state : { hidden })),
}));
