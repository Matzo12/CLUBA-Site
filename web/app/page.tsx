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
    <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs text-[#334155] shadow-sm backdrop-blur">
      <span className="font-semibold text-[#0f172a]">{value}</span>
      <span className="text-[#475569]">{label}</span>
    </div>
  )
}

function FeatureCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="text-sm font-semibold text-[#0f172a]">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-[#475569]">{text}</div>
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
    <main className="min-h-screen bg-[#f7fbff] text-[#0f172a]">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1100px_520px_at_15%_10%,rgba(56,189,248,0.22),transparent_60%),radial-gradient(900px_520px_at_85%_15%,rgba(34,197,94,0.16),transparent_55%),radial-gradient(900px_600px_at_50%_95%,rgba(251,191,36,0.18),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.22] [background-image:linear-gradient(to_right,rgba(15,23,42,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(15,23,42,0.06)_1px,transparent_1px)] [background-size:80px_80px]" />
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

          <a
            href="#newsletter"
            className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-4 py-2 text-sm font-medium text-[#1e293b] shadow-sm backdrop-blur hover:bg-white"
          >
            Newsletter holen <span aria-hidden>→</span>
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pt-10 pb-14">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="flex flex-wrap gap-2">
              <Pill value="Kostenlos" label="Inspiration" />
              <Pill value="Aktuell" label="im Zeitraum" />
              <Pill value="Kompakt" label="statt Recherche" />
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              Ein Urlaubspaket, das dich sofort losziehen lässt.
            </h1>

            <p className="mt-4 text-lg leading-relaxed text-[#334155]">
              CLUBA stellt dir eine <span className="font-medium text-[#0f172a]">Region</span> so vor, dass du direkt weißt:
              Was lohnt sich anzuschauen, was ist wissenswert, welche Spots und Events passen zum Zeitraum — klar, hell,
              und angenehm zu lesen.
            </p>

            <div className="mt-7 grid gap-4 sm:grid-cols-2">
              <FeatureCard
                title="Must-Sees im Zeitraum"
                text="Die Highlights, die jetzt wirklich Sinn machen — kurz erklärt, ohne Overload."
              />
              <FeatureCard
                title="Wetter & Tagesplanung"
                text="Plan A / Plan B: Ideen, die zum Wetter passen — für entspannte oder aktive Tage."
              />
              <FeatureCard
                title="Kultur & Geschichte"
                text="Genug Kontext, um das Reiseziel zu verstehen — ohne Reiseführer-Wälzen."
              />
              <FeatureCard
                title="Events & kleine Tipps"
                text="Märkte, Festivals, Ausstellungen — plus praktische Hinweise für vor Ort."
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="#newsletter"
                className="inline-flex items-center justify-center rounded-2xl bg-[#0f172a] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1e293b]"
              >
                Kostenlos eintragen
              </a>
              <a
                href="#beispiel"
                className="inline-flex items-center justify-center rounded-2xl border border-white/60 bg-white/70 px-5 py-3 text-sm font-semibold text-[#1e293b] shadow-sm backdrop-blur hover:bg-white"
              >
                Beispiel ansehen
              </a>
            </div>

            <p className="mt-4 text-xs text-[#475569]">
              Du bekommst nur Newsletter, die zu deinem ausgewählten Flughafen passen. Abmelden jederzeit möglich.
            </p>
          </div>

          <div className="lg:justify-self-end">
            <div className="relative overflow-hidden rounded-[2rem] border border-white/70 bg-white/60 shadow-xl backdrop-blur">
              <div className="absolute inset-0 bg-[radial-gradient(520px_240px_at_20%_10%,rgba(56,189,248,0.20),transparent_60%),radial-gradient(520px_260px_at_80%_20%,rgba(34,197,94,0.14),transparent_55%),radial-gradient(520px_260px_at_50%_90%,rgba(251,191,36,0.18),transparent_60%)]" />
              <div className="relative p-5 sm:p-6">
                <div className="grid gap-4">
                  <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                    <img
                      src="/images/hero-destination.png"
                      alt="Inspiring destination for a spontaneous short trip"
                      className="h-52 w-full object-cover"
                      loading="lazy"
                    />
                    <div className="p-4">
                      <div className="text-xs font-semibold text-[#475569]">Inspiration des Tages</div>
                      <div className="mt-1 text-xl font-semibold tracking-tight text-[#0f172a]">
                        Sonne, Altstadt & entspannte Tage
                      </div>
                      <div className="mt-2 text-sm text-[#334155]">
                        Eine Region — mit allem, was sich im Zeitraum wirklich lohnt: Spots, Wissen, Events & Planung.
                      </div>
                      <div className="mt-4 grid grid-cols-3 gap-2">
                        <div className="rounded-2xl bg-[#f8fafc] p-3 text-center">
                          <div className="text-xs text-[#475569]">Wetter</div>
                          <div className="mt-1 text-sm font-semibold text-[#0f172a]">☀️ Variiert</div>
                        </div>
                        <div className="rounded-2xl bg-[#f8fafc] p-3 text-center">
                          <div className="text-xs text-[#475569]">Vibe</div>
                          <div className="mt-1 text-sm font-semibold text-[#0f172a]">🌿 Easy</div>
                        </div>
                        <div className="rounded-2xl bg-[#f8fafc] p-3 text-center">
                          <div className="text-xs text-[#475569]">Plan</div>
                          <div className="mt-1 text-sm font-semibold text-[#0f172a]">🗺️ Klar</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                      <img
                        src="/images/package-example.png"
                        alt="Cozy travel moment representing a curated package"
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="p-4">
                        <div className="text-sm font-semibold text-[#0f172a]">Ein Paket, kein Overload</div>
                        <div className="mt-1 text-sm text-[#475569]">Kompakte Inspiration statt 27 Tabs.</div>
                      </div>
                    </div>

                    <div className="overflow-hidden rounded-3xl border border-white/70 bg-white shadow-sm">
                      <img
                        src="/images/city-context.png"
                        alt="Cultural city context for deeper travel understanding"
                        className="h-40 w-full object-cover"
                        loading="lazy"
                      />
                      <div className="p-4">
                        <div className="text-sm font-semibold text-[#0f172a]">Spots & Kontext</div>
                        <div className="mt-1 text-sm text-[#475569]">Wissen, Kultur & Timing im Zeitraum.</div>
                      </div>
                    </div>
                  </div>

                  <div id="beispiel" className="rounded-3xl border border-white/70 bg-white/85 p-5 shadow-sm">
                    <div className="text-sm font-semibold text-[#0f172a]">So ist ein Paket aufgebaut</div>
                    <ul className="mt-2 space-y-1 text-sm text-[#334155]">
                      <li>• Kurzüberblick: Warum ist die Region jetzt spannend?</li>
                      <li>• Must-Sees: Was lohnt sich wirklich — und wann?</li>
                      <li>• Wetter: Plan A / Plan B für den Tag</li>
                      <li>• Wissenswertes: Kultur, Geschichte, lokale Eigenheiten</li>
                      <li>• Events: Was im Zeitraum stattfindet</li>
                    </ul>
                  </div>

                  <p className="text-xs text-[#475569]">
                    Hinweis: Inhalte sind Inspiration und können je nach Zeitraum variieren.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-xs text-[#475569]">
              Bilder werden lokal aus <span className="font-mono">/public/images</span> geladen.
            </p>
          </div>
        </div>
      </section>

      <section id="newsletter" className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-stretch">
          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
            <h2 className="text-2xl font-semibold tracking-tight">Newsletter-Waitlist</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#334155]">
              Trag dich ein und erhalte Urlaubspakete als Inspiration — jeweils mit einer Region und allem, was im Zeitraum
              wirklich lohnenswert ist.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#0f172a]">E-Mail</label>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="du@beispiel.de"
                  className="mt-1 w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm outline-none focus:border-[#cbd5e1]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#0f172a]">Abflughafen</label>
                <select
                  value={airport}
                  onChange={(e) => setAirport(e.target.value)}
                  className="mt-1 w-full rounded-2xl border border-white/80 bg-white px-4 py-3 text-sm outline-none focus:border-[#cbd5e1]"
                >
                  {AIRPORTS_DE.map((a) => (
                    <option key={a.code} value={a.code}>
                      {a.name}
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                  Du bekommst nur Newsletter, die zu deinem ausgewählten Flughafen passen.
                </p>
              </div>

              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full rounded-2xl bg-[#0f172a] px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1e293b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? 'Wird eingetragen…' : 'Kostenlos eintragen'}
              </button>

              <p className="text-xs leading-relaxed text-[#475569]">
                Mit dem Eintragen erklärst du dich damit einverstanden, dass wir dir entsprechend Newsletter zuschicken.
                Du kannst dich jederzeit abmelden.
              </p>

              {result?.ok ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
                  {result.deduped ? 'Du bist bereits auf der Liste — danke!' : 'Geschafft! Du bist auf der Waitlist. ✈️'}
                </div>
              ) : result ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                  {result.error}
                </div>
              ) : null}
            </form>
          </div>

          <div className="rounded-[2rem] border border-white/70 bg-white/70 p-6 shadow-sm backdrop-blur sm:p-8">
            <h3 className="text-xl font-semibold tracking-tight">Warum CLUBA?</h3>
            <p className="mt-2 text-sm leading-relaxed text-[#334155]">
              Weil du spontan sein willst, ohne dich durch endlose Empfehlungen zu wühlen. Ein Paket liefert dir
              Inspiration + Kontext, damit du schnell entscheiden kannst.
            </p>

            <div className="mt-6 grid gap-4">
              <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#0f172a]">Einfach lesen</div>
                <p className="mt-1 text-sm text-[#475569]">
                  Klar strukturiert: Überblick → Must-Sees → Planung → Wissenswertes → Events.
                </p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#0f172a]">Mehr erleben</div>
                <p className="mt-1 text-sm text-[#475569]">
                  Du siehst nicht nur “wohin”, sondern auch “was lohnt sich jetzt” — passend zum Zeitraum.
                </p>
              </div>
              <div className="rounded-3xl border border-white/70 bg-white p-5 shadow-sm">
                <div className="text-sm font-semibold text-[#0f172a]">Relevant für deinen Flughafen</div>
                <p className="mt-1 text-sm text-[#475569]">
                  Inhalte werden nach Abflughafen zugeschnitten — damit du weniger Irrelevantes bekommst.
                </p>
              </div>
            </div>

            <p className="mt-6 text-xs text-[#475569]">
              Kostenlose Inspirationen werden zusätzlich auf Social Media geteilt.
            </p>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-xs text-[#475569]">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} CLUBA</div>
          <div className="flex gap-4">
            <a className="hover:text-[#1e293b]" href="#newsletter">
              Newsletter
            </a>
            <span className="text-[#e2e8f0]">•</span>
            <span>Spontane Reiseinspirationen</span>
          </div>
        </div>
      </footer>
    </main>
  )
}
