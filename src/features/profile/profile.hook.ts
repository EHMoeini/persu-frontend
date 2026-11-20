'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys.constant';

import { updateProfile } from './profile.client.endpoint';
import type { IProfileUpdate } from './profile.models';

/** PATCH /api/me and reconcile the profile + session caches. */
export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationKey: QUERY_KEYS.PROFILE,
        mutationFn: async (input: IProfileUpdate) => {
            const data = await updateProfile(input);
            queryClient.setQueryData(QUERY_KEYS.PROFILE, data);
            queryClient.setQueryData(QUERY_KEYS.AUTH_SESSION, data.user);

            return data;
        },
    });
}
