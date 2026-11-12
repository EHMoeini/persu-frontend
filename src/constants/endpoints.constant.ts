/**
 * External API paths. Paths only — the base URL lives in `api.constant.ts`.
 * `/auth/*` is public except `AUTH_SESSION`, which requires a Bearer token.
 * Every `/api/*` path requires a Bearer token.
 */
export const EXTERNAL_ENDPOINTS = {
    AUTH_CHECK: '/auth/check',
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGIN: '/auth/login',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_OTP_SEND: '/auth/otp/send',
    AUTH_OTP_VERIFY: '/auth/otp/verify',
    AUTH_REFRESH: '/auth/refresh',
    AUTH_SESSION: '/auth/session',
    PROFILE_ME: '/api/me',
} as const;
