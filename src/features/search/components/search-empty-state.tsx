'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';

/** No-results state; the only recovery action is clearing the filters. */
export function SearchEmptyState({ onReset }: { onReset: () => void }) {
    return (
        <Card
            className="flex flex-col items-center gap-3 px-6 py-8 text-center"
            radiusClassName="rounded-2xl"
        >
            <span className="flex size-12 items-center justify-center rounded-full bg-surface-muted">
                <DesignIcon src="/assets/icons/landing/nav-search.svg" className="size-[18px]" />
            </span>

            <div className="flex flex-col gap-1">
                <h2 className="text-sm leading-5 font-bold text-foreground">
                    مجموعه‌ای با این مشخصات پیدا نشد
                </h2>
                <p className="text-xs leading-5 text-foreground-muted">
                    عبارت جستجو یا فیلترها را تغییر دهید تا نتایج بیشتری ببینید.
                </p>
            </div>

            <Button variant="soft" onClick={onReset}>
                پاک کردن فیلترها
            </Button>
        </Card>
    );
}
