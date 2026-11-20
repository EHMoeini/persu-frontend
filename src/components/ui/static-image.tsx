/* eslint-disable @next/next/no-img-element */
import type { CSSProperties } from 'react';

type TStaticImageProps = {
    /** Path or URL of the image to render. */
    src: string;
    /** Accessible name for content imagery; decorative design assets stay empty. */
    alt?: string;
    className?: string;
    style?: CSSProperties;
};

/**
 * Renders a design asset exactly as exported (decorative by default).
 * `next/image` adds nothing for local, fixed-size SVG assets and would
 * disturb their intrinsic dimensions — this keeps them pixel-identical
 * to the Figma export. All static design assets go through this component
 * so the `no-img-element` exemption lives in exactly one place.
 */
export function StaticImage({ src, alt = '', className, style }: TStaticImageProps) {
    return <img alt={alt} src={src} className={className} style={style} />;
}
