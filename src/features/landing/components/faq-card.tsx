import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';

import styles from '../landing.module.css';

type TFaq = {
    question: string;
    answer: string;
};

const FAQS: TFaq[] = [
    {
        question: 'آیا رزرو من در سالن قطعی و تضمین‌شده است؟',
        answer: 'بله؛ پس از پرداخت، سانس شما بلافاصله در تقویم سالن قفل می‌شود و رسید رزرو برایتان صادر می‌گردد.',
    },
    {
        question: 'قوانین لغو سانس و بازگشت وجه چگونه است؟',
        answer: 'تا ۲۴ ساعت پیش از شروع سانس می‌توانید بدون جریمه لغو کنید؛ مبلغ طبق قوانین مجموعه به کیف پول یا حساب شما بازمی‌گردد.',
    },
];

/** Compact FAQ accordion for the landing page. */
export function FaqCard() {
    return (
        <Card className="p-4" radiusClassName="rounded-2xl">
            <div className="flex items-center gap-2">
                <DesignIcon src="/assets/icons/landing/faq.svg" className="size-[15px]" />
                <h2 className="text-sm leading-5 font-bold text-foreground">
                    پرسش‌های متداول ورزشکاران
                </h2>
            </div>

            <div className="mt-3 flex flex-col gap-2">
                {FAQS.map((faq) => (
                    <details
                        key={faq.question}
                        className={`${styles.faq} rounded-xl bg-surface-muted p-3`}
                    >
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden">
                            <span className="text-xs leading-4 font-medium text-foreground">
                                {faq.question}
                            </span>
                            <DesignIcon
                                src="/assets/icons/landing/chevron-down.svg"
                                className={`h-[4.933px] w-2 ${styles.faqChevron}`}
                            />
                        </summary>
                        <p className="pt-3 text-xs leading-5 text-foreground-muted">{faq.answer}</p>
                    </details>
                ))}
            </div>
        </Card>
    );
}
