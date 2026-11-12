'use client';

import { EXTERNAL_ENDPOINTS } from '@/constants/endpoints.constant';
import { httpClient } from '@/utils/http/http-client';

import type { IProfileResponse, IProfileUpdate } from './profile.models';
import { profileResponseSchema, profileUpdateInputSchema } from './profile.schema';

const API_ORIGIN = (process.env.NEXT_PUBLIC_API_BASE_URL ?? '').replace(/\/+$/, '');

function profileUrl(): string {
    return `${API_ORIGIN}${EXTERNAL_ENDPOINTS.PROFILE_ME}`;
}

/** GET /api/me — the authenticated user's public profile. */
export async function getProfile(): Promise<IProfileResponse> {
    const response = await httpClient.get<unknown>(profileUrl(), undefined, { auth: true });

    return profileResponseSchema.parse(response);
}

/** PATCH /api/me — updates the display name and returns the public user. */
export async function updateProfile(input: IProfileUpdate): Promise<IProfileResponse> {
    const data = profileUpdateInputSchema.parse(input);
    const response = await httpClient.patch<unknown>(profileUrl(), data, undefined, {
        auth: true,
    });

    return profileResponseSchema.parse(response);
}
