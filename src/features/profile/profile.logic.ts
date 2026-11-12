import type { IPlusMembership, IProfile, IProfileMenuItem, IWalletSummary } from './profile.models';

/**
 * Mock account data until the profile endpoints land. Pure constants only, so
 * this file stays testable and free of I/O.
 */
export const PROFILE_MOCK: IProfile = {
    phone: '+989123456789',
    role: 'ورزشکار',
    avatarSrc: '/assets/images/avatar-placeholder.svg',
};

export const WALLET_MOCK: IWalletSummary = {
    balance: 1_450_000,
};

export const PLUS_MEMBERSHIP_MOCK: IPlusMembership = {
    statusLabel: 'فعال',
    title: 'حساب کاربری پرسو پلاس',
    description: 'دسترسی به تخفیف‌های ویژه سانس‌ها و رزرو اختصاصی',
};

/** Hrefs are placeholders for routes that have not been built yet. */
export const PROFILE_MENU_ITEMS: readonly IProfileMenuItem[] = [
    {
        id: 'teammates',
        label: 'لیست هم‌بازی‌ها',
        href: '/teammates',
        icon: '/assets/icons/profile/teammates.svg',
        iconClassName: 'h-[13.333px] w-[18.333px]',
    },
    {
        id: 'favorites',
        label: 'علاقه‌مندی‌ها',
        href: '/favorites',
        icon: '/assets/icons/profile/favorites.svg',
        iconClassName: 'h-[15.292px] w-[16.667px]',
    },
    {
        id: 'support-center',
        label: 'مرکز پشتیبانی',
        href: '/support',
        icon: '/assets/icons/landing/support-headset.svg',
        iconClassName: 'h-[15px] w-[16.667px]',
    },
    {
        id: 'support-request',
        label: 'درخواست پشتیبانی',
        href: '/support/request',
        icon: '/assets/icons/profile/support-request.svg',
        iconClassName: 'size-[16.667px]',
    },
];

const PERSIAN_DIGITS = '۰۱۲۳۴۵۶۷۸۹';
const TOMAN_FORMATTER = new Intl.NumberFormat('en-US');
const PHONE_PATTERN = /^\+(\d{2})(\d{3})(\d{3})(\d{4})$/;

/** Renders Latin digits as Persian digits. Pure. */
export function toPersianDigits(value: string): string {
    return value.replace(/[0-9]/g, (digit) => PERSIAN_DIGITS[Number(digit)]);
}

/** Latin grouping (۱,۴۵۰,۰۰۰) + Persian digits, matching the design. */
export function formatToman(amount: number): string {
    return toPersianDigits(TOMAN_FORMATTER.format(amount));
}

/** Formats a canonical `+98…` phone for display in Persian digits. */
export function formatPhone(phone: string): string {
    const match = PHONE_PATTERN.exec(phone);
    if (!match) return toPersianDigits(phone);

    return `+${toPersianDigits(match[1])} ${toPersianDigits(match[2])} ${toPersianDigits(
        match[3],
    )} ${toPersianDigits(match[4])}`;
}
