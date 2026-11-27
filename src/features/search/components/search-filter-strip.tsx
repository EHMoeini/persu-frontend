'use client';

import { SPORT_FILTERS } from '../search.logic';
import type { TSportFilter } from '../search.models';

import { FilterChip } from './filter-chip';

type TSearchFilterStripProps = {
    sport: TSportFilter;
    priceSlotFilterActive: boolean;
    onSportChange: (sport: TSportFilter) => void;
    onOpenFilters: () => void;
};

/** Horizontally scrolling quick filters. The active sport chip starts at the right. */
export function SearchFilterStrip({
    sport,
    priceSlotFilterActive,
    onSportChange,
    onOpenFilters,
}: TSearchFilterStripProps) {
    return (
        <div className="pt-1 pb-2">
            <div
                role="group"
                aria-label="فیلترهای جستجو"
                className="flex h-11 scrollbar-none items-center gap-2 overflow-x-auto px-4 [&::-webkit-scrollbar]:hidden"
            >
                {SPORT_FILTERS.map((option) => {
                    const active = sport === option.id;

                    return (
                        <FilterChip
                            key={option.id}
                            label={option.label}
                            icon={option.icon}
                            iconClassName={option.iconClassName}
                            active={active}
                            maskIcon={option.maskInactive || active}
                            onClick={() => onSportChange(option.id)}
                        />
                    );
                })}

                <FilterChip
                    variant="utility"
                    label="قیمت و سانس"
                    icon="/assets/icons/search/chip-price.svg"
                    iconClassName="h-2 w-3"
                    active={priceSlotFilterActive}
                    maskIcon
                    onClick={onOpenFilters}
                />
            </div>
        </div>
    );
}
