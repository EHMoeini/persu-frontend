'use client';

import Link from 'next/link';
import { useId, useState, type FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';
import { TextField } from '@/components/ui/text-field';
import { isHttpError } from '@/utils/http/http-core';

import { useRegisterAccount } from '../auth.hook';
import { mapAuthError } from '../auth.logic';
import type { NationalPhone } from '../auth.phone';

import { PasswordField } from './password-field';
import { TermsCheckbox } from './terms-checkbox';

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 128;
const FULL_NAME_MAX_LENGTH = 64;

/** The register card — creates the account and signs the user in. */
export function RegisterForm({ phone }: { phone: NationalPhone }) {
    const passwordId = useId();
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [accepted, setAccepted] = useState(false);
    const register = useRegisterAccount();
    const errorCode = isHttpError(register.error) ? register.error.code : undefined;
    const error = register.error ? mapAuthError(errorCode) : null;
    const isDuplicate = errorCode === 'phone_already_registered';

    const trimmedName = fullName.trim();
    const canSubmit =
        trimmedName.length > 0 &&
        trimmedName.length <= FULL_NAME_MAX_LENGTH &&
        password.length >= PASSWORD_MIN_LENGTH &&
        password.length <= PASSWORD_MAX_LENGTH &&
        password.trim().length > 0 &&
        accepted;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!canSubmit || register.isPending) return;

        register.mutate({ phone, fullName: trimmedName, password });
    };

    return (
        <Card className="p-4">
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
                <TextField
                    label="نام و نام خانوادگی"
                    icon="/assets/icons/id-card.svg"
                    required
                    autoComplete="name"
                    maxLength={FULL_NAME_MAX_LENGTH}
                    placeholder="مثال: علیرضا شمس"
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
                    <div role="alert" className="flex flex-col gap-1 text-xs leading-4 text-error">
                        <span>{error}</span>
                        {isDuplicate ? (
                            <Link
                                href={`/login?phone=${phone}`}
                                className="font-medium text-primary"
                            >
                                ورود به حساب
                            </Link>
                        ) : null}
                    </div>
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
                        تکمیل ثبت‌نام
                    </Button>
                </div>
            </form>
        </Card>
    );
}
