import type { ReactNode } from 'react';

type TFieldLabelProps = {
  children: ReactNode;
  htmlFor?: string;
};

/** 12px semibold field label, aligned to the inline start (right in RTL). */
export function FieldLabel({ children, htmlFor }: TFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-xs leading-4 font-semibold text-foreground">
      {children}
    </label>
  );
}
