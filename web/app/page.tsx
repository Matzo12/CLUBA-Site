'use client';

import React, { useEffect, useId, useMemo, useRef, useState } from 'react';

type NavLink = { label: string; href: string };
type Chili = {
  name: string;
  region: string;
  country: string;
  species: string;
  notes: string;
  profile: string;
};
type Post = { title: string; excerpt: string; date: string; href: string; tag: string };

const NAV_LINKS: NavLink[] = [
  { label: 'Origins', href: '#origins' },
  { label: 'Species', href: '#species' },
  { label: 'Journal', href: '#journal' },
  { label: 'About', href: '#about' },
];

const FEATURED_CHILIES: Chili[] = [
  {
    name: 'Guajillo',
    region: 'Oaxaca Highlands',
    country: 'Mexico',
    species: 'Capsicum annuum',
    notes: 'dried cherry, cocoa husk, red tea',
    profile: 'A calm red fruitiness—like sun-warmed paperbacks and the last note of cacao.',
  },
  {
    name: 'Aleppo',
    region: 'Aleppo Plain',
    country: 'Syria',
    species: 'Capsicum annuum',
    notes: 'tomato skin, rose, gentle citrus',
    profile: 'Soft heat, wide aroma. The taste of market light through linen.',
  },
  {
    name: 'Kashmiri',
    region: 'Kashmir Valley',
    country: 'India',
    species: 'Capsicum annuum',
    notes: 'saffron, dried plum, sweet pepper',
    profile: 'Color like lacquer. Flavor like a quiet spice drawer—opened slowly.',
  },
  {
    name: 'Chipotle Morita',
    region: 'Sierra Norte',
    country: 'Mexico',
    species: 'Capsicum annuum',
    notes: 'soft smoke, tamarind, cedar',
    profile: 'Smoke as structure, not spectacle—an ember folded into fruit.',
  },
];

const JOURNAL_POSTS: Post[] = [
  {
    title: 'On Naming a Place by Taste',
    excerpt: 'A landscape can be read like a note: mineral, leaf, sun, and the long sentence of drying.',
    date: '2026-02-06',
    href: '#journal',
    tag: 'Field Notes',
  },
  {
    title: 'Capsicum annuum: A Species With Many Voices',
    excerpt: 'Not one “chili,” but a family of dialects—shape, skin, seed, and scent.',
    date: '2026-01-22',
    href: '#journal',
    tag: 'Botany',
  },
  {
    title: 'How to Taste a Dried Pod',
    excerpt: 'Crush, warm, inhale. Let aroma arrive before heat—like thunder after light.',
    date: '2025-12-18',
    href: '#journal',
    tag: 'Tasting',
  },
];

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ');
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

function useInView<T extends Element>(options?: IntersectionObserverInit) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([entry]) => {
      setInView(entry.isIntersecting);
    }, options);

    io.observe(el);
    return () => io.disconnect();
  }, [options]);

  return { ref, inView };
}

function useActiveSection(sectionIds: string[]) {
  const [active, setActive] = useState<string>(sectionIds[0] ?? '');

  useEffect(() => {
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, rootMargin: '-25% 0px -60% 0px', threshold: [0.1, 0.2, 0.35, 0.5, 0.65] }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionIds.join('|')]);

  return active;
}

function Reveal({
  children,
  className,
  delayMs = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delayMs?: number;
}) {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <div
      ref={ref}
      className={cx(
        'will-change-transform',
        reduced ? 'opacity-100' : 'transition-[opacity,transform] duration-700 ease-out',
        reduced ? '' : inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3',
        className
      )}
      style={!reduced ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}

function useNoiseBackground() {
  return useMemo(() => {
    const svg = encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="140" height="140" viewBox="0 0 140 140">
        <filter id="n">
          <feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" stitchTiles="stitch"/>
          <feColorMatrix type="matrix" values="
            1 0 0 0 0
            0 1 0 0 0
            0 0 1 0 0
            0 0 0 .10 0"/>
        </filter>
        <rect width="140" height="140" filter="url(#n)" opacity=".30"/>
      </svg>
    `);
    return `url("data:image/svg+xml,${svg}")`;
  }, []);
}

function formatDateISO(iso: string) {
  const d = new Date(iso + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString(undefined, { month: 'short' });
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

function IconArrowRight(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path
        fill="currentColor"
        d="M13.5 5.5a1 1 0 0 1 1.4 0l6 6a1 1 0 0 1 0 1.4l-6 6a1 1 0 1 1-1.4-1.4l4.3-4.3H4a1 1 0 1 1 0-2h13.4l-4.3-4.3a1 1 0 0 1 0-1.4Z"
      />
    </svg>
  );
}

function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-[var(--paper)] focus:px-4 focus:py-2 focus:text-sm focus:shadow-[0_10px_30px_rgba(0,0,0,0.15)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
    >
      Skip to content
    </a>
  );
}

export default function Page() {
  const noise = useNoiseBackground();
  const [menuOpen, setMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const activeSection = useActiveSection(['origins', 'species', 'taste', 'featured', 'process', 'journal', 'about']);
  const emailId = useId();

  function onSubmitEmail(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setSubscribed(true);
    setEmail('');
    window.setTimeout(() => setSubscribed(false), 2200);
  }

  return (
    <div
      className="min-h-screen bg-[var(--paper)] text-[var(--ink)] selection:bg-[color:color-mix(in_oklab,var(--accent)_20%,transparent)] selection:text-[var(--ink)] scroll-smooth"
      style={{
        backgroundImage:
          'radial-gradient(1200px 800px at 20% 5%, rgba(124, 92, 58, 0.10), transparent 55%), radial-gradient(900px 700px at 80% 20%, rgba(120, 36, 32, 0.08), transparent 55%)',
      }}
    >
      <style>{`
        :root{
          --paper: #F6F1E7;
          --ink: #111111;
          --muted: rgba(17,17,17,.70);
          --faint: rgba(17,17,17,.12);
          --hair: rgba(17,17,17,.16);
          --accent: #7C1E1A;
          --earth: #7C5C3A;
          --serif: ui-serif, "Iowan Old Style", "Palatino Linotype", Palatino, "Cormorant Garamond", Garamond, serif;
          --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", sans-serif;
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
        }
      `}</style>

      <SkipLink />

      {/* Top Nav */}
      <header
        className={cx(
          'sticky top-0 z-50 border-b backdrop-blur-md transition-[box-shadow,background-color] duration-300',
          scrolled
            ? 'border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_86%,white)] shadow-[0_18px_55px_rgba(0,0,0,0.08)]'
            : 'border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_92%,transparent)] shadow-none'
        )}
      >
        <nav aria-label="Primary" className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="inline-flex items-baseline gap-2 rounded-md outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
              aria-label="CLUBA home"
            >
              <span className="font-[var(--serif)] text-lg tracking-[0.22em] uppercase" style={{ letterSpacing: '0.22em' }}>
                CLUBA
              </span>
              <span className="hidden text-xs text-[var(--muted)] sm:inline">single-origin dried chili pods</span>
              <span className="ml-1 hidden h-[1px] w-10 bg-[var(--hair)] sm:inline-block" aria-hidden="true" />
            </a>
          </div>

          {/* Desktop links */}
          <div className="hidden items-center gap-7 md:flex">
            <div className="flex items-center gap-6">
              {NAV_LINKS.map((l) => {
                const isActive = activeSection && l.href === `#${activeSection}`;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    className={cx(
                      'relative rounded text-sm outline-none transition-colors focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]',
                      isActive ? 'text-[var(--ink)]' : 'text-[var(--muted)] hover:text-[var(--ink)] focus:text-[var(--ink)]'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <span className="relative inline-block pb-1">
                      {l.label}
                      <span
                        aria-hidden="true"
                        className={cx(
                          'absolute left-0 -bottom-0.5 h-[1px] w-full origin-left transition-transform duration-300',
                          isActive ? 'scale-x-100 bg-[var(--ink)]' : 'scale-x-0 bg-[var(--ink)] group-hover:scale-x-100'
                        )}
                      />
                    </span>
                  </a>
                );
              })}
            </div>

            <a
              href="#origins"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.10)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
              aria-label="Explore origins"
            >
              Explore
              <IconArrowRight className="h-4 w-4 opacity-70" />
            </a>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] px-3 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((v) => !v)}
          >
            <span className="font-[var(--sans)] text-[13px] tracking-wide">{menuOpen ? 'Close' : 'Menu'}</span>
          </button>
        </nav>

        {/* Mobile panel */}
        <div
          id="mobile-menu"
          className={cx(
            'md:hidden overflow-hidden border-t border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_92%,transparent)] transition-[max-height,opacity] duration-300',
            menuOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'
          )}
          aria-hidden={!menuOpen}
        >
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
            <div className="flex flex-col gap-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="rounded-md px-2 py-2 text-sm text-[var(--muted)] outline-none transition-colors hover:text-[var(--ink)] focus:text-[var(--ink)] focus:ring-2 focus:ring-[var(--accent)]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#origins"
                onClick={() => setMenuOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]"
              >
                Explore
                <IconArrowRight className="h-4 w-4 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      </header>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <Reveal>
          <section aria-label="Hero" className="relative py-12 sm:py-16 lg:py-20">
            <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-6">
                <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] px-3 py-1 text-xs text-[var(--muted)]">
                  <span
                    className="inline-block h-2 w-2 rounded-full"
                    style={{ background: 'radial-gradient(circle at 30% 30%, rgba(124,30,26,.95), rgba(124,30,26,.55))' }}
                    aria-hidden="true"
                  />
                  Museum-grade sourcing • Whole pods • Species-identified
                </p>

                <h1 className="font-[var(--serif)] text-4xl leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
                  Beyond Heat. <span className="text-[var(--accent)]">Defined by Origin.</span>
                </h1>

                <p className="mt-5 max-w-xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)] sm:text-lg">
                  Single-origin dried chilies identified by region, species, and harvest.
                  Each pod shaped by climate, soil, and sun.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <a
                    href="#origins"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--ink)] px-5 py-3 text-sm text-[var(--paper)] shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(0,0,0,0.22)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                    aria-label="Explore origins"
                  >
                    Explore Origins
                    <IconArrowRight className="h-4 w-4 opacity-80" />
                  </a>

                  <a
                    href="#taste"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-5 py-3 text-sm text-[var(--ink)] shadow-[0_10px_30px_rgba(0,0,0,0.06)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_38px_rgba(0,0,0,0.10)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                    aria-label="Discover the Harvest"
                  >
                    Discover the Harvest
                  </a>
                </div>

                <p className="mt-8 max-w-xl border-l border-[var(--hair)] pl-4 font-[var(--serif)] text-sm leading-relaxed text-[color:color-mix(in_oklab,var(--ink)_85%,var(--earth))]">
                  A pod is a letter from a place—folded, dried, carried.
                  <br className="hidden sm:block" />
                  Open it slowly. Let the air do the reading.
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-[var(--hair)] pt-6 sm:grid-cols-3">
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Sourcing</dt>
                    <dd className="mt-1 font-[var(--serif)] text-lg">Single-origin</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Identity</dt>
                    <dd className="mt-1 font-[var(--serif)] text-lg">Species-known</dd>
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Form</dt>
                    <dd className="mt-1 font-[var(--serif)] text-lg">Whole pods</dd>
                  </div>
                </dl>
              </div>

              <div className="lg:col-span-6">
                <div
                  aria-label="Editorial image placeholder"
                  role="img"
                  className="relative overflow-hidden rounded-3xl border border-[var(--hair)] shadow-[0_18px_60px_rgba(0,0,0,0.10)]"
                >
                  <div
                    className="aspect-[4/3] w-full"
                    style={{
                      backgroundImage: `
                        linear-gradient(135deg,
                          rgba(17,17,17,0.06),
                          rgba(124,92,58,0.10),
                          rgba(124,30,26,0.10),
                          rgba(17,17,17,0.05)
                        ),
                        radial-gradient(900px 500px at 25% 35%, rgba(124,30,26,0.14), transparent 60%),
                        radial-gradient(700px 450px at 80% 40%, rgba(124,92,58,0.12), transparent 55%)
                      `,
                    }}
                  />
                  <div className="pointer-events-none absolute inset-0 opacity-80" style={{ backgroundImage: noise, mixBlendMode: 'multiply' }} aria-hidden="true" />
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <div className="rounded-2xl border border-[color:color-mix(in_oklab,var(--paper)_15%,var(--hair))] bg-[color:color-mix(in_oklab,var(--paper)_85%,transparent)] p-4 backdrop-blur-sm">
                      <p className="font-[var(--sans)] text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                        Botanical archive / plate no. 17
                      </p>
                      <p className="mt-2 font-[var(--serif)] text-base leading-snug">Whole pods, intact skins—aroma preserved in structure.</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_75%,white)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Not a dare</p>
                    <p className="mt-2 font-[var(--serif)] text-base leading-snug">Heat is a note—never the headline.</p>
                  </div>
                  <div className="rounded-2xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_75%,white)] p-5">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">A tasting object</p>
                    <p className="mt-2 font-[var(--serif)] text-base leading-snug">Like tea leaves: origin, cultivar, craft.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Brand Manifesto */}
        <Reveal delayMs={80}>
          <section aria-label="Brand manifesto" className="py-12 sm:py-16">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">A calm approach to intensity.</h2>
                <p className="mt-4 font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  CLUBA treats chili as an ingredient with provenance—an archive specimen you can cook with. 
                  We source by place, identify by species, and describe by taste.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 sm:p-8">
                  <p className="font-[var(--serif)] text-lg leading-relaxed sm:text-xl">We are not chasing extremes. We are listening.</p>
                  <p className="mt-4 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                    A pod carries climate, soil, altitude, and a season’s patience. Drying is not “processing”—it is translation.
                    The goal is clarity: what the plant meant to say.
                  </p>

                  <p className="mt-6 font-[var(--serif)] text-sm leading-relaxed text-[color:color-mix(in_oklab,var(--ink)_80%,var(--earth))]">
                    In the field, you learn this first:
                    <br />
                    what looks small can contain a map.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Three Pillars */}
        <Reveal delayMs={120}>
          <section aria-label="Three pillars" className="py-12 sm:py-16">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Three pillars, held close.</h2>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Before you cook, you can know a chili the way you know a tea: where it’s from, what it is, how it tastes.
                </p>
              </div>
              <div className="hidden sm:block">
                <span className="inline-flex items-center rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_75%,white)] px-3 py-1 text-xs text-[var(--muted)]">
                  Visible within the first two scrolls
                </span>
              </div>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              <article
                className="group rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0"
                id="origins"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Pillar I</p>
                <h3 className="mt-2 font-[var(--serif)] text-2xl">Origin as Identity</h3>
                <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                  Region matters.

                  Volcanic soil in southern Mexico.
                  Dry desert air in New Mexico.
                  Mountain light in Kashmir.

                  Climate defines character.

                  Every harvest is labeled by origin and season.
                  Because place leaves a trace in flavor.
                </p>
                <div className="mt-5 border-t border-[var(--hair)] pt-5">
                  <p className="font-[var(--serif)] text-sm text-[var(--ink)]">What you taste is weather, soil, altitude—held in skin.</p>
                </div>
                <a
                  href="#featured"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                  aria-label="See featured origins"
                >
                  See featured origins
                  <IconArrowRight className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </article>

              <article
                className="group rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0"
                id="species"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Pillar II</p>
                <h3 className="mt-2 font-[var(--serif)] text-2xl">Plant as Species</h3>
                <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                  Chili is not one plant.

                  Capsicum annuum
                  Capsicum chinense
                  Capsicum baccatum

                  Different species. Different chemistry.

                  Some develop bright fruit and gentle warmth.
                  Others deepen into cocoa and smoke.

                  Species determines expression long before drying begins.
                </p>
                <div className="mt-5 border-t border-[var(--hair)] pt-5">
                  <p className="font-[var(--serif)] text-sm text-[var(--ink)]">We label species plainly, like museum tags—no drama, just clarity.</p>
                </div>
                <a
                  href="#process"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                  aria-label="Read about drying process"
                >
                  Read the process
                  <IconArrowRight className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </article>

              <article
                className="group rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0"
                id="taste"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Pillar III</p>
                <h3 className="mt-2 font-[var(--serif)] text-2xl">Tasting Notes</h3>
                <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                  Heat is only one dimension.

                  Dried cherry.
                  Cocoa husk.
                  Tomato skin.
                  Black tea.
                  Sun-warmed earth.

                  We describe aroma and structure so you can cook with precision.
                </p>
                <div className="mt-5 border-t border-[var(--hair)] pt-5">
                  <p className="font-[var(--serif)] text-sm text-[var(--ink)]">Notes are invitations: how to listen, not what to prove.</p>
                </div>
                <a
                  href="#journal"
                  className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                  aria-label="Read tasting guidance in journal"
                >
                  How to taste
                  <IconArrowRight className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
                </a>
              </article>
            </div>
          </section>
        </Reveal>

        {/* Featured Origins */}
        <Reveal delayMs={140}>
          <section aria-label="Featured origins" className="py-12 sm:py-16" id="featured">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Featured origins</h2>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Four pods, four landscapes. Each labeled as carefully as a specimen drawer—ready for the kitchen.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                aria-label="Explore all origins"
              >
                View all origins
                <IconArrowRight className="h-4 w-4 opacity-70" />
              </a>
            </div>

            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {FEATURED_CHILIES.map((c) => (
                <article
                  key={c.name}
                  className="group relative overflow-hidden rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0 focus-within:shadow-[0_18px_60px_rgba(0,0,0,0.08)]"
                  aria-label={`${c.name} origin card`}
                >
                  <div
                    className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full opacity-40 blur-2xl"
                    style={{
                      background: 'radial-gradient(circle at 30% 30%, rgba(124,30,26,.35), rgba(124,92,58,.18), transparent 70%)',
                    }}
                    aria-hidden="true"
                  />
                  <header>
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Origin</p>
                    <h3 className="mt-2 font-[var(--serif)] text-2xl leading-tight">{c.name}</h3>
                    <p className="mt-2 font-[var(--sans)] text-sm text-[var(--muted)]">
                      {c.region} • {c.country}
                    </p>
                  </header>

                  <dl className="mt-5 space-y-3 border-t border-[var(--hair)] pt-5">
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Species</dt>
                      <dd className="text-sm font-[var(--serif)] italic text-[var(--ink)]">{c.species}</dd>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <dt className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Notes</dt>
                      <dd className="text-sm font-[var(--serif)] text-[var(--ink)]">{c.notes}</dd>
                    </div>
                  </dl>

                  <p className="mt-5 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">{c.profile}</p>

                  <a
                    href="#"
                    className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_68%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                    aria-label={`Explore ${c.name}`}
                  >
                    Explore
                    <IconArrowRight className="h-4 w-4 opacity-70 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Process */}
        <Reveal delayMs={160}>
          <section aria-label="How we dry process" className="py-12 sm:py-16" id="process">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">How we dry</h2>
                <p className="mt-4 font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Timing matters.

                  Pods are harvested when sugars peak.
                  Sun drying deepens sweetness and heat.
                  Shade drying preserves brightness.
                  Smoke transforms aroma.

                  Whole pods protect structure.
                  Grind only what you need.
                </p>

                <div className="mt-8 rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_80%,white)] p-6">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Why whole pods?</p>
                  <p className="mt-3 font-[var(--serif)] text-lg leading-snug">Because aroma escapes through cuts.</p>
                  <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                    Whole skin acts like an envelope. You open it when you’re ready to cook—or simply to smell.
                  </p>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-6 sm:grid-cols-3">
                  {[
                    { title: 'Sun', body: 'Bright, clean drying for fruit-forward clarity. The goal is lift—red fruit, tea, citrus peel.', tag: 'Aroma-forward' },
                    { title: 'Shade', body: 'Slower, gentler dehydration. Preserves floral notes and softens edges—like air-dried herbs.', tag: 'Delicate' },
                    { title: 'Smoke', body: 'Used sparingly, as structure. Smoke should read as wood and time—not volume.', tag: 'Architectural' },
                  ].map((m) => (
                    <article
                      key={m.title}
                      className="group rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0"
                    >
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">{m.tag}</p>
                      <h3 className="mt-2 font-[var(--serif)] text-2xl">{m.title}</h3>
                      <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">{m.body}</p>
                      <div className="mt-5 h-1 w-14 rounded-full bg-[color:color-mix(in_oklab,var(--accent)_65%,var(--earth))] opacity-70" />
                    </article>
                  ))}
                </div>

                <div className="mt-8 overflow-hidden rounded-3xl border border-[var(--hair)]">
                  <div
                    className="relative p-7 sm:p-8"
                    style={{
                      backgroundImage: `
                        linear-gradient(135deg, rgba(17,17,17,0.04), rgba(124,92,58,0.10), rgba(124,30,26,0.08)),
                        radial-gradient(900px 480px at 30% 30%, rgba(124,92,58,0.12), transparent 60%)
                      `,
                    }}
                  >
                    <div className="pointer-events-none absolute inset-0 opacity-70" style={{ backgroundImage: noise, mixBlendMode: 'multiply' }} aria-hidden="true" />
                    <div className="relative">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Process note</p>
                      <p className="mt-3 font-[var(--serif)] text-xl leading-snug">Drying is a kind of editing: remove water, keep the sentence.</p>
                      <p className="mt-3 max-w-2xl font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">
                        We work for quiet precision—so a dish tastes more like its ingredients, not like a stunt.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Journal */}
        <Reveal delayMs={180}>
          <section aria-label="Journal teaser" className="py-12 sm:py-16" id="journal">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">Journal</h2>
                <p className="mt-3 max-w-2xl font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  Field notes, tasting guidance, and the quiet science of a pod.
                </p>
              </div>
              <a
                href="#"
                className="inline-flex items-center gap-2 self-start rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_70%,white)] px-4 py-2 text-sm text-[var(--ink)] transition-transform duration-200 hover:-translate-y-0.5 active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                aria-label="Read all journal posts"
              >
                Read all
                <IconArrowRight className="h-4 w-4 opacity-70" />
              </a>
            </div>

            <div className="mt-8 grid gap-6 lg:grid-cols-3">
              {JOURNAL_POSTS.map((p) => (
                <article
                  key={p.title}
                  className="group rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 transition-transform duration-200 hover:-translate-y-1 hover:shadow-[0_18px_60px_rgba(0,0,0,0.08)] active:translate-y-0"
                  aria-label={`Journal post: ${p.title}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_65%,white)] px-3 py-1 text-xs text-[var(--muted)]">
                      {p.tag}
                    </span>
                    <time className="text-xs text-[var(--muted)]" dateTime={p.date}>
                      {formatDateISO(p.date)}
                    </time>
                  </div>
                  <h3 className="mt-4 font-[var(--serif)] text-2xl leading-snug">
                    <a href={p.href} className="rounded outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]">
                      {p.title}
                    </a>
                  </h3>
                  <p className="mt-3 font-[var(--sans)] text-sm leading-relaxed text-[var(--muted)]">{p.excerpt}</p>
                  <a
                    href={p.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm text-[var(--ink)] underline decoration-[var(--hair)] underline-offset-4 transition-colors hover:decoration-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)] rounded"
                    aria-label={`Read ${p.title}`}
                  >
                    Read
                    <IconArrowRight className="h-4 w-4 opacity-70" />
                  </a>
                </article>
              ))}
            </div>
          </section>
        </Reveal>

        {/* Email Signup */}
        <Reveal delayMs={200}>
          <section aria-label="Email signup" className="py-12 sm:py-16" id="about">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-5">
                <h2 className="font-[var(--serif)] text-3xl tracking-tight sm:text-4xl">A short letter, occasionally.</h2>
                <p className="mt-4 font-[var(--sans)] text-base leading-relaxed text-[var(--muted)]">
                  New origins, journal entries, and tasting notes—sent with restraint.
                </p>
                <p className="mt-6 font-[var(--serif)] text-sm leading-relaxed text-[color:color-mix(in_oklab,var(--ink)_80%,var(--earth))]">
                  No noise. No urgency.
                  <br />
                  Just fieldwork and flavor.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className="rounded-3xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_82%,white)] p-6 sm:p-8">
                  <form onSubmit={onSubmitEmail} aria-label="Email signup form">
                    <label htmlFor={emailId} className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
                      Email
                    </label>
                    <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                      <input
                        id={emailId}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        placeholder="you@domain.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full rounded-2xl border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_72%,white)] px-4 py-3 font-[var(--sans)] text-sm text-[var(--ink)] outline-none transition-shadow focus:ring-2 focus:ring-[var(--accent)]"
                        aria-label="Email address"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--ink)] px-5 py-3 text-sm text-[var(--paper)] shadow-[0_14px_40px_rgba(0,0,0,0.18)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(0,0,0,0.22)] active:translate-y-0 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)]"
                        aria-label="Subscribe"
                      >
                        Subscribe
                        <IconArrowRight className="h-4 w-4 opacity-80" />
                      </button>
                    </div>

                    <div className="mt-4 flex items-start justify-between gap-6">
                      <p className="max-w-xl font-[var(--sans)] text-xs leading-relaxed text-[var(--muted)]">
                        Wireframe behavior: this form is local-only for now. Later, connect to your email provider via an API route or Cloudflare Worker.
                      </p>
                      <div
                        role="status"
                        aria-live="polite"
                        className={cx(
                          'shrink-0 rounded-full border border-[var(--hair)] bg-[color:color-mix(in_oklab,var(--paper)_68%,white)] px-3 py-1 text-xs text-[var(--muted)] transition-opacity',
                          subscribed ? 'opacity-100' : 'opacity-0'
                        )}
                      >
                        Subscribed (local)
                      </div>
                    </div>
                  </form>

                  <div className="mt-8 border-t border-[var(--hair)] pt-6">
                    <p className="text-xs uppercase tracking-[0.18em] text-[var(--muted)]">Small print</p>
                    <p className="mt-2 font-[var(--sans)] text-xs leading-relaxed text-[var(--muted)]">
                      CLUBA is built for cooks, not contests. We describe flavor with care, and we keep UI quiet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </Reveal>

        {/* Footer */}
        <footer aria-label="Footer" className="border-t border-[var(--hair)] py-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-[var(--serif)] text-lg tracking-[0.22em] uppercase">CLUBA</p>
              <p className="mt-2 font-[var(--sans)] text-sm text-[var(--muted)]">
                Single-origin dried chili pods—labeled like specimens, used like ingredients.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-sm text-[var(--muted)] underline decoration-[var(--hair)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:decoration-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)] rounded"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#main"
                className="text-sm text-[var(--muted)] underline decoration-[var(--hair)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:decoration-[var(--ink)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2 focus:ring-offset-[var(--paper)] rounded"
              >
                Back to top
              </a>
            </div>
          </div>

          <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-[var(--sans)] text-xs text-[var(--muted)]">© {new Date().getFullYear()} CLUBA. Calm heat. Clear provenance.</p>
            <p className="font-[var(--sans)] text-xs text-[var(--muted)]">Built with whitespace and restraint.</p>
          </div>
        </footer>
      </main>
    </div>
  );
}