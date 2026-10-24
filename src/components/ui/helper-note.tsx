import type { ReactNode } from 'react';

import { StaticImage } from './static-image';

/** Info icon + hint text in one row, packed to the inline start (right in RTL). */
export function HelperNote({ children }: { children: ReactNode }) {
    return (
        <div className="flex items-center gap-1">
            <span className="relative size-3 shrink-0">
                <StaticImage
                    src="/assets/icons/info-circle.svg"
                    className="absolute inset-0 block size-full max-w-none"
                />
            </span>
            <p className="text-xs leading-4 text-outline">{children}</p>
        </div>
    );
}
