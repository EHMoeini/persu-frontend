import type {
    ISearchParams,
    ISearchState,
    IVenue,
    TFilterDraft,
    TSportFilter,
    TVenueSort,
} from './search.models';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const ARABIC_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export const DEFAULT_SEARCH_STATE: ISearchState = {
    sport: 'all',
    sort: 'satisfaction',
    minRating: null,
    maxPrice: null,
    freeSlotsOnly: false,
    discountedOnly: false,
};

export const DEFAULT_SEARCH_PARAMS: ISearchParams = {
    ...DEFAULT_SEARCH_STATE,
    query: '',
};

export const DEFAULT_FILTER_DRAFT: TFilterDraft = {
    sport: DEFAULT_SEARCH_STATE.sport,
    minRating: DEFAULT_SEARCH_STATE.minRating,
    maxPrice: DEFAULT_SEARCH_STATE.maxPrice,
    freeSlotsOnly: DEFAULT_SEARCH_STATE.freeSlotsOnly,
    discountedOnly: DEFAULT_SEARCH_STATE.discountedOnly,
};

export type TSportFilterOption = {
    id: TSportFilter;
    label: string;
    icon: string;
    iconClassName: string;
    /** The all-sports glyph is white, so it always renders as a mask. */
    maskInactive?: boolean;
};

/** Ordered for RTL: the active «همه ورزش‌ها» chip sits at the scroll start. */
export const SPORT_FILTERS: readonly TSportFilterOption[] = [
    {
        id: 'all',
        label: 'همه ورزش‌ها',
        icon: '/assets/icons/search/all-sports.svg',
        iconClassName: 'h-[10.667px] w-[9.333px]',
        maskInactive: true,
    },
    {
        id: 'paddle',
        label: 'پدل و تنیس',
        icon: '/assets/icons/landing/sport-paddle.svg',
        iconClassName: 'h-[14.712px] w-[13.333px]',
    },
    {
        id: 'football',
        label: 'فوتبال و چمن',
        icon: '/assets/icons/landing/sport-football.svg',
        iconClassName: 'size-[13.333px]',
    },
    {
        id: 'basketball',
        label: 'بسکتبال',
        icon: '/assets/icons/landing/sport-basketball.svg',
        iconClassName: 'size-[13.333px]',
    },
    {
        id: 'pool',
        label: 'استخر و شنا',
        icon: '/assets/icons/landing/sport-pool.svg',
        iconClassName: 'h-3 w-[13.333px]',
    },
];

export const SORT_OPTIONS: readonly { id: TVenueSort; label: string }[] = [
    { id: 'satisfaction', label: 'بیشترین رضایت' },
    { id: 'price', label: 'کمترین قیمت' },
    { id: 'distance', label: 'نزدیک‌ترین' },
];

export const MAX_PRICE_OPTIONS: readonly { value: number | null; label: string }[] = [
    { value: null, label: 'همه' },
    { value: 300_000, label: 'تا ۳۰۰ هزار' },
    { value: 500_000, label: 'تا ۵۰۰ هزار' },
    { value: 800_000, label: 'تا ۸۰۰ هزار' },
    { value: 1_000_000, label: 'تا ۱ میلیون' },
];

export const MIN_RATING_OPTIONS: readonly { value: number | null; label: string }[] = [
    { value: null, label: 'همه' },
    { value: 4.5, label: '۴.۵ به بالا' },
    { value: 4.8, label: '۴.۸ به بالا' },
];

/**
 * Mock catalogue until the venue-search endpoint lands. The first four entries
 * mirror the Figma frame order; the rest give the filters real variance.
 */
export const VENUES: readonly IVenue[] = [
    {
        id: 'padel-spin',
        slug: 'padel-spin',
        name: 'باشگاه بین‌المللی پدل اسپین',
        sportId: 'paddle',
        sportLabel: 'پدل',
        rating: 4.9,
        location: 'نیاوران، مژده',
        distanceKm: 2.4,
        priceToman: 480_000,
        availableSlots: 4,
        discounted: false,
        highlight: { kind: 'slots', label: '۴ سانس خالی امروز' },
        image: '/assets/images/search/venue-padel.png',
        amenities: ['پدل', 'سالن سرپوشیده', 'پارکینگ'],
    },
    {
        id: 'tennis-enghelab',
        slug: 'tennis-enghelab',
        name: 'آکادمی تنیس باشگاه انقلاب',
        sportId: 'paddle',
        sportLabel: 'تنیس خاکی',
        rating: 4.8,
        location: 'اتوبان نیایش، سئول',
        distanceKm: 5.1,
        priceToman: 350_000,
        availableSlots: 3,
        discounted: false,
        highlight: { kind: 'surface', label: 'زمین هارد و گرنداسلم' },
        image: '/assets/images/search/venue-tennis.png',
        amenities: ['تنیس', 'زمین هارد', 'گرنداسلم'],
    },
    {
        id: 'futsal-arena',
        slug: 'futsal-arena',
        name: 'سالن چندمنظوره فوتسال آرنا',
        sportId: 'football',
        sportLabel: 'سالن پارکت',
        rating: 4.7,
        location: 'شهرک غرب، سیمای ایران',
        distanceKm: 6.8,
        priceToman: 600_000,
        availableSlots: 1,
        discounted: true,
        highlight: { kind: 'discount', label: '۱ سانس تخفیف‌دار' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتسال', 'سالن پارکت', 'تخفیف'],
    },
    {
        id: 'olympic-aquatic',
        slug: 'olympic-aquatic',
        name: 'مجموعه آبی و استخر المپیک',
        sportId: 'pool',
        sportLabel: 'استخر ۵۰ متر',
        rating: 4.9,
        location: 'ولنجک، میدان دانشجو',
        distanceKm: 4.2,
        priceToman: 290_000,
        availableSlots: 2,
        discounted: false,
        highlight: { kind: 'amenity', label: 'سونا و آب‌درمانی' },
        image: '/assets/images/search/venue-pool.png',
        amenities: ['استخر', 'سونا', 'جکوزی'],
    },
    {
        id: 'padel-vanak',
        slug: 'padel-vanak',
        name: 'باشگاه پدل آرنا ونک',
        sportId: 'paddle',
        sportLabel: 'پدل',
        rating: 4.6,
        location: 'ونک، ملاصدرا',
        distanceKm: 3.7,
        priceToman: 520_000,
        availableSlots: 2,
        discounted: false,
        highlight: { kind: 'slots', label: '۲ سانس خالی امروز' },
        image: '/assets/images/search/venue-padel.png',
        amenities: ['پدل', 'سالن سرپوشیده', 'کافه'],
    },
    {
        id: 'chaman-mellat',
        slug: 'chaman-mellat',
        name: 'زمین چمن مصنوعی پارک ملت',
        sportId: 'football',
        sportLabel: 'چمن مصنوعی',
        rating: 4.5,
        location: 'پارک ملت، بلوار کشاورز',
        distanceKm: 7.3,
        priceToman: 750_000,
        availableSlots: 5,
        discounted: false,
        highlight: { kind: 'slots', label: '۵ سانس خالی امروز' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتبال', 'چمن مصنوعی', 'روشنایی'],
    },
    {
        id: 'pool-enghelab',
        slug: 'pool-enghelab',
        name: 'استخر انقلاب',
        sportId: 'pool',
        sportLabel: 'استخر سرپوشیده',
        rating: 4.4,
        location: 'خیابان کارگر شمالی',
        distanceKm: 8.1,
        priceToman: 250_000,
        availableSlots: 6,
        discounted: false,
        highlight: { kind: 'slots', label: '۶ سانس خالی امروز' },
        image: '/assets/images/search/venue-pool.png',
        amenities: ['استخر', 'سونا', 'آموزش شنا'],
    },
    {
        id: 'basketball-beheshti',
        slug: 'basketball-beheshti',
        name: 'سالن بسکتبال شهید بهشتی',
        sportId: 'basketball',
        sportLabel: 'بسکتبال',
        rating: 4.6,
        location: 'اوین، دانشگاه شهید بهشتی',
        distanceKm: 9.4,
        priceToman: 400_000,
        availableSlots: 2,
        discounted: false,
        highlight: { kind: 'surface', label: 'سالن پارکت استاندارد' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['بسکتبال', 'سالن پارکت', 'تخته امتیاز'],
    },
    {
        id: 'shiroodi',
        slug: 'shiroodi',
        name: 'مجموعه ورزشی شیرودی',
        sportId: 'football',
        sportLabel: 'چمن طبیعی',
        rating: 4.7,
        location: 'فرمانیه، دیباجی',
        distanceKm: 5.9,
        priceToman: 820_000,
        availableSlots: 3,
        discounted: false,
        highlight: { kind: 'slots', label: '۳ سانس خالی امروز' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتبال', 'چمن طبیعی', 'رختکن'],
    },
    {
        id: 'tennis-ekbatan',
        slug: 'tennis-ekbatan',
        name: 'باشگاه تنیس اکباتان',
        sportId: 'paddle',
        sportLabel: 'تنیس',
        rating: 4.5,
        location: 'اکباتان، فاز ۲',
        distanceKm: 11.2,
        priceToman: 450_000,
        availableSlots: 1,
        discounted: true,
        highlight: { kind: 'discount', label: '۱ سانس تخفیف‌دار' },
        image: '/assets/images/search/venue-tennis.png',
        amenities: ['تنیس', 'زمین هارد', 'مربی'],
    },
    {
        id: 'pool-saadatabad',
        slug: 'pool-saadatabad',
        name: 'استخر سعادت‌آباد',
        sportId: 'pool',
        sportLabel: 'استخر',
        rating: 4.8,
        location: 'سعادت‌آباد، بلوار دریا',
        distanceKm: 4.8,
        priceToman: 320_000,
        availableSlots: 4,
        discounted: false,
        highlight: { kind: 'amenity', label: 'جکوزی و سونا' },
        image: '/assets/images/search/venue-pool.png',
        amenities: ['استخر', 'جکوزی', 'سونا'],
    },
    {
        id: 'futsal-olympic',
        slug: 'futsal-olympic',
        name: 'سالن فوتسال المپیک',
        sportId: 'football',
        sportLabel: 'سالن پارکت',
        rating: 4.3,
        location: 'طرشت، بلوار فردوس',
        distanceKm: 10.6,
        priceToman: 550_000,
        availableSlots: 0,
        discounted: true,
        highlight: { kind: 'discount', label: '۲ سانس تخفیف‌دار' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتسال', 'سالن پارکت', 'تخفیف'],
    },
    {
        id: 'basketball-niavaran',
        slug: 'basketball-niavaran',
        name: 'باشگاه بسکتبال نیاوران',
        sportId: 'basketball',
        sportLabel: 'بسکتبال',
        rating: 4.9,
        location: 'نیاوران، باهنر',
        distanceKm: 2.9,
        priceToman: 600_000,
        availableSlots: 3,
        discounted: false,
        highlight: { kind: 'surface', label: 'سالن پارکت' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['بسکتبال', 'سالن پارکت', 'پارکینگ'],
    },
    {
        id: 'padel-zaferanieh',
        slug: 'padel-zaferanieh',
        name: 'آکادمی پدل زعفرانیه',
        sportId: 'paddle',
        sportLabel: 'پدل',
        rating: 4.7,
        location: 'زعفرانیه، مقدس اردبیلی',
        distanceKm: 3.2,
        priceToman: 700_000,
        availableSlots: 2,
        discounted: false,
        highlight: { kind: 'slots', label: '۲ سانس خالی امروز' },
        image: '/assets/images/search/venue-padel.png',
        amenities: ['پدل', 'سالن سرپوشیده', 'مربی'],
    },
    {
        id: 'pool-azadi',
        slug: 'pool-azadi',
        name: 'استخر آزادی',
        sportId: 'pool',
        sportLabel: 'استخر المپیک',
        rating: 4.2,
        location: 'مجموعه ورزشی آزادی',
        distanceKm: 13.7,
        priceToman: 220_000,
        availableSlots: 8,
        discounted: false,
        highlight: { kind: 'slots', label: '۸ سانس خالی امروز' },
        image: '/assets/images/search/venue-pool.png',
        amenities: ['استخر', 'المپیک', 'آموزش شنا'],
    },
    {
        id: 'chaman-shahrak-gharb',
        slug: 'chaman-shahrak-gharb',
        name: 'زمین چمن فوتبال شهرک غرب',
        sportId: 'football',
        sportLabel: 'چمن مصنوعی',
        rating: 4.4,
        location: 'شهرک غرب، ایران‌زمین',
        distanceKm: 6.1,
        priceToman: 650_000,
        availableSlots: 1,
        discounted: false,
        highlight: { kind: 'slots', label: '۱ سانس خالی امروز' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتبال', 'چمن مصنوعی', 'نورپردازی'],
    },
    {
        id: 'basketball-tehran-university',
        slug: 'basketball-tehran-university',
        name: 'سالن بسکتبال دانشگاه تهران',
        sportId: 'basketball',
        sportLabel: 'بسکتبال',
        rating: 4.5,
        location: 'انقلاب، دانشگاه تهران',
        distanceKm: 7.8,
        priceToman: 380_000,
        availableSlots: 3,
        discounted: true,
        highlight: { kind: 'discount', label: '۱ سانس تخفیف‌دار' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['بسکتبال', 'سالن سرپوشیده', 'تخفیف'],
    },
    {
        id: 'tennis-pasdaran',
        slug: 'tennis-pasdaran',
        name: 'باشگاه تنیس پاسداران',
        sportId: 'paddle',
        sportLabel: 'تنیس',
        rating: 4.8,
        location: 'پاسداران، بوستان',
        distanceKm: 5.4,
        priceToman: 580_000,
        availableSlots: 2,
        discounted: false,
        highlight: { kind: 'amenity', label: 'کورت هارد و آنتی‌سلیپ' },
        image: '/assets/images/search/venue-tennis.png',
        amenities: ['تنیس', 'کورت هارد', 'آنتی‌سلیپ'],
    },
    {
        id: 'rasouli',
        slug: 'rasouli',
        name: 'مجموعه ورزشی رسولی',
        sportId: 'football',
        sportLabel: 'چمن مصنوعی',
        rating: 4.1,
        location: 'جنت‌آباد، آیت‌الله کاشانی',
        distanceKm: 12.3,
        priceToman: 480_000,
        availableSlots: 4,
        discounted: false,
        highlight: { kind: 'slots', label: '۴ سانس خالی امروز' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتبال', 'چمن مصنوعی', 'پارکینگ'],
    },
    {
        id: 'pool-ghytarieh',
        slug: 'pool-ghytarieh',
        name: 'استخر قیطریه',
        sportId: 'pool',
        sportLabel: 'استخر',
        rating: 4.6,
        location: 'قیطریه، شریعتی',
        distanceKm: 4.6,
        priceToman: 300_000,
        availableSlots: 0,
        discounted: false,
        highlight: { kind: 'amenity', label: 'سونا خشک' },
        image: '/assets/images/search/venue-pool.png',
        amenities: ['استخر', 'سونا خشک', 'رختکن'],
    },
    {
        id: 'padel-elahiyeh',
        slug: 'padel-elahiyeh',
        name: 'باشگاه پدل الهیه',
        sportId: 'paddle',
        sportLabel: 'پدل',
        rating: 4.9,
        location: 'الهیه، فرشته',
        distanceKm: 2.1,
        priceToman: 900_000,
        availableSlots: 3,
        discounted: false,
        highlight: { kind: 'slots', label: '۳ سانس خالی امروز' },
        image: '/assets/images/search/venue-padel.png',
        amenities: ['پدل', 'سالن سرپوشیده', 'ولت'],
    },
    {
        id: 'basketball-vanak',
        slug: 'basketball-vanak',
        name: 'سالن بسکتبال ونک',
        sportId: 'basketball',
        sportLabel: 'بسکتبال',
        rating: 4.3,
        location: 'ونک، میرداماد',
        distanceKm: 3.9,
        priceToman: 350_000,
        availableSlots: 5,
        discounted: false,
        highlight: { kind: 'slots', label: '۵ سانس خالی امروز' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['بسکتبال', 'سالن سرپوشیده', 'تخته امتیاز'],
    },
    {
        id: 'futsal-poonak',
        slug: 'futsal-poonak',
        name: 'زمین فوتسال پونک',
        sportId: 'football',
        sportLabel: 'سالن پارکت',
        rating: 4.6,
        location: 'پونک، همت',
        distanceKm: 8.7,
        priceToman: 520_000,
        availableSlots: 2,
        discounted: true,
        highlight: { kind: 'discount', label: '۲ سانس تخفیف‌دار' },
        image: '/assets/images/search/venue-futsal.png',
        amenities: ['فوتسال', 'سالن پارکت', 'تخفیف'],
    },
    {
        id: 'pool-niavaran',
        slug: 'pool-niavaran',
        name: 'استخر نیاوران',
        sportId: 'pool',
        sportLabel: 'استخر',
        rating: 4.7,
        location: 'نیاوران، کامرانیه',
        distanceKm: 2.7,
        priceToman: 420_000,
        availableSlots: 1,
        discounted: false,
        highlight: { kind: 'amenity', label: 'جکوزی و سونا' },
        image: '/assets/images/search/venue-pool.png',
        amenities: ['استخر', 'جکوزی', 'سونا'],
    },
];

/** Renders Latin digits as Persian digits. Pure. */
export function toPersianDigits(value: string): string {
    return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** Latin grouping (۱,۴۵۰,۰۰۰) + Persian digits. */
export function formatPersianNumber(value: number): string {
    return toPersianDigits(NUMBER_FORMATTER.format(value));
}

/** Price in تومان, shown as «۴۸۰,۰۰۰». */
export function formatToman(amount: number): string {
    return formatPersianNumber(amount);
}

/** One-decimal rating in Persian digits, e.g. ۴.۹. */
export function formatRating(rating: number): string {
    return toPersianDigits(rating.toFixed(1));
}

/**
 * Persian-aware normalization for mock search: unify Arabic/Persian letter
 * variants, strip diacritics and ZWNJ, convert numerals, and collapse spaces.
 */
export function normalizeSearchText(value: string): string {
    return value
        .replace(/[يى]/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/[ةۀ]/g, 'ه')
        .replace(/[أإآ]/g, 'ا')
        .replace(/[\u064B-\u065F\u0670]/g, '')
        .replace(/[۰-۹]/g, (digit) => String(PERSIAN_DIGITS.indexOf(digit)))
        .replace(/[٠-٩]/g, (digit) => String(ARABIC_DIGITS.indexOf(digit)))
        .replace(/\u200c/g, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function compactSearchText(value: string): string {
    return value.replace(/\s+/g, '');
}

function compareVenues(a: IVenue, b: IVenue, sort: TVenueSort): number {
    if (sort === 'price') {
        return a.priceToman - b.priceToman || b.rating - a.rating;
    }

    if (sort === 'distance') {
        return a.distanceKm - b.distanceKm || b.rating - a.rating;
    }

    // «بیشترین رضایت» is the curated mock ranking: the catalogue order is the
    // satisfaction order, so the design's four lead cards stay first.
    return 0;
}

/** Applies the query and every filter, then orders the mock catalogue. */
export function searchVenues(
    venues: readonly IVenue[],
    filters: ISearchState,
    query: string,
): IVenue[] {
    const normalizedQuery = normalizeSearchText(query);
    const compactQuery = compactSearchText(normalizedQuery);

    return venues
        .filter((venue) => {
            if (filters.sport !== 'all' && venue.sportId !== filters.sport) return false;
            if (filters.minRating !== null && venue.rating < filters.minRating) return false;
            if (filters.maxPrice !== null && venue.priceToman > filters.maxPrice) return false;
            if (filters.freeSlotsOnly && venue.availableSlots <= 0) return false;
            if (filters.discountedOnly && !venue.discounted) return false;
            if (!normalizedQuery) return true;

            const haystack = normalizeSearchText(
                [venue.name, venue.location, venue.sportLabel, ...venue.amenities].join(' '),
            );

            return (
                haystack.includes(normalizedQuery) ||
                (compactQuery.length > 0 && compactSearchText(haystack).includes(compactQuery))
            );
        })
        .toSorted((a, b) => compareVenues(a, b, filters.sort));
}

/** True when the advanced sheet is hiding an active filter. */
export function hasAdvancedFilters(
    filters: Pick<ISearchState, 'minRating' | 'maxPrice' | 'freeSlotsOnly' | 'discountedOnly'>,
): boolean {
    return (
        filters.minRating !== null ||
        filters.maxPrice !== null ||
        filters.freeSlotsOnly ||
        filters.discountedOnly
    );
}

/** True when the price/slot utility chip should read as active. */
export function hasPriceSlotFilters(
    filters: Pick<ISearchState, 'maxPrice' | 'freeSlotsOnly' | 'discountedOnly'>,
): boolean {
    return filters.maxPrice !== null || filters.freeSlotsOnly || filters.discountedOnly;
}

function isSportFilter(value: string | null): value is TSportFilter {
    return (
        value === 'all' ||
        value === 'football' ||
        value === 'paddle' ||
        value === 'basketball' ||
        value === 'pool'
    );
}

function isVenueSort(value: string | null): value is TVenueSort {
    return value === 'satisfaction' || value === 'price' || value === 'distance';
}

function parseOptionalNumber(value: string | null): number | null {
    if (value === null || value.trim() === '') return null;
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

/** Reads the shareable search state from the URL. */
export function parseSearchParams(params: { get(name: string): string | null }): ISearchParams {
    const sport = params.get('sport');
    const sort = params.get('sort');

    return {
        query: params.get('q')?.trim() ?? '',
        sport: isSportFilter(sport) ? sport : DEFAULT_SEARCH_STATE.sport,
        sort: isVenueSort(sort) ? sort : DEFAULT_SEARCH_STATE.sort,
        minRating: parseOptionalNumber(params.get('rating')),
        maxPrice: parseOptionalNumber(params.get('price')),
        freeSlotsOnly: params.get('slots') === '1',
        discountedOnly: params.get('deal') === '1',
    };
}

/**
 * Writes the search state into a cloned parameter set. Unknown params are
 * preserved so campaign tags survive a filter change.
 */
export function serializeSearchParams(
    filters: ISearchState,
    query: string,
    base: URLSearchParams = new URLSearchParams(),
): URLSearchParams {
    const params = new URLSearchParams(base);
    const trimmedQuery = query.trim();

    if (trimmedQuery) params.set('q', trimmedQuery);
    else params.delete('q');

    if (filters.sport !== 'all') params.set('sport', filters.sport);
    else params.delete('sport');

    if (filters.sort !== 'satisfaction') params.set('sort', filters.sort);
    else params.delete('sort');

    if (filters.minRating !== null) params.set('rating', String(filters.minRating));
    else params.delete('rating');

    if (filters.maxPrice !== null) params.set('price', String(filters.maxPrice));
    else params.delete('price');

    if (filters.freeSlotsOnly) params.set('slots', '1');
    else params.delete('slots');

    if (filters.discountedOnly) params.set('deal', '1');
    else params.delete('deal');

    return params;
}
