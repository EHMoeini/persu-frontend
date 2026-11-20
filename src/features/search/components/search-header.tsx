'use client';

import { BackButton } from '@/components/shared/back-button';
import { DesignIcon } from '@/components/ui/design-icon';
import { IconChip } from '@/components/ui/icon-chip';

type TSearchHeaderProps = {
    query: string;
    onQueryChange: (value: string) => void;
    onOpenFilters: () => void;
    filtersActive: boolean;
};

/** Fullscreen search header: back control, input, and the advanced-filter trigger. */
export function SearchHeader({
    query,
    onQueryChange,
    onOpenFilters,
    filtersActive,
}: TSearchHeaderProps) {
    return (
        <header className="sticky top-0 z-20 flex w-full items-center gap-2.5 bg-surface/90 px-4 py-3 shadow-input backdrop-blur-md">
            <BackButton tone="high" radiusClassName="rounded-xl" iconClassName="size-[13.333px]" />

            <div className="relative flex h-11 min-w-0 flex-1 items-center rounded-xl bg-surface-card shadow-input focus-within:ring-2 focus-within:ring-focus">
                <input
                    type="search"
                    dir="rtl"
                    value={query}
                    onChange={(event) => onQueryChange(event.target.value)}
                    placeholder="جستجوی نام سالن، منطقه یا ورزش..."
                    aria-label="جستجوی مجموعه ورزشی"
                    enterKeyHint="search"
                    autoComplete="off"
                    spellCheck={false}
                    className="h-full w-full rounded-xl bg-transparent ps-3 pe-9 text-start text-xs font-medium text-foreground placeholder:text-outline focus:outline-none [&::-webkit-search-cancel-button]:appearance-none"
                />

                <span className="pointer-events-none absolute end-3 flex size-[15px] items-center justify-center">
                    <DesignIcon
                        src="/assets/icons/landing/nav-search.svg"
                        className="size-[15px]"
                    />
                </span>
            </div>

            <span className="relative shrink-0">
                <IconChip
                    label="فیلتر پیشرفته"
                    onClick={onOpenFilters}
                    tone="muted"
                    radiusClassName="rounded-xl"
                >
                    <DesignIcon src="/assets/icons/search/filter.svg" className="size-[15px]" />
                </IconChip>

                {filtersActive ? (
                    <span
                        aria-hidden
                        className="pointer-events-none absolute end-2 top-2 size-2 rounded-full bg-secondary-container"
                    />
                ) : null}
            </span>
        </header>
    );
}
