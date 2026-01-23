'use client'

import { useMemo, useState } from 'react'

type WaitlistResult =
  | { ok: true }
  | { ok: false; error: string }

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

function Icon({ name }: { name: 'shield' | 'eye' | 'graph' | 'spark' | 'lock' | 'trash' | 'check' | 'question' }) {
  const common = 'h-5 w-5'
  switch (name) {
    case 'shield':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l8 4v6c0 5-3.5 9.5-8 10-4.5-.5-8-5-8-10V6l8-4z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M9 12l2 2 4-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'eye':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'graph':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 7h.01M17 5h.01M19 17h.01M7 19h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M7 7l10-2M7 7l12 10M7 19l12-2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'spark':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 2l1.3 6.2L20 10l-6.7 1.8L12 18l-1.3-6.2L4 10l6.7-1.8L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
        </svg>
      )
    case 'lock':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 11V8a5 5 0 0 1 10 0v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M6 11h12v10H6V11z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
    case 'trash':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M6 7l1 14h10l1-14" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'check':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'question':
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12 18h.01" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M9.5 9.5a2.8 2.8 0 1 1 4.3 2.4c-.9.6-1.8 1.2-1.8 2.6v.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          <path d="M12 22C6.5 22 2 17.5 2 12S6.5 2 12 2s10 4.5 10 10-4.5 10-10 10z" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      )
  }
}

function Pill({ children }: { children: React.ReactNode }) {
  return <span className="pill">{children}</span>
}

function SectionHeading({ eyebrow, title, subtitle }: { eyebrow?: string; title: string; subtitle?: string }) {
  return (
    <div className="sectionHeading">
      {eyebrow ? <div className="eyebrow">{eyebrow}</div> : null}
      <h2 className="h2">{title}</h2>
      {subtitle ? <p className="sub">{subtitle}</p> : null}
    </div>
  )
}

function Card({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="cardTop">
        <div className="icon">{icon}</div>
        <div className="cardTitle">{title}</div>
      </div>
      <div className="cardBody">{children}</div>
    </div>
  )
}

function DemoPanel() {
  const [tab, setTab] = useState<'work' | 'learning' | 'travel'>('work')

  const content = useMemo(() => {
    if (tab === 'work') {
      return {
        title: 'Project Kingdom',
        left: ['Goal: Ship MVP by March 15', 'Decision: Local-first storage', 'Artifact: app/home.swift', 'Metric: Signup conversion'],
        right: ['Goal → depends on → Artifact', 'Decision → supports → Goal', 'Metric → measures → Goal', 'Artifact → impacts → Metric'],
        footer: 'After each session, cluba proposes updates. You approve, edit, or reject.'
      }
    }
    if (tab === 'learning') {
      return {
        title: 'Learning Kingdom',
        left: ['Skill: German A2 → B1', 'Mistake: der/die/das', 'Topic: Restaurant dialogues', 'Milestone: 30-day streak'],
        right: ['Mistake → confused-with → nouns', 'Topic → reinforces → Skill', 'Milestone → improves → retention', 'Skill → drives → practice plan'],
        footer: 'Your tutor remembers what matters—only with your confirmation.'
      }
    }
    return {
      title: 'Travel Kingdom',
      left: ['Preference: quiet hotels', 'Place: Kyoto', 'Experience: best ramen', 'Constraint: vegetarian options'],
      right: ['Preference → filters → suggestions', 'Constraint → avoids → restaurants', 'Experience → recommends → places', 'Place → connects → itinerary'],
      footer: 'A memory map for experiences and preferences—fully visible and deletable.'
    }
  }, [tab])

  return (
    <div className="demo">
      <div className="demoTabs" role="tablist" aria-label="Demo tabs">
        <button className={cx('tab', tab === 'work' && 'tabActive')} onClick={() => setTab('work')} role="tab" aria-selected={tab === 'work'}>
          Work
        </button>
        <button className={cx('tab', tab === 'learning' && 'tabActive')} onClick={() => setTab('learning')} role="tab" aria-selected={tab === 'learning'}>
          Learning
        </button>
        <button className={cx('tab', tab === 'travel' && 'tabActive')} onClick={() => setTab('travel')} role="tab" aria-selected={tab === 'travel'}>
          Travel
        </button>
      </div>

      <div className="demoShell">
        <div className="demoHeader">
          <div className="demoTitle">{content.title}</div>
          <div className="demoMeta">
            <Pill>Transparent</Pill>
            <Pill>Permission-based</Pill>
            <Pill>Local-first</Pill>
          </div>
        </div>

        <div className="demoGrid">
          <div className="demoCol">
            <div className="demoLabel">Nodes</div>
            <ul className="demoList">
              {content.left.map((x) => (
                <li key={x} className="demoItem">
                  <span className="dot" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="demoCol">
            <div className="demoLabel">Edges (weighted relationships)</div>
            <ul className="demoList">
              {content.right.map((x) => (
                <li key={x} className="demoItem">
                  <span className="link" />
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="demoFooter">{content.footer}</div>
      </div>
    </div>
  )
}

function WaitlistForm({ compact }: { compact?: boolean }) {
  const [email, setEmail] = useState('')
  const [useCase, setUseCase] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string>('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return

    setStatus('loading')
    setError('')

    try {
      const res = await fetch('/api/waitlist/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, useCase })
      })
      const data = (await res.json()) as WaitlistResult
      if (!data.ok) {
        setStatus('error')
        setError(data.error || 'Something went wrong.')
        return
      }
      setStatus('success')
      setEmail('')
      setUseCase('')
    } catch {
      setStatus('error')
      setError('Network error. Please try again.')
    }
  }

  return (
    <form className={cx('form', compact && 'formCompact')} onSubmit={onSubmit}>
      <div className="formRow">
        <input
          className="input"
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
          required
        />
        <button className="button" type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Joining…' : 'Join the beta'}
        </button>
      </div>

      <div className="formRow">
        <input
          className="input"
          type="text"
          placeholder="What would you use this for? (optional)"
          value={useCase}
          onChange={(e) => setUseCase(e.target.value)}
          aria-label="Use case"
        />
      </div>

      <div className="formHint">
        {status === 'success' ? (
          <span className="success">
            <Icon name="check" /> You’re on the list. Thanks!
          </span>
        ) : status === 'error' ? (
          <span className="error">
            <Icon name="question" /> {error}
          </span>
        ) : (
          <span>We’ll only email for early access. No spam.</span>
        )}
      </div>
    </form>
  )
}

export default function Page() {
  return (
    <main className="root">
      <header className="header">
        <div className="container headerInner">
          <div className="brand">
            <div className="logo" aria-hidden="true">
              c
            </div>
            <div className="brandText">
              <div className="brandName">cluba</div>
              <div className="brandTag">Private AI memory you control</div>
            </div>
          </div>

          <nav className="nav">
            <a className="navLink" href="#how">
              How it works
            </a>
            <a className="navLink" href="#trust">
              Trust
            </a>
            <a className="navLink" href="#faq">
              FAQ
            </a>
            <a className="navCta" href="#waitlist">
              Join
            </a>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container heroGrid">
          <div className="heroLeft">
            <div className="badges">
              <Pill>
                <Icon name="shield" /> User-approved memory
              </Pill>
              <Pill>
                <Icon name="lock" /> Local-first by default
              </Pill>
              <Pill>
                <Icon name="eye" /> Fully transparent
              </Pill>
            </div>

            <h1 className="h1">
              An AI that remembers what matters —
              <span className="grad"> only when you approve.</span>
            </h1>

            <p className="lead">
              cluba turns your interactions with AI into a visible memory map of “Topic Kingdoms” (work, learning, travel, life). After each
              session, the AI proposes changes — you approve, edit, reject, or purge anytime.
            </p>

            <div id="waitlist" className="heroForm">
              <WaitlistForm />
              <div className="micro">
                <span>
                  <Icon name="trash" /> Delete anything
                </span>
                <span>
                  <Icon name="graph" /> Nodes + weighted edges
                </span>
                <span>
                  <Icon name="spark" /> Smarter follow-ups
                </span>
              </div>
            </div>

            <div className="socialProof">
              <div className="proofItem">
                <div className="proofTop">Designed for trust</div>
                <div className="proofBottom">You decide what becomes memory.</div>
              </div>
              <div className="proofItem">
                <div className="proofTop">Built for continuity</div>
                <div className="proofBottom">Projects, learning, and life stay connected.</div>
              </div>
            </div>
          </div>

          <div className="heroRight">
            <DemoPanel />
          </div>
        </div>
      </section>

      <section id="how" className="section">
        <div className="container">
          <SectionHeading
            eyebrow="How it works"
            title="A memory layer between you and any AI"
            subtitle="Simple workflow. Strong control. Immediate benefit."
          />

          <div className="steps">
            <div className="step">
              <div className="stepNum">1</div>
              <div className="stepBody">
                <div className="stepTitle">Chat as usual</div>
                <div className="stepText">Use ChatGPT, Gemini, Claude, or your favorite assistant. cluba focuses on the context you choose.</div>
              </div>
            </div>

            <div className="step">
              <div className="stepNum">2</div>
              <div className="stepBody">
                <div className="stepTitle">Get a “memory proposal”</div>
                <div className="stepText">
                  After the session, cluba suggests node/edge updates: new goals, decisions, learnings, preferences, and links.
                </div>
              </div>
            </div>

            <div className="step">
              <div className="stepNum">3</div>
              <div className="stepBody">
                <div className="stepTitle">You approve, edit, or reject</div>
                <div className="stepText">Nothing is saved without your confirmation. You can also delete items or purge everything at any time.</div>
              </div>
            </div>
          </div>

          <div className="grid3">
            <Card icon={<Icon name="graph" />} title="Topic Kingdoms">
              Organize life into kingdoms (e.g., Project, Language Learning, Travel). Each kingdom has its own nodes, edges, and cadence.
            </Card>
            <Card icon={<Icon name="eye" />} title="Full transparency">
              See exactly what’s remembered. Understand why it’s connected. Update or correct it instantly.
            </Card>
            <Card icon={<Icon name="spark" />} title="Human-like continuity">
              Get smarter follow-ups: “How did the campaign perform?” “Did that learning method work?” — based on what you chose to track.
            </Card>
          </div>
        </div>
      </section>

      <section id="trust" className="section alt">
        <div className="container">
          <SectionHeading eyebrow="Trust & privacy" title="Designed so users stay in control" subtitle="No hidden memory. No silent updates. No lock-in." />

          <div className="grid2">
            <div className="panel">
              <div className="panelTitle">
                <Icon name="shield" /> Permission-based memory
              </div>
              <ul className="list">
                <li>
                  <Icon name="check" /> Every change requires explicit confirmation
                </li>
                <li>
                  <Icon name="check" /> Edit or reject any suggestion
                </li>
                <li>
                  <Icon name="check" /> Clear provenance: what changed, and why
                </li>
              </ul>
            </div>

            <div className="panel">
              <div className="panelTitle">
                <Icon name="lock" /> Local-first by default
              </div>
              <ul className="list">
                <li>
                  <Icon name="check" /> Your data stays on your device unless you opt in
                </li>
                <li>
                  <Icon name="check" /> Export your memory map anytime
                </li>
                <li>
                  <Icon name="check" /> One-click purge for full reset
                </li>
              </ul>
            </div>
          </div>

          <div className="note">
            Compliance matters. cluba is being designed to support GDPR-style control: access, edit, delete, and portability.
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionHeading
            eyebrow="Use cases"
            title="Start with one kingdom — expand when you’re ready"
            subtitle="Same engine. Same approval model. Different domains."
          />

          <div className="useCases">
            <div className="useCase">
              <div className="useTop">
                <div className="useIcon">
                  <Icon name="graph" />
                </div>
                <div>
                  <div className="useTitle">Builders & projects</div>
                  <div className="useText">Connect mission ↔ decisions ↔ code ↔ metrics, so your AI stays aligned over weeks and months.</div>
                </div>
              </div>
              <div className="useBullets">
                <span className="bullet">Roadmap continuity</span>
                <span className="bullet">Decision trail</span>
                <span className="bullet">Smarter summaries</span>
              </div>
            </div>

            <div className="useCase">
              <div className="useTop">
                <div className="useIcon">
                  <Icon name="spark" />
                </div>
                <div>
                  <div className="useTitle">Learning</div>
                  <div className="useText">Track what you forget, what confuses you, and what works — with a visible map you can correct.</div>
                </div>
              </div>
              <div className="useBullets">
                <span className="bullet">Mistake tracking</span>
                <span className="bullet">Retention loops</span>
                <span className="bullet">Adaptive practice</span>
              </div>
            </div>

            <div className="useCase">
              <div className="useTop">
                <div className="useIcon">
                  <Icon name="eye" />
                </div>
                <div>
                  <div className="useTitle">Life & travel</div>
                  <div className="useText">Remember preferences and experiences without surveillance. Keep what you want. Delete the rest.</div>
                </div>
              </div>
              <div className="useBullets">
                <span className="bullet">Preference memory</span>
                <span className="bullet">Trip continuity</span>
                <span className="bullet">Editable history</span>
              </div>
            </div>
          </div>

          <div className="ctaBand">
            <div>
              <div className="ctaTitle">Get early access</div>
              <div className="ctaText">We’re selecting a small group for the first private beta.</div>
            </div>
            <WaitlistForm compact />
          </div>
        </div>
      </section>

      <section id="faq" className="section alt">
        <div className="container">
          <SectionHeading eyebrow="FAQ" title="Common questions" subtitle="If you’re unsure, this section should remove friction." />

          <div className="faq">
            <details className="faqItem">
              <summary>Is this a notes app?</summary>
              <div className="faqBody">
                Not really. cluba is a memory layer: it turns conversations into a structured map of nodes and relationships, and it improves continuity across sessions.
              </div>
            </details>

            <details className="faqItem">
              <summary>How is this different from AI “memory” features?</summary>
              <div className="faqBody">
                cluba is transparent and permission-based. The AI proposes changes. You approve, edit, or reject them. Nothing is silently added.
              </div>
            </details>

            <details className="faqItem">
              <summary>Where is my data stored?</summary>
              <div className="faqBody">
                The default direction is local-first. Any future sync or cloud features should be opt-in and controllable per kingdom.
              </div>
            </details>

            <details className="faqItem">
              <summary>Can I delete or export everything?</summary>
              <div className="faqBody">
                Yes. The product is designed around visibility, editability, export, and purge controls.
              </div>
            </details>

            <details className="faqItem">
              <summary>When can I try it?</summary>
              <div className="faqBody">
                Join the beta list and tell us your use case. We’ll invite early users in small waves.
              </div>
            </details>
          </div>

          <div className="footerCta">
            <div className="footerCtaTitle">Join the beta</div>
            <div className="footerCtaText">If this resonates, leave your email. If it doesn’t, we want to hear that too.</div>
            <WaitlistForm compact />
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="container footerInner">
          <div className="footerLeft">
            <div className="brandSmall">
              <div className="logo" aria-hidden="true">
                c
              </div>
              <div>
                <div className="brandName">cluba</div>
                <div className="brandTag">Private AI memory you control</div>
              </div>
            </div>
            <div className="tiny">© {new Date().getFullYear()} cluba. All rights reserved.</div>
          </div>

          <div className="footerRight">
            <a className="footerLink" href="#how">
              How it works
            </a>
            <a className="footerLink" href="#trust">
              Trust
            </a>
            <a className="footerLink" href="#faq">
              FAQ
            </a>
            <a className="footerLink" href="#waitlist">
              Join
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}
