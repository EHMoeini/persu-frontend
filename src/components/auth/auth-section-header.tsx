import { StaticImage } from '@/components/ui/static-image';

type TAuthSectionHeaderProps = {
  /** Badge icon served from /public. */
  icon: string;
  title: string;
  subtitle: string;
};

/** 56px badge + heading + subtitle — shared header on every auth screen. */
export function AuthSectionHeader({ icon, title, subtitle }: TAuthSectionHeaderProps) {
  return (
    <div className="flex flex-col items-center pt-3 pb-6">
      <div className="mb-3.5 flex size-14 items-center justify-center rounded-xl bg-primary-soft drop-shadow-subtle">
        {/* One icon slot for every auth screen, so no page drifts from the others. */}
        <span className="flex size-5.5 shrink-0 items-center justify-center">
          <StaticImage src={icon} className="block h-auto max-h-full w-auto max-w-full" />
        </span>
      </div>
      <h1 className="mb-1.5 text-center text-xl leading-7 font-bold text-foreground">{title}</h1>
      <p className="text-center text-xs leading-5 text-foreground-muted">{subtitle}</p>
    </div>
  );
}
