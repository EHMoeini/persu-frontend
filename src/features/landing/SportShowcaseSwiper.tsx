'use client';

import { useMemo, type ReactNode } from 'react';

import { Carousel, type CarouselSlide } from '@/components/ui/carousel';
import { useMediaQuery } from '@/hooks/use-media-query';

import { FootballScene, TennisScene, VolleyballScene } from './low-poly-scene';

/** Time each slide stays before the showcase advances on its own. */
const AUTOPLAY_INTERVAL_MS = 5000;

function SceneStage({ children }: { children?: ReactNode }) {
    // The bottom gap keeps the slab clear of the scroller's bottom clipping
    // edge while the canvas itself keeps its full 6:5 size.
    return (
        <div className="pb-2">
            <div className="aspect-[6/5] w-full">{children}</div>
        </div>
    );
}

export function SportShowcaseSwiper() {
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

    const slides = useMemo<CarouselSlide[]>(() => {
        const scenes = [
            { id: 'football', label: 'فوتبال', Scene: FootballScene },
            { id: 'volleyball', label: 'والیبال', Scene: VolleyballScene },
            { id: 'tennis', label: 'تنیس', Scene: TennisScene },
        ];

        return scenes.map(({ id, label, Scene }) => ({
            id,
            label,
            content: (
                <SceneStage>
                    <Scene idle={!reduceMotion} />
                </SceneStage>
            ),
        }));
    }, [reduceMotion]);

    return (
        <Carousel
            slides={slides}
            ariaLabel="نمایش سه‌بعدی زمین‌های ورزشی"
            autoplayInterval={AUTOPLAY_INTERVAL_MS}
            viewportClassName="pb-4"
            className="w-full"
        />
    );
}
