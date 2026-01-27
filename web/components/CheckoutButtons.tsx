"use client";

import React from "react";
import { startStarterCheckout, startTopupCheckout } from "../lib/checkout";

function Button({
  children,
  onClick,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2";
  const styles =
    variant === "primary"
      ? "bg-black text-white hover:opacity-90 focus:ring-black"
      : "bg-white text-black border border-black/15 hover:bg-black/5 focus:ring-black";
  return (
    <button className={`${base} ${styles}`} onClick={onClick}>
      {children}
    </button>
  );
}

export function StarterCheckoutButton() {
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={async () => {
          setErr(null);
          setLoading(true);
          try {
            await startStarterCheckout();
          } catch (e: any) {
            setErr(e?.message || "Checkout failed");
            setLoading(false);
          }
        }}
      >
        {loading ? "Redirecting…" : "Start Starter"}
      </Button>
      {err ? <div className="text-xs text-red-600">{err}</div> : null}
    </div>
  );
}

export function TopupButtons() {
  const [loadingPack, setLoadingPack] = React.useState<string | null>(null);
  const [err, setErr] = React.useState<string | null>(null);

  async function go(pack: "small" | "medium" | "large") {
    setErr(null);
    setLoadingPack(pack);
    try {
      await startTopupCheckout(pack);
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
      setLoadingPack(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Button variant="secondary" onClick={() => go("small")}>
          {loadingPack === "small" ? "Redirecting…" : "Top-up Small"}
        </Button>
        <Button variant="secondary" onClick={() => go("medium")}>
          {loadingPack === "medium" ? "Redirecting…" : "Top-up Medium"}
        </Button>
        <Button variant="secondary" onClick={() => go("large")}>
          {loadingPack === "large" ? "Redirecting…" : "Top-up Large"}
        </Button>
      </div>
      {err ? <div className="text-xs text-red-600">{err}</div> : null}
    </div>
  );
}
