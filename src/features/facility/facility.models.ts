/** One image in the facility media gallery. */
export interface IFacilityImage {
    id: string;
    src: string;
    alt: string;
}

/** One quick-spec pill under the facility title. */
export interface IFacilitySpec {
    id: string;
    label: string;
    icon: string;
    iconClassName: string;
}

/** One service tile in the amenities bento grid. */
export interface IFacilityAmenity {
    id: string;
    title: string;
    detail: string;
    icon: string;
    iconClassName: string;
}

/** One player review in the ratings preview. */
export interface IFacilityReview {
    id: string;
    author: string;
    initials: string;
    relativeDate: string;
    body: string;
    /** Avatar tone; the preview alternates primary and secondary. */
    tone: 'primary' | 'secondary';
}

type TFacilitySlotBase = {
    id: string;
    /** 24-hour interval, kept in Latin digits per DESIGN.md. */
    time: string;
};

/** One interval inside a day row - either bookable or already taken. */
export type IFacilitySlot =
    | (TFacilitySlotBase & {
          state: 'available';
          price: number;
          /** Replaces the price when a Time Slot has a morning discount. */
          priceNote?: string;
      })
    | (TFacilitySlotBase & { state: 'reserved' });

/** A Time Slot that can be selected into the booking bar. */
export type TAvailableSlot = Extract<IFacilitySlot, { state: 'available' }>;

/** One day in the weekly availability table. */
export interface IFacilityDay {
    id: string;
    dateLabel: string;
    /** Today/tomorrow chip shown next to the date. */
    badge?: 'today' | 'tomorrow';
    note: string;
    /** Highlighted notes use the secondary role (popular / last slots). */
    noteTone?: 'default' | 'highlight';
    slots: readonly IFacilitySlot[];
}

/** The Time Slot summarised in the sticky booking bar. */
export interface ISelectedSlot {
    /** `${dayId}:${slotId}` - identifies the selected chip in the table. */
    key: string;
    courtLabel: string;
    /** e.g. «امروز (شنبه ۲۴ آبان)» */
    dayLabel: string;
    time: string;
    price: number;
    durationMinutes: number;
}

/** The weekly availability table plus its controls and legend. */
export interface IFacilitySchedule {
    heading: string;
    hint: string;
    courts: readonly { id: string; label: string }[];
    activeCourtId: string;
    weekLabel: string;
    legend: readonly { id: string; label: string; tone: 'reserved' | 'selected' | 'free' }[];
    days: readonly IFacilityDay[];
}

/** The static detail record behind `/facilities/[id]`. */
export interface IFacilityDetail {
    name: string;
    address: string;
    mapHref: string;
    rating: number;
    reviewCount: number;
    freeSlotsToday: number;
    sportLabel: string;
    verifiedLabel: string;
    specs: readonly IFacilitySpec[];
    description: string;
    amenitiesHeading: string;
    amenities: readonly IFacilityAmenity[];
    pricing: {
        label: string;
        amount: number;
        unit: string;
        guarantee: string;
    };
    reviewsHeading: string;
    reviews: readonly IFacilityReview[];
    schedule: IFacilitySchedule;
    gallery: readonly IFacilityImage[];
}
