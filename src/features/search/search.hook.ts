'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import {
    DEFAULT_SEARCH_PARAMS,
    filterFacilities,
    hasAdvancedFilters,
    parseSearchParams,
    serializeSearchParams,
} from './search.logic';
import type { ISearchParams, TFacilitySort, TFilterDraft, TSportFilter } from './search.models';
import { useFacilitySearch } from './search.query';

const QUERY_DEBOUNCE_MS = 300;

/**
 * Live facility search. The URL is the shareable contract: query, sport, sort
 * and advanced filters round-trip through it via the native History API, while
 * the live input stays local until the debounce settles.
 */
export function useSearchScreen() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();

    const [state, setState] = useState<ISearchParams>(() => parseSearchParams(searchParams));
    const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
    const lastWrittenRef = useRef(searchParamsString);

    const debouncedQuery = useDebounce(state.query, QUERY_DEBOUNCE_MS);
    const { sport, sort, minRating, maxPrice, freeSlotsOnly } = state;

    const { data, isPending, isError, refetch } = useFacilitySearch(debouncedQuery);

    // Back/forward or an external link changes the URL under a mounted screen.
    useEffect(() => {
        if (searchParamsString === lastWrittenRef.current) return;

        lastWrittenRef.current = searchParamsString;
        setState(parseSearchParams(new URLSearchParams(searchParamsString)));
    }, [searchParamsString]);

    // Keep the shareable URL in sync; the debounced query is the applied one.
    useEffect(() => {
        const next = serializeSearchParams(
            { sport, sort, minRating, maxPrice, freeSlotsOnly },
            debouncedQuery,
            new URLSearchParams(window.location.search),
        ).toString();

        if (next === window.location.search.slice(1)) return;

        lastWrittenRef.current = next;
        window.history.replaceState(null, '', next ? `${pathname}?${next}` : pathname);
    }, [sport, sort, minRating, maxPrice, freeSlotsOnly, debouncedQuery, pathname]);

    const results = useMemo(
        () =>
            filterFacilities(data?.facilities ?? [], {
                sport,
                sort,
                minRating,
                maxPrice,
                freeSlotsOnly,
            }),
        [data, sport, sort, minRating, maxPrice, freeSlotsOnly],
    );

    const setQuery = useCallback((query: string) => {
        setState((previous) => ({ ...previous, query }));
    }, []);

    const selectSport = useCallback((nextSport: TSportFilter) => {
        setState((previous) => ({ ...previous, sport: nextSport }));
    }, []);

    const selectSort = useCallback((nextSort: TFacilitySort) => {
        setState((previous) => ({ ...previous, sort: nextSort }));
    }, []);

    const applyFilters = useCallback((nextFilters: TFilterDraft) => {
        setState((previous) => ({ ...previous, ...nextFilters }));
        setFilterSheetOpen(false);
    }, []);

    const resetFilters = useCallback(() => {
        setState(DEFAULT_SEARCH_PARAMS);
    }, []);

    const openFilterSheet = useCallback(() => setFilterSheetOpen(true), []);
    const closeFilterSheet = useCallback(() => setFilterSheetOpen(false), []);

    return {
        query: state.query,
        sport,
        sort,
        minRating,
        maxPrice,
        freeSlotsOnly,
        results,
        resultCount: results.length,
        isPending,
        isError,
        retry: refetch,
        hasAdvancedFilters: hasAdvancedFilters(state),
        isFilterSheetOpen,
        setQuery,
        selectSport,
        selectSort,
        applyFilters,
        resetFilters,
        openFilterSheet,
        closeFilterSheet,
    };
}
