import Link from 'next/link';
import type { ReactNode } from 'react';

import { BUTTON_BASE_CLASS_NAME, BUTTON_VARIANT_SIZE_CLASS_NAMES } from './button-styles';

type TLinkButtonProps = {
    href: string;
    children: ReactNode;
    /** Solid primary action, the soft accent, or a white action on a tinted surface. */
    variant?: 'primary' | 'soft' | 'surface';
    /** Full-width CTA (`md`), compact pill (`sm`), or the in-card CTA (`card`). */
    size?: 'md' | 'sm' | 'card';
    /** Icon placed at the inline start (right in RTL). */
    leadingIcon?: ReactNode;
    /** Icon placed at the inline end (left in RTL). */
    trailingIcon?: ReactNode;
    className?: string;
    /** Disable Next prefetching for routes that are not implemented yet. */
    prefetch?: boolean;
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
    prefetch,
}: TLinkButtonProps) {
    return (
        <Link
            href={href}
            prefetch={prefetch}
            className={`${BUTTON_BASE_CLASS_NAME} ${BUTTON_VARIANT_SIZE_CLASS_NAMES[variant][size]} ${className}`}
        >
            {leadingIcon}
            <span>{children}</span>
            {trailingIcon}
        </Link>
    );
}
