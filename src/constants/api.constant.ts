/**
 * API configuration. Values come from env files at the project root
 * (see `.env.example`). Only `NEXT_PUBLIC_*` variables are readable in the
 * browser, and they are inlined at build time.
 */

/**
 * Backend base URL. Empty string means same-origin (relative) requests.
 * `httpBaseUrlClient` in `src/utils/http/http-client.ts` reads the same
 * variable — point it here when the real API is wired up.
 */
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/**
 * Mock-first while the backend is not ready: API calls resolve from
 * in-app mock modules instead of the network. Defaults to `true`;
 * set `NEXT_PUBLIC_API_USE_MOCK=false` once the real API is live,
 * then delete the mock modules.
 */
export const API_USE_MOCK = process.env.NEXT_PUBLIC_API_USE_MOCK !== 'false';

/** Endpoint paths grouped per feature. Paths only — the base URL lives above. */
export const API_ENDPOINTS = {
  auth: {
    checkUser: '/auth/check-user',
    verifyOtp: '/auth/otp/verify',
    sendOtp: '/auth/otp/send',
    loginWithPassword: '/auth/password/login',
  },
} as const;
