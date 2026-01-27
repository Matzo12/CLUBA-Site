'use client'

import { useMemo, useState } from 'react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const AIRPORTS_DE = [
  'Berlin Brandenburg (BER)',
  'Frankfurt am Main (FRA)',
  'München (MUC)',
  'Hamburg (HAM)',
  'Düsseldorf (DUS)',
  'Köln/Bonn (CGN)',
  'Stuttgart (STR)',
  'Hannover (HAJ)',
  'Nürnberg (NUE)',
  'Leipzig/Halle (LEJ)',
  'Dresden (DRS)',
  'Bremen (BRE)',
  'Dortmund (DTM)',
  'Karlsruhe/Baden-Baden (FKB)',
  'Memmingen (FMM)',
  'Friedrichshafen (FDH)',
]

export default function Page() {
  const [email, setEmail] = useState('')
  const [airport, setAirport] = useState(AIRPORTS_DE[0])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const canSubmit = useMemo(
    () => isValidEmail(email) && !loading,
    [email, loading]
  )

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
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1000px_500px_at_20%_0%,rgba(186,230,253,0.35),transparent_60%),radial-gradient(800px_500px_at_80%_10%,rgba(203,213,225,0.25),transparent_55%)]" />

      <header className="mx-auto max-w-6xl px-6 pt-10 flex items-center justify-between">
        <div className="text-lg font-semibold tracking-tight">CLUBA</div>
        <a href="#newsletter" className="text-sm text-[#334155] hover:text-[#0f172a]">
          Newsletter
        </a>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-24 pb-28 grid gap-14 lg:grid-cols-2 items-start">
        <div>
          <h1 className="text-4xl sm:text-5xl font-semibold leading-tight">
            Spontane Kurztrips
            <br />
            ab deinem Flughafen
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-[#334155]">
            CLUBA erstellt kostenlose Urlaubspakete als Inspiration.
            Wir zeigen dir eine Region genau so, wie sie sich
            <span className="font-medium text-[#0f172a]"> jetzt </span>
            lohnt: Sehenswürdigkeiten, Wetter, Events und Wissen —
            kompakt, ruhig und ohne Recherche-Stress.
          </p>

          <ul className="mt-8 space-y-3 text-[#334155]">
            <li>• Nur Reiseideen ab deinem Flughafen</li>
            <li>• Günstig erreichbare Ziele</li>
            <li>• Must-Sees, Events & Planung im Zeitraum</li>
            <li>• Kostenlos & jederzeit abmeldbar</li>
          </ul>
        </div>

        <div className="rounded-[2rem] bg-white shadow-xl p-8">
          <h2 className="text-xl font-semibold">
            Kostenlose Inspiration bekommen
          </h2>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="E-Mail Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3"
            />

            <select
              value={airport}
              onChange={(e) => setAirport(e.target.value)}
              className="w-full rounded-xl border border-[#e2e8f0] px-4 py-3"
            >
              {AIRPORTS_DE.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <button
              disabled={!canSubmit}
              className="w-full rounded-xl bg-[#0f172a] py-3 font-semibold text-white hover:bg-[#1e293b] disabled:opacity-60"
            >
              {loading ? 'Wird eingetragen…' : 'Kostenlose Inspiration bekommen'}
            </button>

            <p className="text-xs text-[#64748b] leading-relaxed">
              Mit dem Eintragen erklärst du dich einverstanden, dass wir dir passende
              Newsletter zuschicken. Abmeldung jederzeit möglich.
            </p>

            {success && (
              <p className="text-sm text-emerald-600">
                Danke! Du bist dabei ✈️
              </p>
            )}
          </form>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <h3 className="text-2xl font-semibold mb-10">
          So funktioniert CLUBA
        </h3>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="font-medium">1. Region auswählen</div>
            <p className="mt-2 text-sm text-[#475569]">
              Wir finden günstig erreichbare Reiseziele ab deinem Flughafen.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="font-medium">2. Paket kuratieren</div>
            <p className="mt-2 text-sm text-[#475569]">
              Sehenswürdigkeiten, Wetter, Events & Wissen — passend zum Zeitraum.
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="font-medium">3. Inspirieren lassen</div>
            <p className="mt-2 text-sm text-[#475569]">
              Eine klare Übersicht statt endloser Recherche.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-32 grid gap-8 md:grid-cols-3">
        <div className="rounded-2xl bg-white shadow overflow-hidden">
          <img src="/images/package-example.png" className="h-40 w-full object-cover" />
          <div className="p-5">
            <div className="font-medium">Ein Paket</div>
            <p className="mt-1 text-sm text-[#475569]">
              Klar strukturiert & angenehm zu lesen.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow overflow-hidden">
          <img src="/images/city-context.png" className="h-40 w-full object-cover" />
          <div className="p-5">
            <div className="font-medium">Mit Kontext</div>
            <p className="mt-1 text-sm text-[#475569]">
              Kultur, Geschichte & lokale Besonderheiten.
            </p>
          </div>
        </div>

        <div className="rounded-2xl bg-white shadow overflow-hidden">
          <img src="/images/hero-destination.png" className="h-40 w-full object-cover" />
          <div className="p-5">
            <div className="font-medium">Zur richtigen Zeit</div>
            <p className="mt-1 text-sm text-[#475569]">
              Nur das, was sich im Zeitraum lohnt.
            </p>
          </div>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-4xl px-6 pb-40">
        <div className="rounded-[2rem] bg-white p-10 shadow-xl">
          <h2 className="text-2xl font-semibold">
            Kostenlose Inspiration bekommen
          </h2>
          <p className="mt-2 text-[#475569]">
            Spontane Reiseideen — passend zu deinem Flughafen.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="E-Mail Adresse"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            />

            <select
              value={airport}
              onChange={(e) => setAirport(e.target.value)}
              className="w-full rounded-xl border px-4 py-3"
            >
              {AIRPORTS_DE.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>

            <button
              disabled={!canSubmit}
              className="w-full rounded-xl bg-[#0f172a] py-3 font-semibold text-white hover:bg-[#1e293b]"
            >
              {loading ? 'Wird eingetragen…' : 'Kostenlose Inspiration bekommen'}
            </button>
          </form>
        </div>
      </section>

      <footer className="pb-12 text-center text-xs text-[#64748b]">
        © {new Date().getFullYear()} CLUBA · Impressum · Datenschutz
      </footer>
    </main>
  )
}
