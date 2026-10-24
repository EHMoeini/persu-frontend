import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { buildCommonHeaders } from './http-common-headers';
import { createHttp, type HttpError } from './http-core';

const STATUS_REDIRECT: Record<number, string> = {
    // 401: '/errors/401',
};

// Add identity headers here (cookies, session token, ...). Kept async so
// cookie access can be awaited.
const buildServerHeaders = async (): Promise<HeadersInit> => {
    return buildCommonHeaders();
};

export type SafeResult<T> = { data: T; error: null } | { data: null; error: HttpError };

// Page-defining fetches are awaited in a layout, above the segment's streaming
// boundary. Throwing there ends the request as a real 5xx instead of an error
// document streamed under an already-committed HTTP 200.
export function requireResult<T>(result: SafeResult<T>): T {
    if (result.error) throw result.error;
    return result.data;
}

function rethrowNextControlFlow(error: unknown): void {
    if (error && typeof error === 'object' && 'digest' in error) {
        const digest = (error as { digest?: string }).digest;
        if (
            typeof digest === 'string' &&
            (digest.startsWith('NEXT_REDIRECT') || digest.startsWith('NEXT_NOT_FOUND'))
        ) {
            throw error;
        }
    }
}

const safeRequest = async <T>(request: Promise<T>): Promise<T> => {
    try {
        return await request;
    } catch (error) {
        noStore();
        rethrowNextControlFlow(error);

        const httpError = error as HttpError;
        const route = STATUS_REDIRECT[httpError.status];
        if (route) redirect(route);

        throw httpError;
    }
};

const safeRequestResult = async <T>(request: Promise<T>): Promise<SafeResult<T>> => {
    try {
        const data = await request;
        return { data, error: null };
    } catch (error) {
        noStore();
        rethrowNextControlFlow(error);

        const httpError = error as HttpError;
        const route = STATUS_REDIRECT[httpError.status];
        if (route) redirect(route);

        return { data: null, error: httpError };
    }
};

export const httpRaw = createHttp(process.env.API_BASE_URL, buildServerHeaders);

export const http = {
    get: <T>(path: string, init?: RequestInit) => safeRequest(httpRaw.get<T>(path, init)),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
        safeRequest(httpRaw.post<T>(path, body, init)),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
        safeRequest(httpRaw.put<T>(path, body, init)),
    delete: <T>(path: string, init?: RequestInit) => safeRequest(httpRaw.delete<T>(path, init)),
};

// For components — returns { data, error } for local error UI.
export const httpSafe = {
    get: <T>(path: string, init?: RequestInit) => safeRequestResult(httpRaw.get<T>(path, init)),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
        safeRequestResult(httpRaw.post<T>(path, body, init)),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
        safeRequestResult(httpRaw.put<T>(path, body, init)),
    delete: <T>(path: string, init?: RequestInit) =>
        safeRequestResult(httpRaw.delete<T>(path, init)),
};
