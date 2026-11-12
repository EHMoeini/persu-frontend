import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';

import { formatToman } from '../profile.logic';
import type { IWalletSummary } from '../profile.models';

/** Wallet balance with the top-up action. */
export function ProfileWalletCard({ wallet }: { wallet: IWalletSummary }) {
    return (
        <Card className="p-4">
            <div className="flex items-center justify-between gap-3">
                <div className="flex flex-col items-start">
                    <div className="flex items-center gap-1.5">
                        <span className="text-xs leading-4 text-foreground-muted">
                            موجودی کیف پول
                        </span>
                        <DesignIcon
                            src="/assets/icons/profile/wallet.svg"
                            className="h-3 w-[12.667px]"
                        />
                    </div>

                    <p className="mt-1 flex items-baseline gap-1.5">
                        <span className="text-xl leading-7 font-extrabold text-foreground">
                            {formatToman(wallet.balance)}
                        </span>
                        <span className="text-xs leading-4 font-medium text-foreground-muted">
                            تومان
                        </span>
                    </p>
                </div>

                <LinkButton
                    href="/wallet/top-up"
                    size="sm"
                    trailingIcon={
                        <DesignIcon
                            src="/assets/icons/profile/plus.svg"
                            className="size-[9.333px]"
                        />
                    }
                >
                    افزایش موجودی
                </LinkButton>
            </div>
        </Card>
    );
}
