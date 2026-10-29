# Architecture — source of truth

## 0. Baseline

Next.js (App Router) + Tailwind v4 + Bun. All code in `src/`. Lint/format: ESLint + Prettier (Tailwind class order). No new top-level dirs without updating this file.

## 1. Routes: chrome separation

- `src/app/layout.tsx` -> the 390px centered app column. `providers.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx` live alongside. No page UI here.
- `src/app/(shell)/` = chromed pages. `layout.tsx` owns the `Header` and the `Footer`.
- `src/app/(no-shell)/` = flow pages without shell chrome (fullscreen, overlays, errors). `layout.tsx` must be passthrough `{children}`.
- `src/app/(no-shell)/(auth)/` = auth-flow pages (Check User, Login, Register, OTP, Forgot Password) — a fullscreen flow, not part of the shell. Its `layout.tsx` owns the sticky `AuthHeader` (a back control only) plus the legal note; pages stay content-only.
- The `Header` renders in `(shell)` only — never in the root layout and never under `(no-shell)`.
- New page? Decide shell first, then place under correct group. Never mix.
- `src/proxy.ts` = cross-cutting request concerns only. `routes.config.cjs` = slug rewrites only.

## 2. Features: verticals

- Location: `src/features/<domain>/`. Self-contained; cross-feature imports go via shared layers, never direct.
- Suffix contract (hard rule):
    - `*.endpoint.ts` — server I/O only. Returns `{data,error}`. No transforms.
    - `*.client.endpoint.ts` — browser I/O only.
    - `*.query.ts` — fetch wrappers only.
    - `*.hook.ts(x)` — hooks only.
    - `*.logic.ts` — pure only. MUST NOT import http/next/navigation. Must run under `bun test`.
    - `*.server.ts` — server-only helpers.
    - `*.schema.ts` — validation. `*.models.ts` — types.
- Tabbed entity: `components/<entity>-<tab>/` + `hooks/<entity>-<tab>.hook`.
- Violation = reject: `.logic` importing I/O, `.endpoint` containing mapping.

## 3. Shared layers

- `src/components/<group>/` — shared UI only, no fetching.
- `src/utils/http/` — `http-core.ts` (factory) / `http-server.ts` (server-only) / `http-client.ts` (browser-only) / `*.logic.ts` (pure). All fetching goes through here.
- `src/utils/*.util.ts` stateless, `*.server.ts` server-only. Subdirs per concern.
- `src/hooks/`, `src/stores/*.store.ts`, `src/models/*.model.ts`, `src/constants/*.constant.ts` — one kind per dir, no mixing.

## 4. Verification

`bun run lint` + `bunx tsc --noEmit` + `bun run format:check` must pass. No test runner is wired up yet; pure logic still lives in `.logic.ts` files so tests can be added without refactoring.
