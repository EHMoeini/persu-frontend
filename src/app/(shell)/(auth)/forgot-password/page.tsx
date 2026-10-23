import type { Metadata } from 'next';

import { AuthSectionHeader } from '@/components/auth/auth-section-header';
import { Card } from '@/components/ui/card';

export const metadata: Metadata = {
  title: 'فراموشی کلمه عبور | پرسو',
};

export default function ForgotPasswordPage() {
  return (
    <div className="flex flex-col px-5 pt-8">
      <AuthSectionHeader
        icon="/assets/icons/lock.svg"
        title="فراموشی کلمه عبور"
        subtitle="بازیابی کلمه عبور به‌زودی در دسترس قرار می‌گیرد."
      />

      <Card>
        <p className="text-center text-sm leading-6 text-foreground-muted">
          این بخش در حال آماده‌سازی است.
        </p>
      </Card>
    </div>
  );
}
