import Link from 'next/link';
import type { ReactNode } from 'react';

type TLinkButtonProps = {
    href: string;
    children: ReactNode;
    /** Solid primary action or the soft accent used by support actions. */
    variant?: 'primary' | 'soft';
    /** Icon placed at the inline start (right in RTL). */
    leadingIcon?: ReactNode;
    /** Icon placed at the inline end (left in RTL). */
    trailingIcon?: ReactNode;
    className?: string;
};

const BASE_CLASS_NAME =
    'flex w-full items-center justify-center gap-2 rounded-xl font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

const VARIANT_CLASS_NAMES = {
    primary:
        'min-h-12 bg-primary px-6 py-3.5 text-sm leading-5 text-on-accent shadow-action hover:bg-primary-container active:bg-primary',
    soft: 'min-h-11 bg-surface-high px-4 py-3 text-xs leading-4 text-primary hover:bg-primary-fixed',
} as const;

/** Link styled as one of the design's action buttons — Figma "Link" nodes. */
export function LinkButton({
    href,
    children,
    variant = 'primary',
    leadingIcon,
    trailingIcon,
    className = '',
}: TLinkButtonProps) {
    return (
        <Link
            href={href}
            className={`${BASE_CLASS_NAME} ${VARIANT_CLASS_NAMES[variant]} ${className}`}
        >
            {leadingIcon}
            <span>{children}</span>
            {trailingIcon}
        </Link>
    );
}
