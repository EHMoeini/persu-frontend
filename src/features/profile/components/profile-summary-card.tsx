'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';

import { profileDisplayName, profileSecondaryPhone } from '../profile.logic';
import type { IProfile } from '../profile.models';

import { ProfileAvatar } from './profile-avatar';

type TProfileSummaryCardProps = {
    profile: IProfile;
    onEdit: () => void;
};

/** Identity card: avatar, display name, phone number, and the edit action. */
export function ProfileSummaryCard({ profile, onEdit }: TProfileSummaryCardProps) {
    const name = profileDisplayName(profile);
    const secondaryPhone = profileSecondaryPhone(profile);
    const phoneIsPrimary = secondaryPhone === null;

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-high">
                        <ProfileAvatar
                            src={profile.avatar}
                            className="block size-full object-cover"
                        />
                        <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-[inherit] inset-shadow-badge"
                        />
                    </span>

                    <div className="flex min-w-0 flex-col items-start">
                        <p
                            dir={phoneIsPrimary ? 'ltr' : undefined}
                            className="max-w-full truncate text-sm leading-5 font-bold text-foreground"
                        >
                            {name}
                        </p>
                        {secondaryPhone ? (
                            <p
                                dir="ltr"
                                className="mt-1 max-w-full truncate text-xs leading-4 text-foreground-muted"
                            >
                                {secondaryPhone}
                            </p>
                        ) : null}
                    </div>
                </div>

                <Button
                    type="button"
                    variant="soft"
                    onClick={onEdit}
                    icon={<DesignIcon src="/assets/icons/pencil.svg" className="size-[12.75px]" />}
                >
                    ویرایش
                </Button>
            </div>
        </Card>
    );
}
