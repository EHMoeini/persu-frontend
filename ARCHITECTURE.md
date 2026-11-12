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
    - `*.endpoint.ts` — server I/O only. No transforms. Call `http` from `http-server.ts`; return the wire model. Errors surface as `HttpError`.
    - `*.client.endpoint.ts` — browser I/O only. No transforms.
    - `*.query.ts` — TanStack Query `useQuery` wrappers over endpoint functions. No raw I/O.
    - `*.hook.ts(x)` — mutations and other React hooks only. No raw I/O.
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

## 4. API layer

- **Endpoint paths** live in `src/constants/endpoints.constant.ts` as `EXTERNAL_ENDPOINTS`. Paths only — never a base URL, never a fetch call. Group by domain; use the function form for parameterized paths:
    ```ts
    export const EXTERNAL_ENDPOINTS = {
        SOMETHING: '/api/something',
        FUNCTION_SOMETHING: (id: number) => `/api/something/${id}`,
    };
    ```
- **Query keys** live in `src/constants/query-keys.constant.ts` as `QUERY_KEYS`. Every key is a readonly array (TanStack Query v5); parameterized resources use a function returning an array. One entry per cached resource.
- **Client I/O** lives in `src/features/<domain>/<domain>.client.endpoint.ts`. Compose `${process.env.NEXT_PUBLIC_API_BASE_URL}${EXTERNAL_ENDPOINTS.X}`, call `httpClient`, and return the wire model. No mapping, no React.
- **Queries** live in `src/features/<domain>/<domain>.query.ts` (or beside the component for a local resource). They wrap client endpoint functions in `useQuery` and use `QUERY_KEYS`; no raw I/O.
- **Mutations and other hooks** live in `*.hook.ts(x)`; mutations wrap client endpoint functions in `useMutation`.
- **Server I/O** lives in `src/features/<domain>/<domain>.endpoint.ts`. Call `http`; endpoint functions are directly callable from server components and must not be wrapped in a React hook.
- **Models** live in `*.models.ts` (feature) or `src/models/*.model.ts` (shared). Model the wire shape exactly, including envelopes such as `{ success, meta, data }`; types are `I`-prefixed interfaces.
- **Auth boundary**: `/auth/*` is public except `/auth/session`, which requires `Authorization: Bearer <accessToken>`. `/api/*` requires the Bearer token. Never infer the auth requirement from the prefix — check the endpoint. Refresh tokens are only sent to `/auth/refresh` and `/auth/logout`.
- API routes have no trailing slash. Docs routes do.

## 5. Verification

`bun run lint` + `bunx tsc --noEmit` + `bun run format:check` must pass. No test runner is wired up yet; pure logic still lives in `.logic.ts` files so tests can be added without refactoring.
