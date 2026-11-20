---
name: Persu Athletic Space
colors:
    surface: '#faf8ff'
    surface-dim: '#d2d9f4'
    surface-bright: '#faf8ff'
    surface-container-lowest: '#ffffff'
    surface-container-low: '#f2f3ff'
    surface-container: '#eaedff'
    surface-container-high: '#e2e7ff'
    surface-container-highest: '#dae2fd'
    on-surface: '#131b2e'
    on-surface-variant: '#3f4850'
    inverse-surface: '#283044'
    inverse-on-surface: '#eef0ff'
    outline: '#707881'
    outline-variant: '#bfc7d2'
    surface-tint: '#006398'
    primary: '#006194'
    on-primary: '#ffffff'
    primary-container: '#007bb9'
    on-primary-container: '#fdfcff'
    inverse-primary: '#93ccff'
    secondary: '#9d4300'
    on-secondary: '#ffffff'
    secondary-container: '#fd761a'
    on-secondary-container: '#5c2400'
    tertiary: '#006577'
    on-tertiary: '#ffffff'
    tertiary-container: '#008096'
    on-tertiary-container: '#f9fdff'
    error: '#ba1a1a'
    on-error: '#ffffff'
    error-container: '#ffdad6'
    on-error-container: '#93000a'
    primary-fixed: '#cce5ff'
    primary-fixed-dim: '#93ccff'
    on-primary-fixed: '#001d31'
    on-primary-fixed-variant: '#004b73'
    secondary-fixed: '#ffdbca'
    secondary-fixed-dim: '#ffb690'
    on-secondary-fixed: '#341100'
    on-secondary-fixed-variant: '#783200'
    tertiary-fixed: '#acedff'
    tertiary-fixed-dim: '#4cd7f6'
    on-tertiary-fixed: '#001f26'
    on-tertiary-fixed-variant: '#004e5c'
    background: '#faf8ff'
    on-background: '#131b2e'
    surface-variant: '#dae2fd'
    sky-light: '#e0f2fe'
    sky-focus: '#38bdf8'
    tangerine-light: '#ffedd5'
    turf-success: '#10b981'
    court-reserved: '#94a3b8'
    court-pending: '#f59e0b'
    court-error: '#ef4444'
    surface-subtle: '#f8fafc'
typography:
    display-lg:
        fontFamily: Vazirmatn
        fontSize: 44px
        fontWeight: '800'
        lineHeight: 56px
    display-lg-mobile:
        fontFamily: Vazirmatn
        fontSize: 30px
        fontWeight: '800'
        lineHeight: 40px
    headline-lg:
        fontFamily: Vazirmatn
        fontSize: 32px
        fontWeight: '700'
        lineHeight: 44px
    headline-lg-mobile:
        fontFamily: Vazirmatn
        fontSize: 22px
        fontWeight: '700'
        lineHeight: 32px
    headline-md:
        fontFamily: Vazirmatn
        fontSize: 24px
        fontWeight: '700'
        lineHeight: 34px
    headline-sm:
        fontFamily: Vazirmatn
        fontSize: 20px
        fontWeight: '600'
        lineHeight: 30px
    title-lg:
        fontFamily: Vazirmatn
        fontSize: 18px
        fontWeight: '600'
        lineHeight: 28px
    title-md:
        fontFamily: Vazirmatn
        fontSize: 16px
        fontWeight: '600'
        lineHeight: 26px
    title-sm:
        fontFamily: Vazirmatn
        fontSize: 14px
        fontWeight: '600'
        lineHeight: 22px
    body-lg:
        fontFamily: Vazirmatn
        fontSize: 16px
        fontWeight: '400'
        lineHeight: 28px
    body-md:
        fontFamily: Vazirmatn
        fontSize: 14px
        fontWeight: '400'
        lineHeight: 24px
    body-sm:
        fontFamily: Vazirmatn
        fontSize: 12px
        fontWeight: '400'
        lineHeight: 20px
    label-lg:
        fontFamily: Vazirmatn
        fontSize: 14px
        fontWeight: '500'
        lineHeight: 20px
    label-md:
        fontFamily: Vazirmatn
        fontSize: 12px
        fontWeight: '500'
        lineHeight: 18px
    label-sm:
        fontFamily: Vazirmatn
        fontSize: 11px
        fontWeight: '500'
        lineHeight: 16px
rounded:
    sm: 0.25rem
    DEFAULT: 0.5rem
    md: 0.75rem
    lg: 1rem
    xl: 1.5rem
    full: 9999px
spacing:
    gutter: 1rem
    gutter-desktop: 1.5rem
    margin: 1rem
    margin-tablet: 1.5rem
    margin-desktop: 2rem
    space-xs: 0.25rem
    space-sm: 0.5rem
    space-md: 1rem
    space-lg: 1.5rem
    space-xl: 2rem
    space-2xl: 3rem
---

## Figma Implementation Protocol

This section is binding for every Figma-to-code task and outranks the visual notes below whenever the two disagree. **Re-use is the default and the goal.** Structure and placement follow `ARCHITECTURE.md`; runtime values follow `src/app/globals.css`; this file describes the intended look.

### 1. Do not trust the design

Figma frames are a **reference, not a contract**. They are drawn by a human, will drift from the shipped app, and frequently re-draw things that already exist. Assume the frame is approximate until the codebase proves otherwise.

- Read frames for intent — hierarchy, grouping, emphasis, flow. Treat measured values as estimates: ±1–2px, an off-by-one font size and a shade that is "almost" an existing token are noise, not requirements.
- **Re-use is not a fallback, it is the first choice.** If a frame draws its own app bar, footer, card, button, chip, badge, icon or empty state, map it to the existing component; never build a parallel one.
- **Never invent.** No new component, token, icon, font size, weight, radius, shadow, spacing step or animation until you have searched and shown that no existing one can express the design. "It looks different in Figma" is not a reason.
- Do not correct established direction. If the codebase stacks where the frame overlaps, or flows RTL where the frame was drawn LTR, keep the codebase direction and adapt spacing. Never flip or re-engineer an established layout to match a frame.
- Never ship a second implementation of something that already exists. Extend with props/variants; do not fork.

### 2. Re-use, extend, only then build

Before writing markup, search in this order:

1. `src/components/ui/` and `src/components/<group>/` for a primitive.
2. `src/features/<domain>/` — feature UI may already exist (the landing 3D sport showcase in `src/features/landing/`, for example).
3. `public/assets/` for the exported SVG before drawing, inlining or re-exporting anything.
4. `src/app/globals.css` for a token before writing a colour, shadow or radius.

Then walk the ladder and **stop at the first step that works**:

1. **The component exists** → use it as-is.
2. **Same component, different configuration** → pass props/`className` (icon, size, radius, variant).
3. **Same component, missing variant** → add a variant to that component; leave its default behaviour untouched.
4. **No single component** → compose existing primitives (e.g. `Card` + `DesignIcon` + `LinkButton`).
5. **Nothing fits** → build the new element in the correct folder, styled only from existing tokens, and state in the summary why steps 1–4 failed.

The shared primitives are the default building blocks: `Button`, `LinkButton`, `TextButton`, `Card`, `Carousel`, `IconChip`, `CircleBadge`, `MaskedIcon`, `DesignIcon`, `StaticImage`, `Spinner`, `FieldLabel`, `HelperNote`, `BackButton`, `LogoMark`, plus the `Header`, `Footer`, `FooterDivider`, `BottomNav` and `AuthHeader` chrome. If a frame shows something that resembles one of these, it _is_ that one.

#### Closest existing value wins

The frame is not authoritative about values. Map every Figma value to the nearest one already in the app, even when they differ:

| Frame wants                          | Use instead                                                                                                                                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A custom hex, `text-[#…]`, `bg-[#…]` | The nearest role token: `surface*`, `foreground*`, `primary*`, `secondary*`, `tertiary*`, `outline*`, `error`, `success`, `warning`, `sky-light`, `tangerine-light`; translucent variants use `*-soft` |
| A font size that is not in the app   | Nearest existing step: `text-[10px]`, `text-[11px]`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-[28px]`                                                                            |
| A new font weight                    | Existing weights only: `font-normal`, `font-medium`, `font-semibold`, `font-bold`, `font-extrabold`                                                                                                    |
| A new radius                         | `rounded-sm`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`                                                                                                                 |
| A new shadow                         | `drop-shadow-subtle`, `shadow-action`, `shadow-input`, `inset-shadow-badge`                                                                                                                            |
| A new spacing value                  | The nearest Tailwind step already used nearby (2 / 2.5 / 3 / 4 / 5 / 6 …)                                                                                                                              |
| A "new" icon                         | The existing asset for the same concept in `public/assets/icons/`                                                                                                                                      |
| A new control                        | `Button`, `LinkButton`, `TextButton` or `IconChip`; `DesignIcon`/`MaskedIcon` for the glyph                                                                                                            |

Only add a token when its **role** does not exist yet (e.g. a genuinely new status colour), and update this file in the same change. Never add a token because a frame's hex is two shades off.

When a new element is truly needed, match the surrounding style exactly: `globals.css` tokens (`bg-surface-card`, `text-foreground-muted`, `border-outline-muted`, …), the existing radius scale, the established 10/11/12/14/16px label sizes, `drop-shadow-subtle`, and the shared focus ring (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`). No arbitrary hex values, no inline colour/spacing styles, no positive letter-spacing.

### 3. Shell chrome belongs to the shell

- `Header`, `FooterDivider`, `Footer` and `BottomNav` render once in `src/app/(shell)/layout.tsx`. Pages never render their own copy — if the frame shows the header or footer, it is already there.
- `BottomNav` is shell-only chrome and is defined only in `src/components/bottom-nav/`. It is never mounted from a page, a feature or a `(no-shell)` route.
- `(no-shell)` routes carry no app chrome. The auth flow keeps its own `AuthHeader` (back control only).

### 4. Every component goes to its permanent home

- Feature-specific UI → `src/features/<domain>/components/`; the `.logic` / `.hook` / `.query` / `.endpoint` / `.models` suffix contract in `ARCHITECTURE.md` still applies.
- Re-usable UI → `src/components/<group>/` (e.g. `ui`, `header`, `footer`, `bottom-nav`). Features never import each other.
- Route files stay thin: composition only, in `src/app/**/page.tsx`.
- New design assets → `public/assets/icons/<feature>/` (or `public/assets/images/`), consumed through a primitive rather than raw `<img>`.

### 5. Asset discipline

- Icons are design exports used verbatim. Never redraw, re-export, recolor or inline an SVG that already exists in `public/assets/`.
- If the frame shows an icon for a concept that already has an asset, reuse that asset even when the frame's glyph differs slightly. Do not export a near-duplicate.
- Picker: multi-colour icon → `DesignIcon`; single-colour icon that must follow `currentColor` (e.g. active/inactive nav) → `MaskedIcon`; decorative non-icon SVG → `StaticImage`.
- Size the wrapper to the asset's intrinsic box from Figma. Do not stretch an SVG to `100% × 100%` of an arbitrary container.

### 6. Scope and verification

- Implement only the requested screen or component. Note pre-existing out-of-scope mismatches instead of fixing them in the same change.
- Re-read your own diff: every new file, component, prop, token, icon and arbitrary value must be justified against the ladder in §2. If it can be deleted in favour of an existing one, delete it.
- Before finishing, re-check both references: `ARCHITECTURE.md` for layers and placement, this file for visuals and interaction.
- `bun run lint`, `bunx tsc --noEmit` and `bun run format:check` must pass.

## Brand & Style

This design system delivers an energetic, breezy, and modern sports management and court booking platform. It caters to modern athletes, amateur sports enthusiasts, and sports facility managers with equal precision. The aesthetic merges clean athletic vitality with modern SaaS ergonomics.

- **Atmosphere & Tone:** Refreshing, energetic, swift, and trustworthy. The interface evokes outdoor sky-lit courts, clear horizons, and frictionless athletic coordination.
- **Visual Style:** Modern-Athletic Minimalism. Crisp floating cards, breathable whitespace, vibrant sky-lit primaries, and spirited warm-citrus secondary highlights that draw instant focus to critical scheduling actions.
- **RTL-Native Architecture:** Engineered natively for Right-to-Left Persian reading flow. Visual weight, action icons, chronological steppers, and pricing units naturally progress right-to-left with balanced physical proportions.

## Colors

The palette establishes an airy, athletic sky-blue as the dominant anchor, accented by energetic tangerine-orange to create high-contrast points of interaction.

- **Primary (`#0284c7`):** Represents open skies, vitality, and clarity. Used for primary calls-to-action, active court selections, calendar date triggers, and key brand touchpoints.
- **Secondary (`#f97316`):** An energetic, dynamic citrus burst. Used strategically for "Book Now" prompts, instant reservation badges, countdown timers for expiring carts, and high-priority alerts.
- **Tertiary (`#06b6d4`):** Aquatic cyan used for secondary feature highlights, lightning booking indicators, and facility amenity badges (e.g., lighting, lockers, paddle rentals).
- **Neutral (`#0f172a`):** Deep athletic slate. Provides optimal typographic readability and contrast across Persian glyphs against daylight reflections on mobile devices.
- **Named Utility Colors:**
    - `sky-light` (`#e0f2fe`): Tinted background for active time-slot selections and selected tab states.
    - `sky-focus` (`#38bdf8`): Accessible focus ring and outline indicator for interactive form inputs.
    - `tangerine-light` (`#ffedd5`): Soft backdrop for promotional tags, flash discounts, and cart holds.
    - `turf-success` (`#10b981`): Pitch-side turf green for confirmed bookings, available courts, and active status indicators.
    - `court-reserved` (`#94a3b8`): Low-emphasis neutral for unavailable, locked, or past time slots.
    - `court-pending` (`#f59e0b`): Caution amber for reservations undergoing payment gateway verification.
    - `court-error` (`#ef4444`): High-alert crimson for cancellation notices or double-booking alerts.

## Typography

The typography system is unified exclusively around **Vazirmatn (وزیرمتن)** across headlines, titles, body content, and utility labels.

- **Persian Script Dynamics:** Generous line heights (1.5x–1.75x) prevent vertical clipping of Persian ascenders and descenders while preserving scan speed across dense daily court agendas.
- **Zero Letter-Spacing:** Strictly avoid positive tracking (`letter-spacing > 0`) to maintain cursive ligature continuity in Persian text.
- **Localized Numerals:** For Persian currency presentation (تومان / ریال), utilize `font-feature-settings: "ss01"` to show Persian numerals natively in customer-facing summaries, while maintaining standard numerals for international technical time spans (e.g., `18:00 - 19:30`) inside dense scheduling matrices.

## Layout & Spacing

A responsive fluid grid adapts complex court booking matrices, venue catalogs, and operator dashboards effortlessly across devices.

- **Breakpoints:**
    - **Mobile (< 640px):** 4 columns, `margin: 1rem`, `gutter: 1rem`. Time-slot grids transform into horizontal carousels or swipeable single-day timelines.
    - **Tablet (640px – 1024px):** 8 columns, `margin-tablet: 1.5rem`, `gutter: 1rem`. Side-by-side venue comparison and split calendar views.
    - **Desktop (> 1024px):** 12 columns capped at `1400px` max width, `margin-desktop: 2rem`, `gutter-desktop: 1.5rem`. Multi-court Gantt charts span 8 columns with sticky booking sidebars occupying 4 columns.
- **RTL Layout Flow:** Margins, padding, drawer dismissals, and directional carousels originate on the right side and resolve toward the left.

## Elevation & Depth

Visual hierarchy uses clean tonal surfaces combined with subtle sky-tinted ambient shadows, ensuring high contrast under sunlight on outdoor sports fields.

- **Surface Base (Level 0):** Neutral `#f8fafc` canvas that reduces glare and prevents eye fatigue during extended scheduling sessions.
- **Cards & Slotted Containers (Level 1):** `#ffffff` surface with a crisp outline (`1px solid #e2e8f0`) and subtle ambient shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Hover & Active Interactive Items (Level 2):** Elevated interactive state with sky-tinted soft drop: `0 8px 16px -4px rgba(2, 132, 199, 0.12), 0 4px 6px -2px rgba(15, 23, 42, 0.04)`.
- **Floating Bars, Dropdown Filters & Bottom Navigation (Level 3):** `0 12px 24px -6px rgba(15, 23, 42, 0.12), 0 6px 10px -4px rgba(15, 23, 42, 0.06)` — exposed as `shadow-floating`.
- **Modal Sheets & Time-Slot Confirmations (Level 4):** Backdrop blur `backdrop-filter: blur(6px)` with `rgba(15, 23, 42, 0.5)` overlay, supported by `0 24px 38px -12px rgba(15, 23, 42, 0.22)`.
- **Selected Slot Elevation:** Distinctive `2px` inset outline in `#0284c7` layered over `#e0f2fe`, avoiding heavy vertical shifts in tight scheduling tables.

## Shapes

The design system employs **Level 2 (Rounded)** shape geometry, pairing 8px (`0.5rem`) base radii with 16px (`1rem`) and 24px (`1.5rem`) macro envelopes for court cards and mobile modal sheets.

- **Base Components (8px / `0.5rem`):** Buttons, input controls, filter selectors, calendar slot chips, and administrative status tags.
- **Cards & Feature Containers (16px / `1rem`):** Court overview cards, revenue summaries, and court spec panels.
- **Bottom Drawers & Major Modals (24px / `1.5rem`):** Reservation confirmation bottom sheets and sport discipline discovery banners.
- **Pills (`9999px`):** Dynamic category tags (تنیس, فوتبال, پدل, بسکتبال), sport badges, active countdown pills, and player avatars.

## Components

### Buttons

- **Primary Action:** Solid vibrant sky blue (`#0284c7`), text `#ffffff`, radius `0.5rem`, height `44px`. Hover state: `#0369a1`. Active state: `#075985`. Focus ring: `3px` solid `#38bdf8`.
- **Energetic Secondary (Quick Book / Instant Pay):** Dynamic tangerine (`#f97316`), text `#ffffff`, radius `0.5rem`. Hover state: `#ea580c`.
- **Soft Accent:** Background `sky-light` (`#e0f2fe`), text `#0284c7`, hover `#bae6fd`.
- **Outline:** Transparent fill, `1.5px` border `#cbd5e1`, text `#0f172a`, hover background `#f1f5f9`.

### Time-Slot Matrix Chips

- **Available:** Background `#ffffff`, border `1px solid #cbd5e1`, text `#0f172a`, sub-price text `#64748b`. Hover: border `#0284c7`, background `#f0f9ff`.
- **Selected:** Background `#e0f2fe`, border `2px solid #0284c7`, text `#0284c7`, font weight `600`.
- **Reserved / Occupied:** Background `#f1f5f9`, border `1px solid #e2e8f0`, text `#94a3b8`, cursor `not-allowed`, strike-through time display.
- **Expiring Cart Hold:** Background `#ffedd5`, border `1.5px dashed #f97316`, countdown text `#ea580c`.

### Venue & Court Cards

- Clean surface container `#ffffff`, border `1px solid #e2e8f0`, border radius `1rem` (`16px`), overflow hidden.
- Top media block (16:9) with rounded top corners, sports type tag pill anchored top-right (RTL), and price badge anchored top-left.
- Footer row featuring live slot availability badge (e.g., «۴ سانس خالی امروز») styled with `turf-success` (`#10b981`).

### Input Fields & Search

- Container: Height `44px`, background `#ffffff`, border `1px solid #cbd5e1`, radius `0.5rem`, text right-aligned.
- Focus: Border `2px solid #0284c7`, shadow `0 0 0 3px rgba(2, 132, 199, 0.15)`.
- RTL Icon Alignment: Search magnifiers and clear actions sit on the left; category filters and placeholder text align right.

### Checkboxes & Radios

- **Checkbox:** `20px × 20px`, radius `4px`, border `2px solid #cbd5e1`. Checked: Background `#0284c7`, border `#0284c7` with white glyph.
- **Radio:** `20px × 20px`, circular, border `2px solid #cbd5e1`. Selected: Border `#0284c7` with inner dot `#0284c7`.

### Sports Filter Chips

- Capsule pill radius (`9999px`), padding `6px 14px`, inline gap `6px`.
- Inactive: Background `#ffffff`, border `1px solid #cbd5e1`, text `#475569`.
- Active: Background `#0284c7`, border `1px solid #0284c7`, text `#ffffff`. Sports icon rendered on the right side of the label.
