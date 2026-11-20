import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';
import { StaticImage } from '@/components/ui/static-image';

import { formatRating, formatToman } from '../search.logic';
import type { IVenue, TVenueHighlightKind } from '../search.models';

type THighlightPresentation = {
    icon: string;
    iconClassName: string;
    toneClassName: string;
};

const HIGHLIGHT_PRESENTATION: Record<TVenueHighlightKind, THighlightPresentation> = {
    slots: {
        icon: '/assets/icons/search/availability.svg',
        iconClassName: 'h-[10.833px] w-[8.667px]',
        toneClassName: 'text-tertiary',
    },
    surface: {
        icon: '/assets/icons/search/court.svg',
        iconClassName: 'size-[11.917px]',
        toneClassName: 'text-tertiary',
    },
    discount: {
        icon: '/assets/icons/search/discount.svg',
        iconClassName: 'h-[10.644px] w-[11.538px]',
        toneClassName: 'text-secondary',
    },
    amenity: {
        icon: '/assets/icons/search/amenity.svg',
        iconClassName: 'size-[10.833px]',
        toneClassName: 'text-tertiary',
    },
};

/** One search result: photo, metadata, highlight, and the booking CTA. */
export function VenueCard({ venue }: { venue: IVenue }) {
    const highlight = HIGHLIGHT_PRESENTATION[venue.highlight.kind];
    const titleId = `venue-${venue.id}-title`;

    return (
        <article aria-labelledby={titleId}>
            <Card
                className="flex items-center justify-between gap-2.5 p-3"
                radiusClassName="rounded-2xl"
            >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-surface-high">
                        <StaticImage
                            src={venue.image}
                            alt={venue.name}
                            className="block size-full object-cover"
                        />

                        <span className="absolute end-1 bottom-1 rounded-sm bg-surface-inverse/80 px-1.5 py-0.5 text-[10px] leading-[13.5px] font-bold text-foreground-inverse">
                            {venue.sportLabel}
                        </span>
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col items-start">
                        <h2
                            id={titleId}
                            className="max-w-full truncate text-xs leading-4 font-bold text-foreground"
                        >
                            {venue.name}
                        </h2>

                        <div className="mt-1 flex w-full min-w-0 items-center gap-1 text-[11px] leading-[16.5px]">
                            <DesignIcon
                                src="/assets/icons/search/star.svg"
                                className="h-[9.5px] w-2.5"
                            />
                            <span className="shrink-0 font-bold text-secondary">
                                {formatRating(venue.rating)}
                            </span>
                            <span className="shrink-0 text-outline-muted">•</span>
                            <DesignIcon
                                src="/assets/icons/search/pin.svg"
                                className="h-[11.667px] w-[9.333px]"
                            />
                            <span className="min-w-0 flex-1 truncate text-foreground-muted">
                                {venue.location}
                            </span>
                        </div>

                        <div className="mt-1 flex w-full flex-wrap items-center gap-x-1 gap-y-0.5 text-[11px] leading-[16.5px]">
                            <span className="shrink-0 font-bold whitespace-nowrap text-foreground">
                                از {formatToman(venue.priceToman)} ت
                            </span>
                            <span className="shrink-0 text-outline-muted">•</span>
                            <span
                                className={`flex min-w-0 items-center gap-1 font-semibold ${highlight.toneClassName}`}
                            >
                                <DesignIcon
                                    src={highlight.icon}
                                    className={highlight.iconClassName}
                                />
                                <span>{venue.highlight.label}</span>
                            </span>
                        </div>
                    </div>
                </div>

                <LinkButton
                    href={`/venues/${venue.slug}`}
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
