'use client';

import { useState, type FormEvent } from 'react';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { TextButton } from '@/components/ui/text-button';

import {
    DEFAULT_FILTER_DRAFT,
    MAX_PRICE_OPTIONS,
    MIN_RATING_OPTIONS,
    SPORT_FILTERS,
} from '../search.logic';
import type { TFilterDraft } from '../search.models';

import { FilterChip } from './filter-chip';

type TSearchFilterSheetProps = {
    open: boolean;
    filters: TFilterDraft;
    onClose: () => void;
    onApply: (filters: TFilterDraft) => void;
};

type TSearchFilterFormProps = {
    filters: TFilterDraft;
    onApply: (filters: TFilterDraft) => void;
};

/** Advanced filters, applied to the mock catalogue when the form is submitted. */
export function SearchFilterSheet({ open, filters, onClose, onApply }: TSearchFilterSheetProps) {
    return (
        <BottomSheet open={open} onClose={onClose} title="فیلتر پیشرفته" closeLabel="بستن">
            <SearchFilterForm filters={filters} onApply={onApply} />
        </BottomSheet>
    );
}

/**
 * The form lives inside the dialog children so Headless UI unmounts it when the
 * sheet closes. Reopening therefore starts from the currently applied filters.
 */
function SearchFilterForm({ filters, onApply }: TSearchFilterFormProps) {
    const [draft, setDraft] = useState<TFilterDraft>(filters);

    function update<TKey extends keyof TFilterDraft>(key: TKey, value: TFilterDraft[TKey]) {
        setDraft((previous) => ({ ...previous, [key]: value }));
    }

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onApply(draft);
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <section>
                <h3 className="text-xs leading-4 font-semibold text-foreground">ورزش</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {SPORT_FILTERS.map((option) => {
                        const active = draft.sport === option.id;

                        return (
                            <FilterChip
                                key={option.id}
                                variant="option"
                                label={option.label}
                                icon={option.icon}
                                iconClassName={option.iconClassName}
                                active={active}
                                maskIcon={option.maskInactive || active}
                                onClick={() => update('sport', option.id)}
                            />
                        );
                    })}
                </div>
            </section>

            <section>
                <h3 className="text-xs leading-4 font-semibold text-foreground">حداکثر قیمت</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {MAX_PRICE_OPTIONS.map((option) => (
                        <FilterChip
                            key={option.value ?? 'all'}
                            variant="option"
                            label={option.label}
                            active={draft.maxPrice === option.value}
                            onClick={() => update('maxPrice', option.value)}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-xs leading-4 font-semibold text-foreground">حداقل امتیاز</h3>
                <div className="mt-2 flex flex-wrap gap-2">
                    {MIN_RATING_OPTIONS.map((option) => (
                        <FilterChip
                            key={option.value ?? 'all'}
                            variant="option"
                            label={option.label}
                            active={draft.minRating === option.value}
                            onClick={() => update('minRating', option.value)}
                        />
                    ))}
                </div>
            </section>

            <section>
                <h3 className="text-xs leading-4 font-semibold text-foreground">سانس و تخفیف</h3>
                <div className="mt-2 flex flex-col gap-2">
                    <FilterCheckbox
                        label="فقط مجموعه‌های دارای سانس خالی امروز"
                        checked={draft.freeSlotsOnly}
                        onChange={(checked) => update('freeSlotsOnly', checked)}
                    />
                    <FilterCheckbox
                        label="فقط مجموعه‌های تخفیف‌دار"
                        checked={draft.discountedOnly}
                        onChange={(checked) => update('discountedOnly', checked)}
                    />
                </div>
            </section>

            <div className="flex flex-col gap-2">
                <Button type="submit">اعمال فیلتر</Button>
                <TextButton type="button" onClick={() => setDraft(DEFAULT_FILTER_DRAFT)}>
                    پاک کردن فیلترها
                </TextButton>
            </div>
        </form>
    );
}

type TFilterCheckboxProps = {
    label: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
};

function FilterCheckbox({ label, checked, onChange }: TFilterCheckboxProps) {
    return (
        <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-surface-muted p-3">
            <span className="text-xs leading-4 font-medium text-foreground">{label}</span>

            <span className="relative flex size-5 shrink-0 items-center justify-center">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) => onChange(event.target.checked)}
                    className="peer sr-only"
                />
                <span className="flex size-5 items-center justify-center rounded bg-surface-card text-transparent ring-1 ring-outline-muted peer-checked:bg-primary peer-checked:text-on-accent peer-checked:ring-primary peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-card">
                    <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none">
                        <path
                            d="M2 6.2 4.8 9 10 3.8"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </span>
        </label>
    );
}
