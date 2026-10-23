import type { NextConfig } from 'next';

import routesConfig from './routes.config.cjs';

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,
  // Trailing slashes are normalized in proxy.ts so the redirect can be marked
  // no-store; the built-in redirect would run before proxy and stay cacheable.
  skipTrailingSlashRedirect: true,
  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
  async rewrites() {
    return routesConfig.buildAllTabRewrites();
  },
};

export default nextConfig;
