import Link from "next/link";

export default function HomePage() {
  return (
    <main style={{ background: "#fff", color: "#111" }}>
      <section style={{ maxWidth: 760, margin: "0 auto", padding: "96px 20px 72px" }}>
        <h1 style={{
          fontSize: 42,
          fontWeight: 600,
          letterSpacing: "-0.03em",
          lineHeight: 1.15,
          marginBottom: 24
        }}>
          How should AI remember?
        </h1>

        <p style={{
          fontSize: 18,
          lineHeight: 1.6,
          color: "#444",
          marginBottom: 40
        }}>
          As AI systems become part of everyday life, an important question remains unclear:
          who controls what AI remembers — and for how long?
        </p>

        <div style={{ display: "grid", gap: 32 }}>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333" }}>
            Today, memory in AI systems is often implicit.
            Information can persist, change, or influence outcomes without being easy to see,
            verify, or undo.
          </p>

          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333" }}>
            This project explores whether AI memory can be approached differently.
          </p>
        </div>
      </section>

      <section style={{ background: "#fafafa" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 20px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>
            Memory is more than storage
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333" }}>
            Understanding depends on context:
            when something happened,
            in which situation,
            and why it mattered.
            Without context, information becomes brittle or misleading.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 16 }}>
            This exploration treats memory as contextual and revisable,
            not as a growing archive of facts.
          </p>
        </div>
      </section>

      <section>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 20px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>
            Control is essential
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333" }}>
            People should always know what is remembered,
            why it is remembered,
            and how to remove it.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 16 }}>
            Nothing should be stored without awareness or consent.
            Forgetting should be deliberate and respected.
          </p>
        </div>
      </section>

      <section style={{ background: "#fafafa" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 20px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>
            Privacy by principle
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333" }}>
            This work is guided by European data protection values:
            minimal data,
            clear purpose,
            intentional retention,
            and meaningful deletion.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 16 }}>
            Privacy is structural, not optional.
          </p>
        </div>
      </section>

      <section>
        <div style={{ maxWidth: 760, margin: "0 auto", padding: "72px 20px" }}>
          <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 20 }}>
            An open question
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333" }}>
            This is not a product promise.
            It is an exploration.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 16 }}>
            As AI systems mature, memory may become the most important interface
            between humans and machines.
          </p>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: "#333", marginTop: 16 }}>
            This page exists to ask whether that problem resonates with you.
          </p>
        </div>
      </section>

      <section style={{ borderTop: "1px solid #eee" }}>
        <div id="waitlist" style={{ maxWidth: 760, margin: "0 auto", padding: "72px 20px" }}>
          <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>
            If this question matters to you
          </h2>
          <p style={{ fontSize: 15, color: "#555", marginBottom: 24 }}>
            You can leave your email to follow this exploration.
            No commitments. No promises.
          </p>

          <form method="post" action="/api/waitlist">
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              style={{
                width: "100%",
                maxWidth: 360,
                padding: "12px 14px",
                fontSize: 15,
                borderRadius: 8,
                border: "1px solid #ccc",
                marginBottom: 12
              }}
            />
            <br />
            <button
              type="submit"
              style={{
                padding: "10px 16px",
                fontSize: 15,
                borderRadius: 8,
                border: "1px solid #111",
                background: "#111",
                color: "#fff",
                cursor: "pointer"
              }}
            >
              Stay informed
            </button>
          </form>
        </div>
      </section>

      <footer style={{ padding: "40px 20px", textAlign: "center", fontSize: 12, color: "#777" }}>
        ChatGPT can make mistakes. Check important information.
      </footer>
    </main>
  );
}
