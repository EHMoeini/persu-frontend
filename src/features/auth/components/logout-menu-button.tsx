'use client';

import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';
import { Spinner } from '@/components/ui/spinner';

import { useLogout } from '../auth.hook';

/** Destructive row in the account menu — the only client control on the page. */
export function LogoutMenuButton() {
    const logout = useLogout();

    return (
        <button
            type="button"
            onClick={() => logout.mutate()}
            disabled={logout.isPending}
            aria-busy={logout.isPending || undefined}
            className="flex min-h-16 w-full items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-error-tint/30 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus disabled:cursor-not-allowed disabled:opacity-60"
        >
            <span className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-error-tint/60">
                    {logout.isPending ? (
                        <Spinner className="size-4 text-error" />
                    ) : (
                        <DesignIcon
                            src="/assets/icons/profile/logout.svg"
                            className="size-[15px]"
                        />
                    )}
                </span>
                <span className="text-sm leading-5 font-semibold text-error">خروج از حساب</span>
            </span>

            <MaskedIcon
                src="/assets/icons/landing/chevron-down.svg"
                className="h-[5.55px] w-[9px] rotate-90 text-error"
            />
        </button>
    );
}
