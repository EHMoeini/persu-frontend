import { StaticImage } from '@/components/ui/static-image';

/** Opacity ramp along the ball's trail; the ball itself is the brightest end. */
const TRAIL_DOTS = [0.35, 0.45, 0.55, 0.65, 0.75, 0.85];

/**
 * Decorative boundary between the page content and the footer: a football
 * player silhouette kicking a ball along the divider line, with the ball
 * travelling right.
 */
export function FooterDivider() {
    return (
        <div aria-hidden className="relative h-10">
            <div className="absolute inset-x-0 bottom-0 h-px bg-outline-muted/60" />

            <div dir="ltr" className="relative flex h-full items-end px-12">
                <StaticImage
                    src="/assets/images/football-kick-player.svg"
                    className="h-full w-auto shrink-0"
                />

                <div className="flex flex-1 items-center justify-evenly pb-[4.5px]">
                    {TRAIL_DOTS.map((opacity, index) => (
                        <span
                            key={index}
                            className="size-[3px] rounded-full bg-outline-muted"
                            style={{ opacity }}
                        />
                    ))}
                </div>

                <StaticImage
                    src="/assets/images/football-kick-ball.svg"
                    className="size-3 shrink-0"
                />
            </div>
        </div>
    );
}
