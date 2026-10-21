'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';

let browserQueryClient: QueryClient | undefined;

function getQueryClient(): QueryClient {
  // Server: a fresh client per render keeps one user's query data out of the
  // next user's request. Browser: one client for the lifetime of the tab.
  if (typeof window === 'undefined') return new QueryClient();
  browserQueryClient ??= new QueryClient();
  return browserQueryClient;
}

export function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={getQueryClient()}>{children}</QueryClientProvider>;
}
