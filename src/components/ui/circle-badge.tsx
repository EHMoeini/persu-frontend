import type { ReactNode } from 'react';

/**
 * 80px branding accent with an inset-shadowed inner circle —
 * Figma "Top Visual Graphic / Branding Accent".
 */
export function CircleBadge({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-20 shrink-0 items-center justify-center rounded-full bg-primary-fixed drop-shadow-subtle">
      <div className="relative flex size-14 items-center justify-center rounded-full">
        <div aria-hidden className="pointer-events-none absolute inset-0 rounded-full bg-white" />
        {children}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] inset-shadow-badge"
        />
      </div>
    </div>
  );
}
