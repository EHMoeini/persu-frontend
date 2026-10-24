'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';
import { TextButton } from '@/components/ui/text-button';

import { AUTH_COPY } from '../auth.copy';
import { useLoginWithPassword } from '../auth.hook';
import { formatPhone, type NationalPhone } from '../auth.phone';

import { PasswordField } from './password-field';

type TPasswordLoginFormProps = {
    phone: NationalPhone;
    /** Switches the card back to OTP verification. */
    onUseOtp: () => void;
};

/** The password card — Figma "Login/Pass" form fields. */
export function PasswordLoginForm({ phone, onUseOtp }: TPasswordLoginFormProps) {
    const router = useRouter();
    const passwordId = useId();
    const [password, setPassword] = useState('');
    const login = useLoginWithPassword();

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!password || login.isPending) return;

        login
            .mutateAsync({ phone, password })
            .then(({ authenticated }) => {
                if (authenticated) router.push('/');
            })
            .catch(() => {
                // The failure state is rendered from `login` below.
            });
    };

    const error =
        login.data && !login.data.authenticated
            ? AUTH_COPY.wrongPassword
            : login.isError
              ? AUTH_COPY.genericError
              : null;

    return (
        <Card className="p-4">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between px-1">
                        <label
                            htmlFor={passwordId}
                            className="flex items-center gap-1 text-xs leading-4 text-foreground-muted"
                        >
                            <span className="relative block h-3 w-2.25 shrink-0">
                                <StaticImage
                                    src="/assets/icons/lock.svg"
                                    className="absolute inset-0 block size-full max-w-none"
                                />
                            </span>
                            <span>کلمه عبور</span>
                        </label>

                        <span dir="ltr" className="text-xs leading-4 text-outline">
                            {formatPhone(phone, 'masked')}
                        </span>
                    </div>

                    <PasswordField
                        id={passwordId}
                        value={password}
                        onValueChange={setPassword}
                        placeholder="رمز عبور خود را وارد نمایید"
                        error={error}
                        disabled={login.isPending}
                    />

                    <div className="flex justify-end px-1">
                        <Link
                            href="/forgot-password"
                            className="text-xs leading-4 font-medium text-primary"
                        >
                            فراموشی کلمه عبور؟
                        </Link>
                    </div>
                </div>

                <div className="pt-1">
                    <Button
                        type="submit"
                        disabled={!password}
                        loading={login.isPending}
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
                        onClick={onUseOtp}
                        disabled={login.isPending}
                        icon={
                            <span className="relative block size-3.25 shrink-0">
                                <StaticImage
                                    src="/assets/icons/sms.svg"
                                    className="absolute inset-0 block size-full max-w-none"
                                />
                            </span>
                        }
                    >
                        ورود با پیامک (کد یکبار مصرف)
                    </TextButton>
                </div>
            </form>
        </Card>
    );
}
