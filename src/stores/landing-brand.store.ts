'use client';

import { create } from 'zustand';

interface ILandingBrandState {
    inView: boolean;
    setInView: (inView: boolean) => void;
}

/**
 * Viewport visibility of the Landing Brand, shared with the Header. Starts
 * `true` so the Header stays hidden until the observer reports otherwise.
 */
export const useLandingBrandStore = create<ILandingBrandState>((set) => ({
    inView: true,
    setInView: (inView) => set({ inView }),
}));
