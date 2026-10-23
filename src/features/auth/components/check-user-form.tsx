'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';

import { useCheckUser } from '../auth.hook';
import { isValidIranianMobile } from '../auth.logic';

import { PhoneField } from './phone-field';

const HINT_TEXT = 'کد تایید یکبار مصرف به این شماره پیامک خواهد شد.';
const GENERIC_ERROR = 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.';

/** The check-user card — phone entry that routes to login or register. */
export function CheckUserForm() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const checkUser = useCheckUser();
  const isValid = isValidIranianMobile(phone);

  const handleSubmit = async () => {
    if (!isValid || checkUser.isPending) return;

    try {
      const { exists } = await checkUser.mutateAsync(phone);
      router.push(`${exists ? '/login' : '/register'}?phone=${phone}`);
    } catch {
      // The failure state is rendered from `checkUser.isError` below.
    }
  };

  return (
    <Card>
      <div className="flex flex-col gap-5">
        <PhoneField
          value={phone}
          onValueChange={setPhone}
          hint={HINT_TEXT}
          error={checkUser.isError ? GENERIC_ERROR : null}
          disabled={checkUser.isPending}
        />
        <Button
          onClick={handleSubmit}
          disabled={!isValid}
          loading={checkUser.isPending}
          icon={
            <span className="relative block h-2.25 w-3 rotate-180">
              <StaticImage
                src="/assets/icons/arrow-button.svg"
                className="absolute inset-0 block size-full max-w-none"
              />
            </span>
          }
        >
          ادامه
        </Button>
      </div>
    </Card>
  );
}
