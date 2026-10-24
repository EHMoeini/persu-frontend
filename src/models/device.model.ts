export type TDetectedOS = 'Windows' | 'macOS' | 'Linux' | 'Android' | 'iOS' | 'Unknown';

export type TDetectedDeviceType = 'Desktop' | 'Mobile' | 'Tablet' | 'TV' | 'Bot' | 'Unknown';

export type TDetectedBrowser =
    | 'Chrome'
    | 'Firefox'
    | 'Safari'
    | 'Edge'
    | 'Opera'
    | 'IE'
    | 'SamsungBrowser'
    | 'DuckDuckGo'
    | 'Vivaldi'
    | 'Yandex'
    | 'UCBrowser'
    | 'Chromium'
    | 'WebView'
    | 'Unknown';

export interface IDeviceInfo {
    os: TDetectedOS;
    deviceType: TDetectedDeviceType;
    browser: TDetectedBrowser;
    userAgent: string | null;
    brand?: 'Samsung' | 'Other';
}
