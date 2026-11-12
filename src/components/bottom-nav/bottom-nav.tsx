'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { MaskedIcon } from '@/components/ui/masked-icon';
import { useHideOnScroll } from '@/hooks/use-hide-on-scroll';

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
        label: 'سالن‌ها',
        icon: '/assets/icons/landing/nav-search.svg',
        iconClassName: 'size-[16.5px]',
    },
    {
        href: '/bookings',
        label: 'رزروها',
        icon: '/assets/icons/landing/nav-bookings.svg',
        iconClassName: 'h-[18.333px] w-[16.5px]',
    },
    {
        // The profile route is still unguarded; it redirects to /user-check
        // until the profile integration lands.
        href: '/profile',
        label: 'حساب',
        icon: '/assets/icons/landing/nav-account.svg',
        iconClassName: 'size-[18.333px]',
    },
];

const NAVIGATION_MOTION_CLASS_NAMES =
    'duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

/** Floating bottom navigation for every shell page. */
export function BottomNav() {
    const pathname = usePathname();
    const hidden = useHideOnScroll(pathname);

    const activeIndex = NAV_ITEMS.findIndex((item) =>
        item.href === '/'
            ? pathname === '/'
            : pathname === item.href || pathname.startsWith(`${item.href}/`),
    );

    return (
        <div
            className={`pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] transition-transform ${NAVIGATION_MOTION_CLASS_NAMES} ${
                hidden ? 'translate-y-[calc(100%+1rem)]' : 'translate-y-0'
            }`}
        >
            <nav
                aria-label="ناوبری اصلی"
                inert={hidden}
                className="pointer-events-auto mx-auto h-19.25 w-full max-w-89.5 overflow-hidden rounded-[28px] border border-outline-soft bg-surface-card p-2.75 shadow-floating"
            >
                <div className="relative h-full">
                    <span
                        aria-hidden
                        className={`pointer-events-none absolute inset-y-0 w-1/4 rounded-xl bg-primary transition-[inset-inline-start] ${NAVIGATION_MOTION_CLASS_NAMES} ${
                            activeIndex >= 0 ? 'opacity-100' : 'opacity-0'
                        }`}
                        style={{ insetInlineStart: `${Math.max(0, activeIndex) * 25}%` }}
                    />

                    <ul className="relative grid h-full grid-cols-4">
                        {NAV_ITEMS.map((item, index) => {
                            const active = index === activeIndex;

                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex h-full flex-col items-center justify-center gap-0.75 rounded-lg text-xs leading-4 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus ${
                                            active
                                                ? 'text-on-accent'
                                                : 'text-foreground-muted hover:text-foreground'
                                        }`}
                                    >
                                        <MaskedIcon
                                            src={item.icon}
                                            className={item.iconClassName}
                                        />
                                        <span className="whitespace-nowrap">{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </div>
    );
}
