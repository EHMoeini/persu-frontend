'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@/constants/query-keys.constant';

import { searchFacilities } from './search.client.endpoint';

/** Live facility search for the debounced query. */
export function useFacilitySearch(query: string) {
    return useQuery({
        queryKey: QUERY_KEYS.FACILITY_SEARCH(query),
        queryFn: () => searchFacilities(query),
        placeholderData: keepPreviousData,
        retry: false,
    });
}
