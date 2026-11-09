'use client';

import { API_BASE_URL } from '@/constants/api.constant';
import { EXTERNAL_ENDPOINTS } from '@/constants/endpoints.constant';
import { getPersistedRefreshToken, useAuthStore } from '@/stores/auth.store';

import { buildCommonHeaders } from './http-common-headers';
import { createHttp, isHttpError } from './http-core';

export type TRefreshResponse = {
    accessToken: string;
    refreshToken: string;
};

const http = createHttp(API_BASE_URL, () =>
    buildCommonHeaders({ secondsFromUtc: -new Date().getTimezoneOffset() * 60 }),
);

let refreshPromise: Promise<TRefreshResponse> | null = null;

function isTokenPair(value: unknown): value is TRefreshResponse {
    if (!value || typeof value !== 'object') return false;

    const candidate = value as Partial<TRefreshResponse>;
    return typeof candidate.accessToken === 'string' && typeof candidate.refreshToken === 'string';
}

async function performRefresh(refreshToken: string): Promise<TRefreshResponse> {
    const response = await http.post<unknown>(EXTERNAL_ENDPOINTS.AUTH_REFRESH, { refreshToken });

    if (!isTokenPair(response)) {
        throw new Error('INVALID_REFRESH_RESPONSE');
    }

    return response;
}

/**
 * Rotates the refresh token once per tab. Concurrent requests in the same tab
 * share one refresh. Cross-tab races are accepted: a reload or the next refresh
 * recovers the signed-out state.
 */
export function refreshAccessToken(): Promise<TRefreshResponse> {
    if (refreshPromise) return refreshPromise;

    const refreshToken = getPersistedRefreshToken();

    if (!refreshToken) {
        return Promise.reject(new Error('NO_REFRESH_TOKEN'));
    }

    refreshPromise = performRefresh(refreshToken)
        .then((tokens) => {
            useAuthStore.getState().setTokens(tokens);
            return tokens;
        })
        .catch((error: unknown) => {
            if (isHttpError(error) && error.status === 401) {
                useAuthStore.getState().clearSession();
            }

            throw error;
        })
        .finally(() => {
            refreshPromise = null;
        });

    return refreshPromise;
}
