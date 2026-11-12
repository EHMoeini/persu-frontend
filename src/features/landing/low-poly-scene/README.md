# Low-poly scenes

Three inline, fully assembled low-poly 3D scenes for the landing showcase:

- **Football** — outdoor pitch, goals, four players and a ball.
- **Volleyball** — indoor blue/orange court, net with antennae, two players per side and an airborne ball.
- **Tennis** — outdoor clay court, singles layout, net, rackets and a ball.

All three share the same engine, player geometry, slab construction, camera, blob shadows, lighting and idle motion.
They also share one intentionally stylised ground: a **20 × 13 playing area with a 1.3 run-off**, so every slide renders
at exactly the same size. The tennis court is squashed to fit that footprint; real-world proportions are not a goal.

There are no scroll stages or drop animations: every model is visible from the first frame. The only motion is a slow
vertical breath plus occasional eased yaw twists.

## Install

```bash
npm install three
npm install -D @types/three
```

No other runtime dependencies. React Three Fiber, Drei and GSAP are not needed.

## Usage

```tsx
// A client component, or any component that can render client components.
import { TennisScene } from '@/features/landing/low-poly-scene';

export function ShowcaseStage() {
    return (
        <div className="aspect-[6/5] w-full">
            <TennisScene />
        </div>
    );
}
```

`FootballScene` and `VolleyballScene` have the same API.

| Prop        | Default | Notes                                                                |
| ----------- | ------- | -------------------------------------------------------------------- |
| `idle`      | `true`  | Subtle breathing and random twists. Pass `false` for reduced motion. |
| `className` | –       | Applied to the stage wrapper, which fills its parent.                |

The canvas is transparent and draws only the model over the page surface. The stage fills its parent, so give the
parent a size (the landing showcase uses a full-width 6:5 stage directly on the page).

## Files

| File                        | Role                                                                      |
| --------------------------- | ------------------------------------------------------------------------- |
| `engineConfig.ts`           | Shared ground footprint, camera type, idle constants and pixel-ratio cap. |
| `buildUtils.ts`             | Flat marking geometry, slab shape, player/ball/racket builders, disposal. |
| `LowPolyCanvas.tsx`         | Shared WebGL renderer, idle loop, resize, visibility and disposal.        |
| `LowPolyScene.tsx`          | Public inline stage, `next/dynamic` (`ssr: false`), error boundary.       |
| `idleController.ts`         | Subtle breath and random eased yaw twists.                                |
| `sports/football/`          | Pitch config, scene builder and `FootballScene` wrapper.                  |
| `sports/volleyball/`        | Indoor court config, scene builder and `VolleyballScene` wrapper.         |
| `sports/tennis/`            | Clay-court config, scene builder and `TennisScene` wrapper.               |
| `low-poly-scene.module.css` | Stage and canvas sizing.                                                  |

## How it works

1. Each sport builds its complete model once, with every object visible. There are no phases or drop animations.
2. With motion allowed, the model group continuously breathes up/down and twists at random intervals; the renderer
   paints idle frames at about 30fps.
3. Idle frames pause while the scene is off-screen (IntersectionObserver) or the tab is hidden.
4. Under `prefers-reduced-motion`, idle motion is off and frames are drawn only on resize and when the scene comes
   back into view.
5. If WebGL is unavailable, or the chunk or renderer fails, the scene is removed and the rest of the page keeps
   working.

## Scene notes

### Football

A 20 × 13 pitch with a thick rounded slab, mowing bands, full markings, two goals, four players and a resting ball.
The camera looks diagonally from behind the near goal.

### Volleyball

The volleyball court uses the shared 20 × 13 ground: blue with orange attack zones and white lines. The free zone is
the same blue as the back zones, so there is no separate margin around the court. The net is 2.35 high with a white top band, mesh, posts and
red/white antennae. Two blue players defend the near side and two red players the far side. The ball is airborne above
the near attack zone with a shadow on the court.

### Tennis

A clay court squashed onto the shared 20 × 13 ground. The whole slab is the same terracotta clay, so the old green
surround/margin is gone; only the white court lines, net and players sit on top. The singles and doubles lines,
service lines, centre service line and centre marks are all present. The net has posts, a white headband, a centre
strap and mesh. One blue player and one red player wait on the baselines; each holds a low-poly racket. The yellow ball
sits mid-rally near the net.

## Tuning

Each sport's geometry, colours and positions live in its own `sceneConfig.ts`; the ground and camera are shared in
`engineConfig.ts`:

- **Ground**: shared in `engineConfig.ts` (`GROUND`) — 20 × 13 playing area, 1.3 run-off, slab thickness, corner
  radius and line width. All three sports use it; this is what keeps the slides the same size.
- **Camera**: shared `DEFAULT_CAMERA` position, target and FOV. The target is shifted down and slightly off-centre so
  the near slab corner has bottom breathing room instead of touching the canvas edge.
- **Courts**: volleyball and tennis scale their line layouts to the shared ground. Tennis is intentionally squashed
  (20 × 13 instead of 23.77 × 10.97); do not "correct" this if the swiper should stay visually consistent.
- **Players and ball**: positions, facing, kits, hair, scale and ball position.
- **Colours**: surfaces, lines, net, posts, shadow, skin, boots, ball and team kits.
- **Idle motion**: shared in `engineConfig.ts` (`IDLE`). Keep the amplitude and angle small.

### Composition note

With the camera to the right (+x) of the near end, the near end appears **lower-left** and the far end
**upper-right**. Mirror the camera to the left if you want the near end lower-right:

```ts
// engineConfig.ts
position: [-8.92, 16.15, 23.98],
target: [1.2, -1.0, -0.4],
```

## Integration notes

- The landing page renders these inside a shared carousel in the hero at the top of the page, for every viewport.
  The hero viewport is a square surface; the 6:5 stage is centered inside it.
- The carousel is `src/components/ui/carousel.tsx`; it handles swipe, timed advance, pagination, reduced motion and
  off-screen pausing, so the same swiper can be reused elsewhere. The landing adds bottom padding to each slide and
  passes `viewportClassName="pb-4"` so the horizontal scroller's clip edge never cuts the slab's near corner.
- Each scene pauses when scrolled out of view; the tab being hidden also stops painting.
