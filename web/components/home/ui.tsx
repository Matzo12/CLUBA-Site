import * as React from 'react';

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);
  return reduced;
}

export function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" {...props}>
      <path
        d="M7.5 4.5L13 10l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SkipToContent() {
  return (
    <a
      href="#content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[rgba(250,247,241,0.98)] focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-neutral-900 focus:ring-2 focus:ring-[rgba(140,36,36,0.55)]"
    >
      Skip to content
    </a>
  );
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply"
      style={{
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(0,0,0,0.22) 0, rgba(0,0,0,0) 35%),
          radial-gradient(circle at 70% 20%, rgba(0,0,0,0.18) 0, rgba(0,0,0,0) 40%),
          radial-gradient(circle at 40% 80%, rgba(0,0,0,0.16) 0, rgba(0,0,0,0) 45%),
          linear-gradient(0deg, rgba(0,0,0,0.06), rgba(0,0,0,0.06))
        `,
      }}
    />
  );
}

export function EditorialImagePlaceholder() {
  return (
    <div
      className={cx(
        'relative overflow-hidden rounded-3xl border border-[rgba(17,17,17,0.14)]',
        'bg-[rgba(255,255,255,0.35)]',
        'shadow-[0_14px_60px_rgba(17,17,17,0.08)]'
      )}
      aria-label="Editorial image placeholder"
      role="img"
    >
      <div
        className="aspect-[4/5] w-full sm:aspect-[16/11]"
        style={{
          backgroundImage: `
            radial-gradient(1200px 800px at 20% 20%, rgba(140,36,36,0.20), rgba(140,36,36,0) 55%),
            radial-gradient(900px 650px at 80% 30%, rgba(122,92,58,0.22), rgba(122,92,58,0) 60%),
            radial-gradient(700px 500px at 55% 85%, rgba(17,17,17,0.12), rgba(17,17,17,0) 62%),
            linear-gradient(180deg, rgba(250,247,241,1) 0%, rgba(245,240,232,1) 60%, rgba(250,247,241,1) 100%)
          `,
        }}
      />
      <NoiseOverlay />
      <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
        <div className="rounded-2xl border border-[rgba(17,17,17,0.10)] bg-[rgba(250,247,241,0.78)] p-4 backdrop-blur">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600">
            Botanical Archive Plate
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-800">
            A museum quiet: pods as specimens, not spectacle. Varietal, place, season.
          </p>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <header className="max-w-3xl">
      <p className="text-xs font-medium uppercase tracking-[0.22em] text-neutral-600">{eyebrow}</p>
      <h2 className="mt-3 font-serif text-3xl leading-tight text-neutral-900 sm:text-4xl">{title}</h2>
      {subtitle ? (
        <p className="mt-4 text-base leading-relaxed text-neutral-700 sm:text-lg">{subtitle}</p>
      ) : null}
    </header>
  );
}

export function Button({
  children,
  href,
  variant = 'primary',
  ariaLabel,
}: {
  children: React.ReactNode;
  href: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  ariaLabel?: string;
}) {
  const reduced = usePrefersReducedMotion();

  const base =
    'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ' +
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]';

  const primary =
    'bg-[rgba(17,17,17,0.92)] text-[rgba(250,247,241,1)] ' +
    'shadow-[0_10px_35px_rgba(17,17,17,0.14)] hover:bg-[rgba(17,17,17,1)] active:translate-y-[1px]';

  const secondary =
    'border border-[rgba(17,17,17,0.18)] bg-[rgba(250,247,241,0.7)] text-neutral-900 ' +
    'hover:border-[rgba(17,17,17,0.28)] hover:bg-[rgba(255,255,255,0.55)] active:translate-y-[1px]';

  const ghost = 'text-neutral-900 hover:bg-[rgba(17,17,17,0.04)] active:translate-y-[1px]';

  const cls = cx(base, variant === 'primary' ? primary : variant === 'secondary' ? secondary : ghost);

  return (
    <a href={href} className={cls} aria-label={ariaLabel} style={reduced ? undefined : { willChange: 'transform' }}>
      {children}
    </a>
  );
}
