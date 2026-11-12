import { StaticImage } from '@/components/ui/static-image';

/**
 * Persu logo mark — the four exported SVG layers composed at the exact
 * positions used in the design (base vector, clip mask, clipped group,
 * accent vector). The `display: contents` wrappers from the export are
 * inert and omitted; percentages are rounded to whole numbers (≤0.15px drift).
 */
export function LogoMark() {
    return (
        <div className="relative h-7 w-5 overflow-clip">
            <div className="absolute inset-[5%_6%_31%_6%]">
                <div className="absolute inset-[-6%]">
                    <StaticImage
                        src="/assets/brand/logo-mark-base.svg"
                        className="block size-full max-w-none"
                    />
                </div>
            </div>

            <div
                className="absolute inset-[7%_6%_31%_9%] mask-intersect mask-alpha mask-size-[19.8px_19.8px] mask-no-clip mask-position-[-1.5px_-1.4px] mask-no-repeat"
                style={{ maskImage: 'url("/assets/brand/logo-mark-mask.svg")' }}
            >
                <div className="absolute inset-[-1%_0%_-4%_-3%]">
                    <StaticImage
                        src="/assets/brand/logo-mark-clipped.svg"
                        className="block size-full max-w-none"
                    />
                </div>
            </div>

            <div className="absolute inset-[37%_89%_1%_2%]">
                <StaticImage
                    src="/assets/brand/logo-mark-accent.svg"
                    className="absolute inset-0 block size-full max-w-none"
                />
            </div>
        </div>
    );
}
