'use client';

import { isBrowser } from '../shared.util';
import { snackbarEvents } from '../snackbar-events.util';
import { buildCommonHeaders } from './http-common-headers';
import { createHttp, isHttpError } from './http-core';

const STATUS_REDIRECT: Record<number, string> = {
  404: '/errors/404',
};

const OFFLINE_REDIRECT = '/errors/offline';

const isOffline = () => typeof navigator !== 'undefined' && navigator.onLine === false;

const navigate = (route: string) => {
  if (window.location.pathname === route) return;
  window.location.assign(route);
};

type TRequestOptions = { skipErrorRedirect?: boolean };

const handleClientHttpError = async (error: unknown, opts?: TRequestOptions): Promise<never> => {
  if (isHttpError(error)) {
    if (error.status === 429) {
      snackbarEvents.emit('Too many requests, try again in a moment.');
    }

    const route = STATUS_REDIRECT[error.status];
    if (route && !opts?.skipErrorRedirect) {
      navigate(route);
    }
  } else if (isOffline()) {
    navigate(OFFLINE_REDIRECT);
  }

  throw error;
};

const buildClientHeaders = (): HeadersInit => {
  // Add identity headers here (device id, session token, ...).
  return buildCommonHeaders({
    secondsFromUtc: -new Date().getTimezoneOffset() * 60,
  });
};

export const createBrowserHttp = (baseUrl?: string) => {
  const base = createHttp(baseUrl, buildClientHeaders);

  const safeRequest = async <T>(request: () => Promise<T>, opts?: TRequestOptions): Promise<T> => {
    try {
      return await request();
    } catch (error) {
      return await handleClientHttpError(error, opts);
    }
  };

  return {
    get: <T>(path: string, init?: RequestInit, opts?: TRequestOptions) => {
      assertBrowser();
      return safeRequest(() => base.get<T>(path, init), opts);
    },
    post: <T>(path: string, body?: unknown, init?: RequestInit, opts?: TRequestOptions) => {
      assertBrowser();
      return safeRequest(() => base.post<T>(path, body, init), opts);
    },
    put: <T>(path: string, body?: unknown, init?: RequestInit, opts?: TRequestOptions) => {
      assertBrowser();
      return safeRequest(() => base.put<T>(path, body, init), opts);
    },
    delete: <T>(path: string, init?: RequestInit, opts?: TRequestOptions) => {
      assertBrowser();
      return safeRequest(() => base.delete<T>(path, init), opts);
    },
  };
};

export const httpClient = createBrowserHttp();
export const httpBaseUrlClient = createBrowserHttp(process.env.NEXT_PUBLIC_API_BASE_URL);

const assertBrowser = () => {
  if (!isBrowser()) {
    throw new Error('httpClient can only be used in the browser');
  }
};
