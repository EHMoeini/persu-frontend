'use client';

import { Fragment } from 'react';

import { useSearchScreen } from '../search.hook';

import { FacilityCard } from './facility-card';
import { SearchEmptyState } from './search-empty-state';
import { SearchErrorState } from './search-error-state';
import { SearchFilterSheet } from './search-filter-sheet';
import { SearchFilterStrip } from './search-filter-strip';
import { SearchHeader } from './search-header';
import { SearchMapBanner } from './search-map-banner';
import { SearchResultsMeta } from './search-results-meta';

const MAP_BANNER_POSITION = 3;

/** The `/search` screen: live facility search with filters, sort, and the map hook. */
export function SearchScreen() {
    const {
        query,
        sport,
        sort,
        minRating,
        maxPrice,
        freeSlotsOnly,
        results,
        resultCount,
        isPending,
        isError,
        retry,
        hasAdvancedFilters,
        isFilterSheetOpen,
        setQuery,
        selectSport,
        selectSort,
        applyFilters,
        resetFilters,
        openFilterSheet,
        closeFilterSheet,
    } = useSearchScreen();

    const mapBannerIndex =
        results.length > 0 ? Math.min(MAP_BANNER_POSITION, results.length - 1) : -1;

    return (
        <div className="flex w-full flex-col">
            <SearchHeader
                query={query}
                onQueryChange={setQuery}
                onOpenFilters={openFilterSheet}
                filtersActive={hasAdvancedFilters}
            />

            <main className="flex w-full flex-col">
                <SearchFilterStrip
                    sport={sport}
                    priceSlotFilterActive={hasAdvancedFilters}
                    onSportChange={selectSport}
                    onOpenFilters={openFilterSheet}
                />

                {isPending ? (
                    <div aria-hidden className="flex items-center px-4 py-2">
                        <div className="h-4 w-32 rounded bg-surface-high" />
                    </div>
                ) : (
                    <SearchResultsMeta count={resultCount} sort={sort} onSortChange={selectSort} />
                )}

                <div className="flex flex-col gap-3 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                    {isPending ? null : isError ? (
                        <SearchErrorState onRetry={retry} />
                    ) : results.length === 0 ? (
                        <SearchEmptyState onReset={resetFilters} />
                    ) : (
                        results.map((facility, index) => (
                            <Fragment key={facility.id}>
                                <FacilityCard facility={facility} />
                                {index === mapBannerIndex ? <SearchMapBanner /> : null}
                            </Fragment>
                        ))
                    )}
                </div>
            </main>

            <SearchFilterSheet
                open={isFilterSheetOpen}
                filters={{ minRating, maxPrice, freeSlotsOnly }}
                onClose={closeFilterSheet}
                onApply={applyFilters}
            />
        </div>
    );
}
