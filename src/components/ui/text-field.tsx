'use client';

import { useId, type ReactNode } from 'react';

import { FieldLabel } from './field-label';
import { HelperNote } from './helper-note';
import { StaticImage } from './static-image';

type TTextFieldProps = {
    label: string;
    value: string;
    onValueChange: (value: string) => void;
    /** Optional leading icon served from /public, at the inline start (right in RTL). */
    icon?: string;
    placeholder?: string;
    maxLength?: number;
    required?: boolean;
    /** Hint shown under the field; replaced by `error` when present. */
    helper?: ReactNode;
    error?: string | null;
    disabled?: boolean;
    autoComplete?: string;
    autoFocus?: boolean;
    type?: 'text' | 'email' | 'url';
    dir?: 'rtl' | 'ltr';
};

/**
 * Single-line text field — the same muted shell as the auth fields.
 * The optional icon sits at the inline start (right in RTL).
 */
export function TextField({
    label,
    value,
    onValueChange,
    icon,
    placeholder,
    maxLength,
    required,
    helper,
    error,
    disabled,
    autoComplete,
    autoFocus,
    type = 'text',
    dir,
}: TTextFieldProps) {
    const inputId = useId();
    const messageId = useId();

    return (
        <div className="flex flex-col gap-2">
            <FieldLabel htmlFor={inputId} required={required}>
                {label}
            </FieldLabel>

            <div className="relative flex h-12 items-center rounded-xl bg-surface-muted focus-within:ring-2 focus-within:ring-focus">
                {icon ? (
                    <span className="pointer-events-none absolute start-3 flex size-4 items-center justify-center">
                        <StaticImage src={icon} className="block size-full" />
                    </span>
                ) : null}

                <input
                    id={inputId}
                    type={type}
                    dir={dir}
                    autoComplete={autoComplete}
                    maxLength={maxLength}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    disabled={disabled}
                    autoFocus={autoFocus}
                    data-autofocus={autoFocus ? '' : undefined}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error || helper ? messageId : undefined}
                    className={`h-full w-full rounded-xl bg-transparent ${icon ? 'ps-10' : 'ps-4'} pe-4 text-right text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed`}
                />
            </div>

            {error ? (
                <p id={messageId} role="alert" className="text-xs leading-4 text-error">
                    {error}
                </p>
            ) : helper ? (
                <HelperNote>
                    <span id={messageId}>{helper}</span>
                </HelperNote>
            ) : null}
        </div>
    );
}
