import type { ReactNode } from 'react';

type TCardProps = {
    children: ReactNode;
    className?: string;
    /** Corner radius utility — defaults to the auth card's 12px radius. */
    radiusClassName?: string;
};

/** White elevated container — Figma "Interactive Form Card". */
export function Card({ children, className = 'p-5', radiusClassName = 'rounded-xl' }: TCardProps) {
    return (
        <div className={`${radiusClassName} bg-surface-card drop-shadow-subtle ${className}`}>
            {children}
        </div>
    );
}
