'use client';

import { useRouter } from 'next/navigation';

import { IconChip } from '@/components/ui/icon-chip';
import { StaticImage } from '@/components/ui/static-image';

/** App-bar back control. Falls back to the home page when there is no history. */
export function BackButton() {
  const router = useRouter();

  const handleClick = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };

  return (
    <IconChip label="بازگشت" onClick={handleClick}>
      <span className="relative size-3.75">
        <StaticImage
          src="/assets/icons/arrow-back.svg"
          className="absolute inset-0 block size-full max-w-none"
        />
      </span>
    </IconChip>
  );
}
