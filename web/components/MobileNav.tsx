'use client';

import * as React from 'react';
import type { NavLink } from './home/types';
import { cx } from './home/ui';

function getFocusable(container: HTMLElement | null) {
  if (!container) return [];
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',');
  return Array.from(container.querySelectorAll<HTMLElement>(selectors)).filter(
    (el) => !el.hasAttribute('disabled') && !el.getAttribute('aria-hidden')
  );
}

export function MobileNav({
  links,
  activeSectionId,
}: {
  links: NavLink[];
  activeSectionId?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const panelRef = React.useRef<HTMLDivElement | null>(null);
  const buttonRef = React.useRef<HTMLButtonElement | null>(null);
  const titleId = React.useId();

  React.useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === 'Tab') {
        const focusables = getFocusable(panelRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey) {
          if (!active || active === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (active === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);

    // Focus first focusable in panel
    const t = window.setTimeout(() => {
      const focusables = getFocusable(panelRef.current);
      (focusables[0] || panelRef.current)?.focus?.();
    }, 0);

    return () => {
      window.clearTimeout(t);
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  React.useEffect(() => {
    if (!open) buttonRef.current?.focus();
  }, [open]);

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        className={cx(
          'inline-flex h-11 w-11 items-center justify-center rounded-full',
          'border border-[rgba(17,17,17,0.16)] bg-[rgba(250,247,241,0.78)]',
          'text-neutral-900 transition-all hover:bg-[rgba(255,255,255,0.60)]',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]'
        )}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        <span className="sr-only">{open ? 'Close' : 'Open'} navigation</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          {open ? (
            <>
              <path d="M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            <>
              <path d="M4 6h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M4 14h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </>
          )}
        </svg>
      </button>

      {open ? (
        <div className="fixed inset-0 z-[60]" role="dialog" aria-modal="true" aria-labelledby={titleId}>
          <button
            type="button"
            className="absolute inset-0 cursor-default bg-[rgba(17,17,17,0.35)]"
            aria-label="Close menu overlay"
            onClick={close}
          />
          <div className="absolute inset-x-0 top-0 p-4">
            <div
              id="mobile-menu"
              ref={panelRef}
              tabIndex={-1}
              className={cx(
                'rounded-3xl border border-[rgba(17,17,17,0.16)] bg-[rgba(250,247,241,0.92)] p-4 backdrop-blur',
                'shadow-[0_18px_80px_rgba(17,17,17,0.18)]'
              )}
            >
              <div className="flex items-center justify-between gap-4 px-2 py-2">
                <p id={titleId} className="font-serif text-lg tracking-[0.06em] text-neutral-900">
                  CLUBA
                </p>
                <button
                  type="button"
                  className={cx(
                    'inline-flex h-10 w-10 items-center justify-center rounded-full',
                    'border border-[rgba(17,17,17,0.14)] bg-[rgba(255,255,255,0.55)]',
                    'text-neutral-900 transition-all hover:bg-[rgba(255,255,255,0.70)]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]'
                  )}
                  aria-label="Close menu"
                  onClick={close}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M5 5l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <div className="cluba-divider my-3" aria-hidden="true" />

              <nav aria-label="Mobile navigation" className="px-2 pb-2">
                <ul className="space-y-1">
                  {links.map((l) => {
                    const isActive = activeSectionId === l.id;
                    return (
                      <li key={l.href}>
                        <a
                          href={l.href}
                          aria-current={isActive ? 'page' : undefined}
                          className={cx(
                            'flex items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium',
                            isActive
                              ? 'bg-[rgba(140,36,36,0.08)] text-[rgba(140,36,36,0.95)]'
                              : 'text-neutral-900 hover:bg-[rgba(17,17,17,0.04)]',
                            'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]'
                          )}
                          onClick={close}
                        >
                          <span>{l.label}</span>
                          <span
                            aria-hidden="true"
                            className={cx(
                              'inline-block h-2 w-2 rounded-full',
                              isActive ? 'bg-[rgba(140,36,36,0.80)]' : 'bg-[rgba(17,17,17,0.22)]'
                            )}
                          />
                        </a>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 rounded-2xl border border-[rgba(17,17,17,0.12)] bg-[rgba(255,255,255,0.50)] p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600">A note</p>
                  <p className="mt-2 text-sm leading-relaxed text-neutral-800">
                    Heat is not our headline. We read the pod for place, plant, and finish.
                  </p>
                </div>
              </nav>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
