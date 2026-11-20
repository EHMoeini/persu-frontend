import type { ReactNode } from 'react';

export type TIconChipTone = 'sunken' | 'muted' | 'high';

const TONE_CLASS_NAMES: Record<TIconChipTone, string> = {
    sunken: 'bg-surface-sunken',
    muted: 'bg-surface-muted',
    high: 'bg-surface-high',
};

type TIconChipBaseProps = {
    children: ReactNode;
    /** Surface role; the default sunken chip is the header/auth back control. */
    tone?: TIconChipTone;
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
    radiusClassName = 'rounded-lg',
}: TIconChipProps) {
    const className = `flex size-10 shrink-0 items-center justify-center ${radiusClassName} ${TONE_CLASS_NAMES[tone]} drop-shadow-subtle`;

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
