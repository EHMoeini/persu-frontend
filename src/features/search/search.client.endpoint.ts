'use client';

import { EXTERNAL_ENDPOINTS } from '@/constants/endpoints.constant';
import { httpClient } from '@/utils/http/http-client';

import type { IFacilityListResponse } from './search.models';
import { facilityListResponseSchema } from './search.schema';

const API_ORIGIN = process.env.NEXT_PUBLIC_API_BASE_URL ?? '';

/** GET /api/facilities — public facility search; a blank query returns everything. */
export async function searchFacilities(query: string): Promise<IFacilityListResponse> {
    const trimmedQuery = query.trim();
    const search = trimmedQuery ? `?${new URLSearchParams({ q: trimmedQuery }).toString()}` : '';

    const response = await httpClient.get<unknown>(
        `${API_ORIGIN}${EXTERNAL_ENDPOINTS.FACILITIES_SEARCH}${search}`,
        undefined,
        { skipErrorRedirect: true },
    );

    return facilityListResponseSchema.parse(response);
}
