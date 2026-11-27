'use client';

import { useState } from 'react';

import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';
import { StaticImage } from '@/components/ui/static-image';

import { formatRating, toPersianDigits } from '../facility.logic';
import type { IFacilityDetail } from '../facility.models';

const CONTROL_CLASS_NAME =
    'absolute top-1/2 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-surface-card/80 shadow-input backdrop-blur-[12px] transition-colors hover:bg-surface-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** Interactive cover gallery: arrows, counter, badges, and the thumbnail strip. */
export function FacilityGallery({ detail }: { detail: IFacilityDetail }) {
    const [activeIndex, setActiveIndex] = useState(0);
    const images = detail.gallery;
    const activeImage = images[activeIndex];

    const showImage = (index: number) => {
        setActiveIndex((index + images.length) % images.length);
    };

    return (
        <section aria-label="گالری تصاویر مجموعه" className="flex flex-col gap-2.5 px-4 pb-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-surface-high shadow-action">
                <StaticImage
                    src={activeImage.src}
                    alt={activeImage.alt}
                    className="absolute inset-0 size-full object-cover"
                />

                <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-surface-inverse/85 via-surface-inverse/10 to-transparent"
                />

                <div className="absolute start-3.5 top-3.5 flex items-center gap-2">
                    <span className="flex items-center gap-1.5 rounded-full bg-primary/95 px-2.5 py-1 text-[11px] leading-[16.5px] font-bold text-on-accent shadow-input backdrop-blur-[12px]">
                        <MaskedIcon
                            src="/assets/icons/landing/sport-paddle.svg"
                            className="h-[11.953px] w-[10.833px]"
                        />
                        <span>{detail.sportLabel}</span>
                    </span>

                    <span className="rounded-full bg-surface-card/90 px-2.5 py-1 text-[11px] leading-[16.5px] font-semibold text-foreground shadow-input backdrop-blur-[12px]">
                        {toPersianDigits(String(detail.freeSlotsToday))} سانس خالی امروز
                    </span>
                </div>

                <div className="absolute end-3.5 top-3.5 flex items-center gap-1 rounded-full bg-surface-card/95 px-2.5 py-1 text-[11px] leading-[16.5px] shadow-input backdrop-blur-[12px]">
                    <DesignIcon src="/assets/icons/search/star.svg" className="h-[9.5px] w-2.5" />
                    <span className="font-bold text-foreground">{formatRating(detail.rating)}</span>
                    <span className="text-[10px] text-foreground-muted">
                        ({toPersianDigits(String(detail.reviewCount))} نظر)
                    </span>
                </div>

                <button
                    type="button"
                    aria-label="تصویر قبلی"
                    onClick={() => showImage(activeIndex - 1)}
                    className={`${CONTROL_CLASS_NAME} start-3`}
                >
                    <MaskedIcon
                        src="/assets/icons/landing/chevron-down.svg"
                        className="h-[6.167px] w-[10px] -rotate-90 text-foreground"
                    />
                </button>

                <button
                    type="button"
                    aria-label="تصویر بعدی"
                    onClick={() => showImage(activeIndex + 1)}
                    className={`${CONTROL_CLASS_NAME} end-3`}
                >
                    <MaskedIcon
                        src="/assets/icons/landing/chevron-down.svg"
                        className="h-[6.167px] w-[10px] rotate-90 text-foreground"
                    />
                </button>

                <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-xs leading-4 font-medium text-on-accent drop-shadow-subtle">
                        <MaskedIcon
                            src="/assets/icons/landing/feature-shield.svg"
                            className="h-[16.5px] w-[14.25px]"
                        />
                        <span>{detail.verifiedLabel}</span>
                    </span>

                    <span className="rounded-full bg-surface-inverse/50 px-2 py-0.5 text-[11px] leading-[16.5px] text-on-accent">
                        {toPersianDigits(String(activeIndex + 1))} از{' '}
                        {toPersianDigits(String(images.length))}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
                {images.map((image, index) => {
                    const active = index === activeIndex;

                    return (
                        <button
                            key={image.id}
                            type="button"
                            aria-label={`نمایش ${image.alt}`}
                            aria-current={active ? 'true' : undefined}
                            onClick={() => setActiveIndex(index)}
                            className={`relative aspect-[4/3] overflow-hidden rounded-xl shadow-input transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                                active
                                    ? 'opacity-100 ring-2 ring-primary'
                                    : 'opacity-70 hover:opacity-100'
                            }`}
                        >
                            <StaticImage
                                src={image.src}
                                className="absolute inset-0 size-full object-cover"
                            />
                        </button>
                    );
                })}
            </div>
        </section>
    );
}
