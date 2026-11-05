import { redirect } from 'next/navigation';

/**
 * Authenticated account page.
 *
 * Mock auth never persists a session, so every visitor is signed out and sent
 * through the auth flow. Replace the unconditional redirect with a real
 * session check when auth is wired up.
 */
export default function ProfilePage() {
    redirect('/user-check');
}
