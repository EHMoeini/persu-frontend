import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';

import { formatToman } from '../facility.logic';
import type { IFacilityDetail } from '../facility.models';

/** Title, address, quick specs, description, amenities, and the pricing summary. */
export function FacilityOverview({ detail }: { detail: IFacilityDetail }) {
    return (
        <section aria-labelledby="facility-overview-title" className="px-4 pb-6">
            <Card radiusClassName="rounded-2xl" className="flex flex-col gap-2 p-5">
                <div className="flex flex-col gap-1.5">
                    <h1
                        id="facility-overview-title"
                        className="text-xl leading-7 font-bold text-foreground"
                    >
                        {detail.name}
                    </h1>

                    <div className="flex items-center gap-1.5">
                        <DesignIcon
                            src="/assets/icons/search/pin.svg"
                            className="h-[11.667px] w-[9.333px]"
                        />
                        <p className="min-w-0 flex-1 truncate text-xs leading-4 text-foreground-muted">
                            {detail.address}
                        </p>
                        <Link
                            href={detail.mapHref}
                            className="shrink-0 rounded text-xs leading-4 font-semibold text-primary underline underline-offset-2 transition-colors hover:text-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            مشاهده نقشه
                        </Link>
                    </div>
                </div>

                <ul className="flex flex-col items-start gap-2 py-4">
                    {detail.specs.map((spec) => (
                        <li
                            key={spec.id}
                            className="flex h-8 items-center gap-1.5 rounded-lg bg-surface-muted px-3 py-1.5 text-xs leading-4 text-foreground"
                        >
                            <DesignIcon src={spec.icon} className={spec.iconClassName} />
                            <span>{spec.label}</span>
                        </li>
                    ))}
                </ul>

                <p className="text-xs leading-[19.5px] text-foreground-muted">
                    {detail.description}
                </p>

                <div className="flex flex-col gap-3 pt-3">
                    <h2 className="flex items-center gap-1.5 text-sm leading-5 font-bold text-foreground">
                        <DesignIcon
                            src="/assets/icons/search/amenity.svg"
                            className="size-[10.667px]"
                        />
                        <span>{detail.amenitiesHeading}</span>
                    </h2>

                    <ul className="grid grid-cols-2 gap-2.5">
                        {detail.amenities.map((amenity) => (
                            <li
                                key={amenity.id}
                                className="flex h-15 items-center gap-2.5 rounded-xl bg-surface-muted p-3"
                            >
                                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary-fixed">
                                    <DesignIcon
                                        src={amenity.icon}
                                        className={amenity.iconClassName}
                                    />
                                </span>

                                <div className="flex min-w-0 flex-1 flex-col">
                                    <p className="truncate text-xs leading-4 font-semibold text-foreground">
                                        {amenity.title}
                                    </p>
                                    <p className="truncate text-[10px] leading-[15px] text-foreground-muted">
                                        {amenity.detail}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mt-1 flex flex-col gap-3 rounded-xl bg-gradient-to-l from-primary-fixed/40 to-surface-muted p-4">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary">
                            <DesignIcon
                                src="/assets/icons/facility/pricing-racket.svg"
                                className="h-[14.667px] w-[20.167px]"
                            />
                        </span>

                        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                            <p className="text-xs leading-4 text-foreground-muted">
                                {detail.pricing.label}
                            </p>
                            <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span className="text-lg leading-7 font-bold text-primary">
                                    {formatToman(detail.pricing.amount)}
                                </span>
                                <span className="text-xs leading-4 text-foreground-muted">
                                    {detail.pricing.unit}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="flex h-8 items-center gap-2 self-start rounded-lg bg-surface-card px-3 text-[11px] leading-[16.5px] text-foreground shadow-input">
                        <MaskedIcon
                            src="/assets/icons/landing/feature-shield.svg"
                            className="h-3 w-[10.36px] text-foreground"
                        />
                        <span>{detail.pricing.guarantee}</span>
                    </div>
                </div>
            </Card>
        </section>
    );
}
