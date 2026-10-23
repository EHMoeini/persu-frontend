import Link from 'next/link';

/** Temporary entry point — sends visitors into the auth flow. */
export default function Page() {
  return (
    <div className="flex flex-1 items-center justify-center px-5 pb-20">
      <Link
        href="/user-check"
        className="flex h-12 w-full max-w-sm items-center justify-center rounded-xl bg-primary px-4 text-sm leading-5 font-bold text-on-accent shadow-action"
      >
        ورود یا ثبت‌نام
      </Link>
    </div>
  );
}
