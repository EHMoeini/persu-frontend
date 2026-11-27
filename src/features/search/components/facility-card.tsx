import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';
import { StaticImage } from '@/components/ui/static-image';

import { formatRating, formatToman } from '../search.logic';
import type { IFacility } from '../search.models';

/** One search result: cover, metadata, today's availability, and the booking CTA. */
export function FacilityCard({ facility }: { facility: IFacility }) {
    const titleId = `facility-${facility.id}-title`;
    const { rating, location, price, availability } = facility;

    const availabilityLabel = availability ? 'سانس خالی امروز' : 'ظرفیت تکمیل';
    const availabilityTone = availability ? 'text-tertiary' : 'text-outline-muted';

    return (
        <article aria-labelledby={titleId}>
            <Card
                className="flex items-center justify-between gap-2.5 p-3"
                radiusClassName="rounded-2xl"
            >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-high">
                        {facility.picture ? (
                            <StaticImage
                                src={facility.picture}
                                alt={facility.name}
                                className="block size-full object-cover"
                            />
                        ) : (
                            <span className="flex size-full items-center justify-center">
                                <DesignIcon
                                    src="/assets/icons/search/court.svg"
                                    className="size-6"
                                />
                            </span>
                        )}

                        {facility.type ? (
                            <span className="absolute end-1 bottom-1 max-w-[calc(100%-0.5rem)] truncate rounded-sm bg-surface-inverse/80 px-1.5 py-0.5 text-[10px] leading-[13.5px] font-bold text-foreground-inverse">
                                {facility.type}
                            </span>
                        ) : null}
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col items-start">
                        <h2
                            id={titleId}
                            className="max-w-full truncate text-xs leading-4 font-bold text-foreground"
                        >
                            {facility.name}
                        </h2>

                        {rating !== undefined || location ? (
                            <div className="mt-1 flex w-full min-w-0 items-center gap-1 text-[11px] leading-[16.5px]">
                                {rating !== undefined ? (
                                    <>
                                        <DesignIcon
                                            src="/assets/icons/search/star.svg"
                                            className="h-[9.5px] w-2.5"
                                        />
                                        <span className="shrink-0 font-bold text-secondary">
                                            {formatRating(rating)}
                                        </span>
                                    </>
                                ) : null}

                                {rating !== undefined && location ? (
                                    <span className="shrink-0 text-outline-muted">•</span>
                                ) : null}

                                {location ? (
                                    <>
                                        <DesignIcon
                                            src="/assets/icons/search/pin.svg"
                                            className="h-[11.667px] w-[9.333px]"
                                        />
                                        <span className="min-w-0 flex-1 truncate text-foreground-muted">
                                            {location}
                                        </span>
                                    </>
                                ) : null}
                            </div>
                        ) : null}

                        {price !== undefined || availability !== undefined ? (
                            <div className="mt-1 flex w-full flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] leading-[16.5px]">
                                {price !== undefined ? (
                                    <span className="shrink-0 font-bold whitespace-nowrap text-foreground">
                                        از {formatToman(price)} ت
                                    </span>
                                ) : null}

                                {price !== undefined && availability !== undefined ? (
                                    <span className="shrink-0 text-outline-muted">•</span>
                                ) : null}

                                {availability !== undefined ? (
                                    <span
                                        className={`flex min-w-0 items-center gap-1 font-semibold ${availabilityTone}`}
                                    >
                                        <DesignIcon
                                            src="/assets/icons/search/availability.svg"
                                            className="h-[10.833px] w-[8.667px]"
                                        />
                                        <span>{availabilityLabel}</span>
                                    </span>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                </div>

                <LinkButton
                    href={`/facilities/${facility.id}`}
                    prefetch={false}
                    variant="primary"
                    size="card"
                    className="shrink-0"
                    trailingIcon={
                        <DesignIcon
                            src="/assets/icons/landing/cta-arrow.svg"
                            className="size-[9.333px]"
                        />
                    }
                >
                    رزرو سانس
                </LinkButton>
            </Card>
        </article>
    );
}
