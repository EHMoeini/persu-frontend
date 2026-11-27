'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

/** The search request failed; retrying is the only recovery action. */
export function SearchErrorState({ onRetry }: { onRetry: () => void }) {
    return (
        <Card
            className="flex flex-col items-center gap-3 px-6 py-8 text-center"
            radiusClassName="rounded-2xl"
        >
            <div className="flex flex-col gap-1">
                <h2 className="text-sm leading-5 font-bold text-foreground">
                    دریافت مجموعه‌ها ناموفق بود
                </h2>
                <p className="text-xs leading-5 text-foreground-muted">
                    اتصال خود را بررسی کنید و دوباره تلاش کنید.
                </p>
            </div>

            <Button variant="soft" onClick={onRetry}>
                تلاش دوباره
            </Button>
        </Card>
    );
}
