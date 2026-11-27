import type { ReactNode } from 'react';

export type TIconChipTone = 'sunken' | 'muted' | 'high';
export type TIconChipSize = 'md' | 'sm';

const TONE_CLASS_NAMES: Record<TIconChipTone, string> = {
    sunken: 'bg-surface-sunken',
    muted: 'bg-surface-muted',
    high: 'bg-surface-high',
};

const SIZE_CLASS_NAMES: Record<TIconChipSize, string> = {
    md: 'size-10',
    sm: 'size-8',
};

type TIconChipBaseProps = {
    children: ReactNode;
    /** Surface role; the default sunken chip is the header/auth back control. */
    tone?: TIconChipTone;
    /** Chip size; `sm` is the 32px inline action. */
    size?: TIconChipSize;
    /** Corner radius utility; defaults to the 8px chip radius. */
    radiusClassName?: string;
};

type TIconChipProps = TIconChipBaseProps &
    ({ label: string; onClick: () => void } | { label?: never; onClick?: never });

/**
 * 40px rounded chip on the sunken surface. The logo container and the back
 * button in the auth app bar are the same chip — this is that one chip.
 */
export function IconChip({
    children,
    label,
    onClick,
    tone = 'sunken',
    size = 'md',
    radiusClassName = 'rounded-lg',
}: TIconChipProps) {
    const className = `flex ${SIZE_CLASS_NAMES[size]} shrink-0 items-center justify-center ${radiusClassName} ${TONE_CLASS_NAMES[tone]} drop-shadow-subtle`;

    if (onClick) {
        return (
            <button
                type="button"
                aria-label={label}
                onClick={onClick}
                className={`${className} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`}
            >
                {children}
            </button>
        );
    }

    return <div className={className}>{children}</div>;
}
