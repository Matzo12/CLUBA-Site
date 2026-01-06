import Link from "next/link";

function PriceCard({
  title,
  price,
  subtitle,
  bullets,
  highlight,
}: {
  title: string;
  price: string;
  subtitle: string;
  bullets: string[];
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? "card" : "cardSoft"}>
      <div style={{ fontWeight: 800 }}>{title}</div>
      <div className="priceBig">{price}</div>
      <div className="small">{subtitle}</div>
      <ul className="ul">
        {bullets.map((b) => (
          <li key={b}>{b}</li>
        ))}
      </ul>
      <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
        <button className={highlight ? "btn btnPrimary" : "btn"} type="button">
          Start free trial
        </button>
        <a className="btn" href="/privacy.html">
          Privacy details
        </a>
      </div>
      <div className="small" style={{ marginTop: 10 }}>
        Billing & cancellation handled via Stripe Customer Portal.
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <main className="section">
      <h1 className="hTitle" style={{ fontSize: "42px" }}>
        Simple pricing. No surprises.
      </h1>
      <p className="hLead">
        Start with a solid monthly allowance. Buy extra points only if you actually need them.
      </p>

      <div className="priceGrid">
        <PriceCard
          title="CLUBA Starter"
          price="€7 / month"
          subtitle="Includes 200 monthly memory points • 1-month free trial"
          bullets={[
            "200 monthly points (reset each billing cycle)",
            "Cross-platform memory consistency",
            "Explicit approval for memory updates",
            "Cancel anytime via Stripe",
          ]}
          highlight
        />

        <div className="cardSoft">
          <div style={{ fontWeight: 800 }}>Memory Point Packs</div>
          <p className="p" style={{ marginTop: 6 }}>
            Packs never expire. Monthly points are always used first.
          </p>

          <div style={{ marginTop: 12, display: "grid", gap: 10 }}>
            <div className="cardSoft" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Small Pack</strong>
                <strong>€4</strong>
              </div>
              <div className="small">200 points • never expires</div>
              <button className="btn" style={{ marginTop: 10 }} type="button">
                Buy Small
              </button>
            </div>

            <div className="cardSoft" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Medium Pack</strong>
                <strong>€12</strong>
              </div>
              <div className="small">800 points • never expires</div>
              <button className="btn" style={{ marginTop: 10 }} type="button">
                Buy Medium
              </button>
            </div>

            <div className="cardSoft" style={{ background: "rgba(255,255,255,0.03)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>Large Pack</strong>
                <strong>€20</strong>
              </div>
              <div className="small">2,000 points • never expires</div>
              <button className="btn" style={{ marginTop: 10 }} type="button">
                Buy Large
              </button>
            </div>
          </div>

          <div className="hr" />
          <div className="small">
            Points keep usage transparent — no token math, no surprise bills.
          </div>
        </div>
      </div>

      <div className="hr" />

      <section className="section">
        <h2 className="h2">FAQ</h2>
        <div className="grid3">
          <div className="cardSoft">
            <strong>Do you store data automatically?</strong>
            <p className="p">No. You explicitly approve every memory update.</p>
          </div>
          <div className="cardSoft">
            <strong>Do purchased points expire?</strong>
            <p className="p">Never. They stay until used.</p>
          </div>
          <div className="cardSoft">
            <strong>Can I cancel anytime?</strong>
            <p className="p">Yes — directly in Stripe’s customer portal.</p>
          </div>
        </div>

        <div style={{ marginTop: 14, display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Link className="btn" href="/">Back to home</Link>
          <a className="btn" href="/privacy.html">Privacy</a>
          <a className="btn" href="/imprint.html">Imprint</a>
        </div>
      </section>
    </main>
  );
}
