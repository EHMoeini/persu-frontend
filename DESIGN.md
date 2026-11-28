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

The shared primitives are the default building blocks: `Button`, `LinkButton`, `TextButton`, `Card`, `Carousel`, `IconChip`, `CircleBadge`, `BottomSheet`, `TextField`, `MaskedIcon`, `DesignIcon`, `StaticImage`, `Spinner`, `FieldLabel`, `HelperNote`, `BackButton`, `LogoMark`, plus the `Header` (+ `StaticHeader`), `Footer`, `FooterDivider`, `BottomNav` (+ `StaticBottomNav`), `AuthHeader`, `AuthLegalNote` and `AuthSectionHeader` chrome. If a frame shows something that resembles one of these, it _is_ that one.

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
- Shell chrome is inside `Suspense` boundaries with static fallbacks (`StaticHeader` / `StaticBottomNav`) because `usePathname` is request-time on dynamic routes under `cacheComponents`. New shell code must not read request-time data outside a `Suspense`.
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

### Reconciliation with the shipped app

**Authority order.** Binding protocol above → `src/app/globals.css` **runtime values** → this prose → the YAML front-matter. When prose and `globals.css` disagree, `globals.css` wins; prose hexes describe intent, not token names. **Never use a front-matter key that isn't backed by a `--color-*` in `@theme`** — Tailwind won't generate the utility.

- The YAML front-matter is a Figma/design-system manifest. In this app, tokens are only the implemented set below. Front-matter keys **not implemented in `globals.css`** (no utility generated): `on-surface`, `surface-dim`, `surface-bright`, `surface-container-lowest`, `surface-container-low`, `surface-container`, `surface-container-high`, `surface-container-highest`, `surface-tint`, `surface-variant`, `surface-subtle`, `on-primary`, `on-primary-container`, `on-secondary`, `on-tertiary`, `on-tertiary-container`, `inverse-primary`, `inverse-surface`, `inverse-on-surface`, `background`, `on-background`, `on-error`, `error-container`, `on-error-container`, `on-primary-fixed`, `on-primary-fixed-variant`, `primary-fixed-dim`, `secondary-fixed`, `secondary-fixed-dim`, `on-secondary-fixed`, `on-secondary-fixed-variant`, `tertiary-fixed`, `tertiary-fixed-dim`, `on-tertiary-fixed`, `on-tertiary-fixed-variant`, `outline-variant`, `court-reserved`, `court-pending`, `court-error`, `turf-success`, `sky-focus`. (`on-secondary-container`, `sky-light`, `tangerine-light` **are** implemented.) When a frame uses an unimplemented name, map to the closest implemented token (§"Closest existing value wins").
- **Prose aliases corrected to real token names:** `turf-success`→`success`, `sky-focus`→`focus`, `court-reserved`→`reserved`, `court-pending`→`warning`, `court-error`→`danger`, `surface-subtle`→`surface-muted`. Prose hexes like `#0284c7`, `#f97316`, `#06b6d4`, `#0f172a`, `#f8fafc`, `#e2e8f0`, `#cbd5e1`, `#f1f5f9`, `#475569`, `#64748b`, `#f0f9ff`, `#bae6fd`, `#075985`, `#0369a1`, `#ea580c` are **not** token values; use the implemented tokens below.

#### Implemented color tokens (`src/app/globals.css`, exposed to Tailwind via `@theme inline`)

Surfaces: `surface` #faf8ff · `surface-card` #ffffff · `surface-muted` #f2f3ff · `surface-sunken` #dae2fd · `surface-high` #e2e7ff · `surface-inverse` #283044.
Text/icons: `foreground` #131b2e · `foreground-muted` #3f4850 · `foreground-inverse` #eef0ff · `on-accent` #ffffff · `on-secondary-container` #5c2400.
Accents: `primary` #006194 · `primary-container` #007bb9 · `primary-fixed` #cce5ff · `primary-inverse` #93ccff · `secondary` #9d4300 · `secondary-container` #fd761a · `tertiary` #006577 · `tertiary-container` #008096.
Borders: `outline` #707881 · `outline-muted` #bfc7d2.
Status: `error` #ba1a1a · `error-tint` #ffdad6 · `danger` #ef4444 · `success` #10b981 · `warning` #f59e0b · `reserved` #94a3b8.
Highlights: `sky-light` #e0f2fe · `tangerine-light` #ffedd5 · `focus` #38bdf8.
Translucent (`*-soft`, `color-mix` 10–30% transparent): `primary-soft`, `primary-container-soft`, `outline-soft`, `surface-card-soft`, `placeholder`. Tailwind **opacity suffixes** are also used everywhere (`bg-primary/85`, `bg-surface-card/95`, `border-primary/20`, `ring-outline-muted/30`, `bg-foreground/50`, …); combine with any token. `bg-*`/`text-*`/`border-*`/`ring-*`/`outline-*` utilities are generated for every name above.
Matching names in `CONTEXT.md` (Facility/Court/Time Slot/Availability/Amenity/Review/Weekly Availability) govern wording; the Persian UI terms there are binding.

#### Implemented shadows (`@theme`, no `--shadow-*` elsewhere)

`drop-shadow-subtle` 0 1px 1px rgb(0 0 0/.05) · `shadow-input` 0 1px 2px rgb(0 0 0/.05) · `shadow-action` 0 4px 6px -1px rgb(0 0 0/.1), 0 2px 4px -2px rgb(0 0 0/.1) · `shadow-floating` 0 12px 24px -6px rgb(15 23 42/.12), 0 6px 10px -4px rgb(15 23 42/.06) · `inset-shadow-badge` inset 0 2px 4px rgb(0 0 0/.05). No other shadows. Borders use tokens (`border-outline-muted`, `ring-outline*`, `border-*`), not hardcoded `#e2e8f0`. Focus ring is `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus` (or `focus-within:ring-2 focus-within:ring-focus` on fields); inputs aren't bordered to signal focus.

#### Implemented typography & layout

Single family `--font-sans: 'Vazirmatn'`, self-hosted `/fonts/vazirmatn/css/vazirmatn.css`. No named type scale in Tailwind — app uses raw steps + `leading-*`. The YAML `display-lg`…`label-sm` scale is design intent; actual established sizes: `text-[10px]`, `text-[11px]`, `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-xl`, `text-[28px]` + leading `1.5–1.75×`. Weights `font-normal/medium/semibold/bold/extrabold`. **Zero positive letter-spacing.** `ss01` is not enabled in CSS; Persian digits are rendered explicitly (`toPersianDigits`, e.g. `src/features/facility/facility.logic.ts`, and CONTEXT "Localized Numerals"); **time spans stay Latin digits in dense scheduling matrices**; currency grouped `formatToman` + `تومان`.
Radii: `rounded-sm`, `rounded-md`, `rounded-lg` (8px base), `rounded-xl`, `rounded-2xl`, `rounded-3xl`, `rounded-full`, `rounded-[6px]`; `rounded` YAML values are not applied in `globals.css`. **Layout:** mobile-first app shell; root `max-w-97.5` **390px** centered column, `dir=rtl`, `min-h-dvh`; `.app-grid` 24px tinted graph paper; `scrollbar-gutter: stable`; `env(safe-area-inset-bottom)` padding on floating bars/sheets; horizontal `overflow-x-auto` for time-slot rows (not single-day timeline); the responsive 4/8/12-col breakpoints & 1400px below are **intent for future responsive screens**, not current shipped behavior; scheduling facility page is a single-column stack.
**Motion:** `transition-*`, `duration-300`, ease `cubic-bezier(0.22,1,0.36,1)`, `motion-reduce:transition-none`, BottomSheet `400ms`/`200ms`, `data-closed`/`data-leave`, `animate-*` only as already used; no new animation without checking §"Never invent". `useHideOnScroll`: `SCROLL_DIRECTION_THRESHOLD` 32px, `TOP_REVEAL_OFFSET` 64px, reset per route; shared `bottom-nav` store; sticky CTA docks when nav hides, steps aside for footer.

## Brand & Style

This design system delivers an energetic, breezy, and modern sports management and court booking platform. It caters to modern athletes, amateur sports enthusiasts, and sports facility managers with equal precision. The aesthetic merges clean athletic vitality with modern SaaS ergonomics.

- **Atmosphere & Tone:** Refreshing, energetic, swift, and trustworthy. The interface evokes outdoor sky-lit courts, clear horizons, and frictionless athletic coordination.
- **Visual Style:** Modern-Athletic Minimalism. Crisp floating cards, breathable whitespace, vibrant sky-lit primaries, and spirited warm-citrus secondary highlights that draw instant focus to critical scheduling actions.
- **RTL-Native Architecture:** Engineered natively for Right-to-Left Persian reading flow. Visual weight, action icons, chronological steppers, and pricing units naturally progress right-to-left with balanced physical proportions.

## Colors

The palette establishes an airy, athletic sky-blue as the dominant anchor, accented by energetic tangerine-orange to create high-contrast points of interaction.

- **Primary (`primary`, `#006194`; `primary-container` `#007bb9`, `primary-fixed` `#cce5ff`, `primary-inverse` `#93ccff`):** Open skies, vitality, clarity. Primary calls-to-action, active court selections, calendar date triggers, key brand touchpoints. Text on it `on-accent`.
- **Secondary (`secondary`, `#9d4300`; `secondary-container` `#fd761a`, `on-secondary-container` `#5c2400`):** Energetic citrus. "Book Now" / instant-pay prompts, instant reservation badges, expiring-cart countdowns, high-priority alerts; `secondary-container` is the filled energetic CTA (e.g. booking-bar confirm).
- **Tertiary (`tertiary`, `#006577`; `tertiary-container` `#008096`):** Aquatic cyan; secondary feature highlights, availability marks, facility amenity accents.
- **Neutral (`foreground` `#131b2e`, `foreground-muted` `#3f4850`, `foreground-inverse`, `on-accent`, `outline`, `outline-muted`):** Deep athletic slate for readability on light surfaces; muted for secondary text. (Prose `#0f172a`/`#e2e8f0` are not tokens.)
- **Surfaces:** `surface` `#faf8ff` canvas, `surface-card` `#ffffff`, `surface-muted`, `surface-sunken`, `surface-high`, `surface-inverse`. (Prose `#f8fafc` base is not the token; use `surface`.)
- **Named Utility Colors (implemented tokens):**
    - `sky-light` (`#e0f2fe`): Tinted background for active time-slot selections and selected tab states. (Actual selection uses `primary` + `on-accent`, not `sky-light`, on the facility schedule; `sky-light` is available.)
    - `focus` (`#38bdf8`): Accessible focus ring and outline indicator for interactive form inputs. (Prose `sky-focus` is not a token.)
    - `tangerine-light` (`#ffedd5`): Soft backdrop for promotional tags, flash discounts, and cart holds.
    - `success` (`#10b981`): Pitch-side turf green for confirmed bookings, available courts, active status. (Prose `turf-success` is not a token.)
    - `reserved` (`#94a3b8`): Low-emphasis neutral for unavailable, locked, or past time slots. (Prose `court-reserved` is not a token; schedule uses `surface-high` + `opacity-50` + `line-through`.)
    - `warning` (`#f59e0b`): Caution amber for reservations undergoing payment verification. (Prose `court-pending` is not a token.)
    - `danger` (`#ef4444`): Crimson for cancellation/double-booking alerts. (Prose `court-error` is not a token; `error` `#ba1a1a` + `error-tint` for form errors.)
- Translucency: `*-soft` tokens + Tailwind `/NN` opacity on any token.

## Typography

The typography system is unified exclusively around **Vazirmatn (وزیرمتن)** across headlines, titles, body content, and utility labels.

- **Persian Script Dynamics:** Generous line heights (1.5x–1.75x) prevent vertical clipping of Persian ascenders and descenders while preserving scan speed across dense daily court agendas.
- **Zero Letter-Spacing:** Strictly avoid positive tracking (`letter-spacing > 0`) to maintain cursive ligature continuity in Persian text.
- **Localized Numerals:** For Persian currency presentation (تومان / ریال), utilize `font-feature-settings: "ss01"` to show Persian numerals natively in customer-facing summaries, while maintaining standard numerals for international technical time spans (e.g., `18:00 - 19:30`) inside dense scheduling matrices. **Current implementation:** `ss01` isn't enabled in `globals.css`; Persian digits are produced explicitly (`toPersianDigits`, currency `formatToman`; see CONTEXT "Localized Numerals") while technical time spans (e.g. `07:30 - 09:00`) stay Latin-digit. Don't assume `ss01`.

## Layout & Spacing

A responsive fluid grid adapts complex court booking matrices, venue catalogs, and operator dashboards effortlessly across devices.

- **Breakpoints:**
    - **Mobile (< 640px):** 4 columns, `margin: 1rem`, `gutter: 1rem`. Time-slot grids transform into horizontal carousels or swipeable single-day timelines.
    - **Tablet (640px – 1024px):** 8 columns, `margin-tablet: 1.5rem`, `gutter: 1rem`. Side-by-side venue comparison and split calendar views.
    - **Desktop (> 1024px):** 12 columns capped at `1400px` max width, `margin-desktop: 2rem`, `gutter-desktop: 1.5rem`. Multi-court Gantt charts span 8 columns with sticky booking sidebars occupying 4 columns.
- **RTL Layout Flow:** Margins, padding, drawer dismissals, and directional carousels originate on the right side and resolve toward the left. **Current shipped layout** is a mobile-first app shell: fixed **390px** centered column (`max-w-97.5`, `mx-auto`, `dir="rtl"`, `lang="fa"`, `.app-grid`, `scrollbar-gutter: stable`, `min-h-dvh`), single-column stacks, horizontal `overflow-x-auto` slot rows, safe-area-inset padding, floating bottom nav + sticky booking bar; the 4/8/12-col breakpoint scale above is **intent**, not current behavior. Logical properties (`start`/`end`, `ps`/`pe`, `ms`/`me`, `inset-x`) are preferred so RTL works.

## Elevation & Depth

Visual hierarchy uses clean tonal surfaces combined with subtle sky-tinted ambient shadows, ensuring high contrast under sunlight on outdoor sports fields.

- **Surface Base (Level 0):** `surface` `#faf8ff` canvas that reduces glare and prevents eye fatigue during extended scheduling sessions. (Prose `#f8fafc` is not the token; `surface-muted` `#f2f3ff` is the recessed card fill.)
- **Cards & Slotted Containers (Level 1):** `surface-card` `#ffffff`, `rounded-2xl`, **`drop-shadow-subtle`**; borders `border-outline-muted`/`outline-soft` where used. (Prose `1px solid #e2e8f0` + custom shadow is not the implemented look.)
- **Hover & Active Interactive Items (Level 2):** **`shadow-action`** `0 4px 6px -1px rgb(0 0 0/.1), 0 2px 4px -2px rgb(0 0 0/.1)`; **`shadow-input`** `0 1px 2px rgb(0 0 0/.05)`; translucent `*-soft` + `/NN`. (Prose `#…` sky-tinted drops are not token values.) Buttons have no separate hover-shade requirement; `transition-colors`.
- **Floating Bars, Dropdown Filters & Bottom Navigation (Level 3):** **`shadow-floating`** `0 12px 24px -6px rgb(15 23 42/.12), 0 6px 10px -4px rgb(15 23 42/.06)`.
- **Modal Sheets & Time-Slot Confirmations (Level 4):** `BottomSheet` backdrop `bg-foreground/50` (**no blur** in `BottomSheet`), panel `shadow-floating`, `rounded-t-3xl`, `max-h-[calc(100dvh-2rem)]`, `pb` safe-area; `backdrop-blur-*` (`backdrop-blur`, `backdrop-blur-[12px]`, `backdrop-blur-2xl`) is used on translucent floating chips/bars; `inset-shadow-badge`. (Prose `blur(6px)` + `rgba(.5)` + `0 24px…` is not the implemented shadow; match `BottomSheet`.)
- **Selected Slot Elevation:** selected slot = `bg-primary` + `text-on-accent` + `shadow-action`, check icon; `inset-shadow-badge` for inset pills; no heavy vertical shifts. (Prose `2px inset #0284c7` + `#e0f2fe` is not the current implementation.)

## Shapes

The design system employs **Level 2 (Rounded)** shape geometry, pairing 8px (`0.5rem`) base radii with 16px (`1rem`) and 24px (`1.5rem`) macro envelopes for court cards and mobile modal sheets.

- **Base Components:** `rounded-lg` (8px, `rounded` DEFAULT `0.5rem`) for buttons, inputs, filter selectors, calendar slot chips, status tags; `rounded-md`/`rounded-sm`. (Actual buttons/slots are `rounded-xl` 12px; fields `rounded-xl`; chips `rounded-lg`.)
- **Cards & Feature Containers:** `rounded-xl` (12px) slots; **`rounded-2xl` (16px)** court/facility cards, panels; `rounded-[6px]` legend; base radii are Tailwind defaults, not overridden in `globals.css`.
- **Bottom Drawers & Major Modals:** **`rounded-t-3xl` (24px)** top corners `BottomSheet`; `rounded-2xl` sheets; `rounded-3xl`.
- **Pills (`rounded-full`, `9999px`):** category tags, sport badges, countdown pills, avatars, `CircleBadge`, `IconChip`.

## Components

### Buttons

Shipped `Button` (`src/components/ui/button.tsx`, styles `button-styles.ts`):

- **Primary Action (`variant="primary"`):** `h-12` (48px, prose `44px` is stale), full width, `rounded-xl`, `bg-primary`, `text-on-accent`, `text-sm font-bold`, `shadow-action`, `transition-colors`; **no separate hover shade**; focus-visible `outline-2 outline-offset-2 outline-focus`; disabled `opacity-40` + no shadow + `cursor-not-allowed`; `loading` → `Spinner`, `aria-busy`, disabled; `icon` trailing (after label in reading order). Figma "Primary Action Button". (Prose hover `#0369a1`/active `#075985` + 3px ring not implemented.)
- **Energetic Secondary (Quick Book / Instant Pay):** filled **`bg-secondary-container`** + `text-on-accent` (`#fd761a`/`#ffffff`, e.g. booking-bar confirm); `secondary` `#9d4300` for text accents. (Prose `#f97316` hover `#ea580c` not tokens.)
- **Soft Accent (`variant="soft"`, `size="sm"`):** `BUTTON_BASE_CLASS_NAME` + soft sizing; accent uses `primary-soft`/`sky-light`. (Prose `#bae6fd` hover not token.)
- **Outline:** via `LinkButton`/`TextButton` or composed; `border-outline-muted`, `text-foreground`. (Prose `#cbd5e1`/`#f1f5f9` not tokens.)
- **`LinkButton`:** `<a>`, `variant`, `size`, `trailingIcon`, `prefetch`, href; **`TextButton`**; **`IconChip`** (`tone` sunken/muted/high, `size` md=40px/sm=32px, `radiusClassName`, `label`, `onClick`); **`CircleBadge`**; **`BackButton`**.

### Time-Slot Matrix Chips

Shipped `FacilitySchedule` (`src/features/facility/components/facility-schedule.tsx`; prose `#…` values are **not** the implementation):

- **Available:** `bg-surface-card`, `hover:bg-surface-high`, `rounded-xl`, time `font-bold`, sub-price `text-primary`, `text-[10px]`, scrollable `overflow-x-auto` per day; **no border**. (Prose border `#cbd5e1` + `#f0f9ff` not tokens.) Free legend swatch `bg-surface-card ring-1 ring-outline-muted/30`.
- **Selected:** `bg-primary` + `text-on-accent` + `shadow-action`, `aria-pressed`, check-circle icon, `text-primary-fixed` sub-price. (Prose `#e0f2fe`+`2px #0284c7` + `600` not implementation.)
- **Reserved / Occupied:** `bg-surface-high/60`, `opacity-50`, `text-outline` + `line-through`, «رزرو شد», non-interactive `<div>`. (`reserved` token exists; prose `#f1f5f9`/`#e2e8f0`/`#94a3b8` not tokens.) Legend `bg-surface-high/60`.
- **Expiring Cart Hold (intent, not yet shipped):** `tangerine-light`, dashed `secondary-container`, countdown `secondary`; `warning`. (Prose `#ffedd5`/`#f97316`/`#ea580c` not tokens.)

### Facility & Court Cards

Shipped cards (`FacilityCard` search result, `PopularFacilityCard` landing, facility overview `Card`); terminology is **Facility/Court**, not "venue":

- `Card`, `surface-card`, `rounded-2xl`, `overflow-hidden`, `border-surface-high/70`, `shadow-input`→`shadow-action` hover, `p-3`/`p-5`; `StaticImage`.
- **Top media block:** `aspect-[16/10]` (prose 16:9 not current; facility overview `aspect-[16/10]`, thumbnails `aspect-[4/3]`); rounded-top; sport pill `rounded-full bg-primary/85 text-on-accent`; **price badge** `rounded-md bg-surface-inverse/80 text-foreground-inverse`; rating `text-secondary`; type tag.
- **Footer/live availability:** «۴ سانس خالی امروز» / «سانس خالی امروز» / «ظرفیت تکمیل»; available `text-tertiary`, unavailable `text-outline-muted`, `availability` icon; `success` `#10b981` for confirmed bookings. (Prose `turf-success` not token; current card uses `tertiary`, not `success`, for availability.)
- Facility page structure (this branch): `FacilityTopBar`, `FacilityGallery`, `FacilityOverview`, `FacilityReviews`, `FacilitySchedule`, `FacilityBookingBar`; mocked `FACILITY_DETAIL`.

### Input Fields & Search

Shipped `TextField` (and auth fields):

- Container `h-12`, `rounded-xl`, **`bg-surface-muted`**, no border; **focus `ring-2 ring-focus`** (`focus-within`); prose `44px`/`#fff`+`1px #cbd5e1`+`0 0 0 3px rgba(2,132,199,.15)` not implementation. Text right-aligned; placeholder `text-placeholder`; disabled; `aria-invalid`, `aria-describedby`, `role="alert"` error `text-error`, helper `HelperNote`, `FieldLabel`, `required`.
- RTL Icon Alignment: leading icon at **inline start (right in RTL)** `start-3` + `ps-10`; search magnifier/clear at inline end; category filters align right. (Prose "magnifier sit on the left" — app uses logical `start`/`end`.)

### Checkboxes & Radios

- **Checkbox (shipped `TermsCheckbox`):** `sr-only` input + label `size-5` (20px), `rounded`, `bg-surface-sunken`, inline check SVG `text-transparent`→`peer-checked:bg-primary peer-checked:text-on-accent`, `peer-focus-visible:ring-2 ring-focus`, disabled `opacity-40`; **no `2px` border**; checkbox sits at inline end; prose `#cbd5e1`/`#0284c7` not tokens. No shared `Checkbox`; **no `Radio` shipped** (prose `2px`/`4px` + `#…` is intent, not implementation).

### Sports Filter Chips

Prose padding `6px 14px` is not the implementation. Two shipped forms:

- **Search `FilterChip`** (`src/features/search/components/filter-chip.tsx`, feature-local): `h-8 rounded-full text-xs`, `gap-1.5 px-3.5` (sport/option) / `gap-1 px-3` (utility), `aria-pressed`, focus ring; **no border**. Inactive sport `bg-surface-card text-foreground-muted drop-shadow-subtle`, utility `bg-surface-high`, option `bg-surface-muted`; **active `bg-primary font-semibold text-on-accent`**. Glyph `DesignIcon`, or `MaskedIcon` when `maskIcon`, single-colour follows `currentColor`. **Sports icon rendered on the right side of the label** (RTL: icon first in DOM → right).
- **Landing sport pills** (`sport-search-card.tsx`): `h-[20.5px] rounded-full bg-surface-high px-2.5 text-[11px] font-medium`, icon + label, not toggle buttons.
