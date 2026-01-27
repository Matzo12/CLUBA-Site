'use client'

import { useMemo, useState } from 'react'

type WaitlistResult =
  | { ok: true; deduped?: boolean }
  | { ok: false; error: string }

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const AIRPORTS_DE = [
  { code: 'BER', name: 'Berlin Brandenburg (BER)' },
  { code: 'FRA', name: 'Frankfurt am Main (FRA)' },
  { code: 'MUC', name: 'München (MUC)' },
  { code: 'HAM', name: 'Hamburg (HAM)' },
  { code: 'DUS', name: 'Düsseldorf (DUS)' },
  { code: 'CGN', name: 'Köln/Bonn (CGN)' },
  { code: 'STR', name: 'Stuttgart (STR)' },
  { code: 'HAJ', name: 'Hannover (HAJ)' },
  { code: 'NUE', name: 'Nürnberg (NUE)' },
  { code: 'LEJ', name: 'Leipzig/Halle (LEJ)' },
  { code: 'DRS', name: 'Dresden (DRS)' },
  { code: 'BRE', name: 'Bremen (BRE)' },
  { code: 'DTM', name: 'Dortmund (DTM)' },
  { code: 'FKB', name: 'Karlsruhe/Baden-Baden (FKB)' },
  { code: 'FMM', name: 'Memmingen (FMM)' },
  { code: 'FDH', name: 'Friedrichshafen (FDH)' },
].sort((a, b) => a.name.localeCompare(b.name, 'de'))

async function joinWaitlist(email: string, airport: string): Promise<WaitlistResult> {
  try {
    const res = await fetch('/api/waitlist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, airport }),
    })

    if (res.ok) {
      const data = await res.json().catch(() => ({}))
      return { ok: true, deduped: Boolean((data as any)?.deduped) }
    }

    const data = await res.json().catch(() => null)
    const message =
      (data && (data as any).error) ||
      `Das hat leider nicht geklappt (Status ${res.status}). Bitte versuche es erneut.`
    return { ok: false, error: message }
  } catch {
    return { ok: false, error: 'Netzwerkfehler. Bitte prüfe deine Verbindung und versuche es erneut.' }
  }
}

function Pill({ value, label }: { value: string; label: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur">
      <span className="font-semibold text-slate-900">{value}</span>
      <span className="text-slate-600">{label}</span>
    </div>
  )
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-slate-600">{text}</div>
    </div>
  )
}

export default function Page() {
  const [email, setEmail] = useState('')
  const [airport, setAirport] = useState<string>(AIRPORTS_DE[0]?.code ?? 'FRA')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<WaitlistResult | null>(null)

  const canSubmit = useMemo(() => {
    return isValidEmail(email.trim()) && Boolean(airport) && !loading
  }, [email, airport, loading])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setResult(null)

    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setResult({ ok: false, error: 'Bitte gib eine gültige E-Mail Adresse ein.' })
      return
    }

    setLoading(true)
    const r = await joinWaitlist(trimmed, airport)
    setResult(r)
    setLoading(false)

    if (r.ok && !r.deduped) setEmail('')
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] text-slate-900">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_15%_10%,rgba(56,189,248,0.22),transparent_60%),radial-gradient(900px_520px_at_85%_15%,rgba(34,197,94,0.16),transparent_55%),radial-gradient(900px_600px_at_50%_95%,rgba(251,191,36,0.18),transparent_60%)]" />
      </div>

      <section className="mx-auto max-w-6xl px-6 pt-24 pb-32">
        <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
          Spontane Reiseinspirationen
        </h1>
        <p className="mt-4 text-lg text-slate-700">
          Eine Region, ein Zeitraum, alles was sich jetzt lohnt.
        </p>
        <img
          src="/images/hero-destination.png"
          alt="Travel inspiration"
          className="mt-10 rounded-3xl shadow-xl"
        />
      </section>
    </main>
  )
}
