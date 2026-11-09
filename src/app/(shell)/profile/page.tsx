import { redirect } from 'next/navigation';

/**
 * Authenticated account page.
 *
 * Profile is out of scope for the auth integration; every visitor is sent
 * through the auth flow until the profile route guard is wired up.
 */
export default function ProfilePage() {
    redirect('/user-check');
}
