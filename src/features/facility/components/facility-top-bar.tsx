import Link from 'next/link';

import { DesignIcon } from '@/components/ui/design-icon';
import { IconChip } from '@/components/ui/icon-chip';
import { MaskedIcon } from '@/components/ui/masked-icon';

const BRAND_LABEL = 'پرسو';

const LINK_CLASS_NAME =
    'shrink-0 rounded text-xs leading-4 text-foreground-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** Breadcrumb plus the favourite/share controls that sit above the gallery. */
export function FacilityTopBar({ name }: { name: string }) {
    return (
        <div className="flex items-center justify-between gap-3 px-4 py-3">
            <nav
                aria-label="مسیر صفحه"
                className="flex min-w-0 items-center gap-1.5 text-xs leading-4"
            >
                <Link href="/" aria-label="خانه" className={LINK_CLASS_NAME}>
                    <MaskedIcon
                        src="/assets/icons/landing/nav-home.svg"
                        className="h-[10.5px] w-[9.333px] text-foreground-muted"
                    />
                </Link>

                <Link href="/" className={LINK_CLASS_NAME}>
                    {BRAND_LABEL}
                </Link>

                <MaskedIcon
                    src="/assets/icons/landing/chevron-down.svg"
                    className="h-[3.7px] w-[6px] shrink-0 rotate-90 text-outline-muted"
                />

                <span aria-current="page" className="truncate font-medium text-primary">
                    {name}
                </span>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
                <IconChip tone="high" size="sm" radiusClassName="rounded-full">
                    <DesignIcon
                        src="/assets/icons/facility/share.svg"
                        className="h-[15px] w-[13.5px]"
                    />
                </IconChip>

                <IconChip tone="high" size="sm" radiusClassName="rounded-full">
                    <MaskedIcon
                        src="/assets/icons/profile/favorites.svg"
                        className="h-[13.762px] w-[15px] text-secondary"
                    />
                </IconChip>
            </div>
        </div>
    );
}
