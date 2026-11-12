import type { Metadata } from 'next';

import NotFound from '@/components/not-found/not-found';

// Must be a page: notFound() cannot be called from client components.

export const metadata: Metadata = {
    title: '404 - Page not found',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <NotFound />;
}
