import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SearchScreen } from '@/features/search/components/search-screen';

export const metadata: Metadata = {
    title: 'جستجوی مجموعه ورزشی | پرسو',
    description: 'جستجوی سالن‌ها و زمین‌های ورزشی بر اساس نام، منطقه و رشته ورزشی.',
};

export default function SearchPage() {
    return (
        <Suspense fallback={null}>
            <SearchScreen />
        </Suspense>
    );
}
