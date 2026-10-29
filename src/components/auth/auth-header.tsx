import { BackButton } from '@/components/shared/back-button';

/**
 * Sticky app bar for auth-flow pages. Auth lives outside the shell, so this
 * replaces the global Header with the only control the flow needs: back.
 */
export function AuthHeader() {
    return (
        <header className="sticky top-0 right-0 z-20 flex w-full items-center bg-surface-card px-4 pt-3 pb-4 drop-shadow-subtle">
            <BackButton />
        </header>
    );
}
