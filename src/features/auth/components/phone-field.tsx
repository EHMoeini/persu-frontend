'use client';

import { useId } from 'react';

import { FieldLabel } from '@/components/ui/field-label';
import { HelperNote } from '@/components/ui/helper-note';

import { normalizePhoneInput, toPersianDigits } from '../auth.logic';

type TPhoneFieldProps = {
    /** Normalized Latin-digit value (what gets submitted). */
    value: string;
    onValueChange: (value: string) => void;
    /** Hint shown under the field; replaced by `error` when present. */
    hint?: string;
    error?: string | null;
    disabled?: boolean;
};

/**
 * Iranian mobile field — Figma "Input Shell with Country Selector & Clean RTL/LTR Balance".
 * Digits are stored as Latin but rendered as Persian; the text itself is LTR
 * inside the RTL shell, with the country tag pinned to the inline start (right).
 */
export function PhoneField({ value, onValueChange, hint, error, disabled }: TPhoneFieldProps) {
    const inputId = useId();
    const hintId = useId();
    const errorId = useId();

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel htmlFor={inputId}>شماره موبایل</FieldLabel>

            <div className="flex h-12 items-center rounded-xl bg-surface-muted ps-3 focus-within:ring-2 focus-within:ring-focus">
                <span className="flex h-7 shrink-0 items-center gap-1.5 rounded-lg bg-surface-card px-2.5 drop-shadow-subtle">
                    <span className="text-xs leading-4 font-bold text-foreground">۹۸+</span>
                    <span className="flex h-3.5 w-5 shrink-0 flex-col overflow-clip rounded-sm">
                        <span className="min-h-px w-full flex-1 bg-success" />
                        <span className="min-h-px w-full flex-1 bg-white" />
                        <span className="min-h-px w-full flex-1 bg-error" />
                    </span>
                </span>

                <input
                    id={inputId}
                    dir="ltr"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel-national"
                    placeholder="۰۹۱۲۳۴۵۶۷۸۹"
                    value={toPersianDigits(value)}
                    onChange={(event) => onValueChange(normalizePhoneInput(event.target.value))}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : hint ? hintId : undefined}
                    className="h-full min-w-0 flex-1 rounded-xl bg-transparent pl-3 text-left text-base tracking-wider text-foreground placeholder:text-outline focus:outline-none disabled:cursor-not-allowed"
                />
            </div>

            {error ? (
                <p id={errorId} role="alert" className="text-xs leading-4 text-error">
                    {error}
                </p>
            ) : hint ? (
                <HelperNote>
                    <span id={hintId}>{hint}</span>
                </HelperNote>
            ) : null}
        </div>
    );
}
