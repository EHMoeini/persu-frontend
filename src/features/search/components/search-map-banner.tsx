import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';
import { MaskedIcon } from '@/components/ui/masked-icon';

/** Interstitial shortcut from the venue list to the map experience. */
export function SearchMapBanner() {
    return (
        <div className="flex items-center justify-between gap-3 rounded-2xl bg-linear-to-l from-primary-fixed to-surface-high p-3.5">
            <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary drop-shadow-subtle">
                    <DesignIcon src="/assets/icons/search/map.svg" className="size-[16.5px]" />
                </span>

                <div className="flex min-w-0 flex-col items-start">
                    <p className="text-xs leading-4 font-bold text-foreground">
                        جستجوی زنده روی نقشه تهران
                    </p>
                    <p className="mt-1 text-[11px] leading-[16.5px] font-medium text-foreground-muted">
                        مشاهده سالن‌های نزدیک با قابلیت تفکیک سانس
                    </p>
                </div>
            </div>

            <LinkButton
                href="/search/map"
                prefetch={false}
                variant="surface"
                size="card"
                className="shrink-0"
                trailingIcon={
                    <MaskedIcon
                        src="/assets/icons/landing/chevron-down.svg"
                        className="h-[4.317px] w-[7px] rotate-90 text-primary"
                    />
                }
            >
                نمایش
            </LinkButton>
        </div>
    );
}
