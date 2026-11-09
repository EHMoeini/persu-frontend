'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MaskedIcon } from '@/components/ui/masked-icon';

type TNavigationItem = {
    href: string;
    label: string;
    icon: string;
    iconClassName: string;
};

const NAV_ITEMS: TNavigationItem[] = [
    {
        href: '/',
        label: 'خانه',
        icon: '/assets/icons/landing/nav-home.svg',
        iconClassName: 'size-[18.333px]',
    },
    {
        href: '/venues',
        label: 'رزرو سالن',
        icon: '/assets/icons/landing/nav-search.svg',
        iconClassName: 'size-[16.5px]',
    },
    {
        href: '/bookings',
        label: 'رزروهای من',
        icon: '/assets/icons/landing/nav-bookings.svg',
        iconClassName: 'h-[18.333px] w-[16.5px]',
    },
    {
        // The profile route is still unguarded; it redirects to /user-check
        // until the profile integration lands.
        href: '/profile',
        label: 'حساب من',
        icon: '/assets/icons/landing/nav-account.svg',
        iconClassName: 'size-[18.333px]',
    },
];

/** Fixed bottom tab bar for every shell page. */
export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="ناوبری اصلی"
            className="fixed inset-x-0 bottom-0 z-30 mx-auto w-full max-w-97.5 bg-surface/90 shadow-[0_-1px_10px_0_rgba(0,0,0,0.03)] backdrop-blur-xl"
        >
            <ul className="flex min-h-16 items-center px-2 pb-[env(safe-area-inset-bottom)]">
                {NAV_ITEMS.map((item) => {
                    const active =
                        item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);

                    return (
                        <li key={item.href} className="flex-1">
                            <Link
                                href={item.href}
                                aria-current={active ? 'page' : undefined}
                                className={`flex min-h-11 flex-col items-center justify-center gap-px rounded-lg px-1 py-0.5 text-[11px] leading-[16.5px] transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                                    active
                                        ? 'font-bold text-primary'
                                        : 'font-normal text-foreground-muted hover:text-foreground'
                                }`}
                            >
                                <MaskedIcon src={item.icon} className={item.iconClassName} />
                                <span>{item.label}</span>
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
