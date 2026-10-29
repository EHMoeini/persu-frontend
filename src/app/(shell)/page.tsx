import Link from 'next/link';

import { SportShowcase } from '@/features/landing/SportShowcase';
import styles from '@/features/landing/landing.module.css';

export default function Page() {
    return (
        <>
            <SportShowcase />
            <div className={`${styles.loginStage} hidden md:flex`}>
                <Link
                    href="/user-check"
                    className="flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-primary px-4 text-sm leading-5 font-bold text-on-accent shadow-action focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                >
                    ورود یا ثبت‌نام
                </Link>
            </div>
        </>
    );
}
