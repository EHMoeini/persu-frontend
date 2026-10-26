'use client';

import dynamic from 'next/dynamic';
import { Component, type ReactNode } from 'react';
import type { FootballCanvasProps } from './FootballCanvas';
import styles from './football-scene.module.css';

const FootballCanvas = dynamic(() => import('./FootballCanvas'), { ssr: false });

/**
 * The fixed, non-interactive background layer. Any failure inside it (chunk
 * load, WebGL init) is contained and reported through `onError`; the page
 * around it keeps working.
 */
export function FootballSceneBackground(props: FootballCanvasProps) {
    return (
        <div className={styles.background} aria-hidden="true">
            <CanvasBoundary onError={props.onError}>
                <FootballCanvas {...props} />
            </CanvasBoundary>
        </div>
    );
}

class CanvasBoundary extends Component<
    { children: ReactNode; onError?: (error: unknown) => void },
    { failed: boolean }
> {
    state = { failed: false };

    static getDerivedStateFromError() {
        return { failed: true };
    }

    componentDidCatch(error: unknown) {
        this.props.onError?.(error);
    }

    render() {
        return this.state.failed ? null : this.props.children;
    }
}

let webglSupport: boolean | undefined;

/** Client-only, cached WebGL probe. */
export function hasWebGL() {
    if (webglSupport === undefined) {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
            webglSupport = !!gl;
            gl?.getExtension('WEBGL_lose_context')?.loseContext();
        } catch {
            webglSupport = false;
        }
    }
    return webglSupport;
}
