'use client'

import { useMemo, useState } from 'react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const AIRPORTS = [
  'Berlin (BER)',
  'Frankfurt (FRA)',
  'München (MUC)',
  'Hamburg (HAM)',
  'Düsseldorf (DUS)',
  'Köln/Bonn (CGN)',
  'Stuttgart (STR)',
]

export default function Page() {
  const [email, setEmail] = useState('')
  const [airport, setAirport] = useState(AIRPORTS[0])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const canSubmit = useMemo(() => isValidEmail(email) && !loading, [email, loading])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) return

    setLoading(true)
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, airport }),
    })

    setLoading(false)
    if (res.ok) {
      setSuccess(true)
      setEmail('')
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#0f172a]">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(56,189,248,0.18),transparent_60%),radial-gradient(900px_600px_at_80%_20%,rgba(34,197,94,0.14),transparent_55%),radial-gradient(900px_600px_at_50%_90%,rgba(251,191,36,0.16),transparent_60%)]" />

      <header className="mx-auto max-w-7xl px-6 pt-10 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight">CLUBA</div>
        <a href="#newsletter" className="rounded-full bg-white/80 px-4 py-2 text-sm shadow hover:bg-white">
          Newsletter
        </a>
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-24 pb-32 grid gap-16 lg:grid-cols-2 items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Spontaneous trips,
            <br />
            beautifully curated.
          </h1>

          <p className="mt-6 text-lg text-[#334155] leading-relaxed">
            CLUBA creates inspiring travel packages — one region at a time.
            We show you what’s truly worth seeing, knowing, and experiencing
            during a specific period, so spontaneous trips feel effortless.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <div className="font-medium">What to see</div>
              <p className="mt-1 text-sm text-[#475569]">
                The highlights that actually matter right now.
              </p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <div className="font-medium">What to know</div>
              <p className="mt-1 text-sm text-[#475569]">
                Culture, history & context — short and human.
              </p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <div className="font-medium">How to plan</div>
              <p className="mt-1 text-sm text-[#475569]">
                Weather-aware ideas, Plan A & Plan B.
              </p>
            </div>
            <div className="rounded-3xl bg-white/80 p-5 shadow-sm">
              <div className="font-medium">What’s on</div>
              <p className="mt-1 text-sm text-[#475569]">
                Events and moments happening now.
              </p>
            </div>
          </div>

          <a
            href="#newsletter"
            className="inline-flex mt-10 rounded-2xl bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e293b]"
          >
            Get inspired by email
          </a>
        </div>

        <div className="relative">
          <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
            <img
              src="/images/hero-destination.png"
              alt="Travel inspiration"
              className="h-[520px] w-full object-cover"
            />
          </div>

          <div className="absolute -bottom-10 left-8 right-8 rounded-3xl bg-white/90 backdrop-blur p-6 shadow-xl">
            <div className="text-sm font-medium">This week’s inspiration</div>
            <div className="mt-1 text-lg font-semibold">
              Sun, old town & slow afternoons
            </div>
            <p className="mt-2 text-sm text-[#475569]">
              One region, perfectly timed — curated for an easy spontaneous escape.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32 grid gap-10 lg:grid-cols-3">
        <div className="rounded-3xl overflow-hidden bg-white shadow">
          <img src="/images/package-example.png" className="h-56 w-full object-cover" />
          <div className="p-6">
            <div className="font-medium">One clear package</div>
            <p className="mt-2 text-sm text-[#475569]">
              No overload. Just the essentials that make a place feel alive.
            </p>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden bg-white shadow">
          <img src="/images/city-context.png" className="h-56 w-full object-cover" />
          <div className="p-6">
            <div className="font-medium">Context & culture</div>
            <p className="mt-2 text-sm text-[#475569]">
              Understand where you are — not just where you go.
            </p>
          </div>
        </div>

        <div className="rounded-3xl bg-[#0f172a] text-white p-8 flex flex-col justify-between">
          <div>
            <div className="text-lg font-semibold">Why CLUBA?</div>
            <p className="mt-3 text-sm text-white/80">
              Because inspiration should feel calm, beautiful, and relevant —
              not overwhelming.
            </p>
          </div>
          <p className="text-sm text-white/60">
            Free newsletter · unsubscribe anytime
          </p>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-4xl px-6 pb-40">
        <div className="rounded-[2.5rem] bg-white p-10 shadow-xl">
          <h2 className="text-2xl font-semibold">
            Receive spontaneous travel inspiration
          </h2>
          <p className="mt-2 text-[#475569]">
            Only destinations relevant to your nearby airport.
          </p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />

            <select
              value={airport}
              onChange={(e) => setAirport(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              {AIRPORTS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <button
              disabled={!canSubmit}
              className="w-full rounded-xl bg-[#0f172a] py-3 font-semibold text-white hover:bg-[#1e293b] disabled:opacity-60"
            >
              {loading ? 'Signing up…' : 'Join newsletter'}
            </button>

            {success && (
              <div className="text-sm text-emerald-600">
                You’re on the list ✈️
              </div>
            )}
          </form>
        </div>
      </section>

      <footer className="pb-12 text-center text-xs text-[#64748b]">
        © {new Date().getFullYear()} CLUBA — spontaneous travel inspiration
      </footer>
    </main>
  )
}
