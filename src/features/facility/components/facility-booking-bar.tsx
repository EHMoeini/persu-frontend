'use client';

import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';
import { useBottomNavStore } from '@/stores/bottom-nav.store';

import { formatToman, toPersianDigits } from '../facility.logic';
import type { ISelectedSlot } from '../facility.models';

type TFacilityBookingBarProps = {
    selection: ISelectedSlot;
    /** The shell Footer is on screen, so the bar steps aside. */
    hidden: boolean;
};

/** Sticky booking summary: the selected Time Slot plus the continue CTA. */
export function FacilityBookingBar({ selection, hidden }: TFacilityBookingBarProps) {
    const timeLabel = toPersianDigits(selection.time.replace(' - ', ' الی '));
    const durationLabel = toPersianDigits(String(selection.durationMinutes));

    // When the BottomNav slides away, the bar docks into the space it frees
    // instead of hovering above an empty strip at the bottom of the screen.
    const docked = useBottomNavStore((state) => state.hidden);

    return (
        <div
            aria-hidden={hidden}
            inert={hidden}
            className={`fixed inset-x-0 z-20 px-3 transition-[bottom,translate,opacity] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                docked
                    ? 'bottom-[calc(env(safe-area-inset-bottom)+1rem)]'
                    : 'bottom-[calc(env(safe-area-inset-bottom)+6.25rem)]'
            } ${
                hidden
                    ? 'pointer-events-none translate-y-[calc(100%+8rem)] opacity-0'
                    : 'translate-y-0 opacity-100'
            }`}
        >
            <div className="mx-auto w-full max-w-91.5">
                <aside
                    aria-label="خلاصه رزرو سانس"
                    className="rounded-2xl border border-primary/20 bg-surface-card/95 p-[15px] shadow-floating backdrop-blur-2xl"
                >
                    <div className="flex items-center gap-3">
                        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary shadow-input">
                            <DesignIcon
                                src="/assets/icons/facility/booking-racket.svg"
                                className="h-[22.067px] w-5"
                            />
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <div className="flex items-center gap-2">
                                <p className="truncate text-xs leading-4 font-bold text-foreground">
                                    {selection.dayLabel}
                                </p>
                                <span className="shrink-0 rounded-md bg-primary-fixed px-2 py-0.5 text-[11px] leading-[16.5px] font-semibold text-primary">
                                    {selection.courtLabel}
                                </span>
                            </div>

                            <div className="flex items-center gap-1.5 text-xs leading-4">
                                <MaskedIcon
                                    src="/assets/icons/clock.svg"
                                    className="size-[11.667px] shrink-0 text-foreground-muted"
                                />
                                <span className="truncate text-foreground-muted">
                                    ساعت {timeLabel} ({durationLabel} دقیقه)
                                </span>
                                <span aria-hidden className="shrink-0 text-foreground-muted">
                                    •
                                </span>
                                <span className="shrink-0 font-bold text-primary">
                                    {formatToman(selection.price)} تومان
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        type="button"
                        disabled
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-secondary-container px-6 py-3 text-sm leading-5 font-bold text-on-accent shadow-action disabled:cursor-not-allowed"
                    >
                        <span>تایید و ادامه رزرو سانس</span>
                        <MaskedIcon
                            src="/assets/icons/arrow-continue.svg"
                            className="size-3 text-on-accent"
                        />
                    </button>
                </aside>
            </div>
        </div>
    );
}
