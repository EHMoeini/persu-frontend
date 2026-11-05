type TMaskedIconProps = {
    /** Design asset served from `/public`. Its alpha channel becomes the mask. */
    src: string;
    /** Size classes — match the asset's intrinsic dimensions from the design. */
    className?: string;
};

/**
 * Uses a single-colour design SVG as an alpha mask so the icon can inherit the
 * current text colour. Needed where the same asset has active and inactive
 * colours (the bottom navigation) without duplicating the file.
 */
export function MaskedIcon({ src, className = '' }: TMaskedIconProps) {
    return (
        <span
            aria-hidden
            className={`block shrink-0 bg-current ${className}`}
            style={{
                maskImage: `url("${src}")`,
                maskRepeat: 'no-repeat',
                maskSize: '100% 100%',
                WebkitMaskImage: `url("${src}")`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskSize: '100% 100%',
            }}
        />
    );
}
