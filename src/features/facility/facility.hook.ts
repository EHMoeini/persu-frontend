'use client';

import { useEffect, useState } from 'react';

/**
 * Tracks whether the shell Footer is on screen. The sticky booking bar steps
 * aside for it so the footer links stay reachable.
 */
export function useFooterInView() {
    const [footerInView, setFooterInView] = useState(false);

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver(
            ([entry]) => setFooterInView(entry.isIntersecting),
            { threshold: 0 },
        );

        observer.observe(footer);
        return () => observer.disconnect();
    }, []);

    return footerInView;
}
