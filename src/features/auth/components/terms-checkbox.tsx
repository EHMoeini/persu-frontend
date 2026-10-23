'use client';

import Link from 'next/link';
import { useId } from 'react';

const linkClassName =
  'font-bold text-primary underline decoration-1 underline-offset-2 [text-decoration-skip-ink:none]';

type TTermsCheckboxProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
};

/** Figma "Label - Terms and Policy Checkbox" — the checkbox sits at the inline end. */
export function TermsCheckbox({ checked, onCheckedChange, disabled }: TTermsCheckboxProps) {
  const inputId = useId();
  const descriptionId = useId();

  return (
    <div className="flex items-start gap-2.5 pt-2">
      <span className="pt-0.5">
        <input
          id={inputId}
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(event.target.checked)}
          disabled={disabled}
          aria-describedby={descriptionId}
          className="peer sr-only"
        />
        <label
          htmlFor={inputId}
          className="flex size-5 cursor-pointer items-center justify-center rounded bg-surface-sunken text-transparent peer-checked:bg-primary peer-checked:text-on-accent peer-focus-visible:ring-2 peer-focus-visible:ring-focus peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-surface-card peer-disabled:cursor-not-allowed peer-disabled:opacity-40"
        >
          <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="none">
            <path
              d="M2 6.2 4.8 9 10 3.8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </label>
      </span>
      <p id={descriptionId} className="flex-1 text-xs leading-5 text-foreground-muted">
        کلیه{' '}
        <Link href="/terms" className={linkClassName}>
          قوانین و مقررات
        </Link>{' '}
        استفاده و{' '}
        <Link href="/privacy" className={linkClassName}>
          سیاست حریم خصوصی
        </Link>{' '}
        پرسو را می‌پذیرم.
      </p>
    </div>
  );
}
