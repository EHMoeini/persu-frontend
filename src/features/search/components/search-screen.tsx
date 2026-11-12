'use client';

import { Fragment } from 'react';

import { useSearchScreen } from '../search.hook';

import { SearchEmptyState } from './search-empty-state';
import { SearchFilterSheet } from './search-filter-sheet';
import { SearchFilterStrip } from './search-filter-strip';
import { SearchHeader } from './search-header';
import { SearchMapBanner } from './search-map-banner';
import { SearchResultsMeta } from './search-results-meta';
import { VenueCard } from './venue-card';

const MAP_BANNER_POSITION = 3;

/** The `/search` screen: quick filters, sortable mock results, and the map hook. */
export function SearchScreen() {
    const {
        query,
        sport,
        sort,
        minRating,
        maxPrice,
        freeSlotsOnly,
        discountedOnly,
        results,
        resultCount,
        hasAdvancedFilters,
        hasPriceSlotFilters,
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
                    sort={sort}
                    priceSlotFilterActive={hasPriceSlotFilters}
                    onSportChange={selectSport}
                    onOpenFilters={openFilterSheet}
                    onSelectNearest={() => selectSort('distance')}
                />

                <SearchResultsMeta count={resultCount} sort={sort} onSortChange={selectSort} />

                <div className="flex flex-col gap-3 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                    {results.length === 0 ? (
                        <SearchEmptyState onReset={resetFilters} />
                    ) : (
                        results.map((venue, index) => (
                            <Fragment key={venue.id}>
                                <VenueCard venue={venue} />
                                {index === mapBannerIndex ? <SearchMapBanner /> : null}
                            </Fragment>
                        ))
                    )}
                </div>
            </main>

            <SearchFilterSheet
                open={isFilterSheetOpen}
                filters={{
                    sport,
                    minRating,
                    maxPrice,
                    freeSlotsOnly,
                    discountedOnly,
                }}
                onClose={closeFilterSheet}
                onApply={applyFilters}
            />
        </div>
    );
}

/** Static placeholder while URL search params resolve behind the Suspense boundary. */
export function SearchScreenFallback() {
    return (
        <div aria-hidden className="flex w-full flex-col">
            <div className="px-4 py-3">
                <div className="h-11 rounded-xl bg-surface-high" />
            </div>

            <div className="flex h-11 items-center gap-2 px-4 pt-1 pb-2">
                <div className="h-8 w-24 rounded-full bg-surface-high" />
                <div className="h-8 w-28 rounded-full bg-surface-high" />
                <div className="h-8 w-20 rounded-full bg-surface-high" />
            </div>

            <div className="flex items-center justify-between px-4 py-2">
                <div className="h-4 w-32 rounded bg-surface-high" />
                <div className="h-4 w-36 rounded bg-surface-high" />
            </div>

            <div className="flex flex-col gap-3 px-4 pt-1 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
                {Array.from({ length: 3 }, (_, index) => (
                    <div
                        key={index}
                        className="h-28 rounded-2xl bg-surface-card drop-shadow-subtle"
                    />
                ))}
            </div>
        </div>
    );
}
