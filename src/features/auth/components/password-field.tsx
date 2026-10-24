'use client';

import { useId, useState } from 'react';

import { FieldLabel } from '@/components/ui/field-label';
import { StaticImage } from '@/components/ui/static-image';

type TPasswordFieldProps = {
    /** Id of the input — the form's label points at it. */
    id: string;
    value: string;
    onValueChange: (value: string) => void;
    placeholder: string;
    /** Optional label rendered above the shell; auth login supplies its own label row. */
    label?: string;
    required?: boolean;
    /** Optional leading icon served from /public, at the inline start (right in RTL). */
    icon?: string;
    autoComplete?: 'current-password' | 'new-password';
    error?: string | null;
    disabled?: boolean;
};

/**
 * Password field — Figma "Password Input".
 * The visibility control sits at the inline end (left in RTL); an optional
 * leading icon sits at the inline start. The value stays LTR so symbols
 * keep their logical order.
 */
export function PasswordField({
    id,
    value,
    onValueChange,
    placeholder,
    label,
    required,
    icon,
    autoComplete = 'current-password',
    error,
    disabled,
}: TPasswordFieldProps) {
    const errorId = useId();
    const [visible, setVisible] = useState(false);

    return (
        <div className="flex flex-col gap-2">
            {label ? (
                <FieldLabel htmlFor={id} required={required}>
                    {label}
                </FieldLabel>
            ) : null}

            <div className="relative flex h-12 items-center rounded-xl bg-surface-muted shadow-input focus-within:ring-2 focus-within:ring-focus">
                {icon ? (
                    <span className="pointer-events-none absolute start-3 flex h-4 w-3 items-center justify-center">
                        <StaticImage src={icon} className="block size-full" />
                    </span>
                ) : null}

                <input
                    id={id}
                    dir="ltr"
                    type={visible ? 'text' : 'password'}
                    autoComplete={autoComplete}
                    autoCapitalize="off"
                    spellCheck={false}
                    placeholder={placeholder}
                    value={value}
                    onChange={(event) => onValueChange(event.target.value)}
                    disabled={disabled}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`h-full w-full rounded-xl bg-transparent pe-10 ${icon ? 'ps-10' : 'ps-4'} text-right text-sm text-foreground placeholder:text-placeholder focus:outline-none disabled:cursor-not-allowed`}
                />

                <button
                    type="button"
                    onClick={() => setVisible((current) => !current)}
                    disabled={disabled}
                    aria-label={visible ? 'مخفی‌سازی کلمه عبور' : 'نمایش کلمه عبور'}
                    aria-pressed={visible}
                    className="absolute end-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full disabled:cursor-not-allowed"
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
