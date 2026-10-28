import Link from 'next/link';

import { SportShowcaseSwiper } from './SportShowcaseSwiper';

/** Mobile landing hero: intro copy, sign-in action, and the sport model swiper. */
export function SportShowcase() {
    return (
        <section
            aria-labelledby="sport-showcase-title"
            className="flex min-h-[calc(100svh-68px)] flex-col justify-center px-4 pt-6 pb-8 md:hidden"
        >
            <div className="flex flex-col items-center text-center">
                <h1
                    id="sport-showcase-title"
                    className="text-[1.375rem] leading-8 font-bold text-foreground"
                >
                    همه‌ی زمین‌ها، یک‌جا
                </h1>
                <p className="mt-2 max-w-sm text-sm leading-6 text-foreground-muted">
                    فوتبال، والیبال یا تنیس؛ زمین مورد علاقه‌ات را پیدا کن و سانست را در چند ثانیه
                    رزرو کن.
                </p>
                <Link
                    href="/user-check"
                    className="mt-4 flex h-11 items-center justify-center rounded-xl bg-primary px-6 text-sm leading-5 font-bold text-on-accent shadow-action transition-[background-color,transform] hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.98] active:bg-primary-container"
                >
                    ورود یا ثبت‌نام
                </Link>
            </div>

            <div className="mt-4">
                <SportShowcaseSwiper />
            </div>
        </section>
    );
}
