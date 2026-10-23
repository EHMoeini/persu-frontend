import Link from 'next/link';

const linkClassName =
  'font-medium text-primary underline decoration-1 [text-decoration-skip-ink:none] [text-underline-position:from-font]';

/** Figma "Legal Terms Note" — shared by all auth screens. */
export function AuthLegalNote() {
  return (
    <footer className="px-5 pt-12 pb-9">
      <p className="text-center text-[11px] leading-4.5 text-outline">
        ورود شما به منزله پذیرش{' '}
        <Link href="/terms" className={linkClassName}>
          شرایط و قوانین
        </Link>{' '}
        و{' '}
        <Link href="/privacy" className={linkClassName}>
          حریم خصوصی
        </Link>{' '}
        پلتفرم ورزشی پرسو&nbsp;است.
      </p>
    </footer>
  );
}
