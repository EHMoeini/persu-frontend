'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';

import { AUTH_COPY } from '../auth.copy';
import { useSendOtp, useVerifyOtp } from '../auth.hook';
import { toPersianDigits } from '../auth.logic';

import { OtpInput } from './otp-input';
import { ResendOtpRow } from './resend-otp-row';

/** Seconds before the OTP can be resent — the design's starting countdown (۰۱:۴۵). */
const RESEND_SECONDS = 105;

/** The OTP card — verifies the code sent to the phone number below. */
export function OtpForm({ phone }: { phone: string }) {
  const router = useRouter();
  const labelId = useId();
  const errorId = useId();
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(RESEND_SECONDS);
  const verifyOtp = useVerifyOtp();
  const sendOtp = useSendOtp();

  useEffect(() => {
    const id = setInterval(() => setCountdown((seconds) => (seconds > 0 ? seconds - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const submit = (nextCode: string) => {
    if (nextCode.length !== 4 || verifyOtp.isPending) return;

    verifyOtp
      .mutateAsync({ phone, code: nextCode })
      .then(({ verified }) => {
        if (verified) router.push('/');
      })
      .catch(() => {
        // The failure state is rendered from `verifyOtp` below.
      });
  };

  const handleCodeChange = (nextCode: string) => {
    setCode(nextCode);
    if (nextCode.length === 4) submit(nextCode);
  };

  const handleResend = () => {
    if (countdown > 0 || sendOtp.isPending) return;
    sendOtp.mutate({ phone }, { onSuccess: () => setCountdown(RESEND_SECONDS) });
  };

  const error =
    verifyOtp.data && !verifyOtp.data.verified
      ? AUTH_COPY.wrongOtp
      : verifyOtp.isError || sendOtp.isError
        ? AUTH_COPY.genericError
        : null;

  return (
    <Card className="p-4">
      <div className="flex flex-col gap-4">
        <div className="flex h-12 items-center justify-between gap-2 rounded-xl bg-surface-muted ps-3 pe-2">
          <button
            type="button"
            onClick={() => router.push(`/user-check?phone=${phone}`)}
            disabled={verifyOtp.isPending}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] leading-4.25 font-medium text-primary disabled:cursor-not-allowed disabled:opacity-40"
          >
            <span>ویرایش شماره</span>
            <span className="relative block size-2.5 shrink-0">
              <StaticImage
                src="/assets/icons/pencil.svg"
                className="absolute inset-0 block size-full max-w-none"
              />
            </span>
          </button>

          <span dir="ltr" className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft">
              <span className="relative block h-4 w-2.75">
                <StaticImage
                  src="/assets/icons/phone-mobile.svg"
                  className="absolute inset-0 block size-full max-w-none"
                />
              </span>
            </span>
            <span className="text-sm font-semibold tracking-wider text-foreground">
              {toPersianDigits(phone)}
            </span>
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          <span id={labelId} className="text-xs leading-4 font-semibold text-foreground">
            کد تایید ۴ رقمی:
          </span>

          <OtpInput
            value={code}
            onValueChange={handleCodeChange}
            disabled={verifyOtp.isPending}
            ariaLabelledBy={labelId}
            ariaDescribedBy={error ? errorId : undefined}
            ariaInvalid={Boolean(error)}
          />

          {error ? (
            <p id={errorId} role="alert" className="text-xs leading-4 text-error">
              {error}
            </p>
          ) : null}

          <ResendOtpRow countdown={countdown} onResend={handleResend} pending={sendOtp.isPending} />
        </div>

        <div className="pt-1">
          <Button
            onClick={() => submit(code)}
            disabled={code.length !== 4}
            loading={verifyOtp.isPending}
            icon={
              <span className="relative block size-3">
                <StaticImage
                  src="/assets/icons/arrow-continue.svg"
                  className="absolute inset-0 block size-full max-w-none"
                />
              </span>
            }
          >
            تایید و ورود به حساب
          </Button>
        </div>
      </div>
    </Card>
  );
}
