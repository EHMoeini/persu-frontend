'use client';

import { useId } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';
import { TextButton } from '@/components/ui/text-button';
import { isHttpError } from '@/utils/http/http-core';

import { useOtpFlow } from '../auth.hook';
import { mapAuthError } from '../auth.logic';
import { formatPhone, type NationalPhone } from '../auth.phone';

import { OtpInput } from './otp-input';
import { ResendOtpRow } from './resend-otp-row';

type TLoginFormProps = {
    phone: NationalPhone;
    /** Switches the card to password login. */
    onUsePassword: () => void;
};

/** The login card — OTP verification for an existing account. */
export function LoginForm({ phone, onUsePassword }: TLoginFormProps) {
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
                        onValueChange={setCode}
                        disabled={verify.isPending}
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
                        ورود به حساب
                    </Button>
                </div>

                <div className="flex justify-center pt-1">
                    <TextButton
                        onClick={onUsePassword}
                        disabled={verify.isPending}
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
