'use client'

import { useMemo, useState } from 'react'

type WaitlistResult =
  | { ok: true; deduped?: boolean }
  | { ok: false; error: string }

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function Icon({ name }: { name: 'shield' | 'eye' | 'lock' | 'trash' | 'check' | 'spark' }) {
  const common = 'icon'
  switch (name) {
    case 'shield':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'eye':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.7" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
          <path d="M6 11h12v10H6V11z" stroke="currentColor" strokeWidth="1.7" />
        </svg>
      )
    case 'trash':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M6 7l1 14h10l1-14" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
      )
    case 'check':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'spark':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l1.3 6.2L20 10l-6.7 1.8L12 18l-1.3-6.2L4 10l6.7-1.8L12 2z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
        </svg>
      )
  }
}

function Badge({ children }: { children: React.ReactNode }) {
  return <span className="badge">{children}</span>
}

function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [msg, setMsg] = useState<string>('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setMsg('')

    try {
      const res = await fetch('/api/waitlist/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, useCase })
      })
      const data = (await res.json()) as WaitlistResult
      if (!data.ok) {
        setStatus('error')
        setMsg(data.error || 'Something went wrong.')
        return
      }
      setStatus('success')
      setMsg(data.deduped ? 'You’re already on the list.' : 'You’re on the list. Thank you.')
      setEmail('')
      setUseCase('')
    } catch {
      setStatus('error')
      setMsg('Network error. Please try again.')
    }
  }

  return (
    <form className="form" onSubmit={onSubmit}>
      <div className="formRow">
        <label className="label" htmlFor="email">Email</label>
        <input
          id="email"
          className="input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="formRow">
        <label className="label" htmlFor="useCase">Use case (optional)</label>
        <input
          id="useCase"
          className="input"
          type="text"
          placeholder="Work projects, language learning, travel…"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
        />
      </div>

      <div className="formActions">
        <button className="button" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining…' : 'Join the beta'}
        </button>
        <div className="formNote">No spam. Only early access updates.</div>
      </div>

      <div className="formStatus" aria-live="polite">
        {status === 'success' ? (
          <div className="status success"><Icon name="check" /> {msg}</div>
        ) : status === 'error' ? (
          <div className="status error"><Icon name="spark" /> {msg}</div>
        ) : null}
      </div>
    </form>
  )
}

function MiniMap() {
  const [tab, setTab] = useState<'work' | 'learning' | 'life'>('work')

  const content = useMemo(() => {
    if (tab === 'work') {
      return {
        title: 'Project kingdom',
        items: [
          'Goal: Ship MVP',
          'Decision: Local-first storage',
          'Artifact: landing + ads',
          'Metric: conversion'
        ],
        note: 'The assistant stays aligned with your goals over weeks and months.'
      }
    }
    if (tab === 'learning') {
      return {
        title: 'Learning kingdom',
        items: [
          'Skill: German A2 → B1',
          'Mistake patterns',
          'Practice topics',
          'Milestones'
        ],
        note: 'It remembers what helps you improve — only when you approve.'
      }
    }
    return {
      title: 'Life kingdom',
      items: [
        'Preferences',
        'Plans',
        'Experiences',
        'Constraints'
      ],
      note: 'Keep what matters. Delete what doesn’t. Always visible.'
    }
  }, [tab])

  return (
    <div className="minimap">
      <div className="tabs" role="tablist" aria-label="Kingdom tabs">
        <button className={cx('tab', tab === 'work' && 'tabActive')} onClick={() => setTab('work')} role="tab" aria-selected={tab === 'work'}>Work</button>
        <button className={cx('tab', tab === 'learning' && 'tabActive')} onClick={() => setTab('learning')} role="tab" aria-selected={tab === 'learning'}>Learning</button>
        <button className={cx('tab', tab === 'life' && 'tabActive')} onClick={() => setTab('life')} role="tab" aria-selected={tab === 'life'}>Life</button>
      </div>

      <div className="panel">
        <div className="panelTitle">{content.title}</div>
        <div className="panelGrid">
          {content.items.map((x) => (
            <div key={x} className="panelItem">
              <span className="dot" aria-hidden="true" />
              <span>{x}</span>
            </div>
          ))}
        </div>
        <div className="panelNote">{content.note}</div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <main className="page">
      <header className="header">
        <div className="container headerInner">
          <a className="brand" href="/">
            <span className="mark" aria-hidden="true">c</span>
            <span className="brandText">cluba</span>
          </a>

          <nav className="nav">
            <a className="navLink" href="#how">How it works</a>
            <a className="navLink" href="#trust">Trust</a>
            <a className="navLink" href="#faq">FAQ</a>
            <a className="navCta" href="#waitlist">Join</a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container heroGrid">
          <div>
            <div className="badges">
              <Badge><Icon name="eye" /> Transparent memory</Badge>
              <Badge><Icon name="shield" /> You approve changes</Badge>
              <Badge><Icon name="trash" /> Delete anytime</Badge>
            </div>

            <h1 className="h1">
              Private AI memory.
              <span className="h1Sub"> Only with your approval.</span>
            </h1>

            <p className="lead">
              cluba is a user-controlled memory space for AI: topic “kingdoms” connected by relationships.
              After each session, the assistant proposes updates. You approve, edit, reject, or purge.
            </p>

            <div id="waitlist" className="heroCard">
              <div className="heroCardTop">
                <div className="heroCardTitle">Join the private beta</div>
                <div className="heroCardSub">Help shape the product. Keep your data in your control.</div>
              </div>
              <WaitlistForm />
            </div>

            <div className="fineprint">
              Built to earn trust: clear memory, explicit consent, and simple controls.
            </div>
          </div>

          <div className="heroRight">
            <MiniMap />
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <h2 className="h2">How it works</h2>
          <p className="sub">
            Minimal workflow. Maximum control.
          </p>

          <div className="steps">
            <div className="step">
              <div className="stepTop"><Icon name="spark" /> Chat normally</div>
              <div className="stepText">Use your favorite assistant. cluba focuses on the context you choose to track.</div>
            </div>

            <div className="step">
              <div className="stepTop"><Icon name="eye" /> Get a memory proposal</div>
              <div className="stepText">The assistant suggests new nodes and connections: goals, decisions, learnings, preferences.</div>
            </div>

            <div className="step">
              <div className="stepTop"><Icon name="shield" /> You decide</div>
              <div className="stepText">Approve, edit, reject, or purge. Nothing becomes memory without your confirmation.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="trust" className="section subtle">
        <div className="container">
          <h2 className="h2">Trust, by design</h2>
          <p className="sub">
            The product is built around transparency and user control — not surveillance.
          </p>

          <div className="grid">
            <div className="card">
              <div className="cardTop"><Icon name="eye" /> Fully visible memory</div>
              <div className="cardText">See what’s remembered and why it’s connected. Correct it instantly.</div>
            </div>
            <div className="card">
              <div className="cardTop"><Icon name="shield" /> Explicit confirmation</div>
              <div className="cardText">Every session ends with a proposed change list you can accept or refuse.</div>
            </div>
            <div className="card">
              <div className="cardTop"><Icon name="trash" /> Delete anytime</div>
              <div className="cardText">Remove individual nodes/edges or wipe everything — without friction.</div>
            </div>
            <div className="card">
              <div className="cardTop"><Icon name="lock" /> Privacy-first direction</div>
              <div className="cardText">Local-first patterns and opt-in sharing principles guide the roadmap.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="section">
        <div className="container">
          <h2 className="h2">FAQ</h2>

          <div className="faq">
            <details className="qa">
              <summary>Is this a notes app?</summary>
              <div className="a">No. It’s a memory layer for AI: structured context that stays editable and user-controlled.</div>
            </details>

            <details className="qa">
              <summary>How is this different from “AI memory” features?</summary>
              <div className="a">cluba is explicit and transparent. The assistant proposes updates. You approve or reject them.</div>
            </details>

            <details className="qa">
              <summary>What can I use it for?</summary>
              <div className="a">Work projects, learning (e.g. languages), travel plans, and personal preferences — as separate “kingdoms”.</div>
            </details>

            <details className="qa">
              <summary>When can I try it?</summary>
              <div className="a">Join the beta list. We’ll invite early users in small waves.</div>
            </details>
          </div>

          <div className="footerCta">
            <div>
              <div className="footerCtaTitle">Ready to try a calmer, more trustworthy AI?</div>
              <div className="footerCtaSub">Join the beta and tell us your use case.</div>
            </div>
            <a className="navCta" href="#waitlist">Join</a>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footerInner">
          <div className="footLeft">
            <div className="brandFoot">
              <span className="mark" aria-hidden="true">c</span>
              <span className="brandText">cluba</span>
            </div>
            <div className="tiny">© {new Date().getFullYear()} cluba</div>
          </div>
          <div className="footRight">
            <a className="footLink" href="#how">How it works</a>
            <a className="footLink" href="#trust">Trust</a>
            <a className="footLink" href="#waitlist">Join</a>
          </div>
        </div>
      </footer>
    </main>
  )
}
