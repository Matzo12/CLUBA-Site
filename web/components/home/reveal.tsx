import * as React from 'react';

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

export function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, options);

    obs.observe(el);
    return () => obs.disconnect();
  }, [options?.root, options?.rootMargin, options?.threshold]);

  return { ref, inView };
}

export function Reveal({
  children,
  className,
  delayMs = 0,
  as: As = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
  as?: keyof JSX.IntrinsicElements;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView({ rootMargin: '0px 0px -12% 0px', threshold: 0.12 });

  const style: React.CSSProperties | undefined =
    reduced || !delayMs
      ? undefined
      : {
          transitionDelay: `${delayMs}ms`,
        };

  return (
    <As
      ref={ref as any}
      className={['cluba-reveal', inView ? 'cluba-reveal--in' : 'cluba-reveal--out', className || ''].join(' ')}
      style={style}
    >
      {children}
    </As>
  );
}
