import * as React from 'react';
import type { Accent, Chili, JournalPost } from './types';
import { cx, IconArrowRight } from './ui';

export function PillarCard({
  eyebrow,
  title,
  body,
  href,
  accent,
}: {
  eyebrow: string;
  title: string;
  body: string;
  href: string;
  accent: Accent;
}) {
  const accentClass =
    accent === 'red'
      ? 'border-[rgba(140,36,36,0.28)] hover:border-[rgba(140,36,36,0.45)]'
      : accent === 'earth'
      ? 'border-[rgba(122,92,58,0.25)] hover:border-[rgba(122,92,58,0.4)]'
      : 'border-[rgba(17,17,17,0.14)] hover:border-[rgba(17,17,17,0.22)]';

  return (
    <a
      href={href}
      className={cx(
        'group relative block rounded-2xl border bg-[rgba(255,255,255,0.45)] p-6 sm:p-7',
        'shadow-[0_1px_0_rgba(17,17,17,0.05)]',
        'transition-transform duration-300 hover:-translate-y-0.5',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]',
        accentClass
      )}
      aria-label={`${title}: ${body}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600">{eyebrow}</p>
          <h3 className="mt-2 font-serif text-2xl leading-tight text-neutral-900">{title}</h3>
        </div>
        <span
          className={cx(
            'mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full',
            'border border-[rgba(17,17,17,0.10)] bg-[rgba(250,247,241,0.6)]',
            'text-neutral-700 transition-transform duration-300 group-hover:translate-x-0.5'
          )}
          aria-hidden="true"
        >
          <IconArrowRight className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 max-w-prose text-sm leading-relaxed text-neutral-700">{body}</p>
      <div className="mt-6 flex items-center gap-2 text-sm font-medium text-neutral-900">
        <span className="relative">
          <span className="relative z-10">Read the approach</span>
          <span
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-[rgba(17,17,17,0.55)] transition-transform duration-300 group-hover:scale-x-100"
          />
        </span>
      </div>
    </a>
  );
}

export function ChiliCard({ chili }: { chili: Chili }) {
  return (
    <article
      className={cx(
        'group relative rounded-2xl border border-[rgba(17,17,17,0.14)] bg-[rgba(255,255,255,0.42)] p-6',
        'shadow-[0_1px_0_rgba(17,17,17,0.05)]',
        'transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_70px_rgba(17,17,17,0.08)]',
        'focus-within:ring-2 focus-within:ring-[rgba(140,36,36,0.55)] focus-within:ring-offset-2 focus-within:ring-offset-[rgba(250,247,241,1)]'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-serif text-2xl leading-tight text-neutral-900">{chili.name}</h3>
          <p className="mt-2 text-sm text-neutral-700">{chili.region}</p>
        </div>
        <span className="inline-flex rounded-full border border-[rgba(17,17,17,0.12)] bg-[rgba(250,247,241,0.7)] px-3 py-1 text-xs font-medium tracking-wide text-neutral-800">
          {chili.species}
        </span>
      </div>

      <dl className="mt-5 grid grid-cols-2 gap-4">
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600">Tasting Notes</dt>
          <dd className="mt-2 text-sm leading-relaxed text-neutral-800">{chili.notes}</dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-600">Field Details</dt>
          <dd className="mt-2 text-sm leading-relaxed text-neutral-800">
            <span className="block">{chili.altitude}</span>
            <span className="block text-neutral-700">{chili.harvest}</span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-neutral-600">Whole pods · slow-dried · batch-traced</p>
        <a
          href="#origins"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]"
          aria-label={`Explore ${chili.name} origin`}
        >
          <span className="relative">
            <span className="relative z-10">Explore</span>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-[rgba(17,17,17,0.55)] transition-transform duration-300 group-hover:scale-x-100"
            />
          </span>
          <IconArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}

export function JournalCard({ post }: { post: JournalPost }) {
  return (
    <article
      className={cx(
        'group rounded-2xl border border-[rgba(17,17,17,0.14)] bg-[rgba(255,255,255,0.42)] p-6',
        'shadow-[0_1px_0_rgba(17,17,17,0.05)]',
        'transition-transform duration-300 hover:-translate-y-0.5',
        'focus-within:ring-2 focus-within:ring-[rgba(140,36,36,0.55)] focus-within:ring-offset-2 focus-within:ring-offset-[rgba(250,247,241,1)]'
      )}
    >
      <div className="flex items-center justify-between gap-4">
        <span className="inline-flex rounded-full border border-[rgba(140,36,36,0.24)] bg-[rgba(140,36,36,0.06)] px-3 py-1 text-xs font-medium tracking-wide text-[rgba(140,36,36,0.95)]">
          {post.tag}
        </span>
        <p className="text-xs text-neutral-600">{post.date}</p>
      </div>
      <h3 className="mt-4 font-serif text-2xl leading-tight text-neutral-900">{post.title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-neutral-700">{post.excerpt}</p>
      <div className="mt-6">
        <a
          href={post.href}
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(140,36,36,0.55)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(250,247,241,1)]"
          aria-label={`Read journal post: ${post.title}`}
        >
          <span className="relative">
            <span className="relative z-10">Read</span>
            <span
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-[1px] w-full origin-left scale-x-0 bg-[rgba(17,17,17,0.55)] transition-transform duration-300 group-hover:scale-x-100"
            />
          </span>
          <IconArrowRight className="h-4 w-4" />
        </a>
      </div>
    </article>
  );
}
