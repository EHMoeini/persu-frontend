/** The four sport families the search chips expose. */
export type TSportId = 'football' | 'paddle' | 'basketball' | 'pool';

/** A sport chip selection; `all` clears the sport filter. */
export type TSportFilter = TSportId | 'all';

/** Result ordering shown in the meta bar. */
export type TFacilitySort = 'satisfaction' | 'price';

/** One facility as returned by `GET /api/facilities`. */
export interface IFacility {
    id: string;
    name: string;
    description?: string;
    /** Sport family, e.g. «Football» or «Swimming». */
    category?: string;
    /** Surface or venue kind, e.g. «Soccer Field» or «Indoor Pool». */
    type?: string;
    location?: string;
    /** Price per Time Slot, in تومان. */
    price?: number;
    /** Cover image URL. */
    picture?: string;
    rating?: number;
    /** Whether the facility has free Time Slots today. */
    availability?: boolean;
}

/** The facility search envelope. */
export interface IFacilityListResponse {
    facilities: IFacility[];
}

/** Client-side filter state, mirrored into the URL. */
export interface ISearchState {
    sport: TSportFilter;
    sort: TFacilitySort;
    minRating: number | null;
    maxPrice: number | null;
    freeSlotsOnly: boolean;
}

/** Search state plus the live query. */
export interface ISearchParams extends ISearchState {
    query: string;
}

/** The advanced-filter sheet edits everything except sport and sort. */
export type TFilterDraft = Pick<ISearchState, 'minRating' | 'maxPrice' | 'freeSlotsOnly'>;
