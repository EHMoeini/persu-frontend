'use client';

import dynamic from 'next/dynamic';
import { Component, useCallback, useState, type ReactNode } from 'react';

import type { LowPolySceneProps } from './types';
import styles from './low-poly-scene.module.css';

const LowPolyCanvas = dynamic(() => import('./LowPolyCanvas'), { ssr: false });

/**
 * Renders a fully assembled low-poly model inline in normal page flow.
 * The canvas is transparent and only draws the model; sizing comes from the
 * parent. Any WebGL or chunk failure removes the scene without breaking the
 * page around it.
 */
export function LowPolyScene({ build, camera, idle = true, className }: LowPolySceneProps) {
    const [failed, setFailed] = useState(false);
    const handleError = useCallback((error: unknown) => {
        console.warn('[low-poly-scene] 3D model disabled:', error);
        setFailed(true);
    }, []);

    if (failed) return null;

    return (
        <div
            className={className ? `${styles.stage} ${className}` : styles.stage}
            aria-hidden="true"
        >
            <CanvasBoundary onError={handleError}>
                <LowPolyCanvas build={build} camera={camera} idle={idle} onError={handleError} />
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
