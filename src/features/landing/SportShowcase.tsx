import { DesignIcon } from '@/components/ui/design-icon';

import { SportShowcaseSwiper } from './SportShowcaseSwiper';

/** Landing hero: intro copy plus the existing low-poly sport swiper in its viewport. */
export function SportShowcase() {
    return (
        <section
            aria-labelledby="sport-showcase-title"
            className="relative flex w-full flex-col items-center overflow-hidden"
        >
            <div className="relative flex w-full flex-col items-center">
                <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-surface-high px-3 py-1 text-xs leading-4 font-medium text-primary drop-shadow-subtle">
                    <DesignIcon
                        src="/assets/icons/landing/hero-badge-spark.svg"
                        className="h-[13.333px] w-[10.667px]"
                    />
                    رزرو آنی بیش از ۵۰۰ زمین ورزشی
                </span>

                <h1
                    id="sport-showcase-title"
                    className="text-center text-[28px] leading-[35px] font-extrabold text-foreground"
                >
                    همه‌ی زمین‌ها، یک‌جا
                </h1>

                <p className="mt-3 max-w-[358px] text-center text-sm leading-[22.75px] text-foreground-muted">
                    کشف و رزرو آنلاین بهترین سالن‌ها و زمین‌های ورزشی؛ بدون نیاز به تماس تلفنی و
                    گشت‌وگذار در پلتفرم‌های مختلف.
                </p>

                <div className="mt-6 flex aspect-square w-full max-w-80 items-center justify-center overflow-hidden rounded-3xl bg-surface-muted shadow-input">
                    <SportShowcaseSwiper />
                </div>
            </div>
        </section>
    );
}
