import type { Metadata } from 'next';

import { CircleBadge } from '@/components/ui/circle-badge';
import { StaticImage } from '@/components/ui/static-image';
import { CheckUserForm } from '@/features/auth/components/check-user-form';

export const metadata: Metadata = {
  title: 'بررسی شماره همراه | پرسو',
};

export default function CheckUserPage() {
  return (
    <div className="flex flex-col pt-6">
      <section className="flex flex-col items-center">
        <CircleBadge>
          <span className="relative h-7 w-4.75">
            <StaticImage
              src="/assets/icons/phone-mobile.svg"
              className="absolute inset-0 block size-full max-w-none"
            />
          </span>
        </CircleBadge>

        <div className="flex justify-center pt-5">
          <h1 className="text-center text-2xl leading-8 font-bold tracking-tight text-foreground">
            بررسی شماره همراه
          </h1>
        </div>

        <div className="flex justify-center pt-2">
          <p className="max-w-80 text-center text-sm leading-6 text-foreground-muted">
            جهت ورود یا ایجاد حساب کاربری در مجموعه ورزشی پرسو، لطفاً شماره تلفن همراه خود را وارد
            نمایید.
          </p>
        </div>
      </section>

      <div className="pt-6">
        <CheckUserForm />
      </div>

      {/* Figma "Trust & Quick Features Strip" — reserved space before the legal note. */}
      <div aria-hidden className="h-20" />
    </div>
  );
}
