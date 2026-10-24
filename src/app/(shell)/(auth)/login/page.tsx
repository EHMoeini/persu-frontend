import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { isValidIranianMobile } from '@/features/auth/auth.logic';
import { LoginFlow } from '@/features/auth/components/login-flow';

export const metadata: Metadata = {
    title: 'ورود به حساب کاربری | پرسو',
};

type TLoginPageProps = {
    searchParams: Promise<{ phone?: string }>;
};

export default function LoginPage({ searchParams }: TLoginPageProps) {
    return (
        <div className="flex flex-col px-5 pt-8">
            <Suspense fallback={null}>
                <LoginContent searchParams={searchParams} />
            </Suspense>
        </div>
    );
}

async function LoginContent({ searchParams }: TLoginPageProps) {
    const { phone } = await searchParams;

    if (!phone || !isValidIranianMobile(phone)) {
        redirect('/user-check');
    }

    return <LoginFlow phone={phone} />;
}
