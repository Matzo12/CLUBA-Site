"use client";

import { getClubaUserId } from "./clubaUser";

const API_BASE = "https://api.cluba.com";

type TopupPack = "small" | "medium" | "large";

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let data: any = null;
  try { data = JSON.parse(text); } catch { /* ignore */ }

  if (!res.ok) {
    const msg = data?.error || `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data as T;
}

export async function startStarterCheckout(): Promise<void> {
  const data = await postJson<{ ok: boolean; url: string }>("/checkout/starter", {});
  if (!data?.url) throw new Error("No checkout url returned");
  window.location.assign(data.url);
}

export async function startTopupCheckout(pack: TopupPack): Promise<void> {
  const user_id = getClubaUserId();
  const data = await postJson<{ ok: boolean; url: string }>("/checkout/topup", { pack, user_id });
  if (!data?.url) throw new Error("No checkout url returned");
  window.location.assign(data.url);
}
