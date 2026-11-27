import type { Metadata } from 'next';

import { FacilityScreen } from '@/features/facility/components/facility-screen';

export const metadata: Metadata = {
    title: 'باشگاه بین‌المللی پدل و تنیس اسپین نیاوران | پرسو',
    description: 'جزئیات مجموعه، امکانات، دیدگاه بازیکنان و جدول رزرواسیون هفتگی سانس‌ها.',
};

export default function FacilityPage() {
    return <FacilityScreen />;
}
