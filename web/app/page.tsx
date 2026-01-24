'use client'

import { useState } from 'react'

type WaitlistResult =
  | { ok: true; deduped?: boolean }
  | { ok: false; error: string }

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [note, setNote] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()

    if (!trimmed || !isValidEmail(trimmed)) {
      setStatus('error')
      setMessage('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch('/api/waitlist/', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          email: trimmed,
          useCase: note.trim()
        })
      })

      const data = (await res.json()) as WaitlistResult

      if (!data.ok) {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
        return
      }

      setStatus('success')
      setMessage(data.deduped ? 'You’re already on the list.' : 'You’re on the list. Thank you.')
      setEmail('')
      setNote('')
    } catch {
      setStatus('error')
      setMessage('Network error. Please try again.')
    }
  }

  return (
    <main className="page">
      <div className="topGlow" aria-hidden="true" />
      <section className="hero">
        <div className="container">
          <div className="heroInner">
            <div className="pillRow">
              <span className="pill">Exploration</span>
              <span className="pill">User-controlled AI memory</span>
              <span className="pill">EU privacy-first</span>
            </div>

            <h1 className="h1">How should AI remember?</h1>

            <p className="lead">
              As AI systems become part of everyday life, an important question remains unclear:
              <span className="leadStrong"> who controls what AI remembers — and for how long?</span>
            </p>

            <div className="ctaGrid">
              <div className="ctaCard">
                <div className="ctaTitle">Follow the exploration</div>
                <div className="ctaSub">
                  Leave your email. Add an optional note about why this matters to you.
                  No commitments. No product promises.
                </div>

                <form className="form" onSubmit={onSubmit}>
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

                  <label className="label" htmlFor="note">Optional note</label>
                  <textarea
                    id="note"
                    className="textarea"
                    placeholder="e.g. AI memory feels implicit today; I want transparency and control."
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                  />

                  <div className="formRow">
                    <button className="button" type="submit" disabled={status === 'loading'}>
                      {status === 'loading' ? 'Submitting…' : 'Stay informed'}
                    </button>
                    <div className="hint">No spam. Only key updates.</div>
                  </div>

                  <div className="status" aria-live="polite">
                    {status === 'success' ? <span className="ok">{message}</span> : null}
                    {status === 'error' ? <span className="err">{message}</span> : null}
                  </div>
                </form>
              </div>

              <div className="sideCard">
                <div className="sideTitle">What we’re testing</div>
                <ul className="bullets">
                  <li>Does the problem resonate: implicit AI memory without clear control?</li>
                  <li>Would people want visibility into what is remembered and why?</li>
                  <li>Should forgetting be deliberate, respected, and reversible?</li>
                </ul>
                <div className="sideMeta">
                  If this question matters to you, your feedback helps define the direction.
                </div>
              </div>
            </div>

            <div className="divider" />
            <p className="smallIntro">
              Today, memory in AI systems is often implicit. Information can persist, change, or influence outcomes
              without being easy to see, verify, or undo. This project explores whether AI memory can be approached differently.
            </p>
          </div>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="h2">Memory is more than storage</h2>
          <p className="p">
            Understanding depends on context: when something happened, in which situation, and why it mattered.
            Without context, information becomes brittle or misleading.
          </p>
          <p className="p">
            This exploration treats memory as contextual and revisable, not as a growing archive of facts.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="h2">Control is essential</h2>
          <p className="p">
            People should always know what is remembered, why it is remembered, and how to remove it.
          </p>
          <p className="p">
            Nothing should be stored without awareness or consent. Forgetting should be deliberate and respected.
          </p>
        </div>
      </section>

      <section className="section alt">
        <div className="container">
          <h2 className="h2">Privacy by principle</h2>
          <p className="p">
            This work is guided by European data protection values: minimal data, clear purpose, intentional retention,
            and meaningful deletion.
          </p>
          <p className="p">
            Privacy is structural, not optional.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <h2 className="h2">An open question</h2>
          <p className="p">This is not a product promise. It is an exploration.</p>
          <p className="p">
            As AI systems mature, memory may become the most important interface between humans and machines.
            This page exists to ask whether that problem resonates with you.
          </p>
        </div>
      </section>

      <footer className="footer">
        <div className="container footerInner">
          <div className="footerText">ChatGPT can make mistakes. Check important information.</div>
        </div>
      </footer>

      <style jsx global>{`
        :root{
          --bg:#ffffff;
          --text:#111111;
          --muted:rgba(17,17,17,.68);
          --line:rgba(17,17,17,.10);
          --soft:rgba(17,17,17,.04);
          --alt:#fafafa;
          --shadow: 0 14px 40px rgba(0,0,0,.08);
          --radius:18px;
          --radius2:22px;
          --accent:#111111;
        }
        *{box-sizing:border-box;}
        html,body{height:100%;}
        body{
          margin:0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
          color:var(--text);
          background:var(--bg);
          letter-spacing:-0.01em;
        }
        .page{min-height:100vh; position:relative; overflow:hidden;}
        .topGlow{
          position:absolute;
          top:-220px;
          left:50%;
          transform:translateX(-50%);
          width:900px;
          height:500px;
          background: radial-gradient(circle at 50% 50%, rgba(0,0,0,.06), rgba(0,0,0,0) 60%);
          pointer-events:none;
          filter: blur(0px);
        }
        .container{width:min(980px, calc(100% - 40px)); margin:0 auto;}
        .hero{padding:84px 0 48px;}
        .heroInner{max-width:900px;}
        .pillRow{display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;}
        .pill{
          font-size:12px;
          color:rgba(17,17,17,.72);
          padding:8px 10px;
          border-radius:999px;
          border:1px solid var(--line);
          background:rgba(255,255,255,.85);
        }
        .h1{
          margin:0;
          font-size: clamp(34px, 4.1vw, 54px);
          line-height:1.05;
          letter-spacing:-0.04em;
          font-weight:650;
        }
        .lead{
          margin:14px 0 0;
          font-size:18px;
          line-height:1.6;
          color:var(--muted);
          max-width:72ch;
        }
        .leadStrong{color:rgba(17,17,17,.86); font-weight:560;}
        .ctaGrid{
          margin-top:26px;
          display:grid;
          grid-template-columns: 1.15fr .85fr;
          gap:14px;
          align-items:start;
        }
        @media (max-width: 980px){
          .ctaGrid{grid-template-columns:1fr;}
        }
        .ctaCard{
          border:1px solid var(--line);
          border-radius:var(--radius2);
          background:rgba(255,255,255,.92);
          box-shadow:var(--shadow);
          padding:18px;
        }
        .ctaTitle{font-weight:700; letter-spacing:-0.02em; font-size:16px;}
        .ctaSub{margin-top:6px; color:var(--muted); line-height:1.55; font-size:13.5px;}
        .form{margin-top:14px; display:grid; gap:10px;}
        .label{font-size:12.5px; color:rgba(17,17,17,.62);}
        .input{
          width:100%;
          padding:12px 12px;
          border-radius:14px;
          border:1px solid var(--line);
          background:#fff;
          outline:none;
          font-size:14.5px;
        }
        .textarea{
          width:100%;
          padding:12px 12px;
          border-radius:14px;
          border:1px solid var(--line);
          background:#fff;
          outline:none;
          font-size:14.5px;
          resize:vertical;
          min-height:88px;
        }
        .input:focus, .textarea:focus{
          border-color: rgba(17,17,17,.26);
          box-shadow: 0 0 0 4px rgba(17,17,17,.08);
        }
        .formRow{display:flex; align-items:center; gap:12px; flex-wrap:wrap; margin-top:2px;}
        .button{
          padding:11px 14px;
          border-radius:14px;
          border:1px solid rgba(17,17,17,.22);
          background: var(--accent);
          color:#fff;
          font-weight:700;
          cursor:pointer;
        }
        .button:disabled{opacity:.75; cursor:not-allowed;}
        .hint{font-size:12.5px; color:rgba(17,17,17,.55);}
        .status{min-height:18px; font-size:13px;}
        .ok{color:rgba(8,120,70,.95);}
        .err{color:rgba(190,65,65,.95);}
        .sideCard{
          border:1px solid var(--line);
          border-radius:var(--radius2);
          background:rgba(255,255,255,.78);
          padding:18px;
        }
        .sideTitle{font-weight:700; letter-spacing:-0.02em; font-size:15px;}
        .bullets{
          margin:10px 0 0;
          padding-left:18px;
          color:rgba(17,17,17,.72);
          line-height:1.6;
          font-size:13.5px;
        }
        .sideMeta{margin-top:12px; color:rgba(17,17,17,.55); font-size:12.5px; line-height:1.55;}
        .divider{
          margin:32px 0 18px;
          height:1px;
          background: var(--line);
        }
        .smallIntro{
          margin:0;
          color:rgba(17,17,17,.62);
          font-size:13.5px;
          line-height:1.65;
          max-width:86ch;
        }
        .section{padding:56px 0;}
        .alt{background:var(--alt); border-top:1px solid rgba(17,17,17,.06); border-bottom:1px solid rgba(17,17,17,.06);}
        .h2{margin:0; font-size:24px; letter-spacing:-0.02em; font-weight:650;}
        .p{margin:12px 0 0; color:rgba(17,17,17,.72); font-size:15.5px; line-height:1.75; max-width:78ch;}
        .footer{border-top:1px solid var(--line); padding:26px 0 38px;}
        .footerInner{display:flex; justify-content:center;}
        .footerText{font-size:12.5px; color:rgba(17,17,17,.55);}
      `}</style>
    </main>
  )
}
