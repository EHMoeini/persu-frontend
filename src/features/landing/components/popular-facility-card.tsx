import Link from 'next/link';

import { DesignIcon } from '@/components/ui/design-icon';
import { StaticImage } from '@/components/ui/static-image';

export type TPopularFacility = {
    slug: string;
    name: string;
    sportLabel: string;
    location: string;
    priceLabel: string;
    ratingLabel: string;
    image: string;
};

/** Compact facility card used by the landing page's popular-facilities carousel. */
export function PopularFacilityCard({ facility }: { facility: TPopularFacility }) {
    return (
        <Link
            href={`/facilities/${facility.slug}`}
            prefetch={false}
            className="block w-full overflow-hidden rounded-2xl border border-surface-high/70 bg-surface-card shadow-input transition-shadow hover:shadow-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
            <article>
                <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-muted">
                    <StaticImage
                        src={facility.image}
                        alt={facility.name}
                        className="absolute inset-0 size-full object-cover"
                    />

                    <span className="absolute start-2 top-2 flex items-center gap-0.5 rounded-full bg-surface-card/90 px-2 py-0.5 shadow-input backdrop-blur-[4px]">
                        <DesignIcon
                            src="/assets/icons/search/star.svg"
                            className="h-[9.5px] w-2.5"
                        />
                        <span className="text-[10px] leading-[15px] font-bold text-secondary">
                            {facility.ratingLabel}
                        </span>
                    </span>

                    <span className="absolute start-2 bottom-2 rounded-md bg-primary/85 px-2 py-0.5 text-[9px] leading-[13.5px] font-medium text-on-accent">
                        {facility.sportLabel}
                    </span>
                </div>

                <div className="flex flex-col gap-1 p-3">
                    <h3 className="truncate text-[13px] leading-[19.5px] font-bold text-foreground">
                        {facility.name}
                    </h3>

                    <div className="flex items-center gap-1 pb-1 text-[11px] leading-[16.5px] text-foreground-muted">
                        <DesignIcon
                            src="/assets/icons/search/pin.svg"
                            className="h-[10.833px] w-[8.667px]"
                        />
                        <span className="min-w-0 flex-1 truncate">{facility.location}</span>
                    </div>

                    <div className="flex items-center justify-between border-t border-surface-high/60 pt-[7px]">
                        <span className="text-[10px] leading-[15px] text-outline">نرخ هر سانس</span>
                        <span className="text-[11px] leading-[16.5px] font-bold text-primary">
                            {facility.priceLabel}
                        </span>
                    </div>
                </div>
            </article>
        </Link>
    );
}
