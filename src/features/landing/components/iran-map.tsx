'use client';

import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

import { DesignIcon } from '@/components/ui/design-icon';
import { useMediaQuery } from '@/hooks/use-media-query';

import styles from '../landing.module.css';

/**
 * Iran mainland silhouette (Natural Earth, public domain) projected to a
 * 250 × 225.69 box and used only as the clip for the dot grid.
 */
const IRAN_OUTLINE =
    'M10.26 2.02L11.83 4.35L12.91 5.55L14.32 7.25L16.79 8.76L17.43 9.95L18.3 11.31L19.79 12.34L28.33 13.82L32.36 13.64L35.14 11.41L36.92 9.3L39.13 8.66L42.86 5.61L48.87 1.75L51.49 1.19L53.6 6.94L55.58 11.14L52.32 12.73L54.53 16.24L57.13 18.03L59.48 21.1L62.97 21.87L63.94 28.89L69.31 34.62L76.67 35.56L81.29 39.56L86.42 43.61L106.76 47.87L129.39 43.24L125.67 44.5L127.45 45.5L129.27 42.61L132.22 37.44L137.58 35.87L139.78 33.63L140.01 31.24L143.84 28.02L146.78 26.71L154.2 25.93L159.29 25.8L162.27 23.28L165.93 23.73L170.06 23.04L171.62 24.46L174.79 28.34L177.61 28.73L178.95 29.14L183.43 30.85L185.4 32.57L188.44 31.86L191.07 32.44L194.51 32.94L198.63 35.48L200.06 38.72L200.44 39.55L202.02 40.59L207.64 42.61L218.07 47.97L222.32 49.55L221.98 52.92L222.62 54.47L222.53 56.92L221.82 58.39L223.28 60.78L222.96 62.89L222.9 66.53L221.36 68.93L221.74 70.99L221.15 73.79L220.34 76.42L218.78 78.8L216.21 80.64L218.54 83.65L213.31 87.09L216.51 95.37L218.02 96.29L215.69 99.77L216.75 111.63L217.27 119.05L217.31 124.79L228.52 128.7L230.18 132.58L230.35 136.42L223.48 145.32L221.5 156.44L224.39 161.34L225.76 163.32L226.05 164.69L228.04 168.5L234.41 173.2L238.92 175.21L242.44 180.66L242.96 190.91L243.56 192.35L247.15 192.2L249.56 193.09L248.9 196.82L247.98 201.37L244.57 201.43L241.49 202.08L238.12 202.92L236.69 203.57L236.34 205.72L233.09 206.74L229.8 213.75L228.6 216.62L227.47 223.02L227.19 223.53L226.42 224.54L222.36 224.46L214.84 220.51L212.13 220.81L212.87 221.73L210.77 221.21L209.54 221.21L207.6 221.02L200.41 219.8L195.28 220.37L192.56 218.48L186.69 217.58L184.87 217.65L182.49 218.03L178.36 216.85L177.35 215.12L174.02 214.9L171.29 211.71L170.29 209.81L169.55 205.4L167.87 197.53L167.69 196.15L166.84 195.72L166.33 195.19L165.02 194L161.25 193.26L156.71 193.53L154.73 195.25L152.15 195.98L149.71 197.35L146.36 199.19L142.75 201.31L139.02 203.45L133.93 201.09L130 200.04L126.09 200.28L122.11 196.29L115.25 192.98L111.25 189.6L110.85 187.78L102.94 183.06L97.97 182.79L95.64 181.63L93.89 176.43L90.93 168.73L87.85 165.84L89.1 165.61L88.83 163.5L86.84 163.14L86.15 161.29L85.99 158.35L83.84 155.95L80.42 151.72L79.24 149.84L78.16 146.72L71.05 148.06L69.69 147.4L67.63 146.73L67.19 146L64.61 145.15L65.36 143.64L67.89 143.43L66.76 142.39L65.9 141.97L64.2 142.7L62.84 144.41L63.65 146.33L63.46 149.25L59.97 149.5L58.5 150.45L57.1 148.62L56.93 146.96L54.65 145.01L53.3 143.04L49.42 122.87L48.05 120.53L46.14 117.59L45.09 116.44L44.38 114.8L44.05 113.27L41.09 112.19L33.54 106.63L26.85 103.78L26.36 102.11L27.75 100.72L26.1 97.75L25.1 96.26L24.41 94.9L22.19 94.28L20.57 91.9L17.68 88.94L19.15 86.99L20.02 84.48L18.28 81.52L20.19 79.84L21.71 79.1L21.08 77.69L22.41 75.64L23.98 73.97L24.4 72.48L25.83 72.26L27.4 71.18L27.33 68.83L25.44 65.17L25.73 64.21L28.52 62.25L29.35 60.49L27.26 60.27L24.4 60.43L22.07 60.49L18.2 57.88L16.9 57.95L16.67 54.67L15.85 51.67L13.46 50.72L12.89 49.33L12.32 46.36L10.61 45.06L11.21 42.13L9.92 41.37L9.57 39.21L8.85 36.69L7.26 34.94L7.42 31.87L5.36 30.56L4.78 29.55L2.61 28.42L3.41 26.48L4.48 24.91L5.49 21.54L3.57 20.79L3.37 17.21L3.43 14.69L1.97 12.57L2.01 10.69L0.72 7.92L0 6.1L3.63 5.99L5.21 3.9L5.76 1.12Z';

type TCityTone = 'primary' | 'secondary' | 'tertiary';

type TCity = {
    id: string;
    name: string;
    /** Today's headline count, already in Persian digits. */
    count: string;
    tone: TCityTone;
    /** Dot centre as a percentage of the map silhouette box. */
    x: number;
    y: number;
    /** Bubble side chosen so the bubble never clips against the map edges. */
    bubbleSide: 'above' | 'below';
    bubbleWidthClassName: string;
    dotSizeClassName: string;
};

const CITIES: TCity[] = [
    {
        id: 'tehran',
        name: 'تهران',
        count: '۳۴ سالن فعال امروز',
        tone: 'primary',
        x: 38.2,
        y: 27.75,
        bubbleSide: 'above',
        bubbleWidthClassName: 'min-w-[105px]',
        dotSizeClassName: 'size-3',
    },
    {
        id: 'isfahan',
        name: 'اصفهان',
        count: '۱۸ سانس خالی امروز',
        tone: 'secondary',
        x: 39.64,
        y: 48.39,
        bubbleSide: 'above',
        bubbleWidthClassName: 'min-w-[103px]',
        dotSizeClassName: 'size-2.5',
    },
    {
        id: 'mashhad',
        name: 'مشهد',
        count: '۲۱ سالن آماده رزرو',
        tone: 'tertiary',
        x: 80.76,
        y: 23.62,
        bubbleSide: 'above',
        bubbleWidthClassName: 'min-w-[100px]',
        dotSizeClassName: 'size-2.5',
    },
    {
        id: 'shiraz',
        name: 'شیراز',
        count: '۱۴ سالن ورزشی',
        tone: 'primary',
        x: 44.12,
        y: 69.2,
        bubbleSide: 'below',
        bubbleWidthClassName: 'min-w-[95px]',
        dotSizeClassName: 'size-2.5',
    },
    {
        id: 'tabriz',
        name: 'تبریز',
        count: '۱۲ سانس فعال',
        tone: 'primary',
        x: 11.79,
        y: 11.5,
        bubbleSide: 'below',
        bubbleWidthClassName: 'min-w-[90px]',
        dotSizeClassName: 'size-2.5',
    },
    {
        id: 'ahvaz',
        name: 'اهواز',
        count: '۹ سالن ورزشی',
        tone: 'secondary',
        x: 24.16,
        y: 57.45,
        bubbleSide: 'above',
        bubbleWidthClassName: 'min-w-[85px]',
        dotSizeClassName: 'size-2.5',
    },
];

const TONE_CLASS_NAMES: Record<TCityTone, string> = {
    primary: styles.mapTonePrimary,
    secondary: styles.mapToneSecondary,
    tertiary: styles.mapToneTertiary,
};

/** How long one reservation bubble stays on screen. */
const BUBBLE_VISIBLE_MS = 2800;
/** Gap between bubbles, randomized inside this range. */
const BUBBLE_GAP_MIN_MS = 2500;
const BUBBLE_GAP_RANGE_MS = 2500;

/** Landing map: dotted Iran with live-feeling city reservation bubbles. */
export function IranMap() {
    const [hoveredCityId, setHoveredCityId] = useState<string | null>(null);
    const [randomCityId, setRandomCityId] = useState<string | null>(null);
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const { ref, inView } = useInView({ threshold: 0.25 });

    useEffect(() => {
        if (!inView || reduceMotion) return;

        let cancelled = false;
        const timerIds: number[] = [];
        let previousIndex = -1;

        const scheduleNext = () => {
            timerIds.push(
                window.setTimeout(
                    () => {
                        if (cancelled) return;

                        let nextIndex = Math.floor(Math.random() * CITIES.length);
                        if (nextIndex === previousIndex) {
                            nextIndex = (nextIndex + 1) % CITIES.length;
                        }
                        previousIndex = nextIndex;

                        setRandomCityId(CITIES[nextIndex].id);
                        timerIds.push(
                            window.setTimeout(() => {
                                if (cancelled) return;
                                setRandomCityId(null);
                                scheduleNext();
                            }, BUBBLE_VISIBLE_MS),
                        );
                    },
                    BUBBLE_GAP_MIN_MS + Math.random() * BUBBLE_GAP_RANGE_MS,
                ),
            );
        };

        scheduleNext();

        return () => {
            cancelled = true;
            timerIds.forEach((timerId) => window.clearTimeout(timerId));
        };
    }, [inView, reduceMotion]);

    // Hover always wins; otherwise one bubble at a time cycles on its own.
    const visibleCityId = hoveredCityId ?? (reduceMotion ? 'tehran' : randomCityId);

    return (
        <div className="flex w-full flex-col items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-high px-3 py-0.5 text-[11px] leading-[16.5px] font-medium text-primary drop-shadow-subtle">
                <DesignIcon
                    src="/assets/icons/landing/coverage-globe.svg"
                    className="size-[12.5px]"
                />
                پوشش سراسری در سراسر ایران
            </span>

            <div
                ref={ref}
                aria-hidden="true"
                className="relative mx-auto aspect-[4/3.4] w-full max-w-[360px]"
            >
                {/* The silhouette box keeps the viewBox aspect, so dots and hotspots share one coordinate space. */}
                <div className="absolute inset-[4.3%_7%]">
                    <svg
                        viewBox="0 0 250 225.69"
                        preserveAspectRatio="none"
                        className="absolute inset-0 size-full"
                    >
                        <defs>
                            <pattern
                                id="iran-map-dots"
                                width="7"
                                height="7"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle cx="3.5" cy="3.5" r="1.05" className={styles.mapDots} />
                            </pattern>
                            <clipPath id="iran-map-clip">
                                <path d={IRAN_OUTLINE} />
                            </clipPath>
                        </defs>
                        <rect
                            width="250"
                            height="225.69"
                            fill="url(#iran-map-dots)"
                            clipPath="url(#iran-map-clip)"
                        />
                    </svg>

                    {CITIES.map((city, index) => {
                        const isVisible = visibleCityId === city.id;

                        return (
                            <div
                                key={city.id}
                                className={`absolute -translate-x-1/2 -translate-y-1/2 ${TONE_CLASS_NAMES[city.tone]} ${
                                    hoveredCityId === city.id ? 'z-30' : isVisible ? 'z-20' : 'z-10'
                                }`}
                                style={{ left: `${city.x}%`, top: `${city.y}%` }}
                                onPointerEnter={() => setHoveredCityId(city.id)}
                                onPointerLeave={() => setHoveredCityId(null)}
                            >
                                <span
                                    className={`absolute -inset-0.5 rounded-full ${styles.mapHalo}`}
                                    style={{ animationDelay: `${index * 0.35}s` }}
                                />

                                <span
                                    className={`block ${city.dotSizeClassName} rounded-full border-2 border-surface shadow-input ${styles.mapDot}`}
                                />

                                <div
                                    className={`pointer-events-none absolute left-1/2 w-max -translate-x-1/2 ${
                                        city.bubbleSide === 'above'
                                            ? 'bottom-[calc(100%+6px)]'
                                            : 'top-[calc(100%+4px)]'
                                    }`}
                                >
                                    <div
                                        className={`${styles.mapBubble} ${
                                            isVisible ? styles.mapBubbleVisible : ''
                                        }`}
                                    >
                                        <div
                                            className={`relative flex flex-col items-center rounded-xl border bg-surface-card px-3 py-1.5 shadow-action ${city.bubbleWidthClassName}`}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span
                                                    className={`size-1.5 rounded-full ${styles.mapAccentDot}`}
                                                />
                                                <span
                                                    className={`text-[11px] leading-[16.5px] font-bold ${styles.mapAccentText}`}
                                                >
                                                    {city.name}
                                                </span>
                                            </div>
                                            <span className="pt-0.5 text-[10px] leading-[15px] font-medium text-foreground-muted">
                                                {city.count}
                                            </span>

                                            <span
                                                className={`absolute left-1/2 size-2 -translate-x-1/2 rotate-45 bg-surface-card shadow-input ${styles.mapTail} ${
                                                    city.bubbleSide === 'above'
                                                        ? '-bottom-1 border-r border-b'
                                                        : '-top-1 border-t border-l'
                                                }`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
