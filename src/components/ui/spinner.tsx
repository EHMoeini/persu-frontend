/** Minimal CSS spinner. Inherits the current text color. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      aria-hidden
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className ?? 'size-4'}`}
    />
  );
}
