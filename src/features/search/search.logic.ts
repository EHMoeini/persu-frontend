import type {
    IFacility,
    ISearchParams,
    ISearchState,
    TFacilitySort,
    TFilterDraft,
    TSportFilter,
} from './search.models';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

export const DEFAULT_SEARCH_STATE: ISearchState = {
    sport: 'all',
    sort: 'satisfaction',
    minRating: null,
    maxPrice: null,
    freeSlotsOnly: false,
};

export const DEFAULT_SEARCH_PARAMS: ISearchParams = {
    ...DEFAULT_SEARCH_STATE,
    query: '',
};

export const DEFAULT_FILTER_DRAFT: TFilterDraft = {
    minRating: DEFAULT_SEARCH_STATE.minRating,
    maxPrice: DEFAULT_SEARCH_STATE.maxPrice,
    freeSlotsOnly: DEFAULT_SEARCH_STATE.freeSlotsOnly,
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

export const SORT_OPTIONS: readonly { id: TFacilitySort; label: string }[] = [
    { id: 'satisfaction', label: 'بیشترین رضایت' },
    { id: 'price', label: 'کمترین قیمت' },
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
 * Keywords per sport chip. `category` is the sport on the wire and may be in
 * Persian or English, so a chip matches when any of its keywords appears.
 */
const SPORT_CATEGORY_KEYWORDS: Record<Exclude<TSportFilter, 'all'>, readonly string[]> = {
    paddle: ['racket', 'tennis', 'padel', 'badminton', 'table tennis', 'پدل', 'تنیس'],
    football: ['football', 'soccer', 'futsal', 'فوتبال', 'فوتسال', 'چمن'],
    basketball: ['basketball', 'بسکتبال'],
    pool: ['swimming', 'pool', 'استخر', 'شنا'],
};

/** Unifies Arabic/Persian letter variants so free-text categories match the keywords. */
function normalizePersianText(value: string): string {
    return value
        .replace(/[يى]/g, 'ی')
        .replace(/ك/g, 'ک')
        .replace(/\u200c/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function matchesSport(facility: IFacility, sport: TSportFilter): boolean {
    if (sport === 'all') return true;

    const source = facility.category ?? facility.type;
    if (!source) return false;

    const text = normalizePersianText(source);
    return SPORT_CATEGORY_KEYWORDS[sport].some((keyword) => text.includes(keyword));
}

function compareFacilities(a: IFacility, b: IFacility, sort: TFacilitySort): number {
    if (sort === 'price') {
        return (
            (a.price ?? Infinity) - (b.price ?? Infinity) ||
            (b.rating ?? -Infinity) - (a.rating ?? -Infinity)
        );
    }

    return (b.rating ?? -Infinity) - (a.rating ?? -Infinity);
}

/** Applies the sport, price, rating, and availability filters, then orders. Pure. */
export function filterFacilities(
    facilities: readonly IFacility[],
    filters: ISearchState,
): IFacility[] {
    return facilities
        .filter((facility) => {
            if (!matchesSport(facility, filters.sport)) return false;

            if (filters.minRating !== null) {
                if (facility.rating === undefined || facility.rating < filters.minRating) {
                    return false;
                }
            }

            if (filters.maxPrice !== null) {
                if (facility.price === undefined || facility.price > filters.maxPrice) {
                    return false;
                }
            }

            if (filters.freeSlotsOnly && facility.availability !== true) return false;

            return true;
        })
        .toSorted((a, b) => compareFacilities(a, b, filters.sort));
}

/** True when the advanced sheet is hiding an active filter. */
export function hasAdvancedFilters(
    filters: Pick<ISearchState, 'minRating' | 'maxPrice' | 'freeSlotsOnly'>,
): boolean {
    return filters.minRating !== null || filters.maxPrice !== null || filters.freeSlotsOnly;
}

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

function isSportFilter(value: string | null): value is TSportFilter {
    return (
        value === 'all' ||
        value === 'football' ||
        value === 'paddle' ||
        value === 'basketball' ||
        value === 'pool'
    );
}

function isFacilitySort(value: string | null): value is TFacilitySort {
    return value === 'satisfaction' || value === 'price';
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
        sort: isFacilitySort(sort) ? sort : DEFAULT_SEARCH_STATE.sort,
        minRating: parseOptionalNumber(params.get('rating')),
        maxPrice: parseOptionalNumber(params.get('price')),
        freeSlotsOnly: params.get('slots') === '1',
    };
}

/** Params whose backing field no longer exists; dropped from shared links. */
const RETIRED_PARAMS = ['deal'] as const;

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

    RETIRED_PARAMS.forEach((key) => params.delete(key));

    if (trimmedQuery) params.set('q', trimmedQuery);
    else params.delete('q');

    if (filters.sport !== 'all') params.set('sport', filters.sport);
    else params.delete('sport');

    if (filters.sort !== DEFAULT_SEARCH_STATE.sort) params.set('sort', filters.sort);
    else params.delete('sort');

    if (filters.minRating !== null) params.set('rating', String(filters.minRating));
    else params.delete('rating');

    if (filters.maxPrice !== null) params.set('price', String(filters.maxPrice));
    else params.delete('price');

    if (filters.freeSlotsOnly) params.set('slots', '1');
    else params.delete('slots');

    return params;
}
