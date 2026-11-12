'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys.constant';
import { useAuthStore } from '@/stores/auth.store';
import { refreshAccessToken } from '@/utils/http/auth-refresh';
import { isHttpError } from '@/utils/http/http-core';

import { getSession } from './auth.client.endpoint';
import type { IUser } from './auth.models';

async function bootstrapSession(): Promise<IUser | null> {
    const store = useAuthStore.getState();

    if (!store.refreshToken) {
        store.clearSession();
        return null;
    }

    try {
        await refreshAccessToken();
        const { user } = await getSession();
        useAuthStore.getState().setStatus('authenticated');
        return user;
    } catch (error) {
        if (isHttpError(error) && error.status === 401) {
            useAuthStore.getState().clearSession();
        } else {
            useAuthStore.getState().setStatus('unauthenticated');
        }

        throw error;
    }
}

/** Restores the session on app load: refresh → `/auth/session`. */
export function useSession() {
    const status = useAuthStore((state) => state.status);

    return useQuery({
        queryKey: QUERY_KEYS.AUTH_SESSION,
        queryFn: bootstrapSession,
        enabled: status === 'loading',
        staleTime: Infinity,
        retry: false,
    });
}
