import { StaticImage } from './static-image';

type TDesignIconProps = {
    /** Design asset served from `/public`. */
    src: string;
    /** Size classes — match the asset's intrinsic dimensions from the design. */
    className: string;
};

/** Fixed-size, decorative design icon. `className` carries the exact box from Figma. */
export function DesignIcon({ src, className }: TDesignIconProps) {
    return (
        <span aria-hidden className={`relative block shrink-0 ${className}`}>
            <StaticImage src={src} className="absolute inset-0 block size-full max-w-none" />
        </span>
    );
}
