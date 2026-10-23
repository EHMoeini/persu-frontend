import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

import { AuthSectionHeader } from '@/components/auth/auth-section-header';
import { isValidIranianMobile } from '@/features/auth/auth.logic';
import { OtpForm } from '@/features/auth/components/otp-form';

export const metadata: Metadata = {
  title: 'تایید شماره موبایل | پرسو',
};

type TOtpPageProps = {
  searchParams: Promise<{ phone?: string }>;
};

export default function OtpPage({ searchParams }: TOtpPageProps) {
  return (
    <div className="flex flex-col px-5 pt-8">
      <Suspense fallback={null}>
        <OtpContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function OtpContent({ searchParams }: TOtpPageProps) {
  const { phone } = await searchParams;

  if (!phone || !isValidIranianMobile(phone)) {
    redirect('/user-check');
  }

  return (
    <>
      <AuthSectionHeader
        icon="/assets/icons/mail-check.svg"
        title="تایید شماره موبایل"
        subtitle="کد اعتبارسنجی پیامک شده به شماره زیر را وارد کنید"
      />

      <OtpForm phone={phone} />
    </>
  );
}
