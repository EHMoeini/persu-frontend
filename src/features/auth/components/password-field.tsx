'use client';

import { useId, useState } from 'react';

import { StaticImage } from '@/components/ui/static-image';

type TPasswordFieldProps = {
  /** Id of the input — the form's label points at it. */
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  placeholder: string;
  error?: string | null;
  disabled?: boolean;
};

/**
 * Password field — Figma "Input" inside the Login/Pass card.
 * The visibility control sits at the inline end (left in RTL), matching
 * the design's eye button; the value itself stays LTR so symbols keep
 * their logical order.
 */
export function PasswordField({
  id,
  value,
  onValueChange,
  placeholder,
  error,
  disabled,
}: TPasswordFieldProps) {
  const errorId = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative flex h-12 items-center rounded-xl bg-surface-muted shadow-input focus-within:ring-2 focus-within:ring-focus">
        <input
          id={id}
          dir="ltr"
          type={visible ? 'text' : 'password'}
          autoComplete="current-password"
          autoCapitalize="off"
          spellCheck={false}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-full w-full rounded-xl bg-transparent pr-4 pl-10 text-right text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed"
        />

        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          disabled={disabled}
          aria-label={visible ? 'مخفی‌سازی کلمه عبور' : 'نمایش کلمه عبور'}
          aria-pressed={visible}
          className="absolute top-1 left-3 flex size-6 items-center justify-center rounded-full disabled:cursor-not-allowed"
        >
          <span className="relative block h-2.75 w-4">
            <StaticImage
              src={visible ? '/assets/icons/eye-off.svg' : '/assets/icons/eye.svg'}
              className="absolute inset-0 block size-full max-w-none"
            />
          </span>
        </button>
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs leading-4 text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
