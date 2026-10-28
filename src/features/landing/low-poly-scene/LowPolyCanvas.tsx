'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { MathUtils, PerspectiveCamera, Scene, WebGLRenderer } from 'three';

import { MAX_PIXEL_RATIO, type CameraConfig } from './engineConfig';
import { createIdleController } from './idleController';
import type { LowPolyModel } from './types';
import styles from './low-poly-scene.module.css';

export type LowPolyCanvasProps = {
    build: () => LowPolyModel;
    camera: CameraConfig;
    /** Subtle breathing and random twists. Default true. */
    idle?: boolean;
    onError?: (error: unknown) => void;
};

/**
 * Owns the WebGL renderer for a fully assembled low-poly model.
 *
 * Idle frames are capped at ~30fps and pause while the scene is off-screen or
 * the tab is hidden. With idle off (reduced motion), frames are drawn only on
 * resize and when the model comes back into view.
 *
 * Loaded through next/dynamic with ssr: false, so three.js never reaches the
 * server bundle.
 */
export default function LowPolyCanvas({ build, camera, idle = true, onError }: LowPolyCanvasProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const latest = useRef({ idle, onError });
    const requestRenderRef = useRef<() => void>(() => {});

    useLayoutEffect(() => {
        latest.current = { idle, onError };
    });

    useEffect(() => {
        requestRenderRef.current();
    }, [idle]);

    useEffect(() => {
        const host = hostRef.current;
        if (!host) return;

        let renderer: WebGLRenderer;
        try {
            renderer = new WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'low-power',
            });
        } catch (error) {
            latest.current.onError?.(error);
            return;
        }
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO));
        const canvas = renderer.domElement;
        host.appendChild(canvas);

        const scene = new Scene();
        const model = build();
        scene.add(model.root);
        const cam = new PerspectiveCamera(40, 1, 0.5, 150);
        const modelIdle = createIdleController(model.content);

        let frame = 0;
        let inView = false;
        let lastPaint = 0;
        const render = (time: number) => {
            frame = 0;
            const now = time / 1000;
            const idling = Boolean(latest.current.idle) && inView && !document.hidden;

            // Idle motion is slow enough to paint at ~30fps.
            if (idling && time - lastPaint < 1000 / 30) {
                requestRender();
                return;
            }
            if (idling) modelIdle.apply(now);
            else modelIdle.reset();

            renderer.render(scene, cam);
            lastPaint = time;
            if (idling) requestRender();
        };
        const requestRender = () => {
            if (!frame) frame = requestAnimationFrame(render);
        };

        const layout = () => {
            const width = host.clientWidth;
            const height = host.clientHeight;
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            fitCamera(cam, camera, width / height);
            requestRender();
        };
        const resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(host);
        layout();

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                inView = entry.isIntersecting;
                if (inView) requestRender();
            },
            { rootMargin: '120px' },
        );
        intersectionObserver.observe(host);

        const onContextLost = (event: Event) => {
            event.preventDefault();
            cancelAnimationFrame(frame);
            frame = 0;
        };
        canvas.addEventListener('webglcontextlost', onContextLost);
        canvas.addEventListener('webglcontextrestored', requestRender);

        const onVisibility = () => {
            if (!document.hidden) requestRender();
        };
        document.addEventListener('visibilitychange', onVisibility);

        requestRenderRef.current = requestRender;

        return () => {
            requestRenderRef.current = () => {};
            resizeObserver.disconnect();
            intersectionObserver.disconnect();
            cancelAnimationFrame(frame);
            document.removeEventListener('visibilitychange', onVisibility);
            canvas.removeEventListener('webglcontextlost', onContextLost);
            canvas.removeEventListener('webglcontextrestored', requestRender);
            model.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
        };
    }, [build, camera]);

    return <div ref={hostRef} className={styles.canvasHost} />;
}

function fitCamera(cam: PerspectiveCamera, config: CameraConfig, aspect: number) {
    // Widen the vertical FOV on narrow screens so the horizontal FOV never drops
    // below `minHorizontalFov` and the whole model stays in frame.
    const minVertical =
        2 * Math.atan(Math.tan(MathUtils.degToRad(config.minHorizontalFov) / 2) / aspect);
    cam.fov = Math.max(config.fov, MathUtils.radToDeg(minVertical));
    cam.aspect = aspect;
    cam.position.set(...config.position);
    cam.lookAt(...config.target);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
}
