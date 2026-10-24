'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useId, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';
import { TextButton } from '@/components/ui/text-button';

import { AUTH_COPY } from '../auth.copy';
import { useSendOtp, useVerifyOtp } from '../auth.hook';
import { formatPhone, type NationalPhone } from '../auth.phone';

import { OtpInput } from './otp-input';
import { ResendOtpRow } from './resend-otp-row';

/** Seconds before the OTP can be resent — the design's starting countdown (۰۱:۴۵). */
const RESEND_SECONDS = 105;

type TLoginFormProps = {
    phone: NationalPhone;
    /** Switches the card to password login. */
    onUsePassword: () => void;
};

/** The login card — OTP verification for an existing account. */
export function LoginForm({ phone, onUsePassword }: TLoginFormProps) {
    const router = useRouter();
    const errorId = useId();
    const [code, setCode] = useState('');
    const [countdown, setCountdown] = useState(RESEND_SECONDS);
    const verifyOtp = useVerifyOtp();
    const sendOtp = useSendOtp();

    useEffect(() => {
        const id = setInterval(
            () => setCountdown((seconds) => (seconds > 0 ? seconds - 1 : 0)),
            1000,
        );
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
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <span className="flex items-center gap-1">
                            <span className="relative size-3">
                                <StaticImage
                                    src="/assets/icons/sms.svg"
                                    className="absolute inset-0 block size-full max-w-none"
                                />
                            </span>
                            <span className="text-xs leading-4 text-foreground-muted">
                                کد تایید پیامکی
                            </span>
                        </span>
                        <span className="text-xs leading-4 text-outline" dir="ltr">
                            {formatPhone(phone, 'masked')}
                        </span>
                    </div>

                    <OtpInput
                        value={code}
                        onValueChange={handleCodeChange}
                        disabled={verifyOtp.isPending}
                    />

                    {error ? (
                        <p id={errorId} role="alert" className="text-xs leading-4 text-error">
                            {error}
                        </p>
                    ) : null}

                    <ResendOtpRow
                        countdown={countdown}
                        onResend={handleResend}
                        pending={sendOtp.isPending}
                    />
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
                        ورود به حساب
                    </Button>
                </div>

                <div className="flex justify-center pt-1">
                    <TextButton
                        onClick={onUsePassword}
                        disabled={verifyOtp.isPending}
                        icon={
                            <span className="relative block h-3 w-2.25">
                                <StaticImage
                                    src="/assets/icons/lock.svg"
                                    className="absolute inset-0 block size-full max-w-none"
                                />
                            </span>
                        }
                    >
                        ورود با کلمه عبور
                    </TextButton>
                </div>
            </div>
        </Card>
    );
}
