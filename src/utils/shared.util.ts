/**
 * Returns true if running in the browser, false during SSR/Node.
 */
export function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof window.document !== 'undefined';
}

/**
 * Timezone offset in seconds ahead of UTC (browser only; false during SSR).
 * Send it as a request header so servers can render times in the client's zone.
 */
export function getSecondsFromUTC(format?: 'number'): number;
export function getSecondsFromUTC(format?: string): string | false;
export function getSecondsFromUTC(format?: string): number | string | false {
  if (typeof window === 'undefined') {
    return false;
  }
  const seconds = new Date().getTimezoneOffset() * -60;
  return format === 'number' ? seconds : seconds.toString();
}

/**
 * Replace all occurrences of a string.
 */
export function replaceAll(str: string, find: string, replace: string): string {
  return str.replace(new RegExp(find, 'g'), replace);
}

export function urlEncode(key: string): string {
  return encodeURIComponent(key);
}

/**
 * Parses a `key=value; key=value` header into an object of numbers.
 */
export function parseHeader(header: string): Record<string, number> | null {
  if (!header) {
    console.warn('header is not present');
    return null;
  }

  const result: Record<string, number> = {};
  for (const element of header.split('; ')) {
    if (element) {
      const [key, value] = element.split('=');
      result[key] = +value;
    }
  }
  return result;
}

// Truncates text at the given limit without breaking a word.
export function stringTruncate(text: string | undefined, limit: number, suffix = ''): string {
  if (!text) return '';
  if (text.length <= limit) return text;

  const cut = text.substring(0, limit);
  const lastSpace = cut.lastIndexOf(' ');
  return (lastSpace !== -1 ? cut.substring(0, lastSpace) : cut) + suffix;
}

export function hasWebShareAPI(): boolean {
  return typeof navigator !== 'undefined' && !!navigator.share;
}

/**
 * Share buttons hand over canonical paths, but a bare path copied to the
 * clipboard is dead once pasted anywhere else — make it absolute. Plain
 * concatenation keeps non-latin slugs readable instead of percent-encoded.
 */
export function toAbsoluteShareUrl(url: string, origin: string): string {
  return url.startsWith('/') ? origin + url : url;
}

export async function nativeShare(title: string, url: string): Promise<void> {
  if (typeof navigator === 'undefined') return;

  const shareUrl =
    typeof window !== 'undefined' ? toAbsoluteShareUrl(url, window.location.origin) : url;
  const shareText = `${title}\n${shareUrl}`;

  if (hasWebShareAPI() && typeof navigator.share === 'function') {
    try {
      // The Web Share API serializes `url`, which percent-encodes non-latin
      // slugs in the receiving app. Text is handed over verbatim.
      await navigator.share({ title, text: shareText });
      return;
    } catch (e) {
      console.error(e);
      return;
    }
  }

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(shareText);
    } else {
      console.warn('Clipboard API not available');
    }
  } catch (e) {
    console.error(e);
  }
}

/**
 * Sanitize a redirect target to prevent open redirects: relative paths or
 * same-origin URLs only; anything else falls back.
 */
export function pickSafeRedirect(
  params: URLSearchParams,
  fallback = '/',
): { url: string; isExternal: boolean } {
  const raw = params.get('from')?.trim() || '';
  if (!raw) return { url: fallback, isExternal: false };

  if (raw.startsWith('/')) {
    return { url: raw, isExternal: false };
  }

  try {
    const u = new URL(raw, window.location.origin);
    if (u.origin === window.location.origin) {
      const relative = u.pathname + u.search + u.hash;
      return { url: relative || fallback, isExternal: false };
    }
    return { url: fallback, isExternal: false };
  } catch {
    return { url: fallback, isExternal: false };
  }
}

/**
 * Serializes JSON-LD for an inline script without allowing content values to
 * terminate the script element.
 */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
