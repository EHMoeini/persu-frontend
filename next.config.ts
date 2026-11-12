import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    output: 'standalone',
    /* config options here */
    experimental: {
        agentFeedback: true,
    },
    cacheComponents: false,
    partialPrefetching: false,
    // Trailing slashes are normalized in proxy.ts so the redirect can be marked
    // no-store; the built-in redirect would run before proxy and stay cacheable.
    skipTrailingSlashRedirect: true,
    turbopack: {
        rules: {
            '*.css': {
                // CSS modules must go through Turbopack's built-in module
                // transform, otherwise their class-name exports are empty.
                condition: { not: { path: '*.module.css' } },
                loaders: ['@tailwindcss/turbopack'],
                as: '*.css',
            },
        },
    },
};

export default nextConfig;
