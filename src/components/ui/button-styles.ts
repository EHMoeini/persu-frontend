/** Shared class names for the design's action buttons. */
export const BUTTON_BASE_CLASS_NAME =
    'flex items-center justify-center font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus';

export const BUTTON_VARIANT_SIZE_CLASS_NAMES = {
    primary: {
        md: 'min-h-12 w-full gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm leading-5 text-on-accent shadow-action hover:bg-primary-container active:bg-primary',
        sm: 'min-h-0 w-auto gap-1 rounded-lg bg-primary px-3.5 py-2 text-xs leading-4 text-on-accent shadow-action hover:bg-primary-container active:bg-primary',
    },
    soft: {
        md: 'min-h-11 w-full gap-2 rounded-xl bg-surface-high px-4 py-3 text-xs leading-4 text-primary hover:bg-primary-fixed',
        sm: 'min-h-0 w-auto gap-1 rounded-lg bg-surface-high px-3 py-1.5 text-xs leading-4 text-primary hover:bg-primary-fixed',
    },
} as const;
