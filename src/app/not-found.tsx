import type { Metadata } from 'next';

import NotFound from '@/components/not-found/not-found';

export const metadata: Metadata = {
    title: '404 - Page not found',
    robots: { index: false, follow: false },
};

export default function NotFoundPage() {
    return <NotFound />;
}
