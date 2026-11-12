import { Card } from '@/components/ui/card';
import { DesignIcon } from '@/components/ui/design-icon';
import { LinkButton } from '@/components/ui/link-button';

type TContactItem = {
    id: string;
    label: string;
    value: string;
    icon: string;
    iconClassName: string;
    href?: string;
    valueClassName?: string;
    valueDir?: 'ltr' | 'rtl';
};

const CONTACTS: TContactItem[] = [
    {
        id: 'phone',
        label: 'شماره تماس پشتیبانی',
        value: '۰۲۱-۸۸۹۹۰۰۲۲',
        icon: '/assets/icons/landing/contact-phone.svg',
        iconClassName: 'size-[15px]',
        href: 'tel:+982188990022',
        valueClassName: 'font-bold text-primary',
    },
    {
        id: 'email',
        label: 'ایمیل رسمی پرسو',
        value: 'support@persu.ir',
        icon: '/assets/icons/landing/contact-mail.svg',
        iconClassName: 'h-[13.333px] w-[16.667px]',
        href: 'mailto:support@persu.ir',
        valueDir: 'ltr',
    },
    {
        id: 'hours',
        label: 'ساعات پاسخگویی',
        value: 'همه‌روزه از ساعت ۸ الی ۲۴',
        icon: '/assets/icons/landing/contact-clock.svg',
        iconClassName: 'size-[16.667px]',
    },
];

const ROW_CLASS_NAME =
    'flex items-center justify-between gap-2 rounded-xl bg-surface-muted p-3 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** Landing support section: contact channels and the support message action. */
export function ContactCard() {
    return (
        <Card className="p-5" radiusClassName="rounded-2xl">
            <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-surface-high">
                    <DesignIcon
                        src="/assets/icons/landing/support-headset.svg"
                        className="h-[14.25px] w-[15.833px]"
                    />
                </span>
                <h2 className="text-base leading-6 font-bold text-foreground">
                    با ما در ارتباط باشید
                </h2>
            </div>

            <p className="mt-1.5 text-xs leading-[19.5px] text-foreground-muted">
                سوالی دارید یا به راهنمایی در رزرو نیاز دارید؟ تیم پشتیبانی پرسو همیشه آماده
                پاسخگویی به شماست.
            </p>

            <div className="mt-4 flex flex-col gap-2.5">
                {CONTACTS.map((contact) => {
                    const content = (
                        <>
                            <span className="flex items-center gap-2.5">
                                <DesignIcon src={contact.icon} className={contact.iconClassName} />
                                <span className="text-xs leading-4 font-medium text-foreground">
                                    {contact.label}
                                </span>
                            </span>
                            <span
                                dir={contact.valueDir}
                                className={`text-xs leading-4 text-foreground-muted ${
                                    contact.valueClassName ?? ''
                                }`}
                            >
                                {contact.value}
                            </span>
                        </>
                    );

                    return contact.href ? (
                        <a
                            key={contact.id}
                            href={contact.href}
                            className={`${ROW_CLASS_NAME} hover:bg-surface-high`}
                        >
                            {content}
                        </a>
                    ) : (
                        <div key={contact.id} className={ROW_CLASS_NAME}>
                            {content}
                        </div>
                    );
                })}
            </div>

            <LinkButton
                href="mailto:support@persu.ir"
                variant="soft"
                className="mt-4"
                leadingIcon={
                    <DesignIcon src="/assets/icons/landing/send.svg" className="size-[15px]" />
                }
            >
                ارسال پیام به پشتیبانی
            </LinkButton>
        </Card>
    );
}
