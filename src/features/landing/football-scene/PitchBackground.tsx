'use client';

import {
    useCallback,
    useMemo,
    useRef,
    useState,
    useSyncExternalStore,
    type ReactNode,
} from 'react';

import { FootballSceneBackground, hasWebGL } from './FootballSceneBackground';
import {
    DEFAULT_CAMERA,
    DEFAULT_TIMING,
    type CameraConfig,
    type TimingConfig,
} from './sceneConfig';
import { createStageStore } from './stageStore';
import { SNAP_CLASS, useScrollScene } from './useScrollScene';
import styles from './football-scene.module.css';

export type PitchBackgroundProps = {
    /** Normal page content. It is not coupled to the animation stages. */
    children?: ReactNode;
    /** Turn the whole effect off (content still renders). Default true. */
    enabled?: boolean;
    /** The scene renders below this viewport width in px. Default 768. */
    breakpoint?: number;
    /** Height of the fixed shell header in px. Default 0. */
    topOffset?: number;
    /**
     * Empty viewport-heights appended after the content for the scroll intro.
     * Default 2 (goals on the first, players on the second). Each screen snaps
     * while the intro runs. Set 0 to use your own scroll runway.
     */
    scrollScreens?: number;
    camera?: Partial<CameraConfig>;
    timing?: Partial<TimingConfig>;
    /**
     * With `prefers-reduced-motion: reduce`:
     *  - 'instant' (default): scroll still advances the stage, objects appear in place.
     *  - 'skip': the scene starts fully assembled and nothing animates.
     */
    reducedMotion?: 'instant' | 'skip';
    className?: string;
};

/**
 * A transparent, fixed 3D pitch behind normal page content.
 *
 * The page can grow freely: this component only owns the fixed scene, the
 * scroll runway, and the phase machine. It does not require stage panels or
 * mapping page sections to the animation.
 */
export function PitchBackground({
    children,
    enabled = true,
    breakpoint = 768,
    topOffset = 0,
    scrollScreens = 2,
    camera,
    timing,
    reducedMotion = 'instant',
    className,
}: PitchBackgroundProps) {
    const [store] = useState(createStageStore);
    const scrollSpaceRef = useRef<HTMLDivElement>(null);
    const mobileQuery = `(max-width: ${breakpoint - 0.02}px)`;
    const isMobile = useMediaQuery(mobileQuery);
    const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const [status, setStatus] = useState<'loading' | 'ready' | 'failed'>('loading');

    // Stable configs even when callers pass inline objects.
    const cameraKey = JSON.stringify(camera ?? {});
    const timingKey = JSON.stringify(timing ?? {});
    const cameraConfig = useMemo<CameraConfig>(
        () => ({ ...DEFAULT_CAMERA, ...JSON.parse(cameraKey) }),
        [cameraKey],
    );
    const timingConfig = useMemo<TimingConfig>(
        () => ({ ...DEFAULT_TIMING, ...JSON.parse(timingKey) }),
        [timingKey],
    );

    const offset = Math.max(0, topOffset);
    const screens = Math.max(0, Math.floor(scrollScreens));

    // isMobile is false during SSR and hydration, so hasWebGL() only runs in the browser.
    const showScene = enabled && isMobile && status !== 'failed' && hasWebGL();

    useScrollScene({
        store,
        active: showScene && status === 'ready',
        animate: !prefersReducedMotion,
        skip: prefersReducedMotion && reducedMotion === 'skip',
        topOffset: offset,
        scrollScreens: screens,
        scrollSpaceRef,
    });

    const handleReady = useCallback(() => setStatus('ready'), []);
    const handleError = useCallback((error: unknown) => {
        console.warn('[football-scene] 3D background disabled:', error);
        setStatus('failed');
    }, []);

    return (
        <div className={className ? `${styles.root} ${className}` : styles.root}>
            {enabled && (
                <style>{`html.${SNAP_CLASS}{scroll-snap-type:y mandatory;scroll-padding-top:${offset}px}`}</style>
            )}
            {showScene && (
                <FootballSceneBackground
                    store={store}
                    camera={cameraConfig}
                    timing={timingConfig}
                    idle={!prefersReducedMotion}
                    onReady={handleReady}
                    onError={handleError}
                />
            )}
            <div className={styles.content}>
                {children}
                {screens > 0 && (
                    <div ref={scrollSpaceRef} className={styles.scrollSpace} aria-hidden="true">
                        {Array.from({ length: screens }, (_, index) => (
                            <div key={index} style={{ height: `calc(100svh - ${offset}px)` }} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function useMediaQuery(query: string) {
    const subscribe = useCallback(
        (onChange: () => void) => {
            const mql = window.matchMedia(query);
            mql.addEventListener('change', onChange);
            return () => mql.removeEventListener('change', onChange);
        },
        [query],
    );
    return useSyncExternalStore(
        subscribe,
        () => window.matchMedia(query).matches,
        () => false,
    );
}
