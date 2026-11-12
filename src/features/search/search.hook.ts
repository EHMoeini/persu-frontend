'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useDebounce } from '@/hooks/use-debounce';

import {
    DEFAULT_SEARCH_PARAMS,
    hasAdvancedFilters,
    hasPriceSlotFilters,
    parseSearchParams,
    searchVenues,
    serializeSearchParams,
    VENUES,
} from './search.logic';
import type { ISearchParams, TFilterDraft, TSportFilter, TVenueSort } from './search.models';

const QUERY_DEBOUNCE_MS = 300;

/**
 * Mock search state. The URL is the shareable contract: query, sport, sort and
 * advanced filters round-trip through it via the native History API, while the
 * live input stays local until the debounce settles.
 */
export function useSearchScreen() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const searchParamsString = searchParams.toString();

    const [state, setState] = useState<ISearchParams>(() => parseSearchParams(searchParams));
    const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
    const lastWrittenRef = useRef(searchParamsString);

    const debouncedQuery = useDebounce(state.query, QUERY_DEBOUNCE_MS);
    const { sport, sort, minRating, maxPrice, freeSlotsOnly, discountedOnly } = state;

    // Back/forward or an external link changes the URL under a mounted screen.
    useEffect(() => {
        if (searchParamsString === lastWrittenRef.current) return;

        lastWrittenRef.current = searchParamsString;
        setState(parseSearchParams(new URLSearchParams(searchParamsString)));
    }, [searchParamsString]);

    // Keep the shareable URL in sync; the debounced query is the applied one.
    useEffect(() => {
        const next = serializeSearchParams(
            { sport, sort, minRating, maxPrice, freeSlotsOnly, discountedOnly },
            debouncedQuery,
            new URLSearchParams(window.location.search),
        ).toString();

        if (next === window.location.search.slice(1)) return;

        lastWrittenRef.current = next;
        window.history.replaceState(null, '', next ? `${pathname}?${next}` : pathname);
    }, [sport, sort, minRating, maxPrice, freeSlotsOnly, discountedOnly, debouncedQuery, pathname]);

    const results = useMemo(
        () =>
            searchVenues(
                VENUES,
                { sport, sort, minRating, maxPrice, freeSlotsOnly, discountedOnly },
                debouncedQuery,
            ),
        [sport, sort, minRating, maxPrice, freeSlotsOnly, discountedOnly, debouncedQuery],
    );

    const setQuery = useCallback((query: string) => {
        setState((previous) => ({ ...previous, query }));
    }, []);

    const selectSport = useCallback((nextSport: TSportFilter) => {
        setState((previous) => ({ ...previous, sport: nextSport }));
    }, []);

    const selectSort = useCallback((nextSort: TVenueSort) => {
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
        discountedOnly,
        results,
        resultCount: results.length,
        hasAdvancedFilters: hasAdvancedFilters(state),
        hasPriceSlotFilters: hasPriceSlotFilters(state),
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
