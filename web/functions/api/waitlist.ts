export async function onRequestPost(context: { request: Request; env: any }) {
  try {
    const body = await context.request.json()
    const email = String(body?.email || '').trim()
    const useCase = String(body?.useCase || '').trim()

    const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
    if (!email || !isValidEmail(email)) {
      return new Response(JSON.stringify({ ok: false, error: 'Please enter a valid email.' }), {
        status: 400,
        headers: { 'content-type': 'application/json' }
      })
    }

    const payload = {
      email,
      useCase,
      ts: new Date().toISOString(),
      ua: context.request.headers.get('user-agent') || ''
    }

    console.log('WAITLIST_SUBMIT', JSON.stringify(payload))

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' }
    })
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid request.' }), {
      status: 400,
      headers: { 'content-type': 'application/json' }
    })
  }
}
