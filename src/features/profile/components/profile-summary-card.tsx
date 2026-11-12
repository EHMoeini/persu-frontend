import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';
import { StaticImage } from '@/components/ui/static-image';

import { formatPhone } from '../profile.logic';
import type { IProfile } from '../profile.models';

/** Identity card: avatar, phone number, role pill, and the edit action. */
export function ProfileSummaryCard({ profile }: { profile: IProfile }) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="relative size-14 shrink-0 overflow-hidden rounded-full bg-surface-high">
                        <StaticImage
                            src={profile.avatarSrc}
                            className="block size-full object-cover"
                        />
                        <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 rounded-[inherit] inset-shadow-badge"
                        />
                    </span>

                    <div className="flex flex-col items-start">
                        <p dir="ltr" className="text-sm leading-5 font-bold text-foreground">
                            {formatPhone(profile.phone)}
                        </p>
                        <span className="mt-1 rounded-full bg-surface-muted px-2 pt-px pb-0.5 text-[11px] leading-[16.5px] font-medium text-primary">
                            {profile.role}
                        </span>
                    </div>
                </div>

                <LinkButton
                    href="/profile/edit"
                    variant="soft"
                    size="sm"
                    trailingIcon={
                        <DesignIcon src="/assets/icons/pencil.svg" className="size-[12.75px]" />
                    }
                >
                    ویرایش
                </LinkButton>
            </div>
        </Card>
    );
}
