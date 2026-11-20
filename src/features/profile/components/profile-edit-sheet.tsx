'use client';

import { useState, type FormEvent } from 'react';

import { BottomSheet } from '@/components/ui/bottom-sheet';
import { Button } from '@/components/ui/button';
import { TextField } from '@/components/ui/text-field';

import { useUpdateProfile } from '../profile.hook';
import { formatPhone } from '../profile.logic';
import type { IProfile, IProfileUpdate } from '../profile.models';

import { ProfileAvatar } from './profile-avatar';

type TProfileEditSheetProps = {
    profile: IProfile;
    open: boolean;
    onClose: () => void;
};

type TProfileEditFormProps = {
    profile: IProfile;
    isPending: boolean;
    onSave: (input: IProfileUpdate) => void;
};

const NAME_MAX_LENGTH = 64;

/** Bottom sheet for editing the display name. */
export function ProfileEditSheet({ profile, open, onClose }: TProfileEditSheetProps) {
    const { mutate: saveProfile, isPending } = useUpdateProfile();

    return (
        <BottomSheet
            open={open}
            onClose={onClose}
            title="ویرایش حساب کاربری"
            closeLabel="انصراف"
            dismissible={!isPending}
        >
            <ProfileEditForm
                profile={profile}
                isPending={isPending}
                onSave={(input) => saveProfile(input, { onSuccess: onClose })}
            />
        </BottomSheet>
    );
}

/**
 * The form lives inside the dialog children so Headless UI unmounts it when
 * the sheet closes. That resets the draft without remounting the Dialog
 * itself, which is what allows the opening transition to run.
 */
function ProfileEditForm({ profile, isPending, onSave }: TProfileEditFormProps) {
    const [name, setName] = useState(profile.nickName?.trim() ?? '');

    const savedName = profile.nickName?.trim() ?? '';
    const trimmedName = name.trim();
    const isDirty = trimmedName !== savedName;

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!isDirty || isPending) return;

        onSave({ nickName: trimmedName });
    };

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex items-center gap-3 rounded-xl bg-surface-muted p-3">
                <span className="relative size-10 shrink-0 overflow-hidden rounded-full bg-surface-high">
                    <ProfileAvatar src={profile.avatar} className="block size-full object-cover" />
                </span>
                <div className="flex min-w-0 flex-col items-start">
                    <span className="text-[11px] leading-[16.5px] text-foreground-muted">
                        شماره همراه
                    </span>
                    <span
                        dir="ltr"
                        className="max-w-full truncate text-sm leading-5 font-bold text-foreground"
                    >
                        {formatPhone(profile.phone)}
                    </span>
                </div>
            </div>

            <TextField
                label="نام نمایشی (اختیاری)"
                icon="/assets/icons/id-card.svg"
                placeholder="مثال: علیرضا شمس"
                helper="اگر خالی بماند، شماره همراه نمایش داده می‌شود."
                maxLength={NAME_MAX_LENGTH}
                autoComplete="nickname"
                autoFocus
                value={name}
                onValueChange={setName}
                disabled={isPending}
            />

            <Button type="submit" loading={isPending} disabled={!isDirty}>
                ذخیره تغییرات
            </Button>
        </form>
    );
}
