import { LogoutMenuButton } from '@/features/auth/components/logout-menu-button';
import { ProfileMenuCard } from '@/features/profile/components/profile-menu-card';
import { ProfilePlusCard } from '@/features/profile/components/profile-plus-card';
import { ProfileSummaryCard } from '@/features/profile/components/profile-summary-card';
import { ProfileWalletCard } from '@/features/profile/components/profile-wallet-card';
import {
    PLUS_MEMBERSHIP_MOCK,
    PROFILE_MENU_ITEMS,
    PROFILE_MOCK,
    WALLET_MOCK,
} from '@/features/profile/profile.logic';

/**
 * Account screen. Data is mocked until the profile API lands; the route guard
 * is intentionally not wired yet so the screen can be reviewed.
 *
 * The frame also draws an app bar and bottom navigation, but the shell already
 * owns both — this page renders content only.
 */
export default function ProfilePage() {
    return (
        <div className="flex w-full flex-col gap-4 px-4 pt-2 pb-6">
            <h1 className="text-xl leading-7 font-bold text-foreground">حساب کاربری</h1>

            <ProfileSummaryCard profile={PROFILE_MOCK} />
            <ProfileWalletCard wallet={WALLET_MOCK} />
            <ProfilePlusCard membership={PLUS_MEMBERSHIP_MOCK} />

            <ProfileMenuCard items={PROFILE_MENU_ITEMS} destructiveAction={<LogoutMenuButton />} />
        </div>
    );
}
