import Link from 'next/link';
import { Fragment, type ReactNode } from 'react';

import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';

import type { IProfileMenuItem } from '../profile.models';

type TProfileMenuCardProps = {
    items: readonly IProfileMenuItem[];
    /** Logout row, passed by the page so this feature never imports the auth feature. */
    destructiveAction: ReactNode;
};

/** Account links list. Rows are separated by the design's inset hairlines. */
export function ProfileMenuCard({ items, destructiveAction }: TProfileMenuCardProps) {
    return (
        <Card className="overflow-clip p-0">
            <nav aria-label="منوی حساب کاربری">
                <ul>
                    {items.map((item, index) => (
                        <Fragment key={item.id}>
                            {index > 0 ? (
                                <li aria-hidden className="mx-4 h-px bg-surface-muted" />
                            ) : null}

                            <li>
                                <Link
                                    href={item.href}
                                    className="flex min-h-16 items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-surface-muted focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-focus"
                                >
                                    <span className="flex items-center gap-3">
                                        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-surface-high">
                                            <DesignIcon
                                                src={item.icon}
                                                className={item.iconClassName}
                                            />
                                        </span>
                                        <span className="text-sm leading-5 font-medium text-foreground">
                                            {item.label}
                                        </span>
                                    </span>

                                    <MaskedIcon
                                        src="/assets/icons/landing/chevron-down.svg"
                                        className="h-[5.55px] w-[9px] rotate-90 text-outline-muted"
                                    />
                                </Link>
                            </li>
                        </Fragment>
                    ))}

                    <li aria-hidden className="mx-4 h-px bg-surface-muted" />
                    <li>{destructiveAction}</li>
                </ul>
            </nav>
        </Card>
    );
}
