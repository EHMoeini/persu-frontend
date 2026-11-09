'use client';

import { useRouter } from 'next/navigation';
import { useId } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';
import { isHttpError } from '@/utils/http/http-core';

import { useOtpFlow } from '../auth.hook';
import { mapAuthError } from '../auth.logic';
import { formatPhone, type NationalPhone } from '../auth.phone';

import { OtpInput } from './otp-input';
import { ResendOtpRow } from './resend-otp-row';

/** The OTP card — verifies the 6-digit code sent to the phone number below. */
export function OtpForm({ phone }: { phone: NationalPhone }) {
    const router = useRouter();
    const labelId = useId();
    const errorId = useId();
    const { code, setCode, submit, countdown, resend, verify, send } = useOtpFlow(phone, {
        autoSend: true,
    });
    const mutationError = verify.error ?? send.error;
    const error = mutationError
        ? mapAuthError(isHttpError(mutationError) ? mutationError.code : undefined)
        : null;

    return (
        <Card className="p-4">
            <div className="flex flex-col gap-4">
                <div className="flex h-12 items-center justify-between gap-2 rounded-xl bg-surface-muted ps-3 pe-2">
                    <button
                        type="button"
                        onClick={() => router.push(`/user-check?phone=${phone}`)}
                        disabled={verify.isPending}
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
                            {formatPhone(phone)}
                        </span>
                    </span>
                </div>

                <div className="flex flex-col gap-2.5">
                    <span id={labelId} className="text-xs leading-4 font-semibold text-foreground">
                        کد تایید ۶ رقمی:
                    </span>

                    <OtpInput
                        value={code}
                        onValueChange={setCode}
                        disabled={verify.isPending}
                        ariaLabelledBy={labelId}
                        ariaDescribedBy={error ? errorId : undefined}
                        ariaInvalid={Boolean(error)}
                    />

                    {error ? (
                        <p id={errorId} role="alert" className="text-xs leading-4 text-error">
                            {error}
                        </p>
                    ) : null}

                    <ResendOtpRow
                        countdown={countdown}
                        onResend={resend}
                        pending={send.isPending}
                    />
                </div>

                <div className="pt-1">
                    <Button
                        onClick={() => submit(code)}
                        disabled={code.length !== 6 || verify.isPending}
                        loading={verify.isPending}
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
