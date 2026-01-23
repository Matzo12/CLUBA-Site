type Env = {
  WAITLIST_KV: KVNamespace
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  })
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  try {
    const body = await context.request.json()
    const email = String(body?.email || '').trim().toLowerCase()
    const useCase = String(body?.useCase || '').trim()

    if (!email || !isValidEmail(email)) {
      return json({ ok: false, error: 'Please enter a valid email.' }, 400)
    }

    const ts = new Date().toISOString()

    const emailKey = `email:${email}`
    const existing = await context.env.WAITLIST_KV.get(emailKey)
    if (existing) {
      return json({ ok: true, deduped: true }, 200)
    }

    const id = crypto.randomUUID()
    const record = {
      id,
      email,
      useCase,
      ts,
      ua: context.request.headers.get('user-agent') || ''
    }

    await context.env.WAITLIST_KV.put(emailKey, id)
    await context.env.WAITLIST_KV.put(`signup:${ts}:${id}`, JSON.stringify(record))

    console.log('WAITLIST_SUBMIT', JSON.stringify(record))

    return json({ ok: true }, 200)
  } catch {
    return json({ ok: false, error: 'Invalid request.' }, 400)
  }
}
