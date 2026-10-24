'use client';

import { useRouter } from 'next/navigation';
import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';

import { AUTH_COPY } from '../auth.copy';
import { useRegisterAccount } from '../auth.hook';

import { NameField } from './name-field';
import { PasswordField } from './password-field';
import { TermsCheckbox } from './terms-checkbox';

const PASSWORD_MIN_LENGTH = 8;

/** The register card — creates the account, then hands off to OTP verification. */
export function RegisterForm({ phone }: { phone: string }) {
    const router = useRouter();
    const passwordId = useId();
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [accepted, setAccepted] = useState(false);
    const register = useRegisterAccount();

    const canSubmit =
        fullName.trim().length > 0 && password.length >= PASSWORD_MIN_LENGTH && accepted;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit || register.isPending) return;

        register
            .mutateAsync({ phone, fullName: fullName.trim(), password })
            .then(({ registered }) => {
                if (registered) router.push(`/otp?phone=${phone}`);
            })
            .catch(() => {
                // The failure state is rendered from `register` below.
            });
    };

    const error =
        register.isError || (register.data && !register.data.registered)
            ? AUTH_COPY.genericError
            : null;

    return (
        <Card className="p-4">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <NameField
                    value={fullName}
                    onValueChange={setFullName}
                    disabled={register.isPending}
                />

                <PasswordField
                    id={passwordId}
                    label="کلمه عبور"
                    required
                    icon="/assets/icons/lock.svg"
                    value={password}
                    onValueChange={setPassword}
                    placeholder="حداقل ۸ کاراکتر امن"
                    autoComplete="new-password"
                    disabled={register.isPending}
                />

                <TermsCheckbox
                    checked={accepted}
                    onCheckedChange={setAccepted}
                    disabled={register.isPending}
                />

                {error ? (
                    <p role="alert" className="text-xs leading-4 text-error">
                        {error}
                    </p>
                ) : null}

                <div className="pt-1">
                    <Button
                        type="submit"
                        disabled={!canSubmit}
                        loading={register.isPending}
                        icon={
                            <span className="relative block size-3">
                                <StaticImage
                                    src="/assets/icons/arrow-continue.svg"
                                    className="absolute inset-0 block size-full max-w-none"
                                />
                            </span>
                        }
                    >
                        تکمیل ثبت‌نام و دریافت کد
                    </Button>
                </div>
            </form>
        </Card>
    );
}
