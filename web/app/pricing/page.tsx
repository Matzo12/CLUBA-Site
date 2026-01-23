export const dynamic = 'force-static'

export default function PricingPage() {
  return (
    <main style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1 style={{ fontSize: 40, letterSpacing: '-0.03em', margin: 0 }}>Pricing</h1>
      <p style={{ marginTop: 14, fontSize: 16, lineHeight: 1.6, opacity: 0.85 }}>
        We’re validating demand. Pricing will be announced with the beta.
      </p>

      <div style={{ marginTop: 28, display: 'grid', gap: 12 }}>
        <div style={{ padding: 16, border: '1px solid rgba(0,0,0,.12)', borderRadius: 14 }}>
          <div style={{ fontWeight: 700 }}>Free (local-first)</div>
          <ul style={{ marginTop: 10, lineHeight: 1.7 }}>
            <li>Private by default</li>
            <li>User-approved memory updates</li>
            <li>Delete anytime</li>
          </ul>
        </div>

        <div style={{ padding: 16, border: '1px solid rgba(0,0,0,.12)', borderRadius: 14 }}>
          <div style={{ fontWeight: 700 }}>Paid (opt-in sync & advanced)</div>
          <ul style={{ marginTop: 10, lineHeight: 1.7 }}>
            <li>Optional cloud features</li>
            <li>More advanced assistance</li>
            <li>Still transparent & user-controlled</li>
          </ul>
        </div>
      </div>

      <div style={{ marginTop: 28, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <a href="/#waitlist" style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(0,0,0,.14)', textDecoration: 'none' }}>
          Join the beta
        </a>
        <a href="/" style={{ padding: '10px 14px', borderRadius: 12, border: '1px solid rgba(0,0,0,.14)', textDecoration: 'none' }}>
          Back to home
        </a>
      </div>
    </main>
  )
}
