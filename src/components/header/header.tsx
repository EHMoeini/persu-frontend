'use client';

import { usePathname } from 'next/navigation';

import { LogoMark } from '@/components/brand/logo-mark';
import { IconChip } from '@/components/ui/icon-chip';
import { useLandingBrandStore } from '@/stores/landing-brand.store';

/** One ease-out curve shared by the header shell and its brand content. */
const HEADER_MOTION_CLASS_NAMES =
    'ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none';

/**
 * The logo lands first, then the name follows 80ms later. On the way out the
 * order reverses: the name leaves first, then the logo, then the shell.
 */
const BRAND_LOGO_MOTION = {
    revealed: 'translate-y-0 opacity-100 delay-[100ms] duration-[220ms]',
    hidden: '-translate-y-3 opacity-0 delay-[30ms] duration-[120ms]',
};

const BRAND_NAME_MOTION = {
    revealed: 'translate-y-0 opacity-100 delay-[180ms] duration-[220ms]',
    hidden: '-translate-y-3 opacity-0 duration-[120ms]',
};

function HeaderBrand({ revealed }: { revealed?: boolean }) {
    const brandMotion =
        revealed === undefined ? '' : `transition-[opacity,translate] ${HEADER_MOTION_CLASS_NAMES}`;
    const logoMotion =
        revealed === undefined ? '' : BRAND_LOGO_MOTION[revealed ? 'revealed' : 'hidden'];
    const nameMotion =
        revealed === undefined ? '' : BRAND_NAME_MOTION[revealed ? 'revealed' : 'hidden'];

    return (
        <div className="ml-auto flex items-center gap-2.5">
            <div className={`shrink-0 ${brandMotion} ${logoMotion}`}>
                <IconChip>
                    <LogoMark />
                </IconChip>
            </div>
            <div className={`flex flex-col ${brandMotion} ${nameMotion}`}>
                <p className="text-base leading-5 font-bold tracking-tight text-foreground">پرسو</p>
                <p className="text-xs leading-4.25 text-outline">پلتفرم رزرو سالن های ورزشی</p>
            </div>
        </div>
    );
}

/** Header for every shell page except the landing page. */
function StaticHeader() {
    return (
        <div className="sticky top-0 right-0 z-20 w-full">
            <header className="flex w-full items-center justify-between bg-surface-card px-4 pt-3 pb-4 drop-shadow-subtle">
                <HeaderBrand />
            </header>
        </div>
    );
}

/**
 * Landing Header: absent while the Landing Brand is in view. Once the brand
 * scrolls fully out, the shell slides in first, then the logo and the name.
 * It retracts when any part of the brand re-enters the viewport.
 */
function LandingHeader() {
    const brandInView = useLandingBrandStore((state) => state.inView);
    const revealed = !brandInView;

    return (
        <div className="pointer-events-none fixed inset-x-0 top-0 z-30">
            <div className="mx-auto w-full max-w-97.5">
                <header
                    aria-hidden={!revealed}
                    inert={!revealed}
                    className={`flex w-full items-center justify-between overflow-hidden bg-surface-card px-4 pt-3 pb-4 drop-shadow-subtle transition-transform ${HEADER_MOTION_CLASS_NAMES} ${
                        revealed
                            ? 'pointer-events-auto translate-y-0 duration-300'
                            : '-translate-y-full delay-[90ms] duration-[220ms]'
                    }`}
                >
                    <HeaderBrand revealed={revealed} />
                </header>
            </div>
        </div>
    );
}

/** Global app bar (root shell). */
export function Header() {
    const pathname = usePathname();

    return pathname === '/' ? <LandingHeader /> : <StaticHeader />;
}
