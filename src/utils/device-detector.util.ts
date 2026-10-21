import {
  IDeviceInfo,
  TDetectedBrowser,
  TDetectedDeviceType,
  TDetectedOS,
} from '@/models/device.model';

// Tables of (value, regex) for each category, first match wins.
const OS_PATTERNS: Array<[TDetectedOS, RegExp]> = [
  ['Android', /android/],
  ['iOS', /iphone|ipad|ipod/i],
  ['Windows', /windows phone|win(dows)?/],
  ['macOS', /macintosh|mac os x|mac_powerpc/],
  ['Linux', /linux/],
];

const DEVICE_TYPE_PATTERNS: Array<[TDetectedDeviceType, RegExp]> = [
  ['Bot', /bot|crawler|spider|crawl|googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot/i],
  ['TV', /tv|smarttv|googletv|crkey|appletv|roku|tizen|webos|hbbtv|pov_tv|netcast|viera/i],
  ['Tablet', /ipad|tablet|(android(?!.*mobi))|kindle|playbook|silk\//i],
  [
    'Mobile',
    /mobi|ip(hone|od)|windows phone|iemobile|mobile|opera mini|opera mobi|skyfire|maemo|nokia|sonyericsson|samsung|lg|htc|mot|meego|fennec|series60|symbianos|blackberry|bb10|playstation portable|nintendo(ds|3ds|wiiu)/i,
  ],
];

const BROWSER_PATTERNS: Array<[TDetectedBrowser, RegExp]> = [
  ['DuckDuckGo', /(duckduckgo\/|ddg\/)/],
  ['Edge', /edg(e|a|ios)?\//],
  ['SamsungBrowser', /samsungbrowser\//],
  ['Vivaldi', /vivaldi\//],
  ['Yandex', /(yabrowser\/|yandex)/],
  ['UCBrowser', /(ucbrowser\/|ucweb\/)/],
  ['Opera', /(opr\/|opera|opt\/)/],
  ['Firefox', /(firefox\/|fxios\/)/],
  ['IE', /(trident\/|msie)/],
  ['Chrome', /(chrome\/|crios\/)/],
  ['Chromium', /chromium\//],
  ['Safari', /safari\//],
  // Android WebView usually has "wv".
  ['WebView', /\bwv\b/],
];

function matchFirst<T>(tables: Array<[T, RegExp]>, ua: string): T | 'Unknown' {
  for (const [value, regex] of tables) {
    if (regex.test(ua)) return value;
  }
  return 'Unknown';
}

export function parseUserAgentForDeviceInfo(userAgent?: string | null): IDeviceInfo {
  const rawUA = userAgent ?? '';
  const ua = rawUA.toLowerCase();
  const detectBrand = (input: string): 'Samsung' | 'Other' =>
    /sm/i.test(input) ? 'Samsung' : 'Other';

  if (!ua) {
    return {
      os: 'Unknown',
      deviceType: 'Unknown',
      browser: 'Unknown',
      userAgent: null,
      brand: 'Other',
    };
  }

  const os = matchFirst(OS_PATTERNS, ua);
  const deviceType = matchFirst(DEVICE_TYPE_PATTERNS, ua) ?? 'Desktop';
  const browser = matchFirst(BROWSER_PATTERNS, ua);
  const brand = detectBrand(rawUA);

  return {
    os,
    deviceType: deviceType === 'Unknown' ? 'Desktop' : deviceType,
    browser,
    userAgent: rawUA,
    brand,
  };
}

export function getDeviceInfo(userAgentOverride?: string): IDeviceInfo {
  if (typeof window !== 'undefined' && window.navigator && !userAgentOverride) {
    return parseUserAgentForDeviceInfo(window.navigator.userAgent);
  }
  return parseUserAgentForDeviceInfo(userAgentOverride ?? null);
}
