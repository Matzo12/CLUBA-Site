'use client'

import { useMemo, useState } from 'react'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

const AIRPORTS_DE = [
  'Berlin Brandenburg (BER)',
  'Bremen (BRE)',
  'Dortmund (DTM)',
  'Dresden (DRS)',
  'Düsseldorf (DUS)',
  'Erfurt-Weimar (ERF)',
  'Frankfurt am Main (FRA)',
  'Frankfurt-Hahn (HHN)',
  'Friedrichshafen (FDH)',
  'Hamburg (HAM)',
  'Hannover (HAJ)',
  'Karlsruhe/Baden-Baden (FKB)',
  'Köln/Bonn (CGN)',
  'Leipzig/Halle (LEJ)',
  'Memmingen (FMM)',
  'München (MUC)',
  'Münster/Osnabrück (FMO)',
  'Nürnberg (NUE)',
  'Paderborn/Lippstadt (PAD)',
  'Rostock-Laage (RLG)',
  'Saarbrücken (SCN)',
  'Stuttgart (STR)',
  'Sylt (GWT)',
  'Weeze / Niederrhein (NRN)',
].sort((a, b) => a.localeCompare(b, 'de'))

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/5 bg-white/70 px-3 py-1 text-xs text-[#334155] shadow-sm">
      {children}
    </span>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-black/5 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.08)] backdrop-blur">
      {children}
    </div>
  )
}

export default function Page() {
  const [email, setEmail] = useState('')
  const [airport, setAirport] = useState(AIRPORTS_DE[0])
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canSubmit = useMemo(() => isValidEmail(email.trim()) && !loading, [email, loading])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    const trimmed = email.trim()
    if (!isValidEmail(trimmed)) {
      setError('Bitte gib eine gültige E-Mail Adresse ein.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, airport }),
      })

      if (!res.ok) {
        setError('Das hat leider nicht geklappt. Bitte versuche es erneut.')
        setLoading(false)
        return
      }

      setSuccess(true)
      setEmail('')
    } catch {
      setError('Netzwerkfehler. Bitte prüfe deine Verbindung.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7fbff] text-[#0f172a]">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_18%_8%,rgba(186,230,253,0.45),transparent_60%),radial-gradient(900px_520px_at_82%_10%,rgba(254,243,199,0.55),transparent_55%),radial-gradient(900px_700px_at_50%_95%,rgba(199,210,254,0.35),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:88px_88px]" />
      </div>

      <header className="mx-auto max-w-6xl px-6 pt-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#0f172a] text-white shadow-sm">
              <span className="text-sm font-semibold">CL</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">CLUBA</div>
              <div className="text-xs text-[#475569]">Spontane Reiseinspirationen</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <a href="#how" className="hidden sm:inline text-[#334155] hover:text-[#0f172a]">
              So funktioniert’s
            </a>
            <a href="#newsletter" className="rounded-full bg-white/80 px-4 py-2 shadow-sm hover:bg-white">
              Kostenlos eintragen
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-14 pb-10">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="pt-2">
            <div className="flex flex-wrap gap-2">
              <Pill>Kostenlos</Pill>
              <Pill>Nur ab deinem Flughafen</Pill>
              <Pill>Günstig erreichbare Ziele</Pill>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl leading-[1.05]">
              Spontane Kurztrips
              <br />
              ab deinem Flughafen.
            </h1>

            <p className="mt-5 text-lg leading-relaxed text-[#334155]">
              CLUBA liefert dir ein kuratiertes Urlaubspaket: eine Region, ein Zeitraum, klar aufbereitet.
              Du siehst sofort, was sich lohnt, wie du planen kannst (Wetter/Timing) und was gerade stattfindet.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">Was lohnt sich?</div>
                <p className="mt-1 text-sm text-[#475569]">Must-Sees, Viertel, Aussichtspunkte — passend zum Zeitraum.</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">Wie plane ich’s?</div>
                <p className="mt-1 text-sm text-[#475569]">Wetter + Plan A/Plan B, damit du entspannt entscheiden kannst.</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">Was ist gerade los?</div>
                <p className="mt-1 text-sm text-[#475569]">Events, Märkte, Ausstellungen — nur das Relevante.</p>
              </div>
              <div className="rounded-2xl border border-black/5 bg-white/70 p-4 shadow-sm">
                <div className="text-sm font-semibold">Warum ist es günstig?</div>
                <p className="mt-1 text-sm text-[#475569]">Fokus auf Ziele, die aktuell gut erreichbar sind.</p>
              </div>
            </div>
          </div>

          <Card>
            <div className="p-7 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Kostenlose Inspiration bekommen</h2>
                  <p className="mt-2 text-sm text-[#475569]">
                    Du erhältst nur Newsletter, die zu deinem Abflughafen passen.
                  </p>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-[#64748b]">2–3×/Monat</span>
                  <span className="text-xs text-[#64748b]">jederzeit abmeldbar</span>
                </div>
              </div>

              <form onSubmit={submit} className="mt-6 space-y-4">
                <div className="grid gap-3 sm:grid-cols-[1fr_1fr]">
                  <div>
                    <label className="block text-xs font-medium text-[#0f172a]">E-Mail</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      placeholder="du@beispiel.de"
                      className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#0f172a]">Abflughafen</label>
                    <select
                      value={airport}
                      onChange={(e) => setAirport(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                    >
                      {AIRPORTS_DE.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Wird eingetragen…' : 'Kostenlose Inspiration bekommen'}
                </button>

                <p className="text-xs leading-relaxed text-[#64748b]">
                  Mit dem Eintragen erklärst du dich einverstanden, dass wir dir passende Newsletter zuschicken.
                  Abmeldung jederzeit möglich.
                </p>

                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    Danke! Du bist dabei ✈️
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </div>
                )}
              </form>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-black/5 bg-[#fbfdff] p-3">
                  <div className="text-xs text-[#64748b]">Fokus</div>
                  <div className="mt-1 text-sm font-semibold">Günstig erreichbar</div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-[#fbfdff] p-3">
                  <div className="text-xs text-[#64748b]">Inhalt</div>
                  <div className="mt-1 text-sm font-semibold">Paket statt Tabs</div>
                </div>
                <div className="rounded-2xl border border-black/5 bg-[#fbfdff] p-3">
                  <div className="text-xs text-[#64748b]">Stil</div>
                  <div className="mt-1 text-sm font-semibold">Ruhig & klar</div>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-black/5 bg-white/70 p-3 shadow-sm">
            <img
              src="/images/hero-destination.png"
              alt="Reiseziel Inspiration"
              className="h-32 w-full rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="px-1 pt-3 pb-1">
              <div className="text-sm font-semibold">Destination-Vibes</div>
              <div className="mt-1 text-xs text-[#64748b]">Klarer Überblick für schnelle Entscheidungen.</div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/70 p-3 shadow-sm">
            <img
              src="/images/package-example.png"
              alt="Paket Beispiel"
              className="h-32 w-full rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="px-1 pt-3 pb-1">
              <div className="text-sm font-semibold">Ein Paket</div>
              <div className="mt-1 text-xs text-[#64748b]">Must-Sees, Wetter, Events, Wissen — kompakt.</div>
            </div>
          </div>

          <div className="rounded-3xl border border-black/5 bg-white/70 p-3 shadow-sm">
            <img
              src="/images/city-context.png"
              alt="Kontext und Kultur"
              className="h-32 w-full rounded-2xl object-cover"
              loading="lazy"
            />
            <div className="px-1 pt-3 pb-1">
              <div className="text-sm font-semibold">Mit Kontext</div>
              <div className="mt-1 text-xs text-[#64748b]">Kultur & Geschichte verständlich erklärt.</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how" className="mx-auto max-w-6xl px-6 pb-14">
        <div className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-sm backdrop-blur sm:p-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">So funktioniert’s</h3>
              <p className="mt-2 text-sm text-[#475569]">
                Drei Schritte. Kein Overthinking. Nur Inspiration, die zu deinem Startpunkt passt.
              </p>
            </div>
            <a href="#newsletter" className="text-sm font-semibold text-[#0f172a] underline underline-offset-4">
              Jetzt kostenlos eintragen
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold text-[#64748b]">SCHRITT 1</div>
              <div className="mt-2 text-base font-semibold">Abflughafen wählen</div>
              <p className="mt-2 text-sm text-[#475569]">Damit du nur Ziele bekommst, die für dich realistisch sind.</p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold text-[#64748b]">SCHRITT 2</div>
              <div className="mt-2 text-base font-semibold">Region + Zeitraum</div>
              <p className="mt-2 text-sm text-[#475569]">Fokus auf günstige Erreichbarkeit und gute Timing-Ideen.</p>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold text-[#64748b]">SCHRITT 3</div>
              <div className="mt-2 text-base font-semibold">Paket lesen & los</div>
              <p className="mt-2 text-sm text-[#475569]">Must-Sees, Wetter, Events & Wissen — ohne Recherche.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="rounded-[2rem] border border-black/5 bg-white/70 p-7 shadow-sm backdrop-blur sm:p-10">
            <h3 className="text-2xl font-semibold tracking-tight">Beispiel: So sieht ein Paket aus</h3>
            <p className="mt-2 text-sm text-[#475569]">
              Du bekommst eine Region als klare Übersicht — mit allem, was im Zeitraum wirklich Sinn macht.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl bg-white p-5 shadow-sm border border-black/5">
                <div className="text-sm font-semibold">Kurzüberblick</div>
                <p className="mt-1 text-sm text-[#475569]">Warum die Region jetzt spannend ist und wie du die Tage aufteilst.</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm border border-black/5">
                <div className="text-sm font-semibold">Must-Sees & Viertel</div>
                <p className="mt-1 text-sm text-[#475569]">Die Highlights, die sich wirklich lohnen — plus beste Uhrzeiten.</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm border border-black/5">
                <div className="text-sm font-semibold">Wetter & Planung</div>
                <p className="mt-1 text-sm text-[#475569]">Plan A/Plan B, damit du flexibel bleibst — ohne Stress.</p>
              </div>

              <div className="rounded-3xl bg-white p-5 shadow-sm border border-black/5">
                <div className="text-sm font-semibold">Events & Wissenswertes</div>
                <p className="mt-1 text-sm text-[#475569]">Aktuelles im Zeitraum + Kultur/Geschichte kurz und verständlich.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-black/5 bg-[#0f172a] p-7 shadow-sm sm:p-10 text-white">
            <h3 className="text-2xl font-semibold tracking-tight">Warum das gut funktioniert</h3>
            <p className="mt-3 text-sm text-white/80 leading-relaxed">
              Spontanität scheitert oft an Recherche und Unsicherheit. CLUBA nimmt dir die Vorarbeit ab:
              eine Region, sauber kuratiert, mit dem richtigen Timing.
            </p>

            <div className="mt-6 space-y-3">
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-sm font-semibold">Relevant</div>
                <p className="mt-1 text-sm text-white/80">Nur ab deinem Flughafen — weniger irrelevantes Rauschen.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-sm font-semibold">Praktisch</div>
                <p className="mt-1 text-sm text-white/80">Wetter + Plan A/Plan B — schneller entscheiden.</p>
              </div>
              <div className="rounded-3xl bg-white/10 p-5">
                <div className="text-sm font-semibold">Kostenlos</div>
                <p className="mt-1 text-sm text-white/80">Newsletter & Social Content — jederzeit abmeldbar.</p>
              </div>
            </div>

            <a
              href="#newsletter"
              className="mt-8 inline-flex w-full items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-[#0f172a] hover:bg-white/90"
            >
              Kostenlose Inspiration bekommen
            </a>
          </div>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-6xl px-6 pb-24">
        <div className="rounded-[2rem] border border-black/5 bg-white/80 p-7 shadow-[0_18px_60px_rgba(15,23,42,0.10)] backdrop-blur sm:p-10">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">Kostenlose Inspiration bekommen</h3>
              <p className="mt-2 text-sm text-[#475569]">
                Spontane Kurztrips, kuratiert nach deinem Abflughafen — mit Must-Sees, Wetter & Events im Zeitraum.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Pill>nur passende Ziele</Pill>
                <Pill>günstig erreichbar</Pill>
                <Pill>jederzeit abmeldbar</Pill>
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-[#0f172a]">E-Mail</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    placeholder="du@beispiel.de"
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#0f172a]">Abflughafen</label>
                  <select
                    value={airport}
                    onChange={(e) => setAirport(e.target.value)}
                    className="mt-1 w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-black/20"
                  >
                    {AIRPORTS_DE.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Wird eingetragen…' : 'Kostenlose Inspiration bekommen'}
                </button>

                <p className="text-xs leading-relaxed text-[#64748b]">
                  Mit dem Eintragen erklärst du dich einverstanden, dass wir dir passende Newsletter zuschicken.
                  Abmeldung jederzeit möglich.
                </p>

                {success && (
                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                    Danke! Du bist dabei ✈️
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-12 text-xs text-[#64748b]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} CLUBA</div>
          <div className="flex gap-4">
            <span>Impressum</span>
            <span>Datenschutz</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
