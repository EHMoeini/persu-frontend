'use client';

import { useId } from 'react';

import { FieldLabel } from '@/components/ui/field-label';
import { StaticImage } from '@/components/ui/static-image';

type TNameFieldProps = {
  value: string;
  onValueChange: (value: string) => void;
  error?: string | null;
  disabled?: boolean;
};

/**
 * Full-name field — Figma "Full Name Input".
 * The id-card icon sits at the inline start (right in RTL), inside the
 * same muted shell as the rest of the auth fields.
 */
export function NameField({ value, onValueChange, error, disabled }: TNameFieldProps) {
  const inputId = useId();
  const errorId = useId();

  return (
    <div className="flex flex-col gap-2">
      <FieldLabel htmlFor={inputId} required>
        نام و نام خانوادگی
      </FieldLabel>

      <div className="relative flex h-12 items-center rounded-xl bg-surface-muted focus-within:ring-2 focus-within:ring-focus">
        <span className="pointer-events-none absolute start-3 flex size-4 items-center justify-center">
          <StaticImage src="/assets/icons/id-card.svg" className="block size-full" />
        </span>

        <input
          id={inputId}
          type="text"
          autoComplete="name"
          placeholder="مثال: علیرضا شمس"
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-full w-full rounded-xl bg-transparent ps-10 pe-4 text-right text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed"
        />
      </div>

      {error ? (
        <p id={errorId} role="alert" className="text-xs leading-4 text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
