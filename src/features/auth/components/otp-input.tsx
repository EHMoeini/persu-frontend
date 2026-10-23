'use client';

import { useId } from 'react';

import { normalizeOtpInput, toPersianDigits } from '../auth.logic';

type TOtpInputProps = {
  /** Normalized Latin-digit value, up to 4 digits. */
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
};

const CELL_COUNT = 4;

/**
 * 4-digit passcode cells — Figma "4-Digit Passcode Input Cells".
 * A single transparent input backs the cells so paste and one-time-code
 * autofill work natively; digits render LTR.
 */
export function OtpInput({ value, onValueChange, disabled }: TOtpInputProps) {
  const inputId = useId();

  return (
    <div className="relative py-2">
      <div dir="ltr" className="flex items-center justify-center gap-3 rounded-xl">
        {Array.from({ length: CELL_COUNT }, (_, index) => (
          <span
            key={index}
            className="flex h-14 w-12 items-center justify-center rounded-xl bg-surface-muted shadow-input"
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

        className="absolute inset-0 h-full w-full opacity-0"
      />
    </div>
  );
}
