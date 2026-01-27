"use client";

const KEY = "cluba_user_id";

export function getClubaUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  const existing = window.localStorage.getItem(KEY);
  if (existing && existing.length >= 6) return existing;

  const id = `cluba_${crypto.randomUUID()}`;
  window.localStorage.setItem(KEY, id);
  return id;
}
