import type { Metadata } from 'next';

import ErrorComponent from '@/components/error/error-component';

export const metadata: Metadata = {
    title: 'Offline',
    robots: { index: false, follow: false },
};

export default function Page() {
    return <ErrorComponent statusCode={0} />;
}
