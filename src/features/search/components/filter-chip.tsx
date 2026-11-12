'use client';

import { DesignIcon } from '@/components/ui/design-icon';
import { MaskedIcon } from '@/components/ui/masked-icon';

type TFilterChipVariant = 'sport' | 'utility' | 'option';

type TFilterChipProps = {
    label: string;
    active: boolean;
    onClick: () => void;
    variant?: TFilterChipVariant;
    /** Design asset for the chip glyph; option chips omit it. */
    icon?: string;
    iconClassName?: string;
    /** Single-colour glyphs follow the chip's current text colour. */
    maskIcon?: boolean;
};

const VARIANT_CLASS_NAMES: Record<TFilterChipVariant, string> = {
    sport: 'gap-1.5 px-3.5',
    utility: 'gap-1 px-3',
    option: 'gap-1.5 px-3.5',
};

const INACTIVE_CLASS_NAMES: Record<TFilterChipVariant, string> = {
    sport: 'bg-surface-card text-foreground-muted drop-shadow-subtle hover:text-foreground',
    utility: 'bg-surface-high text-foreground-muted hover:bg-surface-sunken',
    option: 'bg-surface-muted text-foreground-muted hover:bg-surface-high',
};

/** Capsule chip shared by the filter carousel and the advanced-filter sheet. */
export function FilterChip({
    label,
    active,
    onClick,
    variant = 'sport',
    icon,
    iconClassName = 'size-4',
    maskIcon = false,
}: TFilterChipProps) {
    const stateClassName = active
        ? 'bg-primary font-semibold text-on-accent'
        : `${INACTIVE_CLASS_NAMES[variant]} font-medium`;

    return (
        <button
            type="button"
            aria-pressed={active}
            onClick={onClick}
            className={`flex h-8 shrink-0 items-center rounded-full text-xs leading-4 transition-colors ${VARIANT_CLASS_NAMES[variant]} ${stateClassName} focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus`}
        >
            {icon ? (
                maskIcon ? (
                    <MaskedIcon src={icon} className={iconClassName} />
                ) : (
                    <DesignIcon src={icon} className={iconClassName} />
                )
            ) : null}
            <span className="whitespace-nowrap">{label}</span>
        </button>
    );
}
