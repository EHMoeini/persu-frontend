import type { Metadata } from 'next';

import ErrorComponent from '@/components/error/error-component';

// Must be a page: notFound() cannot be called from client components.

export const metadata: Metadata = {
    title: '500 - Server error',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <ErrorComponent statusCode={500} />;
}
