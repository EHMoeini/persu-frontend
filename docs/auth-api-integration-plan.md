# Auth API integration plan

**Status:** implemented and locally verified 2026-11-09. Production CORS origin and a few manual checks remain.
**Scope:** authentication only. Profile (`GET/PATCH /api/me`) is explicitly out of scope.
**Spec:** live OpenAPI at `https://persu-backend-1.onrender.com/api/schema/` (the attached YAML is stale).
**Architecture:** `ARCHITECTURE.md` §4 (API layer).

## 0. Locked decisions

| Decision          | Choice                                                                                           |
| ----------------- | ------------------------------------------------------------------------------------------------ |
| Register flow     | `register` returns a session → **store it and go home**. No OTP-after-register.                  |
| OTP flow          | OTP login returns a session; **passwordless signup via OTP is allowed**.                         |
| CORS              | Backend enables CORS; browser calls `NEXT_PUBLIC_API_BASE_URL` directly. No Next proxy, no BFF.  |
| Register name     | Backend accepts optional `fullName` (max 64) and stores it as `nickName`. Confirmed live.        |
| Phone wire format | `{ countryCode: 'IR', phone: '09xxxxxxxxx' }` (local trunk form). Confirmed live: `+98912…`.     |
| OTP code          | **6 digits**, not 4. Backend mock code defaults to `123456` (`AUTH_OTP_MOCK_CODE`).              |
| OTP send          | Still a stub: returns success without sending SMS. QA uses `123456`.                             |
| Test account      | Registered and verified live; credentials are intentionally not stored in git.                   |
| Token storage     | Access token in memory; refresh token in `localStorage`; user in the React Query cache.          |
| Error envelope    | Parse `{ "error": { "code", "message" } }`; expose `code` on `HttpError`.                        |
| Validation        | Zod for request and response parsing; wire models in `auth.models.ts`.                           |
| Mocks             | Delete `auth.mock.ts`, `API_USE_MOCK`, `NEXT_PUBLIC_API_USE_MOCK` after the backend gate passes. |

### Non-goals for this pass

- Profile `/api/me` (GET/PATCH), avatar, nickname editing.
- Venue/court/booking APIs.
- Forgot-password API (the page stays as-is).
- Country selector; the app stays fixed to Iran.
- Server-side route guards.
- httpOnly cookies / BFF session.
- Real SMS delivery.
- Multi-account switching.

## 1. Backend gate (verified 2026-11-09)

The deployment is up and the auth contract is real. This table replaces the 2026-11-06
failure report.

> **Note:** the Render edge intermittently reset TLS / returned 522 during the final
> verification pass. The successful results below were captured while it was serving.
> Re-test the manual matrix when the edge is stable again.

| #   | Area                    | Verified behavior                                                                                                                                |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | `POST /auth/check`      | `200 { exists: true }` for a registered number; `200 { exists: false }` for an unknown one.                                                      |
| 2   | `POST /auth/login`      | `200` with token pair + user; wrong password → `401 invalid_credentials`.                                                                        |
| 3   | `POST /auth/refresh`    | `200` with a rotated token pair; old token → `401 invalid_refresh_token`.                                                                        |
| 4   | `POST /auth/logout`     | `204`; repeated logout with the same token → `204`; bogus token → `204`.                                                                         |
| 5   | CORS                    | `http://localhost:3000` preflight → `200` with `Access-Control-Allow-Origin`, methods, headers, max-age; actual POST includes the origin header. |
| 6   | `POST /auth/otp/verify` | Validates `code`; `123456` → `200` token pair + user; wrong code → `401 invalid_otp`.                                                            |
| 7   | `POST /auth/register`   | `201` token pair + user; complete `fullName` → `nickName`; duplicate → `409 phone_already_registered`.                                           |
| 8   | Phone normalization     | `IR` + `09124252728` → `+989124252728`. Confirmed.                                                                                               |
| 9   | `POST /auth/otp/send`   | `200 { success: true }`; still a stub (no SMS); QA code is `123456`.                                                                             |
| 10  | Rate limits             | Documented in the schema (5–30/min per endpoint); not load-tested.                                                                               |
| 11  | Auth boundary           | `/auth/session` → `200` with Bearer, `401 unauthorized` without.                                                                                 |

### 1.1 CORS: verified locally, production origin still open

The preflight for `http://localhost:3000` returns:

- `Access-Control-Allow-Origin: http://localhost:3000`
- `Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS`
- `Access-Control-Allow-Headers: accept, authorization, content-type, user-agent, x-csrftoken, x-requested-with, x-app-version, x-platform, x-client-locale, x-seconds-from-utc`
- `Access-Control-Max-Age: 86400`
- `Vary: Origin`

The actual POST also includes `Access-Control-Allow-Origin: http://localhost:3000`.

**Still open:** the CORS allowlist only accepts configured origins. `https://example.com`
and `http://localhost:3001` get a `200` preflight but **no** `Access-Control-Allow-Origin`,
so the browser blocks them. The production frontend origin must be added to the backend
allowlist before deployment.

Smoke test:

```bash
curl -i -X OPTIONS "$BASE_URL/auth/check" \
  -H "Origin: http://localhost:3000" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: content-type,authorization,x-app-version,x-platform,x-client-locale,x-seconds-from-utc"
```

### 1.2 Test account

- Registered 2026-11-09: `09124252728` → `+989124252728`, nickname `Persu Test`.
- Password is held locally and intentionally **not** stored in this repository.
- Verified: register, login, wrong password, session, refresh, logout, duplicate register.

### 1.3 Still open on the backend

| Item                   | Detail                                                                            |
| ---------------------- | --------------------------------------------------------------------------------- |
| Production CORS origin | Add the deployed frontend origin to the allowlist; localhost alone is not enough. |
| OTP send is a stub     | Accepted for this phase. QA uses `AUTH_OTP_MOCK_CODE`, default `123456`.          |
| OTP auto-creates users | Accepted: passwordless signup via OTP is a supported path. See §2.1.              |
| `Retry-After` on `429` | Not verified; the frontend can fall back to a fixed retry message.                |

## 2. Auth flow (settled)

```text
/user-check
    ├── exists  → /login
    │              ├── OTP login     → session → /
    │              └── password login → session → /
    └── missing → /register
                   └── register → session → /
```

- `register` success: store the returned tokens and user, then `router.replace('/')`.
  Do not `push`; the user must not navigate back to the register form.
- `/otp` is no longer linked from register. It stays as a deep-linkable OTP login
  route; it sends the OTP on entry and verifies to a session. The inline OTP mode in
  `/login` remains the primary entry.
- Extract the shared OTP send/verify/countdown/error logic into `useOtpFlow(phone)` so
  `LoginForm` and `OtpForm` cannot drift.
- **OTP is 6 digits**, not 4. Update the input cells, the normalization cap, the schema
  regex, the auto-submit check, and the “کد تایید ۴ رقمی” copy. QA code is `123456`.
- Update the register button copy from “تکمیل ثبت‌نام و دریافت کد” to “تکمیل ثبت‌نام”
  (no code is received after register anymore).

### 2.1 OTP auto-create policy (settled)

**Decision:** allow passwordless signup via OTP. The live `otp/verify` creates the User
when the phone is not registered, and the frontend accepts that as a supported path.

Implications:

- `/otp?phone=…` and the login OTP mode can create an Account without a password.
- The normal `user-check → register` flow still routes new numbers to Register, so the
  password-based path remains the primary onboarding flow.
- Document this behavior in the product copy when the OTP screen is reviewed.

## 3. API contract

### 3.1 Endpoints

| Endpoint           | Method | Bearer  | Request body                                  | Success                                   | Main errors                 | Rate limit |
| ------------------ | ------ | ------- | --------------------------------------------- | ----------------------------------------- | --------------------------- | ---------- |
| `/auth/check`      | POST   | no      | `{ countryCode, phone }`                      | `200 { exists }`                          | 400, 429                    | 10/min     |
| `/auth/register`   | POST   | no      | `{ countryCode, phone, password, fullName? }` | `201 { accessToken, refreshToken, user }` | 400, 409, 429               | 5/min      |
| `/auth/login`      | POST   | no      | `{ countryCode, phone, password }`            | `200 { accessToken, refreshToken, user }` | 400, 401, 429               | 5/min      |
| `/auth/logout`     | POST   | no      | `{ refreshToken }`                            | `204`                                     | 400, 429                    | 30/min     |
| `/auth/otp/send`   | POST   | no      | `{ countryCode, phone }`                      | `200 { success }`                         | 400, 429                    | 5/min      |
| `/auth/otp/verify` | POST   | no      | `{ countryCode, phone, code }` (6 digits)     | `200 { accessToken, refreshToken, user }` | 400, 401 `invalid_otp`, 429 | 10/min     |
| `/auth/refresh`    | POST   | no      | `{ refreshToken }`                            | `200 { accessToken, refreshToken }`       | 400, 401, 429               | 20/min     |
| `/auth/session`    | GET    | **yes** | —                                             | `200 { user }`                            | 401, 500                    | —          |

`/api/me` is excluded from this pass. `otp/verify` creates the User when the phone is
unregistered; see §2.1.

### 3.2 Models

`src/features/auth/auth.models.ts`:

```ts
export interface IUser {
    id: string;
    phone: string;
    nickName?: string;
    avatar?: string;
}

export interface ITokenPair {
    accessToken: string;
    refreshToken: string;
}

export interface IAuthResponse extends ITokenPair {
    user: IUser;
}

export interface ICheckResponse {
    exists: boolean;
}

export interface ISuccessResponse {
    success: boolean;
}

export interface ISessionResponse {
    user: IUser;
}

export interface IErrorResponse {
    error: {
        code: string;
        message: string;
    };
}
```

### 3.3 Phone wire format

- App canonical form: 10 national digits without trunk `0` (`9123456789`).
- Wire form: `09…` (`09123456789`).
- Request: `{ countryCode: 'IR', phone: toWirePhone(phone) }`.
- Confirmed live: `IR` + `09124252728` → `+989124252728`.

### 3.4 `fullName` mapping

Confirmed live: `fullName` is optional, max 64, stored as the profile nickname and
returned as `nickName`. The frontend treats `nickName` as the display name.

## 4. Frontend architecture

### 4.1 Constants and env

`src/constants/endpoints.constant.ts`:

```ts
export const EXTERNAL_ENDPOINTS = {
    AUTH_CHECK: '/auth/check',
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_OTP_SEND: '/auth/otp/send',
    AUTH_OTP_VERIFY: '/auth/otp/verify',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_SESSION: '/auth/session', // protected: Bearer required
} as const;
```

`src/constants/query-keys.constant.ts`:

```ts
export const QUERY_KEYS = {
    AUTH_SESSION: ['AUTH_SESSION'] as const,
} as const;
```

`src/constants/api.constant.ts`:

- Keep `API_BASE_URL` (reads `NEXT_PUBLIC_API_BASE_URL`).
- Remove `API_ENDPOINTS` (moved to `EXTERNAL_ENDPOINTS`).
- Remove `API_USE_MOCK`.

`.env.local` / `.env.example`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=https://persu-backend-1.onrender.com/
```

Remove `NEXT_PUBLIC_API_USE_MOCK`.

### 4.2 Models and schemas

- `auth.models.ts` holds the wire interfaces above.
- `auth.schema.ts` keeps form/request schemas and adds response schemas typed against
  the models, e.g. `const authResponseSchema: z.ZodType<IAuthResponse> = z.object({ ... })`.
- Request limits:

| Field                 | Rule                                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------------------- |
| `phone`               | national 10 digits, starts with `9`; accept Persian/Arabic digits and pasted `+98`/`0098`/`98` prefixes |
| `countryCode`         | constant `'IR'`, max 8                                                                                  |
| `password` (register) | 8–128 chars, not whitespace-only                                                                        |
| `password` (login)    | 1–128 chars, not whitespace-only                                                                        |
| `fullName`            | trimmed, 1–64 chars (assumed to match `nickName` max)                                                   |
| `code`                | exactly 6 digits in the UI; API max 16; mock code `123456`                                              |

- Replace the mock response schemas:
    - `registerResponseSchema` → `IAuthResponse` (201).
    - `loginWithPasswordResponseSchema` → `IAuthResponse`.
    - `verifyOtpResponseSchema` → `IAuthResponse` (after backend change).
    - `sendOtpResponseSchema` → `ISuccessResponse`.
    - `userCheckResponseSchema` → `ICheckResponse`.
    - Add `sessionResponseSchema`, `tokenPairSchema`, `userSchema`.

### 4.3 Client endpoints

`src/features/auth/auth.client.endpoint.ts`:

```ts
export function checkUser(phone: NationalPhone): Promise<ICheckResponse>;
export function registerAccount(input: TRegisterInput): Promise<IAuthResponse>;
export function loginWithPassword(input: TLoginInput): Promise<IAuthResponse>;
export function sendOtp(phone: NationalPhone): Promise<ISuccessResponse>;
export function verifyOtp(input: TVerifyOtpInput): Promise<IAuthResponse>;
export function refreshSession(refreshToken: string): Promise<ITokenPair>;
export function logout(refreshToken: string): Promise<void>;
export function getSession(): Promise<ISessionResponse>; // Bearer
```

Every function composes the URL exactly as specified:

```ts
const url = `${process.env.NEXT_PUBLIC_API_BASE_URL}${EXTERNAL_ENDPOINTS.AUTH_CHECK}`;
const response = await httpClient.post<unknown>(
    url,
    { countryCode: 'IR', phone: toWirePhone(phone) },
    undefined,
    { skipErrorRedirect: true },
);
return userCheckResponseSchema.parse(response);
```

- `register` body: `{ countryCode: 'IR', phone, password, fullName }`.
- `login` and `verify` bodies add `countryCode: 'IR'`.
- `getSession` passes `{ auth: true, skipErrorRedirect: true }`.
- No transforms, no mock branches.

### 4.4 Session and token state machine

Source of truth:

- **Tokens + status:** Zustand store.
- **User:** React Query cache under `QUERY_KEYS.AUTH_SESSION`.
- No duplicated `user` in the store.

`src/stores/auth.store.ts`:

```ts
type TAuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

interface IAuthState {
    accessToken: string | null;
    refreshToken: string | null;
    status: TAuthStatus;
    setSession: (tokens: ITokenPair) => void;
    setTokens: (tokens: ITokenPair) => void;
    clearSession: () => void;
}
```

- Access token: memory only.
- Refresh token: `safeLocalStorage` under the versioned key `persu.auth.v1.refreshToken`.
- Initialize from storage only on the client; on the server both tokens are `null`.
- Security note: localStorage is XSS-readable. If unacceptable, a BFF with httpOnly
  cookies is required; that reverses the CORS decision.

State transitions:

| Situation                                | Result                                                               |
| ---------------------------------------- | -------------------------------------------------------------------- |
| No refresh token on load                 | `unauthenticated`; no network request                                |
| Refresh token on load                    | `loading` → refresh → `/auth/session` → `authenticated`              |
| Refresh returns 401/invalid              | clear tokens + query cache → `unauthenticated`                       |
| Refresh hits network/5xx                 | keep refresh token; `unauthenticated` for this load; retry next load |
| Login/register/OTP success               | `authenticated`; store tokens; cache user                            |
| Protected request returns 401            | single-flight refresh → retry once                                   |
| Refresh fails during a protected request | clear → redirect `/user-check`                                       |
| Logout                                   | call API, then clear tokens + query cache regardless                 |

### 4.5 Refresh algorithm

Refresh-token rotation makes concurrent refreshes dangerous: reusing a rotated token
revokes the whole family. The frontend dedupes refreshes within one tab (single-flight).
Cross-tab concurrency is accepted for now.

- `src/utils/http/auth-refresh.ts` uses `createHttp(API_BASE_URL)` directly, **not**
  `httpClient`, to avoid recursion.
- Module-level single-flight promise:

```ts
let refreshPromise: Promise<ITokenPair> | null = null;

export function refreshAccessToken(): Promise<ITokenPair> {
    refreshPromise ??= doRefresh().finally(() => {
        refreshPromise = null;
    });
    return refreshPromise;
}
```

- No cross-tab lock. If two tabs refresh at the same moment, the backend may revoke the
  token family and sign both tabs out. If that becomes a problem, prefer a backend grace
  window for the previous token; otherwise add a lock or move refresh to a BFF.
- On success: `setTokens(tokens)`.
- On 401: `clearSession()`.
- On network/5xx: do not clear; rethrow so the caller can show a retry state.
- Never log tokens; `devLog` may log method/URL only.

Circular-import rule: `http-client` → `auth-refresh` → `auth.store`; the store must not
import `http-client`.

`http-client.ts`:

- Add `auth?: boolean` to request options.
- Attach `Authorization: Bearer <accessToken>` only when `auth` is true.
- On `401` for an authenticated call: refresh once, retry once.
- Do **not** globally redirect on `401`; login failures return `401 invalid_credentials`
  and must stay on the form. Redirect only after a refresh failure on an authenticated
  call.
- Auth mutations pass `skipErrorRedirect: true`.

### 4.6 Queries and hooks

- `src/features/auth/auth.query.ts`:
    - `useSession()` → `useQuery({ queryKey: QUERY_KEYS.AUTH_SESSION, queryFn: bootstrapSession, enabled: status === 'loading', staleTime: Infinity, retry: false })`.
    - `bootstrapSession()`: if no refresh token → `null`; else refresh → `setTokens` →
      `getSession()` → return `user`.
    - On success, set status `authenticated`; on 401, clear; on other errors, set status
      `unauthenticated` while keeping the token for the next load (do not log the user out
      on a transient network/5xx failure).
- `auth.hook.ts`:
    - `useUserCheck`, `useRegisterAccount`, `useLoginWithPassword`, `useSendOtp`,
      `useVerifyOtp`, `useLogout` (`useMutation`).
    - Shared `useApplySession()`: `setSession(tokens)` + `queryClient.setQueryData(QUERY_KEYS.AUTH_SESSION, user)` + `router.replace('/')`.
    - `useLogout`: `POST /auth/logout`, then clear store + query cache regardless of the
      response.
- `src/app/providers.tsx`: add a client-only `AuthSessionBootstrap` inside
  `QueryClientProvider`; it calls `useSession()` once and renders `null`.

### 4.7 Flow wiring

| Screen              | Change                                                                                                 |
| ------------------- | ------------------------------------------------------------------------------------------------------ |
| `/user-check`       | Send `{ countryCode: 'IR', phone: '09…' }`; route on `exists`.                                         |
| `/register`         | Keep `fullName`; send it; on `201` apply the session and `router.replace('/')`.                        |
| `/login` (OTP)      | Send OTP once on entry; verify a **6-digit** code; returns a session; apply and go home.               |
| `/login` (password) | Login returns a session; apply and go home.                                                            |
| `/otp`              | Deep-linkable OTP login route; send once on entry; verify a **6-digit** code → home. No register link. |
| `/profile`          | Leave the redirect; update the stale mock comment only.                                                |
| Bottom nav          | Update the stale mock comment only.                                                                    |

OTP send-on-entry:

- `useOtpFlow(phone)` owns send/verify/countdown/error.
- Guard with a ref plus a `sessionStorage` timestamp per phone
  (`persu.otp.v1.sent.<phone>`), so Strict Mode double-effects and page refreshes do not
  burn the 5/minute limit.
- On a failed send, clear the timestamp so the user can retry.
- The manual resend updates the timestamp.
- If the product keeps OTP login-only (§2.1), guard `/login` and `/otp` with an
  `exists` check before showing the OTP screen; an unknown number goes to `/register`.

### 4.8 Error matrix

`http-core.ts`:

- Parse `{ error: { code, message } }`; add `code?: string` to `HttpError`.
- Keep the legacy `error_code` / `message` fallback.
- Handle `204` without attempting `res.json()`.

`auth.logic.ts` (pure, no HTTP import):

```ts
export function mapAuthError(code?: string): string;
```

| Code / status                        | UI behavior                                       |
| ------------------------------------ | ------------------------------------------------- |
| `validation_error` / 400             | Inline “اطلاعات وارد شده معتبر نیست.”             |
| `invalid_credentials` / 401 on login | Inline “شماره همراه یا کلمه عبور صحیح نیست.”      |
| `invalid_otp` / 401 on verify        | Inline “کد وارد شده صحیح نیست یا منقضی شده است.”  |
| `unauthorized` / 401 on protected    | Refresh; if refresh fails → `/user-check`         |
| `phone_already_registered` / 409     | Inline message + link to `/login`                 |
| `rate_limited` / 429                 | Inline + snackbar; honor `Retry-After` if present |
| `invalid_refresh_token` / 401        | Clear session → `/user-check`                     |
| 5xx / network                        | Generic “مشکلی پیش آمد…” with retry               |
| 415                                  | Generic; should not happen with JSON bodies       |

### 4.9 Cleanup

- Delete `src/features/auth/auth.mock.ts` after the backend gate passes.
- Remove `API_USE_MOCK` and `API_ENDPOINTS` from `api.constant.ts`.
- Remove `NEXT_PUBLIC_API_USE_MOCK` from `.env.local` and `.env.example`.
- Remove `httpBaseUrlClient` if it has no remaining callers.
- Update comments that mention mocks in `auth.client.endpoint.ts`, `profile/page.tsx`,
  and `bottom-nav.tsx`.
- `http-server.ts` currently reads `process.env.API_BASE_URL` (undefined). Use the
  `API_BASE_URL` constant from `api.constant.ts` instead.

### 4.10 Server-side auth (deferred)

No page in this scope needs a server-side session check. Do not add `auth.endpoint.ts`
yet. When profile/guarded pages are wired, choose either:

- a server-readable access-token cookie (non-httpOnly), or
- a BFF that keeps tokens in httpOnly cookies.

The server-endpoint pattern is documented in `ARCHITECTURE.md` §4.

## 5. Edge cases and invariants

- **Phone paste forms:** `+98912…`, `0098912…`, `98912…`, `0912…`, `912…`, Persian
  digits, spaces/dashes → all normalize to `912…`. Current `toPhoneDraft` does not strip
  `+98`/`0098`/`98`, so fix it before integration.
- **Phone length:** reject anything that is not 10 national digits after normalization.
- **Password whitespace:** reject whitespace-only values in both register and login.
- **Password length:** cap at 128 to match the API.
- **Full name:** trim; cap at 64; do not send whitespace-only.
- **OTP code:** exactly 6 digits in the UI; mock code `123456`; do not auto-submit more than once.
- **OTP auto-create:** `otp/verify` creates an Account for an unknown number. This is
  accepted as passwordless signup; no `exists` guard is required.
- **Double submit:** every mutation checks `isPending`.
- **Route history:** `router.replace('/')` after auth success.
- **204 logout:** no JSON parse.
- **Cold start:** keep GET timeout at 10s and writes at 30s; show loading states. If
  Render cold starts exceed this, surface a retry, not a logout.
- **Offline:** existing offline redirect stays; auth mutations should not navigate away
  from the form on a network error.
- **Token leakage:** never log request bodies, tokens, or phone numbers.
- **XSS:** access token stays in memory; refresh token in localStorage is the accepted
  trade-off. Add CSP later if the app does not have one.
- **Multi-tab:** no synchronization. Simultaneous refreshes across tabs remain an accepted
  risk; a reload or the next refresh recovers the signed-out state.
- **CORS preflight:** custom headers require the backend allow-list; a missing header
  looks like a network failure in the browser, so test preflight explicitly.

## 6. File-by-file change list

| File                                                   | Change                                                                                                                                 |
| ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------- |
| `src/constants/endpoints.constant.ts`                  | Fill `EXTERNAL_ENDPOINTS` with the eight auth paths.                                                                                   |
| `src/constants/query-keys.constant.ts`                 | New; add `AUTH_SESSION`.                                                                                                               |
| `src/constants/api.constant.ts`                        | Remove `API_ENDPOINTS` and `API_USE_MOCK`; keep `API_BASE_URL`.                                                                        |
| `src/features/auth/auth.models.ts`                     | New; wire models.                                                                                                                      |
| `src/features/auth/auth.schema.ts`                     | Real response schemas; request limits; OTP regex becomes 6 digits.                                                                     |
| `src/features/auth/auth.client.endpoint.ts`            | Rewrite for the real API; remove mocks.                                                                                                |
| `src/features/auth/auth.query.ts`                      | New; `useSession`.                                                                                                                     |
| `src/features/auth/auth.hook.ts`                       | Wire mutations; `useApplySession`; `useLogout`.                                                                                        |
| `src/features/auth/auth.copy.ts`                       | Add error-code messages.                                                                                                               |
| `src/features/auth/auth.logic.ts`                      | Add pure `mapAuthError`; OTP cap 6; phone normalization fixes.                                                                         |
| `src/features/auth/auth.phone.ts`                      | Improve `toPhoneDraft` for `+98`/`0098`/`98`.                                                                                          |
| `src/features/auth/auth.mock.ts`                       | Delete after the backend gate.                                                                                                         |
| `src/stores/auth.store.ts`                             | New; tokens + status + refresh-token persistence.                                                                                      |
| `src/utils/http/auth-refresh.ts`                       | New; single-flight refresh; no cross-tab sync (documented tradeoff).                                                                   |
| `src/utils/http/http-core.ts`                          | Parse the real error envelope; expose `code`; handle 204.                                                                              |
| `src/utils/http/http-client.ts`                        | Bearer opt-in; 401 refresh/retry; remove `httpBaseUrlClient`.                                                                          |
| `src/utils/http/http-server.ts`                        | Use `API_BASE_URL`; keep `http` only (drop `httpSafe` / `SafeResult` / `requireResult`); no auth header until a server session exists. |
| `src/app/providers.tsx`                                | Add `AuthSessionBootstrap`.                                                                                                            |
| `src/features/auth/components/otp-input.tsx`           | Six cells; adjust cell width/gap so 6 fit the 390px column; cap and auto-submit at 6 digits; update comments/copy.                     |
| `src/features/auth/components/login-form.tsx`          | Use `useOtpFlow`; 6-digit verify; apply session; remove `verified` checks.                                                             |
| `src/features/auth/components/otp-form.tsx`            | Use `useOtpFlow`; 6-digit verify; apply session; no register link; 6-digit copy.                                                       |
| `src/features/auth/components/password-login-form.tsx` | Apply session; map `invalid_credentials`.                                                                                              |
| `src/features/auth/components/register-form.tsx`       | Send optional `fullName`; apply session; go home; update copy.                                                                         |
| `src/features/auth/components/user-check-form.tsx`     | Wire the new check body; map errors.                                                                                                   |
| `.env.local` / `.env.example`                          | Remove the mock flag.                                                                                                                  |

## 7. Implementation phases

### Phase A — Backend gate (verified 2026-11-09)

- [x] All eight endpoints return the documented success shapes.
- [x] CORS preflight passes for `http://localhost:3000` with all custom headers.
- [x] `otp/verify` validates `code` (`123456`) and returns a session.
- [x] `register` accepts optional `fullName` and stores it as `nickName`.
- [x] Test account registered and verified.

Still open:

- [ ] Add the production frontend origin to the CORS allowlist.
- [x] OTP auto-create policy: passwordless signup allowed (§2.1).
- [x] OTP send stub / fixed `123456` accepted for this phase.

### Phase B — Contracts and constants

- [x] `EXTERNAL_ENDPOINTS`, `QUERY_KEYS`, models, schemas.
- [x] `API_BASE_URL` cleanup; env cleanup.
- [x] `http-core` error envelope + 204.

### Phase C — Session and HTTP

- [x] Auth store; refresh token persistence.
- [x] Single-flight refresh; no cross-tab sync (accepted).
- [x] `http-client` Bearer opt-in + 401 retry.
- [x] `useSession` + `AuthSessionBootstrap`.

### Phase D — Screens

- [x] Check, register, OTP login, password login.
- [x] Register → home; OTP login only.
- [x] 6-digit OTP cells, schema, auto-submit, and copy.
- [x] Error copy and `409` → login link.
- [x] OTP send-on-entry guard; passwordless signup accepted per §2.1.

### Phase E — Cleanup and verification

- [x] Delete mocks and the mock flag.
- [x] Update stale comments.
- [x] Run lint and typecheck.
- [ ] Run the full manual matrix in §8 (core flows verified; rate-limit, two-tab,
      logout, and expired-access-token retry remain).

### Local verification (2026-11-09)

- [x] Registered number → `/login`; unknown number → `/register`.
- [x] OTP login with `123456` → home; wrong OTP shows the Persian error.
- [x] Password login → home; wrong password shows the Persian error.
- [x] Register → home; duplicate register shows `409` + login link.
- [x] Reload → refresh + `/auth/session` both `200`; session restored.
- [x] Invalid refresh token → `401`, token cleared, no auth requests.
- [x] No refresh token → no auth requests on load.
- [x] OTP send fires once on entry; reload within 60s does not resend.
- [x] 6-cell OTP layout fits the 390px column.
- [x] Pasted `+98`, `0098`, `98`, and `0` forms normalize to the national number.
- [x] Browser CORS preflight for the auth endpoints succeeds.
- [x] `bun run lint`, `bunx tsc --noEmit`, and `bun run build` pass.
- [ ] `bun run format:check` — pre-existing failures in 49 unrelated files; all touched
      files pass Prettier.

## 8. Verification

### Backend (verified 2026-11-09)

- [x] `POST /auth/check` returns `{ exists }` for known and unknown numbers.
- [x] `POST /auth/register` returns `201` with tokens + user and stores `fullName` as `nickName`.
- [x] `POST /auth/login` returns `200` with tokens + user; wrong password returns `401 invalid_credentials`.
- [x] `POST /auth/otp/send` returns `{ success }` (stub; no SMS).
- [x] `POST /auth/otp/verify` rejects a wrong code (`401 invalid_otp`) and returns a session for `123456`.
- [x] `POST /auth/refresh` rotates both tokens; reusing the old token returns `401 invalid_refresh_token`.
- [x] `POST /auth/logout` returns `204` and is idempotent for the same and bogus tokens.
- [x] `GET /auth/session` returns `{ user }` with Bearer and `401` without.
- [x] CORS preflight + actual POST include the required headers for `http://localhost:3000`.
- [ ] Production CORS origin added to the allowlist.
- [ ] Rate limits return `429 rate_limited`; `Retry-After` is present if supported.

### Frontend commands

```bash
bun run lint
bunx tsc --noEmit
bun run format:check
```

### Manual matrix

- [x] Existing number → login; new number → register.
- [x] Register → home; reload → session restored.
- [x] OTP login → home; wrong code shows the error.
- [x] Password login → home; wrong password shows the error.
- [x] Register duplicate → `409` message + login link.
- [ ] Rate limit → Persian retry message.
- [ ] Expired access token → silent refresh + retry.
- [x] Revoked/invalid refresh token → clear tokens.
- [ ] Logout → tokens gone; reload stays signed out (no logout UI in this scope).
- [ ] Two tabs: **not synchronized**. Simultaneous refresh may revoke the family; a
      reload/next refresh recovers (accepted risk).
- [ ] Offline/5xx → form stays put with a retry message; no accidental logout.
- [x] Custom-header preflight succeeds from the browser.

## 9. Risks and mitigations

| Risk                                          | Mitigation                                                                             |
| --------------------------------------------- | -------------------------------------------------------------------------------------- |
| Production CORS origin missing                | Add the deployed frontend origin to the backend allowlist; localhost is verified only. |
| CORS misses custom headers                    | Preflight smoke test with the exact header list (verified locally).                    |
| OTP auto-creates users                        | Accepted as passwordless signup; document it in the OTP screen copy.                   |
| Refresh rotation across tabs                  | Accepted risk; single-flight per tab. Prefer a backend grace window if it bites.       |
| Refresh token in localStorage is XSS-readable | Access token in memory; CSP; BFF if the threat model changes.                          |
| OTP is still a stub                           | QA uses `123456`; confirm real SMS delivery before calling auth “done”.                |
| 6-digit OTP UI mismatch                       | Update cells, schema, auto-submit, and copy; the current UI is 4 digits.               |
| Rate limits during QA                         | Use one phone per test; respect the countdown; clear timestamps only on failure.       |
| Phone normalization mismatch                  | Unit tests for `+98`/`0098`/`98`/`0` forms; live `IR + 09…` confirmed.                 |
| Render cold start > timeout                   | 30s write timeout; show retry; do not clear the session.                               |
| Register/OTP double auth                      | Settled: register → home; OTP login only.                                              |
| 401 login redirects the user away             | Handle `401` per call; only redirect after refresh failure.                            |
| Token logging                                 | `devLog` URL/method only; never bodies or tokens.                                      |

## 10. Definition of done

- [x] Backend auth endpoints verified live (all except production CORS / real SMS).
- [ ] Production frontend origin added to the backend CORS allowlist.
- [x] OTP auto-create policy decided: passwordless signup allowed (§2.1).
- [x] `bun run lint`, `bunx tsc --noEmit`, and `bun run build` pass.
- [ ] `bun run format:check` — pre-existing failures in 49 unrelated files; touched files pass.
- [ ] The full manual matrix passes (core flows verified; rate-limit, two-tab, logout,
      and expired-access-token retry remain).
- [x] Mocks and mock flags are gone.
- [x] `ARCHITECTURE.md` and `CONTEXT.md` reflect the final shape.
- [x] No test credentials or tokens are committed.
- [x] Test account verified; credentials documented locally only.

## 11. Remaining confirmations

Resolved live:

1. `fullName` → `nickName` (max 64). Confirmed.
2. `{ countryCode: 'IR', phone: '09…' }` → `+98…`. Confirmed.
3. `otp/verify` validates `code` and returns tokens + user. Confirmed (`123456`).
4. `logout` is idempotent `204`. Confirmed.
5. OTP is 6 digits, not 4. Confirmed.

Still open:

1. Add the production frontend origin to the CORS allowlist (not deployed yet).
2. Confirm whether `429` includes `Retry-After` or the frontend should use a fixed
   retry message.
