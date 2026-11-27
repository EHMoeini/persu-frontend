import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';

import { formatRating, toPersianDigits } from '../facility.logic';
import type { IFacilityDetail } from '../facility.models';

const AVATAR_TONE_CLASS_NAMES = {
    primary: 'bg-primary',
    secondary: 'bg-secondary',
} as const;

/** Ratings summary plus the two newest player reviews. */
export function FacilityReviews({ detail }: { detail: IFacilityDetail }) {
    return (
        <section aria-labelledby="facility-reviews-title" className="px-4 pb-6">
            <Card radiusClassName="rounded-2xl" className="flex flex-col gap-3 p-4">
                <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                        <h2
                            id="facility-reviews-title"
                            className="truncate text-sm leading-5 font-bold text-foreground"
                        >
                            {detail.reviewsHeading}
                        </h2>

                        <span className="flex shrink-0 items-center gap-1 rounded-full bg-tangerine-light px-2 py-0.5 text-xs leading-4 font-bold text-on-secondary-container">
                            <DesignIcon
                                src="/assets/icons/search/star.svg"
                                className="h-[9.5px] w-2.5"
                            />
                            <span>{formatRating(detail.rating)}</span>
                        </span>
                    </div>

                    <span
                        aria-disabled="true"
                        className="shrink-0 text-xs leading-4 font-semibold text-primary"
                    >
                        مشاهده همه {toPersianDigits(String(detail.reviewCount))} نظر
                    </span>
                </div>

                <ul className="flex flex-col gap-3">
                    {detail.reviews.map((review) => (
                        <li
                            key={review.id}
                            className="flex flex-col gap-1.5 rounded-xl bg-surface-muted p-3"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex min-w-0 items-center gap-2">
                                    <span
                                        className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs leading-4 font-bold text-on-accent ${AVATAR_TONE_CLASS_NAMES[review.tone]}`}
                                    >
                                        {review.initials}
                                    </span>

                                    <span className="truncate text-xs leading-4 font-semibold text-foreground">
                                        {review.author}
                                    </span>

                                    <span className="shrink-0 rounded bg-surface-card px-1.5 text-[10px] leading-[15px] text-foreground">
                                        کاربر تاییدشده
                                    </span>
                                </div>

                                <span className="shrink-0 text-[10px] leading-[15px] text-foreground-muted">
                                    {review.relativeDate}
                                </span>
                            </div>

                            <p className="text-xs leading-[19.5px] text-foreground-muted">
                                {review.body}
                            </p>
                        </li>
                    ))}
                </ul>
            </Card>
        </section>
    );
}
