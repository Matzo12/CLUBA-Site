import { NextResponse } from 'next/server'

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const email = String(body?.email || '').trim()
    const useCase = String(body?.useCase || '').trim()

    if (!email || !isValidEmail(email)) {
      return NextResponse.json({ ok: false, error: 'Please enter a valid email.' }, { status: 400 })
    }

    const payload = {
      email,
      useCase,
      ts: new Date().toISOString(),
      ua: req.headers.get('user-agent') || ''
    }

    console.log('WAITLIST_SUBMIT', JSON.stringify(payload))

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid request.' }, { status: 400 })
  }
}
