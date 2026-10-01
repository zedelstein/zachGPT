"use client";

import type { EventName } from "./events";

/**
 * Client-side event tracking.
 *
 * The session id lives in sessionStorage, so it disappears when the tab closes
 * and cannot be used to recognise a returning visitor. Nothing identifying is
 * collected: no name, email, IP or user-agent string.
 */
const SID_KEY = "zgpt.sid";

function sessionId(): string {
  try {
    const existing = sessionStorage.getItem(SID_KEY);
    if (existing) return existing;
    const sid =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2);
    sessionStorage.setItem(SID_KEY, sid);
    return sid;
  } catch {
    // Private browsing with storage disabled — events are simply not grouped.
    return "nostore";
  }
}

function device(): "desktop" | "mobile" {
  return typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop";
}

export function track(name: EventName, label?: string): void {
  if (typeof window === "undefined") return;
  const payload = JSON.stringify({ name, sid: sessionId(), device: device(), label });
  try {
    // keepalive so the event survives the navigation that triggered it.
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    });
  } catch {
    // Tracking is never allowed to interrupt the page.
  }
}
