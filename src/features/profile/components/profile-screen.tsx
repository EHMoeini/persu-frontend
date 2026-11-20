'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, type ReactNode } from 'react';

import { useAuthStore } from '@/stores/auth.store';

import { PLUS_MEMBERSHIP_MOCK, PROFILE_MENU_ITEMS, WALLET_MOCK } from '../profile.logic';
import { useProfile } from '../profile.query';

import { ProfileEditSheet } from './profile-edit-sheet';
import { ProfileMenuCard } from './profile-menu-card';
import { ProfilePlusCard } from './profile-plus-card';
import { ProfileSummaryCard } from './profile-summary-card';
import { ProfileWalletCard } from './profile-wallet-card';

type TProfileScreenProps = {
    /** Logout row supplied by the route so this feature never imports auth. */
    destructiveAction: ReactNode;
};

/** Account screen: client-side auth guard, live identity, and the edit sheet. */
export function ProfileScreen({ destructiveAction }: TProfileScreenProps) {
    const router = useRouter();
    const status = useAuthStore((state) => state.status);
    const { data } = useProfile();
    const [editing, setEditing] = useState(false);
    const profile = status === 'authenticated' ? data?.user : undefined;

    useEffect(() => {
        if (status === 'unauthenticated') router.replace('/user-check');
    }, [status, router]);

    return (
        <div className="flex w-full flex-col gap-4 px-4 pt-2 pb-6">
            <h1 className="text-xl leading-7 font-bold text-foreground">حساب کاربری</h1>

            {profile ? (
                <>
                    <ProfileSummaryCard profile={profile} onEdit={() => setEditing(true)} />
                    <ProfileWalletCard wallet={WALLET_MOCK} />
                    <ProfilePlusCard membership={PLUS_MEMBERSHIP_MOCK} />
                    <ProfileMenuCard
                        items={PROFILE_MENU_ITEMS}
                        destructiveAction={destructiveAction}
                    />
                </>
            ) : null}

            {profile ? (
                <ProfileEditSheet
                    open={editing}
                    profile={profile}
                    onClose={() => setEditing(false)}
                />
            ) : null}
        </div>
    );
}
