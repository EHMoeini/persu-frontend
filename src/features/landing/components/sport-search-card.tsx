import { Carousel, type CarouselSlide } from '@/components/ui/carousel';
import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';

import { PopularVenueCard, type TPopularVenue } from './popular-venue-card';

type TSportPill = {
    id: string;
    label: string;
    icon: string;
    iconClassName: string;
};

const SPORTS: TSportPill[] = [
    {
        id: 'pool',
        label: 'استخر',
        icon: '/assets/icons/landing/sport-pool.svg',
        iconClassName: 'h-[9.75px] w-[10.833px]',
    },
    {
        id: 'basketball',
        label: 'بسکتبال',
        icon: '/assets/icons/landing/sport-basketball.svg',
        iconClassName: 'size-[10.833px]',
    },
    {
        id: 'paddle',
        label: 'پدل و تنیس',
        icon: '/assets/icons/landing/sport-paddle.svg',
        iconClassName: 'h-[11.953px] w-[10.833px]',
    },
    {
        id: 'football',
        label: 'فوتبال',
        icon: '/assets/icons/landing/sport-football.svg',
        iconClassName: 'size-[10.833px]',
    },
];

type TFeature = {
    id: string;
    label: string;
    icon: string;
    iconClassName: string;
};

const FEATURES: TFeature[] = [
    {
        id: 'guarantee',
        label: 'ضمانت سانس',
        icon: '/assets/icons/landing/feature-shield.svg',
        iconClassName: 'h-[16.5px] w-[14.25px]',
    },
    {
        id: 'always-on',
        label: 'رزرو ۲۴ ساعته',
        icon: '/assets/icons/landing/feature-clock.svg',
        iconClassName: 'size-[15px]',
    },
    {
        id: 'live',
        label: 'استعلام لحظه‌ای',
        icon: '/assets/icons/landing/feature-refresh.svg',
        iconClassName: 'h-[15.75px] w-[16.5px]',
    },
];

const POPULAR_VENUES: readonly TPopularVenue[] = [
    {
        slug: 'olympic-aquatic',
        name: 'استخر و سونای ولنجک',
        sportLabel: 'استخر المپیک',
        location: 'ولنجک، خیابان ساسان',
        priceLabel: 'از ۲۹۰,۰۰۰ ت',
        ratingLabel: '۴.۹',
        image: '/assets/images/search/venue-pool.png',
    },
    {
        slug: 'futsal-arena',
        name: 'سالن چندمنظوره غرب',
        sportLabel: 'فوتسال و بسکتبال',
        location: 'تهران، شهرک غرب، فاز ۴',
        priceLabel: 'از ۶۰۰,۰۰۰ ت',
        ratingLabel: '۴.۷',
        image: '/assets/images/search/venue-futsal.png',
    },
    {
        slug: 'tennis-enghelab',
        name: 'آکادمی تنیس انقلاب',
        sportLabel: 'تنیس خاکی',
        location: 'اتوبان نیایش، ورودی سئول',
        priceLabel: 'از ۳۵۰,۰۰۰ ت',
        ratingLabel: '۴.۸',
        image: '/assets/images/search/venue-tennis.png',
    },
    {
        slug: 'padel-spin',
        name: 'باشگاه پدل نیاوران',
        sportLabel: 'پدل',
        location: 'تهران، نیاوران، خ مژده',
        priceLabel: 'از ۴۸۰,۰۰۰ ت',
        ratingLabel: '۴.۹',
        image: '/assets/images/search/venue-padel.png',
    },
];

const POPULAR_VENUE_SLIDES: readonly CarouselSlide[] = POPULAR_VENUES.map((venue) => ({
    id: venue.slug,
    label: venue.name,
    content: <PopularVenueCard venue={venue} />,
}));

/** Landing section that sends the visitor from discovery into court search. */
export function SportSearchCard() {
    return (
        <section
            aria-labelledby="sport-search-title"
            className="rounded-2xl bg-surface-card p-5 drop-shadow-subtle"
        >
            <ul className="flex flex-wrap items-center justify-center gap-1.5">
                {SPORTS.map((sport) => (
                    <li
                        key={sport.id}
                        className="flex h-[20.5px] items-center gap-1 rounded-full bg-surface-high px-2.5 text-[11px] leading-[16.5px] font-medium text-foreground"
                    >
                        <DesignIcon src={sport.icon} className={sport.iconClassName} />
                        <span>{sport.label}</span>
                    </li>
                ))}
            </ul>

            <h2
                id="sport-search-title"
                className="mt-1.5 text-center text-lg leading-7 font-bold text-foreground"
            >
                زمین ورزشی مورد نظرت را پیدا کن
            </h2>

            <p className="mt-3 text-center text-xs leading-[19.5px] text-foreground-muted">
                فوتبال، پدل، تنیس، بسکتبال و استخر با سانس‌های خالی به‌روز
            </p>

            <div className="mt-5">
                <div className="flex items-center justify-between px-0.5">
                    <div className="flex items-center gap-1.5">
                        <DesignIcon
                            src="/assets/icons/landing/popular-venues.svg"
                            className="h-[14.25px] w-3"
                        />
                        <span className="text-xs leading-4 font-bold text-foreground">
                            محبوب‌ترین سالن‌ها و زمین‌ها
                        </span>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-[10px] leading-[15px] font-medium text-primary">
                            ورق بزنید
                        </span>
                        <DesignIcon
                            src="/assets/icons/landing/swipe-hint.svg"
                            className="h-[12.25px] w-[11.667px]"
                        />
                    </div>
                </div>

                <Carousel
                    ariaLabel="محبوب‌ترین سالن‌ها و زمین‌ها"
                    slides={POPULAR_VENUE_SLIDES}
                    autoplayInterval={0}
                    slideWidthClassName="w-[220px]"
                    slideSnap="start"
                    viewportClassName="mt-2.5 gap-1.5 pt-0.5 pb-2"
                />
            </div>

            <LinkButton
                href="/user-check"
                className="mt-4"
                leadingIcon={
                    <DesignIcon
                        src="/assets/icons/landing/cta-target.svg"
                        className="size-[16.667px]"
                    />
                }
                trailingIcon={
                    <DesignIcon src="/assets/icons/landing/cta-arrow.svg" className="size-3" />
                }
            >
                پیدا کردن زمین ورزشی
            </LinkButton>

            <ul className="mt-4 flex items-start justify-center gap-2 rounded-xl bg-surface-muted px-2.5 pt-4 pb-2.5">
                {FEATURES.map((feature) => (
                    <li
                        key={feature.id}
                        className="flex min-w-0 flex-1 flex-col items-center text-center"
                    >
                        <span className="mb-0.5 flex h-[16.5px] items-center justify-center">
                            <DesignIcon src={feature.icon} className={feature.iconClassName} />
                        </span>
                        <span className="text-[10px] leading-[15px] font-bold text-foreground">
                            {feature.label}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}
