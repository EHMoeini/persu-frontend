# Architecture — source of truth

## 0. Baseline

Next.js 16 (App Router) + React 19 + Tailwind v4 + Bun. All code in `src/`. Lint/format: ESLint + Prettier (Tailwind class order). No new top-level dirs without updating this file.

- **Package manager:** Bun (`bun.lock`, `packageManager` in `package.json`). Scripts: `bun run dev` / `build` / `start`, `bun run lint`, `bun run format` (write) / `format:check`. Verification in §5.
- **Next 16 Cache Components:** `next.config.ts` sets `cacheComponents: true`, `partialPrefetching: true`, `skipTrailingSlashRedirect: true`, `experimental.agentFeedback: true`, `rewrites()` from `routes.config.cjs`, and a Turbopack rule routing non-module `*.css` through `@tailwindcss/turbopack`. Because dynamic params (e.g. `/facilities/[id]`) are only known at request time, anything reading `usePathname` under a dynamic route needs a `Suspense` boundary with a static fallback — see `(shell)/layout.tsx`. Trailing slashes are normalized in `src/proxy.ts`, not by Next. `AGENTS.md` is written/re-added by `next dev` and must not be removed; this version's Next.js has breaking changes vs. older knowledge — read `node_modules/next/dist/docs/`.
- **Language & RTL:** Persian-first. Root layout is `<html lang="fa" dir="rtl">`, Vazirmatn self-hosted (`/fonts/vazirmatn`), `app-grid` 24px graph-paper background, `scrollbar-gutter: stable`. Product vocabulary is fixed in `CONTEXT.md`; visual rules in `DESIGN.md`.
- **Product identity:** "Persu (پرسو)". Constants `APP_VERSION`, device/cookie names live in `src/constants/global.constant.ts`.
- **Design history:** `docs/adr/` (0001 auth route group, 0002 phone-number handoff, 0003 auth in no-shell) + `docs/auth-api-integration-plan.md`. ADRs are append-only records; new durable decisions go there, vocabulary in `CONTEXT.md`, process rules here.

## 1. Routes: chrome separation

- `src/app/layout.tsx` -> the 390px centered app column (`max-w-97.5`, `w-full`, `min-h-dvh`, `mx-auto`, `bg-surface app-grid`). `providers.tsx` (TanStack `QueryClientProvider` + `AuthSessionBootstrap`; fresh client per server render, one per browser tab), `error.tsx`, `global-error.tsx`, `not-found.tsx`, `icon.svg`, `globals.css` live alongside. No page UI here.
- `src/app/(shell)/` = chromed pages. `layout.tsx` owns the `Header`, `FooterDivider`, `Footer` and `BottomNav`. `Header` + `BottomNav` each sit in a `<Suspense>` boundary with a static fallback (`StaticHeader`, `StaticBottomNav`) because both read `usePathname`, which dynamic routes only know at request time; `Header` itself switches to its landing variant on `/`.
- `src/app/(no-shell)/` = flow pages without shell chrome (fullscreen, overlays, errors). `layout.tsx` must be passthrough `{children}`.
- `src/app/(no-shell)/(auth)/` = auth-flow pages — a fullscreen flow, not part of the shell. Its `layout.tsx` owns the sticky `AuthHeader` (a back control only) plus `AuthLegalNote`; pages stay content-only. Pages: `/user-check`, `/login`, `/register`, `/otp`, `/forgot-password`. `(no-shell)/(auth)` has its own `layout.tsx`. See `docs/adr/0001`, `0002`, `0003`.
- The `Header` renders in `(shell)` only — never in the root layout and never under `(no-shell)`. `BottomNav` is shell-only chrome defined in `src/components/bottom-nav/`.
- New page? Decide shell first, then place under correct group. Never mix.

### Route inventory (actual pages)

- `(shell)`: `/` (landing), `/facilities/[id]`, `/profile`.
- `(no-shell)`: `/search` (note: search is **not** a shell page), `(auth)/user-check|login|register|otp|forgot-password`, `errors/401`, `errors/404`, `errors/500`, `errors/502`, `errors/offline`.
- Root `not-found.tsx` + `components/not-found/`, root `error.tsx`, `global-error.tsx`. Error routes under `(no-shell)/errors/*` are targets of `http-client` redirects (`/errors/404`, `/errors/offline`, `/errors/401`, …) and are reachable directly.

### `src/proxy.ts` (Next 16 proxy; cross-cutting request concerns only)

- **Trailing slashes:** `skipTrailingSlashRedirect: true` in `next.config.ts`; proxy trims trailing slashes itself → **308** redirect with `Cache-Control: private, no-cache, no-store, max-age=0, must-revalidate`.
- **Identity headers:** real client IP from `x-forwarded-for` (first hop) / `x-real-ip` → `X-Real-IP`; `x-device-info` JSON from `getDeviceInfo(user-agent)` (`src/utils/device-detector.util.ts`, `src/models/device.model.ts`); `device_id` cookie (`DEVICE_ID_COOKIE`) → `X-Device-ID`, deleted when absent. `X-Device-ID` propagated to downstream requests.
- **Caching:** file-like paths outside known public asset directories (`fonts`, `icons`, `images`, `styles` under `/public`) get no-store; known public assets keep static caching. `matcher` excludes `api`, `_next/*`, well-known root files, `.rsc`/`.segments`.
- **`routes.config.cjs`** = slug rewrites only; `TAB_TRANSLATIONS` is currently empty; localized tab slugs are URL-encoded segments; API routes have no trailing slash, docs routes do (`routes.config.cjs` comment + API rule §4).

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
- **Feature inventory (actual):** `auth`, `landing`, `search`, `profile`, `facility`. `src/features/` contains only these; no cross-feature imports.
- **Suffixes seen in practice beyond the hard rule:** `auth` uses `*.phone.ts` (pure phone-number normalization), `auth.copy.ts` (Persian copy strings), `*.schema.ts`; `landing` ships a CSS module (`landing.module.css`) + `low-poly-scene` three.js + `SportShowcase*.tsx`. CSS modules are allowed alongside Tailwind; non-module CSS routes through Turbopack's built-in transform (`next.config.ts`).

## 3. Shared layers

- `src/components/<group>/` — shared UI only, no fetching. Groups: `ui`, `shared`, `auth`, `header`, `footer`, `bottom-nav`, `brand`, `error`, `not-found`. Features never import each other.
- Use `@headlessui/react` for headless overlays and interactive primitives (Dialog, Popover, Menu, Listbox, Tabs). It is unstyled; style with Tailwind. Headless UI has no dedicated Drawer — compose `Dialog` + `DialogPanel` as the bottom sheet (see `BottomSheet`).
- **Shared primitives (keep in sync with DESIGN.md §2):** `ui/`: `Button`, `LinkButton`, `TextButton`, `Card`, `Carousel`, `IconChip`, `CircleBadge`, `BottomSheet`, `TextField`, `MaskedIcon`, `DesignIcon`, `StaticImage`, `Spinner`, `FieldLabel`, `HelperNote`, `button-styles.ts`; `shared/`: `BackButton`; `auth/`: `AuthHeader`, `AuthLegalNote`, `AuthSectionHeader`; chrome: `Header` (+ `StaticHeader`), `Footer`, `FooterDivider`, `BottomNav` (+ `StaticBottomNav`), `LogoMark`; `error/`, `not-found/`. (`Button`, `IconChip`, `BottomSheet`, `TextField`, `BottomNav`, `StaticBottomNav`, `StaticHeader`, `AuthLegalNote`, `AuthSectionHeader`, `BottomNav` store etc. are real even where DESIGN.md's list is shorter.)
- `src/utils/http/` — `http-core.ts` (factory + `HttpError` + `joinUrl`) / `http-server.ts` (server-only) / `http-client.ts` (browser-only) / `auth-refresh.ts` (refresh-token flow) / `http-common-headers.ts` / `*.logic.ts` (pure). All fetching goes through here. See §4.
- `src/utils/*.util.ts` stateless, `*.server.ts` server-only. Subdirs per concern. Actual utils: `cookie-client`, `cookie-server`, `device-detector`, `logger`, `safe-storage`, `shared`, `slug`, `snackbar-events`; plus `query-client.ts`. (Server-only file `cookie-server.util.ts` reads Next `headers()`.)
- `src/hooks/`, `src/stores/*.store.ts`, `src/models/*.model.ts`, `src/constants/*.constant.ts` — one kind per dir, no mixing.
- **Hooks (`src/hooks/`):** `use-debounce`, `use-drawer-back-button`, `use-hide-on-scroll`, `use-media-query`. `useHideOnScroll` holds scroll-hide state in the shared `bottom-nav` store (thresholds: 32px direction, 64px top reveal; resets per route before paint); sticky CTAs read the same store. Feature-local hooks live in `*.hook.ts(x)`.
- **Stores (`src/stores/`):** `auth.store` (`useAuthStore`; in-memory access token + persisted refresh token `persu.auth.v1.refreshToken` in localStorage; `loading|authenticated|unauthenticated`; `safeLocalStorage`), `bottom-nav.store` (`hidden` + `setHidden`, used by `BottomNav` + sticky CTAs), `landing-brand.store`.
- **Models:** `src/models/device.model.ts`; feature wire models in `*.models.ts`. `src/constants/`: `endpoints.constant.ts` (`EXTERNAL_ENDPOINTS`), `query-keys.constant.ts` (`QUERY_KEYS`), `global.constant.ts`. Types are `I`-prefixed interfaces (see §4).

## 4. API layer

- **Endpoint paths** live in `src/constants/endpoints.constant.ts` as `EXTERNAL_ENDPOINTS`. Paths only — never a base URL, never a fetch call. **A path never starts with `/`** (and never ends with one): the base URL and the path are joined by plain concatenation, so a leading slash turns into `https://api.example.com//auth/login`. Group by domain; use the function form for parameterized paths:
    ```ts
    export const EXTERNAL_ENDPOINTS = {
        SOMETHING: 'api/something',
        FUNCTION_SOMETHING: (id: number) => `api/something/${id}`,
    };
    ```
- **Query keys** live in `src/constants/query-keys.constant.ts` as `QUERY_KEYS`. Every key is a readonly array (TanStack Query v5); parameterized resources use a function returning an array. One entry per cached resource.
- **Current `EXTERNAL_ENDPOINTS`:** `auth/check`, `auth/register`, `auth/login`, `auth/logout`, `auth/otp/send`, `auth/otp/verify`, `auth/refresh`, `auth/session`, `api/me`, `api/facilities`. `api/facilities` supports `?q=` text search. Current `QUERY_KEYS`: `AUTH_SESSION`, `PROFILE`, `FACILITY_SEARCH(query)`.
- **Client I/O** lives in `src/features/<domain>/<domain>.client.endpoint.ts`. Read `process.env.NEXT_PUBLIC_API_BASE_URL` and use it **verbatim** — no trimming, no `.replace(/\/+$/, '')`, no `new URL()` normalization, no "just in case" slash handling. Compose the absolute URL as `${process.env.NEXT_PUBLIC_API_BASE_URL}${EXTERNAL_ENDPOINTS.X}`, call `httpClient`, and return the wire model. No mapping, no React.
- **DRY is deliberately ignored for that composition.** Both sides are already in the shape the concatenation needs: the configured base URL ends with `/` (it is the origin plus the joining slash) and every `EXTERNAL_ENDPOINTS` path starts without one. Do not extract a shared base-URL constant or normalizing helper to deduplicate the concatenation across feature files, and do not wrap the env read in a helper that quietly rewrites it. Each `.client.endpoint.ts` does the concatenation itself, visibly. A malformed base URL (missing trailing slash, extra path, wrong scheme) is fixed in the env file, not compensated for in code. This holds in every client endpoint file — no exceptions. (`http-server.ts` and `auth-refresh.ts` read the same env var, but hand it to `createHttp`, where `http-core.ts`'s `joinUrl` normalizes the seam. That tolerance belongs to the shared factory — not to endpoint files.)
- **Violation = reject**: an `EXTERNAL_ENDPOINTS` value beginning with `/`, or any base-URL normalization/rebuilding inside a client endpoint.
- **Queries** live in `src/features/<domain>/<domain>.query.ts` (or beside the component for a local resource). They wrap client endpoint functions in `useQuery` and use `QUERY_KEYS`; no raw I/O.
- **Mutations and other hooks** live in `*.hook.ts(x)`; mutations wrap client endpoint functions in `useMutation`.
- **Mutation hooks only declare `mutationKey` and `mutationFn`.** They must not own `onSuccess`, `onError`, `onSettled`, navigation, or local UI state. Domain cache reconciliation belongs inside `mutationFn` (or a domain action it calls), so callers do not repeat query-key knowledge. Return the mutation and let the call site destructure `mutate` and `isPending`:

    ```ts
    // feature.hook.ts — key and fn only
    export function useReportComment(newsId: number) {
        return useMutation({
            mutationKey: QUERY_KEYS.REPORT_COMMENT(newsId),
            mutationFn: ({ id, reason }: { id: number; reason: number }) =>
                reportComment(id, reason),
        });
    }
    ```

    If the mutation changes cached data, reconcile it inside `mutationFn` (`queryClient` comes from `useQueryClient()` in the hook):

    ```ts
    mutationFn: async (input: TInput) => {
        const data = await updateThing(input);
        queryClient.setQueryData(QUERY_KEYS.THING, data);
        return data;
    },
    ```

    ```tsx
    // call site — navigation and local UI state belong here
    const { mutate: answerPoll, isPending } = usePollAnswer(optionData.poll_id);

    answerPoll(optionData.id, {
        onSuccess: () => setStatus('done'),
    });
    ```

    This keeps mutation hooks reusable across screens and leaves navigation, toasts, analytics, and local UI state with the screen that owns the context.

- **Server I/O** lives in `src/features/<domain>/<domain>.endpoint.ts`. Call `http`; endpoint functions are directly callable from server components and must not be wrapped in a React hook.
- **Models** live in `*.models.ts` (feature) or `src/models/*.model.ts` (shared). Model the wire shape exactly, including envelopes such as `{ success, meta, data }`; types are `I`-prefixed interfaces.
- **Auth boundary**: `/auth/*` is public except `/auth/session`, which requires `Authorization: Bearer <accessToken>`. `/api/*` requires the Bearer token. Never infer the auth requirement from the prefix — check the endpoint. Refresh tokens are only sent to `/auth/refresh` and `/auth/logout`. **Code reality today:** client Bearer is opt-in per call (`{ auth: true }`); `httpClient` does not attach a token by default. `auth/*` calls omit it; `auth-session` check + `profile` (`api/me`) use `auth: true`. `api/facilities` (facility search) is called **without** `auth` and its code comment calls it public facility search, although the `EXTERNAL_ENDPOINTS` header notes `/api/*` requires Bearer — per-endpoint authority wins, confirm against the backend.
- API routes have no trailing slash. Docs routes do.

### HTTP runtime semantics (`src/utils/http/`)

- **`httpClient`** = `createBrowserHttp()` (browser-only; throws off-browser). Options per call: `auth` (attach `Bearer` from `useAuthStore.accessToken` when present), `skipErrorRedirect`, `retryOnUnauthorized`. `POST/PUT/PATCH` JSON; `get`/`delete`. Server `http`/`httpRaw` use `unstable_noStore` on error, rethrow Next redirect/not-found control flow, optional status→redirect map (currently empty; client maps `404 → /errors/404`).
- **401:** with `auth`, one `refreshAccessToken()` + retry; on refresh failure (`unauthorized`, `invalid_refresh_token`, or no refresh token) `clearSession()` + redirect `/user-check`, unless `skipErrorRedirect`. Session expiry statuses: 401 / `unauthorized` / `invalid_refresh_token`.
- **Redirects (client, unless `skipErrorRedirect`):** `404 → /errors/404`, offline (`navigator.onLine === false`) → `/errors/offline`, `429` → Persian snackbar event (`snackbarEvents`); error still rethrows. Snackbar: `src/utils/snackbar-events.util.ts`.
- **Common headers on every API call** (`buildCommonHeaders`): `X-App-Version`, `x-platform`, `X-Client-Locale`, `x-seconds-from-utc` (client sends real `-getTimezoneOffset()*60`; defaults `APP_VERSION`, `web`, `en`, `0`). Device identity headers (`X-Device-ID`, `x-device-info`) are added by `proxy.ts` on incoming app requests, not on outbound API calls.
- **URL composition** (§4 above): verbatim env + `joinUrl` only inside `createHttp`. **Env:** `NEXT_PUBLIC_API_BASE_URL` (`.env.local`, copied from `.env.example`; must end with `/`; only `NEXT_PUBLIC_*` reaches the browser). No other env vars are read.
- **`HttpError`** from `http-core.ts`; `isHttpError`. Snackbar + redirect side effects live only in `http-client.ts`.
- **Session persistence:** refresh token in `localStorage` (`persu.auth.v1.refreshToken`); access token memory-only; `AuthSessionBootstrap` re-establishes the session on boot; `safeLocalStorage` guards blocked storage. Logout clears. `DEFAULT_SECONDS_FROM_UTC`, `COOKIE_MAX_AGE`, `DEVICE_*` in `global.constant.ts`. Cookies: `src/utils/cookie-client.util.ts` / `cookie-server.util.ts`.

## 5. Verification

`bun run lint` + `bunx tsc --noEmit` + `bun run format:check` must pass. No test runner is wired up yet; pure logic still lives in `.logic.ts` files so tests can be added without refactoring.
