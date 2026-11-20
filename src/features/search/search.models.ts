/** The four sport families the search chips expose. */
export type TSportId = 'football' | 'paddle' | 'basketball' | 'pool';

/** A sport chip selection; `all` clears the sport filter. */
export type TSportFilter = TSportId | 'all';

/** Result ordering shown in the meta bar. */
export type TVenueSort = 'satisfaction' | 'price' | 'distance';

/** The short badge on the photo and the reason the card highlights a venue. */
export type TVenueHighlightKind = 'slots' | 'surface' | 'discount' | 'amenity';

export interface IVenueHighlight {
    kind: TVenueHighlightKind;
    label: string;
}

export interface IVenue {
    id: string;
    slug: string;
    name: string;
    sportId: TSportId;
    /** Short label drawn on the photo, e.g. «پدل» or «تنیس خاکی». */
    sportLabel: string;
    rating: number;
    location: string;
    distanceKm: number;
    priceToman: number;
    /** Free Time Slots today; zero means the venue is listed but full. */
    availableSlots: number;
    discounted: boolean;
    highlight: IVenueHighlight;
    image: string;
    amenities: readonly string[];
}

/** Client-side filter state, mirrored into the URL. */
export interface ISearchState {
    sport: TSportFilter;
    sort: TVenueSort;
    minRating: number | null;
    maxPrice: number | null;
    freeSlotsOnly: boolean;
    discountedOnly: boolean;
}

/** Search state plus the live query. */
export interface ISearchParams extends ISearchState {
    query: string;
}

/** The advanced-filter sheet edits everything except the sort. */
export type TFilterDraft = Pick<
    ISearchState,
    'sport' | 'minRating' | 'maxPrice' | 'freeSlotsOnly' | 'discountedOnly'
>;
