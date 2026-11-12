'use client';

import { LogoMark } from '@/components/brand/logo-mark';
import { IconChip } from '@/components/ui/icon-chip';

/** Global app bar (root layout). */
export function Header() {
    return (
        <header className="flex w-full items-center justify-between bg-surface-card px-4 pt-3 pb-4 drop-shadow-subtle">
            {/*<BackButton />*/}
            <div className="ml-auto flex items-center gap-2.5">
                <IconChip>
                    <LogoMark />
                </IconChip>
                <div className="flex flex-col">
                    <p className="text-base leading-5 font-bold tracking-tight text-foreground">
                        پرسو
                    </p>
                    <p className="text-xs leading-4.25 text-outline">پلتفرم رزرو سالن های ورزشی</p>
                </div>
            </div>
        </header>
    );
}
