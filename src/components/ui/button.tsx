import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { BUTTON_BASE_CLASS_NAME, BUTTON_VARIANT_SIZE_CLASS_NAMES } from './button-styles';
import { Spinner } from './spinner';

type TButtonProps = {
    children: ReactNode;
    /** Trailing icon — placed after the label in reading order (left of it in RTL). */
    icon?: ReactNode;
    loading?: boolean;
    /** Solid primary action or the soft accent used by compact in-card actions. */
    variant?: 'primary' | 'soft';
    /** Compact pill; only meaningful with `variant="soft"`. */
    size?: 'sm';
} & ButtonHTMLAttributes<HTMLButtonElement>;

const PRIMARY_CLASS_NAME =
    'flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm leading-5 font-bold text-on-accent shadow-action transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

/** Primary action button — Figma "Primary Action Button". */
export function Button({
    children,
    icon,
    loading = false,
    variant = 'primary',
    size = 'sm',
    disabled,
    type = 'button',
    ...rest
}: TButtonProps) {
    const variantClassName =
        variant === 'soft'
            ? `${BUTTON_BASE_CLASS_NAME} ${BUTTON_VARIANT_SIZE_CLASS_NAMES.soft[size]}`
            : PRIMARY_CLASS_NAME;

    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className={`${variantClassName} disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none`}
            {...rest}
        >
            <span>{children}</span>
            {loading ? <Spinner className="size-3" /> : icon}
        </button>
    );
}
