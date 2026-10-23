'use client';

import { useId } from 'react';

import { normalizeOtpInput, toPersianDigits } from '../auth.logic';

type TOtpInputProps = {
  /** Normalized Latin-digit value, up to 4 digits. */
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  ariaInvalid?: boolean;
};

const CELL_COUNT = 4;

/**
 * 4-digit passcode cells — Figma "4-Digit Passcode Input Cells".
 * A single transparent input backs the cells so paste and one-time-code
 * autofill work natively; digits render LTR. The next empty cell gets the
 * design's focus ring while the input is focused.
 */
export function OtpInput({
  value,
  onValueChange,
  disabled,
  ariaLabelledBy,
  ariaDescribedBy,
  ariaInvalid,
}: TOtpInputProps) {
  const inputId = useId();
  /** The cell being typed into; stays on the last cell once the code is full. */
  const activeIndex = Math.min(value.length, CELL_COUNT - 1);

  return (
    <div className="group relative py-2">
      <div dir="ltr" className="flex items-center justify-center gap-3 rounded-xl">
        {Array.from({ length: CELL_COUNT }, (_, index) => (
          <span
            key={index}
            className={`flex h-14 w-12 items-center justify-center rounded-xl bg-surface-muted shadow-input ${
              index === activeIndex
                ? 'group-focus-within:bg-surface-card group-focus-within:ring-2 group-focus-within:ring-primary group-focus-within:ring-inset'
                : ''
            }`}
          >
            <span className="text-xl font-bold text-foreground">
              {value[index] ? (
                toPersianDigits(value[index])
              ) : (
                <span className="text-outline">-</span>
              )}
            </span>
          </span>
        ))}
      </div>

      <input
        id={inputId}
        dir="ltr"
        type="text"
        inputMode="numeric"
        autoComplete="one-time-code"
        value={value}
        onChange={(event) => onValueChange(normalizeOtpInput(event.target.value))}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || undefined}
        className="absolute inset-0 h-full w-full opacity-0"
      />
    </div>
  );
}
