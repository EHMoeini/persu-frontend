# Football scene

A scroll-driven, low-poly 3D football pitch that sits behind a page as a fixed, transparent background. It renders below
the `breakpoint` prop (768px by default); the Persu landing raises the breakpoint so the pitch also runs inside the
centered app column on desktop. It is self-contained: copy this folder into any Next.js App Router project.

## Install

```bash
npm install three
npm install -D @types/three
```

No other runtime dependencies. React Three Fiber, Drei and GSAP are not needed: the scene has two short drop
animations plus a subtle idle breath/twist, so plain three.js plus a small tween is smaller and easier to control.

## Usage

```tsx
// app/page.tsx (can stay a Server Component)
import { PitchBackground } from '@/features/landing/football-scene';

export default function Page() {
    return (
        <PitchBackground topOffset={68} scrollScreens={2}>
            <YourPage />
        </PitchBackground>
    );
}
```

The component owns the fixed scene and a trailing scroll runway. Page content stays normal; there is no stages array to
map sections into.

| Prop            | Default     | Notes                                                                                                                         |
| --------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `children`      | –           | Normal page content, laid out and scrolled above the scene.                                                                   |
| `enabled`       | `true`      | `false` renders content only.                                                                                                 |
| `breakpoint`    | `768`       | Scene renders when the viewport is narrower than this (px).                                                                   |
| `topOffset`     | `0`         | Height of a fixed header; used to size the scroll runway and scroll step.                                                     |
| `scrollScreens` | `2`         | Empty viewport-heights appended after the content. One step drops the goals, the second drops the players; each screen snaps. |
| `camera`        | see config  | Partial `CameraConfig` override.                                                                                              |
| `timing`        | see config  | Partial `TimingConfig` override (read when the canvas mounts).                                                                |
| `reducedMotion` | `'instant'` | Under `prefers-reduced-motion`: `'instant'` = stages advance without dropping; `'skip'` = start fully assembled.              |
| `className`     | –           | Applied to the wrapper (use it for the scene CSS variables).                                                                  |

The canvas is transparent and renders only the pitch over whatever surface is behind it. The `--fs-scene-width`
variable caps the centered canvas width. `--fs-scene-opacity`, `--fs-scene-scale`, `--fs-scene-x`, and
`--fs-scene-y` fade, scale, and offset the canvas.

## Files

| File                          | Role                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------ |
| `sceneConfig.ts`              | **Every tunable value**: pitch size, colours, player/ball positions, camera, timing. |
| `buildScene.ts`               | Scene component: pure three.js. Pitch, markings, goals, players, ball, lights.       |
| `dropController.ts`           | Animation controller: staged drop tweens, each group plays once.                     |
| `stageStore.ts`               | Phase state machine `initial → goals-dropped → players-dropped → complete`.          |
| `useScrollScene.ts`           | Maps page scroll + the trailing runway onto the phase machine.                       |
| `idleController.ts`           | Subtle pitch breath and random eased yaw twists.                                     |
| `FootballCanvas.tsx`          | Owns the WebGL renderer, idle/render loop, resize, disposal.                         |
| `FootballSceneBackground.tsx` | Fixed background layer, `next/dynamic` (ssr: false), error boundary, WebGL probe.    |
| `PitchBackground.tsx`         | Public wrapper: page content, scroll runway, layering, reduced motion.               |
| `football-scene.module.css`   | Layer styles.                                                                        |

## How the scroll background works

1. The page content renders normally inside `PitchBackground`. The scene is fixed behind it and the component appends
   `scrollScreens` empty viewport-heights after the content.
2. While the intro is active, each direct content block and every empty runway screen are mandatory snap points
   (`scroll-snap-type: y mandatory`; the header height becomes `scroll-padding-top`). One step is the measured runway
   height divided by `scrollScreens`; crossing the first step drops the goals, the second drops the players. Thresholds
   are clamped to the page's maximum scroll.
3. When scrolling settles after the players stage (`scrollend`, with a 160 ms debounce fallback for Safari), the phase
   becomes `complete`, snapping is removed, and every scroll listener detaches.
4. Phases only move forward. Scrolling back up never reverts or replays anything.
5. With motion allowed, the pitch continuously breathes up/down and twists at random intervals; the renderer paints
   idle frames at about 30fps. Drops paint at full rate. Hidden tabs stop painting.
6. Under `prefers-reduced-motion`, idle motion is off and frames are drawn only on resize, phase change and while a
   drop runs.
7. Loading the page part-way down (scroll restoration, `#anchor` links) jumps straight to the matching state without
   animating.

The phase lives outside React state and outside the canvas, so scrolling never re-renders React, and a canvas remount
(rotation across the breakpoint) restores the scene exactly as it was.

## Tuning

All in `sceneConfig.ts`:

- **Camera**: `DEFAULT_CAMERA.position`, `.target`, `.fov`. To zoom without changing the angle, scale
  `position - target` by one factor. Elevation is `atan(dy / horizontalDistance)` (~32° by default).
  `minHorizontalFov` widens the view on very narrow phones so the whole pitch stays in frame.
- **Pitch size**: `PITCH.length`, `PITCH.width`, `PITCH.margin` (run-off; keep it deeper than `GOAL.depth`).
  `PITCH.thickness` controls the slab depth; `PITCH.cornerRadius` rounds its plan-view corners. The markings, goals
  and bands are derived from these values. If you make the pitch much bigger, move the camera back.
- **Players and ball**: `PLAYERS` (team, `[x, z]` position, facing, hair colour) and `BALL_POSITION`. `+z` is the near
  half (blue), `-z` the far half (red). `PLAYER_SCALE` and `BALL_RADIUS` set their size.
- **Timing**: `DEFAULT_TIMING` sets durations and staggers, or pass `timing={{ goalsDuration: 1.1 }}`. The easing is
  cubic ease-out (same as GSAP `power2.out`), in `dropController.ts`.
- **Idle motion**: `IDLE.breathAmplitude`, `.breathSpeed`, `.twistAmplitude`, `.twistDuration`, and the random twist
  interval. Keep the amplitude and angle small for the intended subtle effect.
- **Colours**: `COLORS`.

### Composition note

With the camera to the right (+x) of the near goal, the near goal appears **lower-left** and the far goal
**upper-right**. Geometry forces this: from a point right of the pitch's centreline, nearer points on that line are
always further left. If you want the near goal lower-right and the far goal upper-left instead, mirror the camera to
the left:

```ts
camera={{ position: [-12.9, 22.5, 33.6], target: [1.2, 0, -0.4] }}
```

## Integration notes

- On the entry screen and the empty runway, the intro uses mandatory y snap. Snapping is removed once the players land,
  so later content scrolls normally.
- Pass a fixed header's height as `topOffset`; the scroll step, runway height and snap padding use it.
- The background uses `height: 100lvh`, so its size doesn't change when mobile toolbars show or hide.
- Idle motion is disabled under `prefers-reduced-motion`; the canvas also stops painting while the tab is hidden.
- If WebGL is unavailable, or the chunk or renderer fails, the scene is dropped and the content renders normally.
- By default, desktop never downloads the three.js chunk; raising `breakpoint` opts desktop in.
