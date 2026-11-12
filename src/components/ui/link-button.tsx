import Link from 'next/link';
import type { ReactNode } from 'react';

type TLinkButtonProps = {
    href: string;
    children: ReactNode;
    /** Solid primary action or the soft accent used by support actions. */
    variant?: 'primary' | 'soft';
    /** Full-width CTA (`md`) or the compact in-card pill (`sm`). */
    size?: 'md' | 'sm';
    /** Icon placed at the inline start (right in RTL). */
    leadingIcon?: ReactNode;
    /** Icon placed at the inline end (left in RTL). */
    trailingIcon?: ReactNode;
    className?: string;
};

const BASE_CLASS_NAME =
    'flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

const VARIANT_SIZE_CLASS_NAMES = {
    primary: {
        md: 'min-h-12 w-full gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm leading-5 text-on-accent shadow-action hover:bg-primary-container active:bg-primary',
        sm: 'min-h-0 w-auto gap-1 rounded-lg bg-primary px-3.5 py-2 text-xs leading-4 text-on-accent shadow-action hover:bg-primary-container active:bg-primary',
    },
    soft: {
        md: 'min-h-11 w-full gap-2 rounded-xl bg-surface-high px-4 py-3 text-xs leading-4 text-primary hover:bg-primary-fixed',
        sm: 'min-h-0 w-auto gap-1 rounded-lg bg-surface-high px-3 py-1.5 text-xs leading-4 text-primary hover:bg-primary-fixed',
    },
} as const;

/** Link styled as one of the design's action buttons — Figma "Link" nodes. */
export function LinkButton({
    href,
    children,
    variant = 'primary',
    size = 'md',
    leadingIcon,
    trailingIcon,
    className = '',
}: TLinkButtonProps) {
    return (
        <Link
            href={href}
            className={`${BASE_CLASS_NAME} ${VARIANT_SIZE_CLASS_NAMES[variant][size]} ${className}`}
        >
            {leadingIcon}
            <span>{children}</span>
            {trailingIcon}
        </Link>
    );
}
