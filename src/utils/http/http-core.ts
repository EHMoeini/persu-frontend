import { devLog } from '../logger.util';

type BuildHeaders = () => HeadersInit | Promise<HeadersInit>;
type Method = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type HttpErrorInput = {
    method: Method;
    path: string;
    url: string;
    status: number;
    statusText: string;
    code?: string;
    response?: unknown;
};

export class HttpError extends Error {
    method: Method;
    path: string;
    url: string;
    status: number;
    statusText: string;
    code?: string;
    response?: unknown;

    constructor(input: HttpErrorInput) {
        super(`HTTP ${input.status} ${input.path}`);
        this.name = 'HttpError';
        this.method = input.method;
        this.path = input.path;
        this.url = input.url;
        this.status = input.status;
        this.statusText = input.statusText;
        this.code = input.code;
        this.response = input.response;
    }
}

export function isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError;
}

const GET_TIMEOUT_MS = 10_000;
const WRITE_TIMEOUT_MS = 30_000;

type TApiErrorBody = {
    error?: {
        code?: string;
        message?: string;
    };
    error_code?: number | string;
    message?: string;
};

export function createHttp(baseUrl?: string, buildHeaders: BuildHeaders = () => ({})) {
    async function send<T>(
        method: Method,
        path: string,
        body?: unknown,
        init: RequestInit = {},
    ): Promise<T> {
        const controller = new AbortController();
        const timeout = setTimeout(
            () => controller.abort(),
            method === 'GET' ? GET_TIMEOUT_MS : WRITE_TIMEOUT_MS,
        );

        if (init.signal) {
            init.signal.addEventListener('abort', () => controller.abort());
        }

        const url = joinUrl(baseUrl, path);

        try {
            // Merge headers from buildHeaders() with per-call init.headers.
            const mergedHeaders = new Headers(await buildHeaders());
            new Headers(init.headers as HeadersInit | undefined).forEach((value, key) => {
                mergedHeaders.set(key, value);
            });
            mergedHeaders.set('Accept', 'application/json');

            // Normalize request body.
            let finalBody = init.body as BodyInit | undefined;
            if (body !== undefined) {
                if (
                    typeof body === 'string' ||
                    body instanceof Blob ||
                    body instanceof FormData ||
                    body instanceof URLSearchParams
                ) {
                    finalBody = body;
                } else {
                    if (!mergedHeaders.has('Content-Type')) {
                        mergedHeaders.set('Content-Type', 'application/json');
                    }
                    finalBody = JSON.stringify(body);
                }
            }

            const finalInit: RequestInit = {
                method,
                ...init,
                headers: mergedHeaders,
                body: finalBody,
                signal: controller.signal,
                cache: 'no-store',
            };

            devLog('-> [HTTP Request]', { method, url });

            const res = await fetch(url, finalInit);

            let data: unknown = null;
            if (res.status !== 204) {
                try {
                    data = await res.json();
                } catch (error) {
                    if (controller.signal.aborted) throw error;
                }
            }

            const errorBody = data as TApiErrorBody | null;
            const errorCode = errorBody?.error?.code;
            const legacyErrorCode = errorBody?.error_code;
            const serverMessage = errorBody?.error?.message ?? errorBody?.message;
            const statusCode = !res.ok
                ? res.status
                : legacyErrorCode !== undefined
                  ? Number(legacyErrorCode) || res.status
                  : res.status;

            if (!res.ok || (legacyErrorCode !== undefined && legacyErrorCode !== 0)) {
                throw new HttpError({
                    method,
                    path,
                    url,
                    status: statusCode,
                    statusText: serverMessage ?? res.statusText,
                    code:
                        errorCode ??
                        (legacyErrorCode !== undefined ? String(legacyErrorCode) : undefined),
                    response: data,
                });
            }

            devLog('<- [HTTP Response]', { url, status: res.status });
            return data as T;
        } catch (err) {
            if (err instanceof Error && err.name === 'AbortError') {
                throw new HttpError({
                    method,
                    path,
                    url,
                    status: 408,
                    statusText: 'Request Timeout',
                });
            }
            throw err;
        } finally {
            clearTimeout(timeout);
        }
    }

    return {
        get: <T>(path: string, init?: RequestInit) => send<T>('GET', path, undefined, init),
        post: <T>(path: string, body?: unknown, init?: RequestInit) =>
            send<T>('POST', path, body, init),
        put: <T>(path: string, body?: unknown, init?: RequestInit) =>
            send<T>('PUT', path, body, init),
        patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
            send<T>('PATCH', path, body, init),
        delete: <T>(path: string, init?: RequestInit) => send<T>('DELETE', path, undefined, init),
    };
}

function joinUrl(baseUrl: string | undefined, path: string): string {
    if (!baseUrl) return path;
    return baseUrl.endsWith('/') || path.startsWith('/')
        ? `${baseUrl}${path.replace(/^\/+/, '')}`
        : `${baseUrl}/${path}`;
}
