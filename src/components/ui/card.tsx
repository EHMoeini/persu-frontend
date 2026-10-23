import type { ReactNode } from 'react';

/** White elevated container — Figma "Interactive Form Card". */
export function Card({ children }: { children: ReactNode }) {
  return <div className="rounded-xl bg-surface-card p-5 drop-shadow-subtle">{children}</div>;
}
