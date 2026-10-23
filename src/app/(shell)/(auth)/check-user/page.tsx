import type { Metadata } from 'next';

import { AuthSectionHeader } from '@/components/auth/auth-section-header';
import { CheckUserForm } from '@/features/auth/components/check-user-form';

export const metadata: Metadata = {
  title: 'بررسی شماره همراه | پرسو',
};

export default function CheckUserPage() {
  return (
    <div className="flex flex-col px-5 pt-8">
      <AuthSectionHeader
        icon="/assets/icons/phone-mobile.svg"
        title="بررسی شماره همراه"
        subtitle="جهت ورود یا ایجاد حساب کاربری در مجموعه ورزشی پرسو، لطفاً شماره تلفن همراه خود را وارد نمایید."
      />

      <CheckUserForm />

      {/* Figma "Trust & Quick Features Strip" — reserved space before the legal note. */}
      <div aria-hidden className="h-20" />
    </div>
  );
}
