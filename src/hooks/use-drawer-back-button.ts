'use client';

import { useCallback, useEffect, useRef } from 'react';

type TSetOpen = (open: boolean) => void;

/**
 * Keeps a drawer in sync with the browser back button: opening pushes a
 * history entry, closing pops it, and popstate drives the drawer state.
 */
export function useDrawerBackButton(key: string, setOpen: TSetOpen) {
    const hasPushedRef = useRef(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const currentState = window.history.state || {};
        if (currentState[key] === undefined) {
            window.history.replaceState(
                { ...currentState, [key]: false },
                '',
                window.location.href,
            );
        }

        const handlePopState = (event: PopStateEvent) => {
            const isOpen = event.state?.[key] ?? false;
            setOpen(isOpen);
            hasPushedRef.current = isOpen;
        };

        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, [key, setOpen]);

    const openDrawer = useCallback(() => {
        setOpen(true);
        if (typeof window === 'undefined') return;

        const currentState = window.history.state || {};
        window.history.pushState({ ...currentState, [key]: true }, '', window.location.href);
        hasPushedRef.current = true;
    }, [key, setOpen]);

    const closeDrawer = useCallback(() => {
        if (typeof window === 'undefined') {
            setOpen(false);
            return;
        }

        const currentState = window.history.state || {};
        if (hasPushedRef.current && currentState[key]) {
            window.history.back();
        } else {
            setOpen(false);
        }
    }, [key, setOpen]);

    return { openDrawer, closeDrawer };
}
