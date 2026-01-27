import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null)

    const email = body?.email
    const airport = body?.airport

    if (typeof email !== 'string' || typeof airport !== 'string' || !email || !airport) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
    }

    // ✅ Hier greift dein existierendes Waitlist-Setup (Cloudflare/Worker/etc.)
    // Wenn du aktuell schon speicherst/weiterleitest, füge es hier ein.
    // Diese Route antwortet bewusst minimal.
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
