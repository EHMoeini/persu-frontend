'use client';

import { create } from 'zustand';

import type { ITokenPair } from '@/features/auth/auth.models';
import { safeLocalStorage } from '@/utils/safe-storage.util';
import { isBrowser } from '@/utils/shared.util';

export type TAuthStatus = 'loading' | 'authenticated' | 'unauthenticated';

const REFRESH_TOKEN_KEY = 'persu.auth.v1.refreshToken';

function readStoredRefreshToken(): string | null {
    if (!isBrowser()) return null;
    return safeLocalStorage.getItem(REFRESH_TOKEN_KEY);
}

function persistRefreshToken(token: string | null): void {
    if (!isBrowser()) return;

    if (token) {
        safeLocalStorage.setItem(REFRESH_TOKEN_KEY, token);
    } else {
        safeLocalStorage.removeItem(REFRESH_TOKEN_KEY);
    }
}

const initialRefreshToken = readStoredRefreshToken();

interface IAuthState {
    accessToken: string | null;
    refreshToken: string | null;
    status: TAuthStatus;
    setSession: (tokens: ITokenPair) => void;
    setTokens: (tokens: ITokenPair) => void;
    setStatus: (status: TAuthStatus) => void;
    clearSession: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
    accessToken: null,
    refreshToken: initialRefreshToken,
    status: initialRefreshToken ? 'loading' : 'unauthenticated',
    setSession: (tokens) => {
        persistRefreshToken(tokens.refreshToken);
        set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            status: 'authenticated',
        });
    },
    setTokens: (tokens) => {
        persistRefreshToken(tokens.refreshToken);
        set({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
        });
    },
    setStatus: (status) => set({ status }),
    clearSession: () => {
        persistRefreshToken(null);
        set({ accessToken: null, refreshToken: null, status: 'unauthenticated' });
    },
}));

/** Latest persisted refresh token; used by the refresh flow. */
export function getPersistedRefreshToken(): string | null {
    return readStoredRefreshToken() ?? useAuthStore.getState().refreshToken;
}
