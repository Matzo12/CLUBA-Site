import Stripe from "stripe";

export interface Env {
  STRIPE_SECRET_KEY: string;
  STRIPE_WEBHOOK_SECRET: string;
  STRIPE_PUBLISHABLE_KEY: string;

  STARTER_LOOKUP_KEY: string;
  TOPUP_SMALL_LOOKUP_KEY: string;
  TOPUP_MED_LOOKUP_KEY: string;
  TOPUP_LARGE_LOOKUP_KEY: string;

  DB: D1Database;
}

function json(data: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(data), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...(init?.headers || {}),
    },
  });
}

function redact(v?: string | null) {
  if (!v) return null;
  const s = String(v);
  if (s.length <= 12) return "***";
  return `${s.slice(0, 6)}…${s.slice(-4)}(len=${s.length})`;
}

function getStripe(env: Env) {
  return new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });
}

async function readRawBody(req: Request): Promise<string> {
  return await req.text();
}

async function getPriceIdByLookupKey(stripe: Stripe, lookupKey: string): Promise<string> {
  const prices = await stripe.prices.list({ lookup_keys: [lookupKey], active: true, limit: 1 });
  const p = prices.data[0];
  if (!p) throw new Error(`No active price for lookup key: ${lookupKey}`);
  return p.id;
}


function extractUserIdFromCheckoutSession(session: Stripe.Checkout.Session): string | null {
  // Preferred: Stripe-supported stable app user mapping
  const cr = (session.client_reference_id || "").trim();
  if (cr) return cr;

  // Fallback: metadata if present
  const mu = (session.metadata?.user_id as string | undefined) || "";
  const m = mu.trim();
  if (m) return m;

  return null;
}

function pointsForPack(env: Env, pack: "small" | "medium" | "large"): number {
  if (pack === "small") return 300;
  if (pack === "medium") return 1000;
  return 2500;
}

async function ensureUser(env: Env, stripeCustomerId: string) {
  // For now, user_id == stripe_customer_id. Later we’ll map to Clerk user id.
  await env.DB.prepare(
    `INSERT INTO users (user_id, stripe_customer_id) VALUES (?, ?)
     ON CONFLICT(user_id) DO UPDATE SET stripe_customer_id=excluded.stripe_customer_id`
  )
    .bind(stripeCustomerId, stripeCustomerId)
    .run();

  await env.DB.prepare(
    `INSERT INTO balances (user_id, monthly_points_remaining, purchased_points_remaining)
     VALUES (?, 0, 0)
     ON CONFLICT(user_id) DO NOTHING`
  )
    .bind(stripeCustomerId)
    .run();

  return stripeCustomerId;
}

async function getOrCreateStripeCustomerIdForUser(env: Env, stripe: Stripe, userId: string): Promise<string> {
  // users.user_id is our stable identity (today: caller-provided, later: Clerk user id)
  const row = await env.DB.prepare(`SELECT stripe_customer_id FROM users WHERE user_id=?`).bind(userId).first() as any;
  const existing = row?.stripe_customer_id as (string | undefined);

  if (existing && typeof existing === "string" && existing.startsWith("cus_")) return existing;

  const cust = await stripe.customers.create({ metadata: { user_id: userId } });

  await env.DB.prepare(
    `INSERT INTO users (user_id, stripe_customer_id) VALUES (?, ?)
     ON CONFLICT(user_id) DO UPDATE SET stripe_customer_id=excluded.stripe_customer_id`
  ).bind(userId, cust.id).run();

  await env.DB.prepare(
    `INSERT INTO balances (user_id, monthly_points_remaining, purchased_points_remaining)
     VALUES (?, 0, 0)
     ON CONFLICT(user_id) DO NOTHING`
  ).bind(userId).run();

  return cust.id;
}


async function ledgerExists(env: Env, id: string): Promise<boolean> {
  const row = await env.DB.prepare(`SELECT id FROM ledger WHERE id=?`).bind(id).first();
  return !!row;
}

async function addLedgerAndUpdatePurchased(env: Env, userId: string, id: string, points: number, note: string) {
  if (await ledgerExists(env, id)) return;

  await env.DB.prepare(`INSERT INTO ledger (id, user_id, kind, points_delta, note) VALUES (?, ?, 'topup', ?, ?)`)
    .bind(id, userId, points, note)
    .run();

  await env.DB.prepare(
    `UPDATE balances
     SET purchased_points_remaining = purchased_points_remaining + ?,
         updated_at = datetime('now')
     WHERE user_id = ?`
  )
    .bind(points, userId)
    .run();
}

async function addLedgerAndResetMonthly(env: Env, userId: string, id: string, monthlyPoints: number, note: string) {
  if (await ledgerExists(env, id)) return;

  await env.DB.prepare(`INSERT INTO ledger (id, user_id, kind, points_delta, note) VALUES (?, ?, 'monthly_reset', ?, ?)`)
    .bind(id, userId, monthlyPoints, note)
    .run();

  await env.DB.prepare(
    `UPDATE balances
     SET monthly_points_remaining = ?,
         updated_at = datetime('now')
     WHERE user_id = ?`
  )
    .bind(monthlyPoints, userId)
    .run();
}

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);

    if (req.method === "GET" && url.pathname === "/health") return json({ ok: true });

    // Confirms which secrets Wrangler actually loaded (redacted).
    if (req.method === "GET" && url.pathname === "/diag/env") {
      return json({
        ok: true,
        STRIPE_WEBHOOK_SECRET: redact(env.STRIPE_WEBHOOK_SECRET),
        STRIPE_SECRET_KEY: redact(env.STRIPE_SECRET_KEY),
        STRIPE_PUBLISHABLE_KEY: redact(env.STRIPE_PUBLISHABLE_KEY),
      });
    }
    if (req.method === "GET" && url.pathname === "/diag/prices") {
      try {
        const stripe = getStripe(env);
        const keys = {
          starter: env.STARTER_LOOKUP_KEY,
          topup_small: env.TOPUP_SMALL_LOOKUP_KEY,
          topup_medium: env.TOPUP_MED_LOOKUP_KEY,
          topup_large: env.TOPUP_LARGE_LOOKUP_KEY,
        } as const;

        const resolved: Record<string, string | null> = {};
        for (const [k, lookup] of Object.entries(keys)) {
          const prices = await stripe.prices.list({ lookup_keys: [lookup], active: true, limit: 1 });
          resolved[k] = prices.data[0]?.id ?? null;
        }

        return json({ ok: true, lookup_keys: keys, resolved_price_ids: resolved });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return json({ ok: false, error: msg }, { status: 500 });
      }
    }
    if (req.method === "GET" && url.pathname === "/diag/stripe-event") {
      try {
        const stripe = getStripe(env);
        const eventId = url.searchParams.get("id");
        if (!eventId) return json({ ok: false, error: "missing id" }, { status: 400 });

        const evt = await stripe.events.retrieve(eventId);

        // Return only the parts we need (avoid dumping huge payloads)
        const obj: any = (evt as any).data?.object;
        return json({
          ok: true,
          id: (evt as any).id,
          type: (evt as any).type,
          created: (evt as any).created,
          object_type: obj?.object ?? null,
          customer: obj?.customer ?? null,
          customer_details: obj?.customer_details ?? null,
          metadata: obj?.metadata ?? null,
          amount_total: obj?.amount_total ?? null,
          payment_intent: obj?.payment_intent ?? null,
          mode: obj?.mode ?? null
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return json({ ok: false, error: msg }, { status: 500 });
      }
    }
    if (req.method === "GET" && url.pathname === "/diag/stripe-account") {
      try {
        const stripe = getStripe(env);
        const acct = await stripe.accounts.retrieve();
        return json({ ok: true, stripe_account_id: (acct as any).id });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return json({ ok: false, error: msg }, { status: 500 });
      }
    }




    if (req.method === "GET" && url.pathname === "/diag/stripe-event") {
      try {
        const stripe = getStripe(env);
        const eventId = url.searchParams.get("id");
        if (!eventId) return json({ ok: false, error: "missing id" }, { status: 400 });

        const evt = await stripe.events.retrieve(eventId);

        // Return only the parts we need (avoid dumping huge payloads)
        const obj: any = (evt as any).data?.object;
        return json({
          ok: true,
          id: (evt as any).id,
          type: (evt as any).type,
          created: (evt as any).created,
          object_type: obj?.object ?? null,
          customer: obj?.customer ?? null,
          customer_details: obj?.customer_details ?? null,
          metadata: obj?.metadata ?? null,
          amount_total: obj?.amount_total ?? null,
          payment_intent: obj?.payment_intent ?? null,
          mode: obj?.mode ?? null
        });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        return json({ ok: false, error: msg }, { status: 500 });
      }
    }





    // Subscription checkout (Starter)
    if (req.method === "POST" && url.pathname === "/checkout/starter") {
      const stripe = getStripe(env);

      const origin = req.headers.get("origin") || "https://cluba.com";
      const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/pricing`;

      const starterPriceId = await getPriceIdByLookupKey(stripe, env.STARTER_LOOKUP_KEY);

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: starterPriceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        allow_promotion_codes: true,
      });

      return json({ ok: true, url: session.url });
    }

    // Top-up checkout
    if (req.method === "POST" && url.pathname === "/checkout/topup") {
      const stripe = getStripe(env);
      const body = (await req.json().catch(() => null)) as null | { pack?: string; user_id?: string };
      const pack = body?.pack;

      if (pack !== "small" && pack !== "medium" && pack !== "large") {
        return json({ ok: false, error: "pack must be: small | medium | large" }, { status: 400 });
      }

      const userId = body?.user_id;
      if (!userId || typeof userId !== "string" || userId.length < 3) {
        return json({ ok: false, error: "user_id is required" }, { status: 400 });
      }


      const lookupKey =
        pack === "small"
          ? env.TOPUP_SMALL_LOOKUP_KEY
          : pack === "medium"
          ? env.TOPUP_MED_LOOKUP_KEY
          : env.TOPUP_LARGE_LOOKUP_KEY;

      const origin = req.headers.get("origin") || "https://cluba.com";
      const successUrl = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/pricing`;

      const priceId = await getPriceIdByLookupKey(stripe, lookupKey);

      // Ensure Checkout Session has a customer so the webhook can map top-ups to a user
      const stripeCustomerId = await getOrCreateStripeCustomerIdForUser(env, stripe, userId);
      
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        customer: stripeCustomerId,
        client_reference_id: userId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: { pack: pack, user_id: userId },
      });

      return json({ ok: true, url: session.url });
    }

    // Stripe webhook
    
    // Stripe webhook
    if (req.method === "POST" && url.pathname === "/stripe/webhook") {
      const stripe = getStripe(env);

      const sig = req.headers.get("stripe-signature") || "";
      const raw = await readRawBody(req);

      let event: Stripe.Event;
      try {
        event = await stripe.webhooks.constructEventAsync(raw, sig, env.STRIPE_WEBHOOK_SECRET);
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("stripe webhook signature fail:", msg);
        return json({ ok: false, error: "Webhook signature verification failed" }, { status: 400 });
      }

      // Helper: stable user id must come from our own mapping, never from cus_...
      const stableUserIdFromSession = (session: Stripe.Checkout.Session): string | null => {
        const cr = (session.client_reference_id || "").trim();
        if (cr) return cr;
        const mu = ((session.metadata?.user_id as string | undefined) || "").trim();
        if (mu) return mu;
        return null;
      };

      try {
        // Monthly points credit (subscription renewals)
        if (event.type === "invoice.paid") {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = typeof invoice.customer === "string" ? invoice.customer : invoice.customer?.id;

          if (!customerId) {
            console.info("stripe webhook ignored: invoice.paid missing customer", { eventId: event.id });
            return json({ ok: true, ignored: true, reason: "invoice missing customer" });
          }

          // For production: map customerId -> user_id from our DB (created at checkout time)
          const row = await env.DB.prepare(
            "SELECT user_id FROM users WHERE stripe_customer_id = ? LIMIT 1"
          ).bind(customerId).first<{ user_id: string }>();

          const userId = row?.user_id;
          if (!userId) {
            console.info("stripe webhook ignored: invoice.paid no user mapping for customer", { eventId: event.id, customerId });
            return json({ ok: true, ignored: true, reason: "no user mapping" });
          }

          await env.DB.prepare(
            `INSERT INTO balances (user_id, monthly_points_remaining, purchased_points_remaining)
             VALUES (?, 0, 0)
             ON CONFLICT(user_id) DO NOTHING`
          ).bind(userId).run();

          await addLedgerAndResetMonthly(env, userId, `stripe:${event.id}`, 200, "Monthly points reset (invoice.paid)");
          console.info("stripe credit: monthly_reset", { userId, customerId, points: 200, eventId: event.id });
          return json({ ok: true });
        }

        // One-time topups credit (Checkout payment)
        if (event.type === "checkout.session.completed") {
          const session = event.data.object as Stripe.Checkout.Session;

          if (session.mode !== "payment") {
            return json({ ok: true, ignored: true, reason: "not a payment session" });
          }

          const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id;
          if (!customerId) {
            console.info("stripe webhook ignored: checkout.session.completed missing customer", { eventId: event.id });
            return json({ ok: true, ignored: true, reason: "session missing customer" });
          }

          const userId = stableUserIdFromSession(session);
          if (!userId) {
            console.info("stripe webhook ignored: missing stable user mapping", {
              eventId: event.id,
              sessionId: (session as any).id,
              customerId,
              client_reference_id: (session as any).client_reference_id ?? null,
              metadata: (session as any).metadata ?? null,
            });
            return json({ ok: true, ignored: true, reason: "missing stable user mapping" });
          }

          const pack = (session.metadata?.pack as "small" | "medium" | "large" | undefined) || undefined;
          if (!pack) {
            console.info("stripe webhook ignored: missing metadata.pack", { eventId: event.id, userId });
            return json({ ok: true, ignored: true, reason: "missing pack" });
          }

          // Persist mapping user_id -> stripe_customer_id for future invoice.paid
          await env.DB.prepare(
            `INSERT INTO users (user_id, stripe_customer_id) VALUES (?, ?)
             ON CONFLICT(user_id) DO UPDATE SET stripe_customer_id=excluded.stripe_customer_id`
          ).bind(userId, customerId).run();

          await env.DB.prepare(
            `INSERT INTO balances (user_id, monthly_points_remaining, purchased_points_remaining)
             VALUES (?, 0, 0)
             ON CONFLICT(user_id) DO NOTHING`
          ).bind(userId).run();

          const points = pointsForPack(env, pack);
          await addLedgerAndUpdatePurchased(env, userId, `stripe:${event.id}`, points, `Top-up pack ${pack}`);

          console.info("stripe credit: topup", { userId, customerId, pack, points, eventId: event.id });
          return json({ ok: true });
        }

        return json({ ok: true, ignored: true, event_type: event.type });
      } catch (e) {
        const msg = e instanceof Error ? e.message : String(e);
        console.error("stripe webhook handler error:", msg);
        return json({ ok: false, error: msg }, { status: 500 });
      }
    }
return json({ ok: false, error: "Not found" }, { status: 404 });
  },
};
