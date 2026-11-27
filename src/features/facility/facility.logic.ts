import type {
    IFacilityAmenity,
    IFacilityDay,
    IFacilityDetail,
    IFacilityImage,
    IFacilityReview,
    IFacilitySlot,
    ISelectedSlot,
    TAvailableSlot,
} from './facility.models';

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const NUMBER_FORMATTER = new Intl.NumberFormat('en-US');

/** Latin digits to Persian digits, leaving separators untouched. */
export function toPersianDigits(value: string): string {
    return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** Price in تومان, grouped and shown in Persian digits. */
export function formatToman(amount: number): string {
    return toPersianDigits(NUMBER_FORMATTER.format(amount));
}

/** One-decimal rating in Persian digits, e.g. ۴.۹. */
export function formatRating(rating: number): string {
    return toPersianDigits(rating.toFixed(1));
}

const available = (id: string, time: string, price: number, priceNote?: string): IFacilitySlot => ({
    id,
    time,
    price,
    state: 'available',
    priceNote,
});

const reserved = (id: string, time: string): IFacilitySlot => ({ id, time, state: 'reserved' });

const GALLERY: readonly IFacilityImage[] = [
    {
        id: 'padel-hero',
        src: '/assets/images/facilities/spin-padel-hero.png',
        alt: 'کورت اصلی پدل اسپین نیاوران',
    },
    {
        id: 'tennis-court',
        src: '/assets/images/facilities/spin-tennis-court.png',
        alt: 'کورت تنیس استاندارد',
    },
    {
        id: 'indoor-hall',
        src: '/assets/images/facilities/spin-indoor-hall.png',
        alt: 'سالن چندمنظوره مسابقات',
    },
    {
        id: 'padel-view',
        src: '/assets/images/facilities/spin-padel-view.png',
        alt: 'نمای کورت پدل',
    },
];

const AMENITIES: readonly IFacilityAmenity[] = [
    {
        id: 'locker',
        title: 'رختکن و دوش آب گرم',
        detail: 'شخصی و بسیار بهداشتی',
        icon: '/assets/icons/facility/amenity-locker.svg',
        iconClassName: 'h-[15px] w-[11.667px]',
    },
    {
        id: 'parking',
        title: 'پارکینگ اختصاصی رایگان',
        detail: 'ظرفیت ۴۰ خودرو',
        icon: '/assets/icons/facility/amenity-parking.svg',
        iconClassName: 'h-[15px] w-[10.833px]',
    },
    {
        id: 'rental',
        title: 'اجاره راکت و توپ',
        detail: 'برندهای هد و بابولات',
        icon: '/assets/icons/facility/amenity-racket.svg',
        iconClassName: 'h-[18.389px] w-[16.667px]',
    },
    {
        id: 'cafe',
        title: 'کافه و بوفه سلامت',
        detail: 'اسموتی و مکمل ارگانیک',
        icon: '/assets/icons/facility/amenity-cafe.svg',
        iconClassName: 'size-[15px]',
    },
    {
        id: 'coach',
        title: 'مربی رسمی بین‌المللی',
        detail: 'هماهنگی سانس آموزشی',
        icon: '/assets/icons/facility/amenity-coach.svg',
        iconClassName: 'h-2.5 w-[16.667px]',
    },
    {
        id: 'wifi',
        title: 'اینترنت پرسرعت فیبر',
        detail: 'رایگان برای ورزشکاران',
        icon: '/assets/icons/facility/amenity-wifi.svg',
        iconClassName: 'h-[14.167px] w-5',
    },
];

const REVIEWS: readonly IFacilityReview[] = [
    {
        id: 'sohrab',
        author: 'سهراب مسعودی',
        initials: 'س‌م',
        relativeDate: '۳ روز پیش',
        tone: 'primary',
        body: 'کف کورت پدل بسیار تمیز و استاندارد است و اصلاً لیز نمی‌خورد. سیستم روشنایی عالی بود و زاویه نور به چشم نمی‌زند. حتماً دوباره رزرو می‌کنم.',
    },
    {
        id: 'niloofar',
        author: 'نیلوفر آرین',
        initials: 'ن‌آ',
        relativeDate: 'هفته گذشته',
        tone: 'secondary',
        body: 'رختکن و دوش بسیار شیک و تمیز، رفتار پرسنل عالی بود و راکت‌های اجاره‌ای هم نو و بسیار خوش‌دست بودند.',
    },
];

const DAYS: readonly IFacilityDay[] = [
    {
        id: 'today',
        dateLabel: 'شنبه ۲۴ آبان',
        badge: 'today',
        note: '۲ سانس خالی موجود',
        slots: [
            reserved('0730', '07:30 - 09:00'),
            reserved('0900', '09:00 - 10:30'),
            reserved('1030', '10:30 - 12:00'),
            reserved('1200', '12:00 - 13:30'),
            available('1600', '16:00 - 17:30', 480_000),
            available('1730', '17:30 - 19:00', 480_000),
            reserved('1900', '19:00 - 20:30'),
        ],
    },
    {
        id: 'tomorrow',
        dateLabel: 'یکشنبه ۲۵ آبان',
        badge: 'tomorrow',
        note: '۴ سانس خالی',
        slots: [
            available('0730', '07:30 - 09:00', 420_000, '۴۲۰,۰۰۰ (تخفیف صبح)'),
            available('0900', '09:00 - 10:30', 420_000),
            reserved('1030', '10:30 - 12:00'),
            available('1200', '12:00 - 13:30', 450_000),
            available('1600', '16:00 - 17:30', 480_000),
            reserved('1730', '17:30 - 19:00'),
            reserved('1900', '19:00 - 20:30'),
        ],
    },
    {
        id: 'monday',
        dateLabel: 'دوشنبه ۲۶ آبان',
        note: '۵ سانس خالی',
        slots: [
            available('0730', '07:30 - 09:00', 420_000),
            available('0900', '09:00 - 10:30', 420_000),
            available('1030', '10:30 - 12:00', 450_000),
            available('1200', '12:00 - 13:30', 450_000),
            available('1600', '16:00 - 17:30', 480_000),
            reserved('1730', '17:30 - 19:00'),
        ],
    },
    {
        id: 'tuesday',
        dateLabel: 'سه‌شنبه ۲۷ آبان',
        note: '۳ سانس خالی',
        slots: [
            reserved('0730', '07:30 - 09:00'),
            available('0900', '09:00 - 10:30', 420_000),
            available('1030', '10:30 - 12:00', 450_000),
            reserved('1200', '12:00 - 13:30'),
            available('1600', '16:00 - 17:30', 480_000),
            reserved('1730', '17:30 - 19:00'),
        ],
    },
    {
        id: 'wednesday',
        dateLabel: 'چهارشنبه ۲۸ آبان',
        note: '۴ سانس خالی',
        slots: [
            available('0730', '07:30 - 09:00', 420_000),
            available('0900', '09:00 - 10:30', 420_000),
            reserved('1030', '10:30 - 12:00'),
            available('1200', '12:00 - 13:30', 450_000),
            available('1730', '17:30 - 19:00', 480_000),
        ],
    },
    {
        id: 'thursday',
        dateLabel: 'پنج‌شنبه ۲۹ آبان (آخر هفته)',
        note: 'سانس‌های پرطرفدار',
        noteTone: 'highlight',
        slots: [
            reserved('0730', '07:30 - 09:00'),
            available('0900', '09:00 - 10:30', 480_000),
            reserved('1030', '10:30 - 12:00'),
            available('1200', '12:00 - 13:30', 480_000),
            reserved('1600', '16:00 - 17:30'),
            reserved('1730', '17:30 - 19:00'),
        ],
    },
    {
        id: 'friday',
        dateLabel: 'جمعه ۳۰ آبان (تعطیل)',
        note: 'تنها ۲ سانس باقی‌مانده',
        noteTone: 'highlight',
        slots: [
            reserved('0730', '07:30 - 09:00'),
            reserved('0900', '09:00 - 10:30'),
            available('1030', '10:30 - 12:00', 520_000),
            available('1200', '12:00 - 13:30', 520_000),
            reserved('1600', '16:00 - 17:30'),
        ],
    },
];

/** The court the booking bar refers to; the table only renders court 1. */
export const BOOKING_COURT_LABEL = 'کورت ۱';

/** Builds the sticky-bar summary from a selected Time Slot. */
export function toSelectedSlot(day: IFacilityDay, slot: TAvailableSlot): ISelectedSlot {
    return {
        key: `${day.id}:${slot.id}`,
        courtLabel: BOOKING_COURT_LABEL,
        dayLabel: day.badge === 'today' ? `امروز (${day.dateLabel})` : day.dateLabel,
        time: slot.time,
        price: slot.price,
        durationMinutes: 90,
    };
}

const DEFAULT_DAY = DAYS[0];
const DEFAULT_SLOT = DEFAULT_DAY.slots.find(
    (slot): slot is TAvailableSlot => slot.state === 'available' && slot.id === '1730',
);

if (!DEFAULT_SLOT) {
    throw new Error('The demo facility needs the default 17:30 Time Slot.');
}

/** Selected on first paint so the sticky bar matches the frame. */
export const DEFAULT_SELECTED_SLOT: ISelectedSlot = toSelectedSlot(DEFAULT_DAY, DEFAULT_SLOT);

/** The demo facility rendered for every `/facilities/[id]` until the detail API lands. */
export const FACILITY_DETAIL: IFacilityDetail = {
    name: 'باشگاه بین‌المللی پدل و تنیس اسپین نیاوران',
    address: 'تهران، نیاوران، خیابان مژده، بن‌بست یاس، پلاک ۱۲',
    mapHref: '/search',
    rating: 4.9,
    reviewCount: 128,
    freeSlotsToday: 4,
    sportLabel: 'پدل و تنیس خاکی',
    verifiedLabel: 'سالن تایید شده رسمی فدراسیون',
    specs: [
        {
            id: 'duration',
            label: 'سانس‌های ۹۰ دقیقه‌ای',
            icon: '/assets/icons/clock.svg',
            iconClassName: 'size-[11.667px]',
        },
        {
            id: 'courts',
            label: '۲ کورت پدل + ۱ تنیس خاکی',
            icon: '/assets/icons/search/court.svg',
            iconClassName: 'size-[11.667px]',
        },
        {
            id: 'cancel',
            label: 'امکان لغو تا ۲۴ ساعت قبل',
            icon: '/assets/icons/facility/cancel-policy.svg',
            iconClassName: 'h-[11.667px] w-[9.333px]',
        },
    ],
    description:
        'سالن استاندارد بین‌المللی با ۲ کورت پدل مجهز به شیشه‌های ضخیم ۱۲ میلی‌متری پانوراما بدون ستون، چمن مصنوعی موندو (مورد تایید WPT)، سیستم تهویه مطبوع هواساز با تنظیم دما و رطوبت، نورپردازی ویژه بدون خیرگی (۸۰۰ لوکس) و رختکن‌های اختصاصی VIP.',
    amenitiesHeading: 'امکانات و خدمات برگزیده مجموعه',
    amenities: AMENITIES,
    pricing: {
        label: 'نرخ پایه اجاره کورت کامل',
        amount: 480_000,
        unit: 'تومان / سانس ۹۰ دقیقه‌ای',
        guarantee: 'گارانتی تضمین بازگشت ۱۰۰٪ وجه در لغو مجاز',
    },
    reviewsHeading: 'دیدگاه و امتیاز بازیکنان',
    reviews: REVIEWS,
    schedule: {
        heading: 'جدول رزرواسیون هفتگی سانس‌ها',
        hint: 'برای انتخاب و ثبت، روی سانس آزاد مورد نظر کلیک نمایید.',
        courts: [
            { id: 'court-1', label: 'کورت شماره ۱ (پانوراما)' },
            { id: 'court-2', label: 'کورت شماره ۲ (کلاسیک)' },
        ],
        activeCourtId: 'court-1',
        weekLabel: 'هفته جاری: شنبه ۲۴ آبان تا جمعه ۳۰ آبان ۱۴۰۴',
        legend: [
            { id: 'free', label: 'آزاد (قابل رزرو)', tone: 'free' },
            { id: 'selected', label: 'انتخاب شما', tone: 'selected' },
            { id: 'reserved', label: 'رزرو شده / تکمیل', tone: 'reserved' },
        ],
        days: DAYS,
    },
    gallery: GALLERY,
};
