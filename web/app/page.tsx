'use client'

import { useState } from 'react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const AIRPORTS = [
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
  const [airport, setAirport] = useState(AIRPORTS[0])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()

    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setStatus('error')
      return
    }

    setStatus('loading')

    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, airport }),
      })

      if (!res.ok) {
        setStatus('error')
        return
      }

      setStatus('success')
      setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <main className="min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(56,189,248,0.25),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(900px_600px_at_50%_90%,rgba(251,191,36,0.20),transparent_60%)]" />

      {/* Header */}
      <header className="mx-auto max-w-6xl px-6 pt-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-2xl bg-slate-900 text-white shadow-sm">
            <span className="text-sm font-semibold">CL</span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">CLUBA</div>
            <div className="text-xs text-slate-600">Spontane Reiseinspirationen</div>
          </div>
        </div>

        <a
          href="#newsletter"
          className="rounded-full bg-white/80 px-4 py-2 text-sm shadow hover:bg-white"
        >
          Newsletter
        </a>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-20 grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-slate-700 shadow-sm backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Kostenlos • Inspirierend • Kurz & klar
          </div>

          <h1 className="mt-6 text-4xl sm:text-5xl font-semibold leading-tight tracking-tight">
            Ein Urlaubspaket als Inspiration —
            <br />
            <span className="text-slate-700">eine Region, alles was sich jetzt lohnt.</span>
          </h1>

          <p className="mt-6 text-lg text-slate-700 leading-relaxed">
            CLUBA stellt dir regelmäßig eine <span className="font-medium text-slate-900">Region</span> so vor, dass du
            sofort entscheiden kannst: Was lohnt sich im Zeitraum anzuschauen, was ist wissenswert, welche Spots und
            Events solltest du nicht verpassen — kompakt, angenehm, ohne Recherche-Stress.
          </p>

          <ul className="mt-8 space-y-3 text-slate-700">
            <li className="flex gap-2"><span>✓</span><span>Must-Sees & Highlights im Zeitraum</span></li>
            <li className="flex gap-2"><span>✓</span><span>Wetter & passende Tagesplanung (Plan A / Plan B)</span></li>
            <li className="flex gap-2"><span>✓</span><span>Kultur, Geschichte & lokale Besonderheiten</span></li>
            <li className="flex gap-2"><span>✓</span><span>Events & Inspiration statt endloser Tabs</span></li>
          </ul>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <a
              href="#newsletter"
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
            >
              Kostenlos eintragen
            </a>
            <a
              href="#beispiel"
              className="rounded-2xl bg-white/80 px-5 py-3 text-sm font-semibold text-slate-800 shadow-sm backdrop-blur hover:bg-white"
            >
              Beispiel ansehen
            </a>
          </div>

          <p className="mt-4 text-xs text-slate-600">
            Du bekommst nur Newsletter, die zu deinem ausgewählten Flughafen passen. Abmelden jederzeit möglich.
          </p>
        </div>

        {/* Visual */}
        <div className="rounded-[2rem] bg-white/70 backdrop-blur shadow-xl overflow-hidden border border-white/70">
          <div className="grid gap-4 p-5 sm:p-6">
            <div className="rounded-3xl bg-white/85 p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-600">Inspiration des Tages</div>
              <div className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
                Sonne, Altstadt & Genuss
              </div>
              <p className="mt-2 text-sm text-slate-700 leading-relaxed">
                Eine Region — mit den besten Spots, Wissen & Ideen, die sich im Zeitraum wirklich lohnen.
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <div className="text-xs text-slate-600">Wetter</div>
                  <div className="mt-1 text-sm font-semibold">☀️ 22–27°</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <div className="text-xs text-slate-600">Vibe</div>
                  <div className="mt-1 text-sm font-semibold">🌿 Easy</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-3 text-center">
                  <div className="text-xs text-slate-600">Plan</div>
                  <div className="mt-1 text-sm font-semibold">🗺️ Klar</div>
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-white/70">
                <img
                  src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
                  alt="Strand und türkisfarbenes Meer"
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="text-sm font-semibold">Urlaubsgefühl</div>
                  <div className="mt-1 text-sm text-slate-600">Leicht, hell, sofort Lust auf los.</div>
                </div>
              </div>

              <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-white/70">
                <img
                  src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=1600&q=80"
                  alt="Stadt bei Sonnenuntergang"
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="text-sm font-semibold">Spots & Kontext</div>
                  <div className="mt-1 text-sm text-slate-600">Was sehen, was wissen, was erleben.</div>
                </div>
              </div>
            </div>

            <div id="beispiel" className="rounded-3xl bg-white/85 p-5 shadow-sm">
              <div className="text-sm font-semibold">So ist ein Paket aufgebaut</div>
              <ul className="mt-2 space-y-1 text-sm text-slate-700">
                <li>• Kurzüberblick: warum die Region jetzt spannend ist</li>
                <li>• Must-Sees: Highlights + wann es sich lohnt</li>
                <li>• Wetter: Plan A / Plan B, kompakt erklärt</li>
                <li>• Wissenswertes: Kultur, Geschichte, lokale Eigenheiten</li>
                <li>• Events: Märkte, Festivals, Ausstellungen im Zeitraum</li>
              </ul>
            </div>

            <p className="text-xs text-slate-600">
              Hinweis: Bilder sind stimmungsvolle Beispiele (Unsplash). Inhalte im Newsletter sind konkret für Zeitraum/Region.
            </p>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section id="newsletter" className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-[2rem] bg-white/80 backdrop-blur shadow-xl border border-white/70 p-7 sm:p-9">
          <h2 className="text-2xl font-semibold tracking-tight">
            Kostenlose Reise-Inspiration per Newsletter
          </h2>
          <p className="mt-2 text-slate-700">
            Du erhältst nur Newsletter, die zu deinem ausgewählten Flughafen passen.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900">E-Mail</label>
              <input
                type="email"
                placeholder="du@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900">Abflughafen</label>
              <select
                value={airport}
                onChange={(e) => setAirport(e.target.value)}
                className="mt-1 w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm outline-none focus:border-slate-300"
              >
                {AIRPORTS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
              <p className="mt-2 text-xs text-slate-600">
                Damit bekommst du nur passende Inspirationen für deinen Startpunkt.
              </p>
            </div>

            <button
              disabled={status === 'loading'}
              className="w-full rounded-2xl bg-slate-900 text-white py-3 text-sm font-semibold hover:bg-slate-800 disabled:opacity-60"
            >
              {status === 'loading' ? 'Wird eingetragen…' : 'Kostenlos eintragen'}
            </button>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mit dem Eintragen erklärst du dich einverstanden, dass wir dir entsprechend Newsletter zuschicken.
              Du kannst dich jederzeit abmelden.
            </p>

            {status === 'success' && (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                Danke! Du bist auf der Liste ✈️
              </div>
            )}

            {status === 'error' && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                Bitte überprüfe deine E-Mail und versuche es erneut.
              </div>
            )}
          </form>
        </div>
      </section>

      <footer className="pb-10 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} CLUBA — Spontane Reiseinspirationen
      </footer>
    </main>
  )
}
