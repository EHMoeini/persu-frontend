import { NextRequest, NextResponse } from 'next/server';

import {
    DEVICE_ID_COOKIE,
    DEVICE_ID_HEADER,
    DEVICE_INFO_HEADER,
} from '@/constants/global.constant';
import { getDeviceInfo } from '@/utils/device-detector.util';

const PRIVATE_NO_STORE = 'private, no-cache, no-store, max-age=0, must-revalidate';

// Directories under /public. A file-like path under one of these resolves to a
// real static asset and keeps the static handler's own caching. Extend when
// new public asset directories appear.
const PUBLIC_ASSET_DIRECTORIES = new Set(['fonts', 'icons', 'images', 'styles']);

// The last segment looks like a file (has an extension).
function isFileLikePath(pathname: string): boolean {
    const lastSegment = pathname.slice(pathname.lastIndexOf('/') + 1);
    return /\.[\w]+$/.test(lastSegment);
}

function isPublicAssetPath(pathname: string): boolean {
    return PUBLIC_ASSET_DIRECTORIES.has(pathname.split('/')[1]);
}

export async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const requestHeaders = new Headers(req.headers);

    // Real client IP: the first hop of x-forwarded-for wins.
    const forwardedFor = req.headers.get('x-forwarded-for');
    const realIp = forwardedFor?.split(',')[0] ?? req.headers.get('x-real-ip') ?? '';
    if (realIp) {
        requestHeaders.set('X-Real-IP', realIp);
    }

    // Device info parsed once here, readable from any server component as JSON.
    const ua = req.headers.get('user-agent') ?? undefined;
    requestHeaders.set(DEVICE_INFO_HEADER, JSON.stringify(getDeviceInfo(ua)));

    // Identity cookies become request headers: layouts cannot read every cookie
    // position, but forwarded headers are always available. The same pattern
    // applies to any other identity cookie (session, ...).
    const deviceId = req.cookies.get(DEVICE_ID_COOKIE)?.value;
    if (deviceId) {
        requestHeaders.set(DEVICE_ID_HEADER, deviceId);
    } else {
        requestHeaders.delete(DEVICE_ID_HEADER);
    }

    // Trailing slashes are normalized here instead of Next's own redirect so the
    // response can be marked no-store. The built-in one is disabled with
    // `skipTrailingSlashRedirect: true` in next.config.
    const trimmedPathname = pathname.length > 1 ? pathname.replace(/\/+$/, '') || '/' : pathname;

    if (trimmedPathname !== pathname) {
        const redirectResponse = NextResponse.redirect(
            new URL(trimmedPathname + req.nextUrl.search, req.url),
            { status: 308 },
        );
        redirectResponse.headers.set('Cache-Control', PRIVATE_NO_STORE);
        return redirectResponse;
    }

    const res = NextResponse.next({ request: { headers: requestHeaders } });

    // A file-like path resolves to a public file or to the catch-all's 404, and
    // proxy cannot tell which. Neither may inherit a page's cache headers, so
    // only known public directories keep the static handler's own caching.
    if (isFileLikePath(trimmedPathname)) {
        if (!isPublicAssetPath(trimmedPathname)) {
            res.headers.set('Cache-Control', PRIVATE_NO_STORE);
        }
        return res;
    }

    return res;
}

export const config = {
    // File-like requests must reach proxy so they can be rejected or marked
    // no-store before rendering; known root files still bypass it.
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.[\\w]+$).*)',
        '/((?!api(?:/|$)|_next(?:/|$)|(?:favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest)$|.*(?:\\.rsc|\\.segments)$).*\\.[\\w]+$)',
    ],
};
