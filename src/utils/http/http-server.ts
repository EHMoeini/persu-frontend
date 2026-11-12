import { unstable_noStore as noStore } from 'next/cache';
import { redirect } from 'next/navigation';

import { API_BASE_URL } from '@/constants/api.constant';

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

export const httpRaw = createHttp(API_BASE_URL, buildServerHeaders);

export const http = {
    get: <T>(path: string, init?: RequestInit) => safeRequest(httpRaw.get<T>(path, init)),
    post: <T>(path: string, body?: unknown, init?: RequestInit) =>
        safeRequest(httpRaw.post<T>(path, body, init)),
    put: <T>(path: string, body?: unknown, init?: RequestInit) =>
        safeRequest(httpRaw.put<T>(path, body, init)),
    delete: <T>(path: string, init?: RequestInit) => safeRequest(httpRaw.delete<T>(path, init)),
};
