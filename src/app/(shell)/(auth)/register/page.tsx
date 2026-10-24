import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { AuthSectionHeader } from '@/components/auth/auth-section-header';
import { isValidIranianMobile } from '@/features/auth/auth.logic';
import { RegisterForm } from '@/features/auth/components/register-form';

export const metadata: Metadata = {
    title: 'ایجاد حساب کاربری | پرسو',
};

type TRegisterPageProps = {
    searchParams: Promise<{ phone?: string }>;
};

export default function RegisterPage({ searchParams }: TRegisterPageProps) {
    return (
        <div className="flex flex-col px-5 pt-8">
            <Suspense fallback={null}>
                <RegisterContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

async function RegisterContent({ searchParams }: TRegisterPageProps) {
    const { phone } = await searchParams;

    if (!phone || !isValidIranianMobile(phone)) {
        redirect('/user-check');
    }

    return (
        <>
            <AuthSectionHeader
                icon="/assets/icons/user-plus.svg"
                title="ایجاد حساب کاربری"
                subtitle="برای رزرو آسان زمین‌ها و سالن‌های ورزشی ثبت‌نام کنید."
            />

            <RegisterForm phone={phone} />
        </>
    );
}
