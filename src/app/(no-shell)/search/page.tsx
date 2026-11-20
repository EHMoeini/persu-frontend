import type { Metadata } from 'next';
import { Suspense } from 'react';

import { SearchScreen, SearchScreenFallback } from '@/features/search/components/search-screen';

export const metadata: Metadata = {
    title: 'جستجوی مجموعه ورزشی | پرسو',
    description: 'جستجوی سالن‌ها و زمین‌های ورزشی با فیلتر ورزش، قیمت، امتیاز و سانس خالی.',
};

export default function SearchPage() {
    return (
        <Suspense fallback={<SearchScreenFallback />}>
            <SearchScreen />
        </Suspense>
    );
}
