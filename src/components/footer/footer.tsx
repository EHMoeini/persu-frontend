import Link from 'next/link';

const FOOTER_LINKS = [
    { href: '/', label: 'صفحه اصلی' },
    { href: '/venues', label: 'جستجوی مجموعه‌ها' },
    { href: '/bookings', label: 'پیگیری نوبت‌ها' },
    { href: '/terms', label: 'قوانین و پشتیبانی' },
];

/** Shell footer — brand summary, quick links, and the copyright line. */
export default function Footer() {
    return (
        <footer className="bg-surface-card/90 px-5 pt-8 pb-[calc(env(safe-area-inset-bottom)+8rem)]">
            <div className="flex flex-col gap-2">
                <h2 className="text-sm leading-5 font-bold text-foreground">سامانه هوشمند پرسو</h2>

                <p className="text-xs leading-5 text-foreground-muted">
                    پلتفرم جامع کشف، استعلام لحظه‌ای و رزرو آنلاین زمین‌های چمن، تنیس، پدل و
                    سالن‌های ورزشی سراسر کشور.
                </p>

                <nav aria-label="لینک‌های پانوشت" className="grid grid-cols-2 gap-3 pt-4">
                    {FOOTER_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="rounded py-1 text-xs leading-4 text-foreground-muted transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <p className="pt-8 text-center text-[11px] leading-[16.5px] text-foreground-muted">
                    © ۲۰۲۵ Persu Athletic Space. تمامی حقوق محفوظ است.
                </p>
            </div>
        </footer>
    );
}
