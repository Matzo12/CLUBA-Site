'use client';

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

export function ReadingProgressBar({ className = '' }: { className?: string }) {
  const reduced = usePrefersReducedMotion();
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    let raf = 0;

    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const scrollHeight = doc.scrollHeight || 0;
      const clientHeight = doc.clientHeight || window.innerHeight || 1;
      const max = Math.max(1, scrollHeight - clientHeight);
      const p = Math.min(1, Math.max(0, scrollTop / max));
      setProgress(p);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 bottom-0 h-[2px] ${className}`}
    >
      <div className="h-full bg-[rgba(17,17,17,0.10)]" />
      <div
        className="absolute left-0 top-0 h-full origin-left bg-[rgba(140,36,36,0.70)]"
        style={{
          transform: `scaleX(${progress})`,
          transition: reduced ? 'none' : 'transform 120ms linear',
        }}
      />
    </div>
  );
}
