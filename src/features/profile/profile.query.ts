'use client';

import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys.constant';
import { useAuthStore } from '@/stores/auth.store';

import { getProfile } from './profile.client.endpoint';

/** The authenticated user's live profile. */
export function useProfile() {
    const status = useAuthStore((state) => state.status);

    return useQuery({
        queryKey: QUERY_KEYS.PROFILE,
        queryFn: getProfile,
        enabled: status === 'authenticated',
        retry: false,
    });
}
