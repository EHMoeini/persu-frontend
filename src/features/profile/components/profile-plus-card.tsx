import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';

import type { IPlusMembership } from '../profile.models';

/** Persu Plus membership summary; the whole card links to the plan page. */
export function ProfilePlusCard({ membership }: { membership: IPlusMembership }) {
    return (
        <Link
            href="/plus"
            className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
        >
            <Card className="overflow-clip bg-linear-to-l from-primary-fixed/40 via-surface-muted to-surface-card p-4">
                <div className="flex items-center justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary-container/15">
                            <DesignIcon
                                src="/assets/icons/profile/plus-badge.svg"
                                className="size-[18.333px]"
                            />
                        </span>

                        <div className="flex min-w-0 flex-col items-start">
                            <div className="flex items-center gap-2">
                                <h2 className="text-sm leading-5 font-bold text-foreground">
                                    {membership.title}
                                </h2>
                                <span className="shrink-0 rounded-full bg-secondary-container/20 px-2 py-0.5 text-[10px] leading-[15px] font-bold text-secondary">
                                    {membership.statusLabel}
                                </span>
                            </div>
                            <p className="mt-0.5 w-full truncate text-xs leading-4 text-foreground-muted">
                                {membership.description}
                            </p>
                        </div>
                    </div>

                    <DesignIcon
                        src="/assets/icons/landing/chevron-down.svg"
                        className="h-[6.167px] w-2.5 rotate-90"
                    />
                </div>
            </Card>
        </Link>
    );
}
