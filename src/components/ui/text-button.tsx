import type { ButtonHTMLAttributes, ReactNode } from 'react';

type TTextButtonProps = {
    children: ReactNode;
    /** Icon presented at the inline start (right in RTL) — Figma places the lock there. */
    icon?: ReactNode;
} & ButtonHTMLAttributes<HTMLButtonElement>;

/** Quiet inline action — Figma "ورود با کلمه عبور" — the one text-button in the design. */
export function TextButton({ children, icon, type = 'button', ...rest }: TTextButtonProps) {
    return (
        <button
            type={type}
            className="flex items-center justify-center gap-1 py-1 text-xs leading-4 font-medium text-outline disabled:cursor-not-allowed disabled:opacity-40"
            {...rest}
        >
            {icon}
            <span>{children}</span>
        </button>
    );
}
