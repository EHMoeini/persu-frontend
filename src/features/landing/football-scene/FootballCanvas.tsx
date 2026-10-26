'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { MathUtils, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { buildFootballScene } from './buildScene';
import { createDropController } from './dropController';
import { createPitchIdleController } from './idleController';
import { MAX_PIXEL_RATIO, type CameraConfig, type TimingConfig } from './sceneConfig';
import type { ScenePhase, StageStore } from './stageStore';
import styles from './football-scene.module.css';

export type FootballCanvasProps = {
    store: StageStore;
    camera: CameraConfig;
    /** Read once at mount. */
    timing: TimingConfig;
    /** Subtle pitch idle motion. Default true; reduced-motion callers pass false. */
    idle?: boolean;
    onReady?: () => void;
    onError?: (error: unknown) => void;
};

/**
 * Owns the WebGL renderer. With idle motion it paints at a capped rate; without
 * it (reduced motion), frames are drawn only on resize, phase change and while
 * a drop runs. Hidden tabs stop painting.
 *
 * Loaded through next/dynamic with ssr: false, so three.js never reaches the
 * server or desktop bundles.
 */
export default function FootballCanvas({
    store,
    camera,
    timing,
    idle = true,
    onReady,
    onError,
}: FootballCanvasProps) {
    const hostRef = useRef<HTMLDivElement>(null);
    const latest = useRef({ camera, timing, idle, onReady, onError });
    const setCameraRef = useRef<((config: CameraConfig) => void) | null>(null);
    const requestRenderRef = useRef<() => void>(() => {});

    useLayoutEffect(() => {
        latest.current = { camera, timing, idle, onReady, onError };
    });

    useEffect(() => {
        setCameraRef.current?.(camera);
    }, [camera]);

    // Idle can be toggled by reduced-motion changes without remounting.
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
        const football = buildFootballScene();
        scene.add(football.root);
        const cam = new PerspectiveCamera(40, 1, 0.5, 150);
        const drops = createDropController(football, latest.current.timing);
        const pitchIdle = createPitchIdleController(football.pitch);
        let cameraConfig = latest.current.camera;

        let frame = 0;
        let ready = false;
        let lastPaint = 0;
        const render = (time: number) => {
            frame = 0;
            const now = time / 1000;
            const idling = Boolean(latest.current.idle) && !document.hidden;
            const moving = drops.update(now);

            // Idle motion is slow enough to paint at ~30fps; drops stay fluid.
            if (idling && !moving && time - lastPaint < 1000 / 30) {
                requestRender();
                return;
            }
            if (idling) pitchIdle.apply(now);
            else pitchIdle.reset();

            renderer.render(scene, cam);
            lastPaint = time;
            if (!ready) {
                ready = true;
                host.dataset.ready = 'true';
                latest.current.onReady?.();
            }
            if (moving || idling) requestRender();
        };
        const requestRender = () => {
            if (!frame) frame = requestAnimationFrame(render);
        };

        const layout = () => {
            const width = host.clientWidth;
            const height = host.clientHeight;
            if (!width || !height) return;
            renderer.setSize(width, height, false);
            fitCamera(cam, cameraConfig, width / height);
            requestRender();
        };
        const resizeObserver = new ResizeObserver(layout);
        resizeObserver.observe(host);
        layout();

        const sync = (phase: ScenePhase, animate: boolean) => {
            const now = performance.now() / 1000;
            if (latest.current.idle && !document.hidden) pitchIdle.apply(now);
            else pitchIdle.reset();
            drops.apply(phase, animate, cam, now);
            requestRender();
        };
        // Mounting late (or remounting after a resize) restores the current phase instantly.
        sync(store.getPhase(), false);
        const unsubscribe = store.subscribe(sync);

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

        setCameraRef.current = (config) => {
            cameraConfig = config;
            layout();
        };
        requestRenderRef.current = requestRender;

        return () => {
            setCameraRef.current = null;
            requestRenderRef.current = () => {};
            unsubscribe();
            resizeObserver.disconnect();
            cancelAnimationFrame(frame);
            document.removeEventListener('visibilitychange', onVisibility);
            canvas.removeEventListener('webglcontextlost', onContextLost);
            canvas.removeEventListener('webglcontextrestored', requestRender);
            football.dispose();
            renderer.dispose();
            renderer.forceContextLoss();
            canvas.remove();
            delete host.dataset.ready;
        };
    }, [store]);

    return <div ref={hostRef} className={styles.canvasHost} />;
}

function fitCamera(cam: PerspectiveCamera, config: CameraConfig, aspect: number) {
    // Widen the vertical FOV on narrow screens so the horizontal FOV never drops
    // below `minHorizontalFov` and the whole pitch stays in frame.
    const minVertical =
        2 * Math.atan(Math.tan(MathUtils.degToRad(config.minHorizontalFov) / 2) / aspect);
    cam.fov = Math.max(config.fov, MathUtils.radToDeg(minVertical));
    cam.aspect = aspect;
    cam.position.set(...config.position);
    cam.lookAt(...config.target);
    cam.updateProjectionMatrix();
    cam.updateMatrixWorld();
}
