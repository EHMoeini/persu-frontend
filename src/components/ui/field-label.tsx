import type { ReactNode } from 'react';

type TFieldLabelProps = {
  children: ReactNode;
  htmlFor?: string;
  /** Appends the required marker at the inline end (left in RTL). */
  required?: boolean;
};

/** 12px semibold field label, aligned to the inline start (right in RTL). */
export function FieldLabel({ children, htmlFor, required }: TFieldLabelProps) {
  return (
    <label htmlFor={htmlFor} className="text-xs leading-4 font-semibold text-foreground">
      {children}
      {required ? (
        <span aria-hidden className="ms-1 font-bold text-error">
          *
        </span>
      ) : null}
    </label>
  );
}
