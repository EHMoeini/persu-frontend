import { LogoutMenuButton } from '@/features/auth/components/logout-menu-button';
import { ProfileScreen } from '@/features/profile/components/profile-screen';

/**
 * Account screen. Auth state, the live profile query and the edit sheet live
 * in the profile feature; the route only supplies the auth-owned logout row.
 */
export default function ProfilePage() {
    return <ProfileScreen destructiveAction={<LogoutMenuButton />} />;
}
