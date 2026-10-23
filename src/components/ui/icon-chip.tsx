import type { ReactNode } from 'react';

type TIconChipProps =
  | { children: ReactNode; label: string; onClick: () => void }
  | { children: ReactNode; label?: never; onClick?: never };

/**
 * 40px rounded chip on the sunken surface. The logo container and the back
 * button in the auth app bar are the same chip — this is that one chip.
 */
export function IconChip({ children, label, onClick }: TIconChipProps) {
  const className =
    'flex size-10 shrink-0 items-center justify-center rounded-lg bg-surface-sunken drop-shadow-subtle';

  if (onClick) {
    return (
      <button type="button" aria-label={label} onClick={onClick} className={className}>
        {children}
      </button>
    );
  }

  return <div className={className}>{children}</div>;
}
