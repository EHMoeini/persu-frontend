import type { ReactNode } from 'react';

/** White elevated container — Figma "Interactive Form Card". */
export function Card({ children, className = 'p-5' }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={`rounded-xl border border-outline-muted bg-surface-card drop-shadow-subtle ${className}`}
        >
            {children}
        </div>
    );
}
