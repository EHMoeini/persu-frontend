'use client';

import { useAuthStore } from '@/stores/auth.store';

import { isBrowser } from '../shared.util';
import { snackbarEvents } from '../snackbar-events.util';
import { refreshAccessToken } from './auth-refresh';
import { buildCommonHeaders } from './http-common-headers';
import { createHttp, isHttpError } from './http-core';

const STATUS_REDIRECT: Record<number, string> = {
    404: '/errors/404',
};

const OFFLINE_REDIRECT = '/errors/offline';

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

const navigate = (route: string) => {
    if (window.location.pathname === route) return;
    window.location.assign(route);
};

type TRequestOptions = {
    /** Keep the user on the current screen instead of following a status redirect. */
    skipErrorRedirect?: boolean;
    /** Attach the current access token as a Bearer header. */
    auth?: boolean;
    /** Set to false to skip the one-time refresh/retry on 401. */
    retryOnUnauthorized?: boolean;
};

const handleClientHttpError = async (error: unknown, opts?: TRequestOptions): Promise<never> => {
    if (isHttpError(error)) {
        if (error.status === 429) {
            snackbarEvents.emit('تعداد تلاش‌ها بیش از حد مجاز است. کمی بعد دوباره تلاش کنید.');
        }

        const route = STATUS_REDIRECT[error.status];
        if (route && !opts?.skipErrorRedirect) {
            navigate(route);
        }
    } else if (isOffline() && !opts?.skipErrorRedirect) {
        navigate(OFFLINE_REDIRECT);
    }

    throw error;
};

const buildClientHeaders = (): HeadersInit => {
    return buildCommonHeaders({
        secondsFromUtc: -new Date().getTimezoneOffset() * 60,
    });
};

function withAuthHeader(
    init: RequestInit | undefined,
    opts?: TRequestOptions,
): RequestInit | undefined {
    if (!opts?.auth) return init;

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) return init;

    const headers = new Headers(init?.headers);
    headers.set('Authorization', `Bearer ${accessToken}`);

    return { ...init, headers };
}

function isSessionExpired(error: unknown): boolean {
    return (
        isHttpError(error) &&
        (error.status === 401 ||
            error.code === 'unauthorized' ||
            error.code === 'invalid_refresh_token')
    );
}

export const createBrowserHttp = (baseUrl?: string) => {
    const base = createHttp(baseUrl, buildClientHeaders);

    const safeRequest = async <T>(
        request: () => Promise<T>,
        opts?: TRequestOptions,
    ): Promise<T> => {
        try {
            return await request();
        } catch (error) {
            if (
                isHttpError(error) &&
                error.status === 401 &&
                opts?.auth &&
                opts.retryOnUnauthorized !== false
            ) {
                try {
                    await refreshAccessToken();
                    return await request();
                } catch (refreshError) {
                    const hasRefreshToken = Boolean(useAuthStore.getState().refreshToken);

                    if (isSessionExpired(refreshError) || !hasRefreshToken) {
                        useAuthStore.getState().clearSession();
                        if (!opts.skipErrorRedirect) navigate('/user-check');
                    }

                    throw refreshError;
                }
            }

            return await handleClientHttpError(error, opts);
        }
    };

    return {
        get: <T>(path: string, init?: RequestInit, opts?: TRequestOptions) => {
            assertBrowser();
            return safeRequest(() => base.get<T>(path, withAuthHeader(init, opts)), opts);
        },
        post: <T>(path: string, body?: unknown, init?: RequestInit, opts?: TRequestOptions) => {
            assertBrowser();
            return safeRequest(() => base.post<T>(path, body, withAuthHeader(init, opts)), opts);
        },
        put: <T>(path: string, body?: unknown, init?: RequestInit, opts?: TRequestOptions) => {
            assertBrowser();
            return safeRequest(() => base.put<T>(path, body, withAuthHeader(init, opts)), opts);
        },
        patch: <T>(path: string, body?: unknown, init?: RequestInit, opts?: TRequestOptions) => {
            assertBrowser();
            return safeRequest(() => base.patch<T>(path, body, withAuthHeader(init, opts)), opts);
        },
        delete: <T>(path: string, init?: RequestInit, opts?: TRequestOptions) => {
            assertBrowser();
            return safeRequest(() => base.delete<T>(path, withAuthHeader(init, opts)), opts);
        },
    };
};

export const httpClient = createBrowserHttp();

const assertBrowser = () => {
    if (!isBrowser()) {
        throw new Error('httpClient can only be used in the browser');
    }
};
