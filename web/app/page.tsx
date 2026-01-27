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
      // Optional: Backend kann z.B. { deduped: true } zurückgeben
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

    if (r.ok && !r.deduped) {
      setEmail('')
    }
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900">
      {/* Top gradient / subtle texture */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_10%,rgba(24,24,27,0.06),transparent_60%),radial-gradient(900px_500px_at_80%_20%,rgba(59,130,246,0.08),transparent_55%),radial-gradient(800px_600px_at_50%_90%,rgba(16,185,129,0.06),transparent_60%)]" />
      </div>

      <header className="mx-auto max-w-6xl px-6 pt-10 pb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-zinc-900 text-white grid place-items-center font-semibold">
              C
            </div>
            <div className="leading-tight">
              <div className="font-semibold tracking-tight">CLUBA</div>
              <div className="text-xs text-zinc-600">Spontane Reisepakete als Inspiration</div>
            </div>
          </div>
          <a
            href="#waitlist"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-4 py-2 text-sm font-medium shadow-sm hover:bg-white"
          >
            Newsletter holen
            <span aria-hidden>→</span>
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-12">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          {/* Left: Hero copy */}
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/70 px-3 py-1 text-xs text-zinc-700 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Kostenloser Newsletter • Flughafen-lokal • Kein Spam
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Dein nächstes Abenteuer —{' '}
              <span className="text-zinc-950">spontan, günstig, perfekt für deinen Flughafen.</span>
            </h1>

            <p className="mt-5 text-lg text-zinc-700 leading-relaxed">
              CLUBA findet günstige <span className="font-medium text-zinc-900">Hin- und Rückflüge</span> ab deinem
              nächstgelegenen Flughafen und baut daraus ein komplettes Kurztrip-Paket: Highlights, aktuellem Wetter,
              Kultur & Geschichte, Events im Zeitraum und Ideen für Erkundungen — alles kompakt in einem Newsletter.
            </p>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">1) Flug-Deal finden</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Wir suchen günstige Roundtrips ab deinem Flughafen.
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">2) Trip-Paket bauen</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Sehenswürdigkeiten, Wetter, Events, Kulinarik & Routen.
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">3) Nur relevant für dich</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Du bekommst nur Newsletter, die zu deinem Flughafen passen.
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">4) Kostenlos & schnell</div>
                <div className="mt-1 text-sm text-zinc-600">
                  Inspiration in Minuten — ideal für spontane Wochenenden.
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-3 text-sm text-zinc-600">
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Keine App nötig
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Jederzeit abmelden
              </div>
              <div className="inline-flex items-center gap-2">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-zinc-400" />
                Flughafen-basierte Inhalte
              </div>
            </div>
          </div>

          {/* Right: Waitlist card */}
          <div id="waitlist" className="lg:justify-self-end">
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(500px_240px_at_20%_0%,rgba(59,130,246,0.10),transparent_60%),radial-gradient(500px_260px_at_80%_20%,rgba(16,185,129,0.10),transparent_55%)]" />
              <div className="relative p-6 sm:p-8">
                <h2 className="text-2xl font-semibold tracking-tight">Newsletter-Waitlist</h2>
                <p className="mt-2 text-sm text-zinc-700 leading-relaxed">
                  Trag dich ein und erhalte spontane Reisepakete, die <span className="font-medium">zu deinem Flughafen</span>{' '}
                  passen.
                </p>

                <form onSubmit={onSubmit} className="mt-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-900">E-Mail</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="du@beispiel.de"
                      className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-zinc-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-zinc-900">Abflughafen</label>
                    <select
                      value={airport}
                      onChange={(e) => setAirport(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none ring-0 focus:border-zinc-400"
                    >
                      {AIRPORTS_DE.map((a) => (
                        <option key={a.code} value={a.code}>
                          {a.name}
                        </option>
                      ))}
                    </select>
                    <p className="mt-2 text-xs text-zinc-600 leading-relaxed">
                      Wir senden dir nur Newsletter, die sich auf deinen ausgewählten Flughafen beziehen.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={!canSubmit}
                    className="w-full rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? 'Wird eingetragen…' : 'Kostenlos eintragen'}
                  </button>

                  <p className="text-xs text-zinc-600 leading-relaxed">
                    Mit dem Eintragen erklärst du dich damit einverstanden, dass wir dir entsprechend Newsletter zuschicken.
                    Du kannst dich jederzeit abmelden.
                  </p>

                  {result?.ok ? (
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                      {result.deduped
                        ? 'Du bist bereits auf der Liste — danke!'
                        : 'Geschafft! Du bist auf der Waitlist. ✈️'}
                    </div>
                  ) : result ? (
                    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                      {result.error}
                    </div>
                  ) : null}
                </form>

                <div className="mt-6 grid gap-3 rounded-2xl border border-zinc-200 bg-white/70 p-4">
                  <div className="text-sm font-semibold">Was du bekommst</div>
                  <ul className="list-disc pl-5 text-sm text-zinc-700 space-y-1">
                    <li>Günstige Flug-Inspirationen (Hin & Rück)</li>
                    <li>Sehenswürdigkeiten & Must-Dos im Zeitraum</li>
                    <li>Aktuelles Wetter & beste Tagesplanung</li>
                    <li>Events, Kultur, Geschichte & lokale Tipps</li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-zinc-500">
              Hinweis: Inhalte sind Inspiration und können sich je nach Verfügbarkeit/Preis kurzfristig ändern.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-3xl border border-zinc-200 bg-white/70 p-6 sm:p-8 shadow-sm">
          <h3 className="text-xl font-semibold tracking-tight">So sieht ein CLUBA-Paket aus</h3>
          <p className="mt-2 text-sm text-zinc-700">
            Ein Deal + ein Plan. Statt endlos zu recherchieren, bekommst du eine klare Route mit Highlights, Timing und Kontext.
          </p>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold">Deal-Snapshot</div>
              <p className="mt-2 text-sm text-zinc-600">
                Zeitraum, Flugpreise, sinnvolle Abflugzeiten — schnell erfassbar.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold">3-Tage-Plan</div>
              <p className="mt-2 text-sm text-zinc-600">
                Sehenswürdigkeiten, Viertel, Spots, Ausblicke — mit logischer Reihenfolge.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="text-sm font-semibold">Kontext & Events</div>
              <p className="mt-2 text-sm text-zinc-600">
                Wetter, Kultur, Geschichte, aktuelle Events — damit du mehr erlebst.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-zinc-500">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} CLUBA</div>
          <div className="flex gap-4">
            <a className="hover:text-zinc-700" href="#waitlist">Newsletter</a>
            <span className="text-zinc-300">•</span>
            <span>Made for spontaneous trips</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
