import {
    APP_VERSION,
    DEFAULT_LOCALE,
    DEFAULT_PLATFORM,
    DEFAULT_SECONDS_FROM_UTC,
} from '@/constants/global.constant';

export type TCommonHeaderOptions = {
    appVersion?: string;
    locale?: string;
    platform?: string;
    secondsFromUtc?: number;
};

export function buildCommonHeaders(opts: TCommonHeaderOptions = {}): Record<string, string> {
    const {
        appVersion = APP_VERSION,
        locale = DEFAULT_LOCALE,
        platform = DEFAULT_PLATFORM,
        secondsFromUtc = DEFAULT_SECONDS_FROM_UTC,
    } = opts;

    return {
        'X-App-Version': appVersion,
        'x-platform': platform,
        'X-Client-Locale': locale,
        'x-seconds-from-utc': String(secondsFromUtc),
    };
}
