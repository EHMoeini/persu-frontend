'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StaticImage } from '@/components/ui/static-image';

import { useUserCheck } from '../auth.hook';
import { parsePhone, type NationalPhone } from '../auth.phone';

import { PhoneField } from './phone-field';

const HINT_TEXT = 'کد تایید یکبار مصرف به این شماره پیامک خواهد شد.';
const GENERIC_ERROR = 'مشکلی پیش آمد. لطفاً دوباره تلاش کنید.';

/** The user-check card — phone entry that routes to login or register. */
export function UserCheckForm({ initialPhone }: { initialPhone?: NationalPhone }) {
    const router = useRouter();
    const [phone, setPhone] = useState(initialPhone ?? '');
    const userCheck = useUserCheck();
    const isValid = parsePhone(phone) !== null;

    const handleSubmit = async () => {
        const parsed = parsePhone(phone);
        if (!parsed || userCheck.isPending) return;

        try {
            const { exists } = await userCheck.mutateAsync(parsed);
            router.push(`${exists ? '/login' : '/register'}?phone=${parsed}`);
        } catch {
            // The failure state is rendered from `userCheck.isError` below.
        }
    };

    return (
        <Card>
            <div className="flex flex-col gap-5">
                <PhoneField
                    value={phone}
                    onValueChange={setPhone}
                    hint={HINT_TEXT}
                    error={userCheck.isError ? GENERIC_ERROR : null}
                    disabled={userCheck.isPending}
                />
                <Button
                    onClick={handleSubmit}
                    disabled={!isValid}
                    loading={userCheck.isPending}
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
