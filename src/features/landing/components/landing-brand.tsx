'use client';

import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { StaticImage } from '@/components/ui/static-image';
import { useLandingBrandStore } from '@/stores/landing-brand.store';

/**
 * Oversized, centered brand lockup at the top of the landing page. It reports
 * its viewport visibility so the Header can take over once it scrolls out.
 */
export function LandingBrand() {
    const { ref, inView } = useInView({ initialInView: true });
    const setInView = useLandingBrandStore((state) => state.setInView);

    useEffect(() => {
        setInView(inView);
    }, [inView, setInView]);

    // Leaving the landing page resets the handoff for the next visit.
    useEffect(() => {
        return () => setInView(true);
    }, [setInView]);

    return (
        <div ref={ref} className="flex flex-col items-center gap-3">
            <StaticImage src="/assets/brand/logo-combined.svg" className="size-20" />
            <p className="text-[30px] leading-10 font-extrabold text-foreground">پرسو</p>
        </div>
    );
}
