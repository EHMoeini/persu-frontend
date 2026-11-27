/** TanStack Query keys. One entry per cached resource. */
export const QUERY_KEYS = {
    AUTH_SESSION: ['AUTH_SESSION'] as const,
    PROFILE: ['PROFILE'] as const,
    FACILITY_SEARCH: (query: string) => ['FACILITY_SEARCH', query] as const,
} as const;
