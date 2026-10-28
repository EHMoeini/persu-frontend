import type { ButtonHTMLAttributes, ReactNode } from 'react';

import { Spinner } from './spinner';

type TButtonProps = {
    children: ReactNode;
    /** Trailing icon — placed after the label in reading order (left of it in RTL). */
    icon?: ReactNode;
    loading?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** Primary action button — Figma "Primary Action Button". */
export function Button({
    children,
    icon,
    loading = false,
    disabled,
    type = 'button',
    ...rest
}: TButtonProps) {
    return (
        <button
            type={type}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm leading-5 font-bold text-on-accent shadow-action transition-[background-color,transform] enabled:hover:bg-primary-container enabled:active:scale-[0.98] enabled:active:bg-primary-container disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
            {...rest}
        >
            <span>{children}</span>
            {loading ? <Spinner className="size-3" /> : icon}
        </button>
    );
}
