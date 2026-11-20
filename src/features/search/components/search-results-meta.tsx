'use client';

import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

import { MaskedIcon } from '@/components/ui/masked-icon';

import { formatPersianNumber, SORT_OPTIONS } from '../search.logic';
import type { TVenueSort } from '../search.models';

type TSearchResultsMetaProps = {
    count: number;
    sort: TVenueSort;
    onSortChange: (sort: TVenueSort) => void;
};

/** Live result count on the right, sort menu on the left. */
export function SearchResultsMeta({ count, sort, onSortChange }: TSearchResultsMetaProps) {
    const activeSortLabel = SORT_OPTIONS.find((option) => option.id === sort)?.label ?? '';

    return (
        <div className="flex items-center justify-between gap-3 px-4 py-2">
            <p
                role="status"
                aria-live="polite"
                className="shrink-0 text-xs leading-4 font-bold text-foreground"
            >
                {formatPersianNumber(count)} مجموعه ورزشی فعال
            </p>

            <Menu as="div" className="relative">
                <MenuButton className="flex items-center gap-1 rounded-lg text-[11px] leading-[16.5px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus">
                    <span className="font-medium text-foreground-muted">مرتب‌سازی:</span>
                    <span className="font-bold text-primary">{activeSortLabel}</span>
                    <MaskedIcon
                        src="/assets/icons/landing/chevron-down.svg"
                        className="h-[4.317px] w-[7px] text-foreground-muted"
                    />
                </MenuButton>

                <MenuItems
                    transition
                    className="absolute end-0 top-full z-30 mt-1 w-44 origin-top-left rounded-xl bg-surface-card p-1 shadow-floating ring-1 ring-outline-soft transition duration-150 ease-out focus:outline-none data-closed:scale-95 data-closed:opacity-0 data-leave:duration-100 data-leave:ease-in"
                >
                    {SORT_OPTIONS.map((option) => (
                        <MenuItem key={option.id}>
                            {({ focus, close }) => (
                                <button
                                    type="button"
                                    onClick={() => {
                                        onSortChange(option.id);
                                        close();
                                    }}
                                    className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-right text-xs leading-4 transition-colors ${
                                        focus ? 'bg-surface-muted' : ''
                                    } ${
                                        sort === option.id
                                            ? 'font-semibold text-primary'
                                            : 'font-medium text-foreground'
                                    }`}
                                >
                                    <span>{option.label}</span>
                                    {sort === option.id ? (
                                        <span
                                            aria-hidden
                                            className="size-1.5 rounded-full bg-primary"
                                        />
                                    ) : null}
                                </button>
                            )}
                        </MenuItem>
                    ))}
                </MenuItems>
            </Menu>
        </div>
    );
}
