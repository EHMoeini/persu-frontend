# Architecture — source of truth

## 0. Baseline

CNA + Bun + Biome only. All code in `apps/<app>/src/`. No new top-level dirs without updating this file.

## 1. Routes: chrome separation

- `src/app/layout.tsx` -> `providers.tsx`, `error.tsx`, `global-error.tsx`, `not-found.tsx`. No page UI here.
- `src/app/(shell)/` = chromed pages only. `layout.tsx` is the ONLY place for Header/Footer/nav.
- `src/app/(no-shell)/` = chromeless flows only (fullscreen, overlays, errors). `layout.tsx` must be passthrough `{children}`. No chrome imports allowed here.
- New page? Decide shell first, then place under correct group. Never mix.
- `src/middleware.ts` = cross-cutting request concerns only. `routes.config.cjs` = slug rewrites only.

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

`biome check .` + `tsc --noEmit` + `bun test` must pass. Every `.logic.ts` has co-located `.test.ts`.
