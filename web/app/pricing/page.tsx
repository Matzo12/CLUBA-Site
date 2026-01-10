"use client";

import React, { useMemo, useState } from "react";
import { Button, Card, Container } from "@/components/ui";

type Pack = "small" | "medium" | "large";

const API_BASE =
  process.env.NEXT_PUBLIC_CLUBA_API_BASE || "http://127.0.0.1:8787";

async function postJson(path: string, body: unknown) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });

  const text = await res.text();
  let json: any = null;
  try {
    json = JSON.parse(text);
  } catch {
    throw new Error(`Non-JSON response (${res.status}): ${text.slice(0, 200)}`);
  }

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || `Request failed (${res.status})`);
  }
  return json;
}

export default function PricingPage() {
  const [userId, setUserId] = useState("demo_user_1");
  const [busy, setBusy] = useState<null | "starter" | Pack>(null);
  const [error, setError] = useState<string | null>(null);

  const safeUserId = useMemo(() => userId.trim(), [userId]);

  async function startCheckoutStarter() {
    setError(null);
    setBusy("starter");
    try {
      const json = await postJson("/checkout/starter", { user_id: safeUserId });
      if (json?.url) window.open(json.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  async function startCheckoutTopup(pack: Pack) {
    setError(null);
    setBusy(pack);
    try {
      const json = await postJson("/checkout/topup", { pack, user_id: safeUserId });
      if (json?.url) window.open(json.url, "_blank", "noopener,noreferrer");
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(null);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-zinc-50 text-zinc-950">
      <div className="py-14">
        <Container>
          <div className="flex flex-col gap-10">
            <header className="flex flex-col gap-4">
              <div className="inline-flex items-center gap-2 text-xs text-zinc-600">
                <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  EU privacy-first
                </span>
                <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  Secure payments by Stripe
                </span>
                <span className="rounded-full border border-black/10 bg-white/70 px-3 py-1">
                  VAT included (19%)
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight">
                Simple pricing. Transparent usage.
              </h1>
              <p className="max-w-2xl text-zinc-600">
                CLUBA gives you secure, cross-platform AI memory and point-based usage.
                Monthly points refresh. Purchased points never expire until used.
              </p>
            </header>

            <Card className="p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                  <div className="text-sm font-medium">User ID (for testing)</div>
                  <div className="text-xs text-zinc-600">
                    In production this comes from login. For now, this is what gets credited.
                  </div>
                </div>

                <input
                  className="w-full sm:w-[320px] rounded-xl border border-black/10 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black/10"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="e.g. demo_user_1"
                />
              </div>

              {error && (
                <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {error}
                </div>
              )}
            </Card>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
              <Card className="p-6 lg:col-span-2">
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-zinc-600">Subscription</div>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <div className="text-2xl font-semibold">CLUBA Starter</div>
                      <div className="text-zinc-600 text-sm">€7 / month (incl. 19% VAT)</div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-semibold">200</div>
                      <div className="text-xs text-zinc-600">monthly points</div>
                    </div>
                  </div>

                  <ul className="mt-3 space-y-2 text-sm text-zinc-700">
                    <li>• Points refresh monthly</li>
                    <li>• Cross-platform memory (ChatGPT, Gemini, Chrome, etc.)</li>
                    <li>• Transparent usage and balance tracking</li>
                    <li>• Cancel anytime</li>
                  </ul>

                  <div className="mt-4 flex gap-3">
                    <Button
                      onClick={startCheckoutStarter}
                      disabled={!safeUserId || busy !== null}
                      className="w-full"
                    >
                      {busy === "starter" ? "Opening Checkout…" : "Subscribe"}
                    </Button>
                    <Button href="/" variant="secondary" className="w-full">
                      Back
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-zinc-600">Memory Points</div>
                  <div className="text-xl font-semibold">Small Pack</div>
                  <div className="text-sm text-zinc-600">300 points (one-time)</div>
                  <div className="mt-3">
                    <Button
                      onClick={() => startCheckoutTopup("small")}
                      disabled={!safeUserId || busy !== null}
                      className="w-full"
                      variant="secondary"
                    >
                      {busy === "small" ? "Opening…" : "Buy Small Pack"}
                    </Button>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex flex-col gap-3">
                  <div className="text-sm text-zinc-600">Memory Points</div>
                  <div className="text-xl font-semibold">Medium / Large</div>
                  <div className="text-sm text-zinc-600">For heavy usage</div>

                  <div className="mt-3 flex flex-col gap-2">
                    <Button
                      onClick={() => startCheckoutTopup("medium")}
                      disabled={!safeUserId || busy !== null}
                      className="w-full"
                      variant="secondary"
                    >
                      {busy === "medium" ? "Opening…" : "Buy Medium Pack"}
                    </Button>

                    <Button
                      onClick={() => startCheckoutTopup("large")}
                      disabled={!safeUserId || busy !== null}
                      className="w-full"
                      variant="secondary"
                    >
                      {busy === "large" ? "Opening…" : "Buy Large Pack"}
                    </Button>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <div className="text-sm font-medium">Security</div>
                  <div className="text-sm text-zinc-600">
                    Payments are handled by Stripe. CLUBA never stores card details.
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Transparency</div>
                  <div className="text-sm text-zinc-600">
                    Monthly points reset. Purchased points persist until used.
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium">Compliance</div>
                  <div className="text-sm text-zinc-600">
                    Built for EU expectations: explicit consent, clear pricing, clear data handling.
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </Container>
      </div>
    </main>
  );
}
