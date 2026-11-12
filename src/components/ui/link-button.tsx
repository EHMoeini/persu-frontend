import Link from 'next/link';
import type { ReactNode } from 'react';

import { BUTTON_BASE_CLASS_NAME, BUTTON_VARIANT_SIZE_CLASS_NAMES } from './button-styles';

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
            className={`${BUTTON_BASE_CLASS_NAME} ${BUTTON_VARIANT_SIZE_CLASS_NAMES[variant][size]} ${className}`}
        >
            {leadingIcon}
            <span>{children}</span>
            {trailingIcon}
        </Link>
    );
}
