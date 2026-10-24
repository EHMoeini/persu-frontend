import type { Metadata } from 'next';
import { Suspense } from 'react';

import { AuthSectionHeader } from '@/components/auth/auth-section-header';
import { parsePhone } from '@/features/auth/auth.phone';
import { UserCheckForm } from '@/features/auth/components/user-check-form';

export const metadata: Metadata = {
    title: 'بررسی شماره همراه | پرسو',
};

type TUserCheckPageProps = {
    searchParams: Promise<{ phone?: string }>;
};

export default function UserCheckPage({ searchParams }: TUserCheckPageProps) {
    return (
        <div className="flex flex-col px-5 pt-8">
            <AuthSectionHeader
                icon="/assets/icons/phone-mobile.svg"
                title="بررسی شماره همراه"
                subtitle="جهت ورود یا ایجاد حساب کاربری در مجموعه ورزشی پرسو، لطفاً شماره تلفن همراه خود را وارد نمایید."
            />

            <Suspense fallback={null}>
                <UserCheckContent searchParams={searchParams} />
            </Suspense>

            {/* Figma "Trust & Quick Features Strip" — reserved space before the legal note. */}
            <div aria-hidden className="h-20" />
        </div>
    );
}

/** Reads the optional `phone` search param so the static shell above can prerender. */
async function UserCheckContent({ searchParams }: TUserCheckPageProps) {
    const { phone } = await searchParams;
    const initialPhone = phone ? parsePhone(phone) : null;

    return <UserCheckForm initialPhone={initialPhone ?? undefined} />;
}
