'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';

import { useMediaQuery } from '@/hooks/use-media-query';

export type CarouselSlide = {
    id: string;
    /** Used for the slide's accessible name and its pagination button. */
    label: string;
    content: ReactNode;
};

export type CarouselProps = {
    slides: readonly CarouselSlide[];
    ariaLabel: string;
    /** Auto-advance delay in milliseconds. Set to 0 to disable autoplay. */
    autoplayInterval?: number;
    className?: string;
    /** Extra classes for the horizontal scrolling viewport. */
    viewportClassName?: string;
    showSlides?: boolean;
};

/**
 * Full-width, snap-scrolling carousel with optional autoplay and pagination.
 * One slide is visible at a time. Swiping always works; pagination appears
 * when there is more than one slide, and autoplay pauses off-screen or under
 * `prefers-reduced-motion`.
 */
export function Carousel({
    slides,
    ariaLabel,
    autoplayInterval = 5000,
    className,
    viewportClassName,
    showSlides = false,
}: CarouselProps) {
    const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
    const scrollerRef = useRef<HTMLDivElement>(null);
    const slideRefs = useRef<Array<HTMLDivElement | null>>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const activeIndexRef = useRef(0);

    const scrollToSlide = useCallback(
        (index: number) => {
            slideRefs.current[index]?.scrollIntoView({
                behavior: reduceMotion ? 'auto' : 'smooth',
                block: 'nearest',
                inline: 'center',
            });
        },
        [reduceMotion],
    );

    // Tracks the visible slide so autoplay starts from wherever the user is.
    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (!entry.isIntersecting) continue;
                    const index = slideRefs.current.indexOf(entry.target as HTMLDivElement);
                    if (index >= 0) {
                        activeIndexRef.current = index;
                        setActiveIndex(index);
                    }
                }
            },
            { root: scroller, threshold: 0.6 },
        );

        for (let index = 0; index < slides.length; index++) {
            const slide = slideRefs.current[index];
            if (slide) observer.observe(slide);
        }
        return () => observer.disconnect();
    }, [slides.length]);

    // Autoplay only while the carousel itself is on screen.
    useEffect(() => {
        const scroller = scrollerRef.current;
        if (!scroller) return;

        const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), {
            threshold: 0.35,
        });
        observer.observe(scroller);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (autoplayInterval <= 0 || !isVisible || reduceMotion || slides.length < 2) return;

        const timer = window.setInterval(() => {
            scrollToSlide((activeIndexRef.current + 1) % slides.length);
        }, autoplayInterval);

        return () => window.clearInterval(timer);
    }, [activeIndex, autoplayInterval, isVisible, reduceMotion, scrollToSlide, slides.length]);

    if (slides.length === 0) return null;

    return (
        <div className={className}>
            <div
                ref={scrollerRef}
                role="region"
                aria-roledescription="carousel"
                aria-label={ariaLabel}
                tabIndex={0}
                className={`flex snap-x snap-mandatory scrollbar-none overflow-x-auto overscroll-x-contain focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus [&::-webkit-scrollbar]:hidden ${
                    viewportClassName ?? ''
                }`}
            >
                {slides.map((slide, index) => (
                    <div
                        key={slide.id}
                        ref={(node) => {
                            slideRefs.current[index] = node;
                        }}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={`${index + 1} از ${slides.length}: ${slide.label}`}
                        className="w-full shrink-0 snap-center snap-always"
                    >
                        {slide.content}
                    </div>
                ))}
            </div>

            {showSlides && slides.length > 1 && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                    {slides.map((slide, index) => (
                        <button
                            key={slide.id}
                            type="button"
                            aria-label={slide.label}
                            aria-current={index === activeIndex}
                            onClick={() => scrollToSlide(index)}
                            className={`h-2 rounded-full transition-[width,background-color] ${
                                index === activeIndex
                                    ? 'w-5 bg-primary'
                                    : 'w-2 bg-outline-muted hover:bg-outline'
                            }`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
