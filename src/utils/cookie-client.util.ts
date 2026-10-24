import { isBrowser } from './shared.util';

export type ClientCookieOptions = {
    /** Days until expiry. */
    expires?: number;
    path?: string;
    domain?: string;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
};

function readCookie(name: string): string | undefined {
    const prefix = `${encodeURIComponent(name)}=`;
    const match = document.cookie.split('; ').find((row) => row.startsWith(prefix));
    return match ? decodeURIComponent(match.slice(prefix.length)) : undefined;
}

export function getClientCookie(name: string): string | undefined {
    try {
        if (isBrowser()) return readCookie(name);
    } catch {
        // Privacy modes and sandboxed documents may reject cookie access.
    }

    return undefined;
}

export function setClientCookie(
    name: string,
    value: string,
    options: ClientCookieOptions = {},
): void {
    try {
        if (!isBrowser()) return;

        const parts = [`${encodeURIComponent(name)}=${encodeURIComponent(value)}`];
        const { expires, path = '/', domain, secure, sameSite } = options;

        if (typeof expires === 'number') {
            const date = new Date();
            date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1000);
            parts.push(`expires=${date.toUTCString()}`);
        }
        if (path) parts.push(`path=${path}`);
        if (domain) parts.push(`domain=${domain}`);
        if (secure) parts.push('secure');
        if (sameSite) parts.push(`samesite=${sameSite}`);

        document.cookie = parts.join('; ');
    } catch {
        // Cookie persistence is optional; callers must continue without it.
    }
}

export function hasClientCookie(name: string): boolean {
    try {
        if (isBrowser()) return typeof readCookie(name) !== 'undefined';
    } catch {
        // Treat inaccessible cookie storage as empty.
    }

    return false;
}

export function deleteClientCookie(name: string, options: ClientCookieOptions = {}): void {
    setClientCookie(name, '', { ...options, expires: -1 });
}
