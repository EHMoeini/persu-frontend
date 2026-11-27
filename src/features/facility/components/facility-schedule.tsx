'use client';

import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';

import { formatToman } from '../facility.logic';
import type {
    IFacilityDay,
    IFacilityDetail,
    ISelectedSlot,
    TAvailableSlot,
} from '../facility.models';

type TFacilityScheduleProps = {
    schedule: IFacilityDetail['schedule'];
    selectedSlotKey: ISelectedSlot['key'];
    onSelectSlot: (day: IFacilityDay, slot: TAvailableSlot) => void;
};

const BADGE_LABELS = {
    today: 'امروز',
    tomorrow: 'فردا',
} as const;

const BADGE_CLASS_NAMES = {
    today: 'bg-primary text-on-accent',
    tomorrow: 'bg-surface-sunken text-foreground-muted',
} as const;

const LEGEND_CLASS_NAMES = {
    reserved: 'bg-surface-high/60',
    selected: 'bg-primary',
    free: 'bg-surface-card ring-1 ring-outline-muted/30',
} as const;

const NAVIGATOR_CHIP_CLASS_NAME =
    'flex h-8 w-[31px] items-center justify-center rounded-lg bg-surface-card';

/** Weekly availability table: court tabs, week bar, legend, and selectable slots. */
export function FacilitySchedule({
    schedule,
    selectedSlotKey,
    onSelectSlot,
}: TFacilityScheduleProps) {
    return (
        <section aria-labelledby="facility-schedule-title" className="px-4 pb-6">
            <div className="flex flex-col rounded-2xl bg-surface-card p-4 drop-shadow-subtle">
                <div className="flex flex-col gap-3 pb-4">
                    <div className="flex flex-col gap-0.5">
                        <h2
                            id="facility-schedule-title"
                            className="flex items-center gap-2 text-lg leading-7 font-bold text-foreground"
                        >
                            <DesignIcon
                                src="/assets/icons/facility/calendar.svg"
                                className="h-[16.667px] w-[15px]"
                            />
                            <span>{schedule.heading}</span>
                        </h2>

                        <p className="text-xs leading-4 text-foreground-muted">{schedule.hint}</p>
                    </div>

                    <div className="flex justify-center">
                        <div className="flex rounded-xl bg-surface-muted p-1">
                            {schedule.courts.map((court) => {
                                const active = court.id === schedule.activeCourtId;

                                return (
                                    <span
                                        key={court.id}
                                        className={`rounded-lg px-3 py-1.5 text-xs leading-4 ${
                                            active
                                                ? 'bg-primary font-semibold text-on-accent'
                                                : 'font-medium text-foreground-muted'
                                        }`}
                                    >
                                        {court.label}
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-2 rounded-xl bg-surface-muted p-2.5">
                    <span className={NAVIGATOR_CHIP_CLASS_NAME}>
                        <MaskedIcon
                            src="/assets/icons/landing/chevron-down.svg"
                            className="h-[5.55px] w-[9px] -rotate-90 text-foreground"
                        />
                    </span>

                    <span className="flex min-w-0 flex-1 items-center justify-center gap-2">
                        <DesignIcon
                            src="/assets/icons/facility/week-info.svg"
                            className="h-[13.333px] w-3 shrink-0"
                        />
                        <span className="text-right text-xs leading-4 font-bold text-foreground">
                            {schedule.weekLabel}
                        </span>
                    </span>

                    <span className={NAVIGATOR_CHIP_CLASS_NAME}>
                        <MaskedIcon
                            src="/assets/icons/landing/chevron-down.svg"
                            className="h-[5.55px] w-[9px] rotate-90 text-foreground"
                        />
                    </span>
                </div>

                <ul className="flex flex-wrap items-center gap-4 py-4">
                    {schedule.legend.map((item) => (
                        <li
                            key={item.id}
                            className="flex items-center gap-1.5 text-xs leading-4 text-foreground-muted"
                        >
                            <span
                                aria-hidden
                                className={`size-3.5 rounded-[6px] ${LEGEND_CLASS_NAMES[item.tone]}`}
                            />
                            <span>{item.label}</span>
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col gap-3.5">
                    {schedule.days.map((day) => (
                        <div
                            key={day.id}
                            className="flex flex-col gap-2 rounded-xl bg-surface-muted p-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-2">
                                    {day.badge ? (
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] leading-[15px] font-bold ${BADGE_CLASS_NAMES[day.badge]}`}
                                        >
                                            {BADGE_LABELS[day.badge]}
                                        </span>
                                    ) : null}

                                    <p className="truncate text-sm leading-5 font-bold text-foreground">
                                        {day.dateLabel}
                                    </p>
                                </div>

                                <p
                                    className={`shrink-0 text-[11px] leading-[16.5px] font-medium ${
                                        day.noteTone === 'highlight'
                                            ? 'text-secondary'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {day.note}
                                </p>
                            </div>

                            <div className="flex [scrollbar-width:none] gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
                                {day.slots.map((slot) => {
                                    const key = `${day.id}:${slot.id}`;

                                    if (slot.state === 'reserved') {
                                        return (
                                            <div
                                                key={slot.id}
                                                className="flex min-w-25 shrink-0 flex-col gap-0.5 rounded-xl bg-surface-high/60 px-3 py-2 opacity-50"
                                            >
                                                <span className="text-center text-xs leading-4 font-semibold text-outline line-through">
                                                    {slot.time}
                                                </span>
                                                <span className="text-center text-[10px] leading-[15px] text-outline">
                                                    رزرو شد
                                                </span>
                                            </div>
                                        );
                                    }

                                    const selected = key === selectedSlotKey;

                                    return (
                                        <button
                                            key={slot.id}
                                            type="button"
                                            aria-pressed={selected}
                                            onClick={() => onSelectSlot(day, slot)}
                                            className={`flex min-w-27.5 shrink-0 flex-col items-center gap-0.5 rounded-xl px-2.5 py-3 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                                                selected
                                                    ? 'bg-primary text-on-accent shadow-action'
                                                    : 'bg-surface-card hover:bg-surface-high'
                                            }`}
                                        >
                                            {selected ? (
                                                <span className="flex items-center justify-center gap-2">
                                                    <MaskedIcon
                                                        src="/assets/icons/facility/check-circle.svg"
                                                        className="size-[11.667px]"
                                                    />
                                                    <span className="text-xs leading-4 font-bold">
                                                        {slot.time}
                                                    </span>
                                                </span>
                                            ) : (
                                                <span className="text-xs leading-4 font-bold text-foreground">
                                                    {slot.time}
                                                </span>
                                            )}

                                            <span
                                                className={`text-center text-[10px] leading-[15px] font-semibold ${
                                                    selected
                                                        ? 'text-primary-fixed'
                                                        : slot.priceNote
                                                          ? 'text-foreground'
                                                          : 'text-primary'
                                                }`}
                                            >
                                                {slot.priceNote ??
                                                    `${formatToman(slot.price)} تومان`}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
