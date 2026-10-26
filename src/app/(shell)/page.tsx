import Link from 'next/link';

import { PitchBackground } from '@/features/landing/football-scene';
import styles from '@/features/landing/landing.module.css';

/** Height of the shell header, used to dock the intro scroll runway. */
const HEADER_HEIGHT = 68;

export default function Page() {
    return (
        <PitchBackground
            className={styles.page}
            breakpoint={2000}
            topOffset={HEADER_HEIGHT}
            scrollScreens={2}
            reducedMotion="skip"
        >
            <div className={styles.loginStage}>
                <Link
                    href="/user-check"
                    className="flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-primary px-4 text-sm leading-5 font-bold text-on-accent shadow-action transition-[background-color,transform] hover:bg-primary-container focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus active:scale-[0.98] active:bg-primary-container"
                >
                    ورود یا ثبت‌نام
                </Link>
            </div>
        </PitchBackground>
    );
}
