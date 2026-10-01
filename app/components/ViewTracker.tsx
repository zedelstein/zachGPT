"use client";

import { useEffect } from "react";
import type { EventName } from "@/lib/analytics/events";
import { track } from "@/lib/analytics/client";

/** Fires a single event when a server-rendered page mounts. */
export function ViewTracker({ event, label }: { event: EventName; label?: string }) {
  useEffect(() => {
    track(event, label);
  }, [event, label]);
  return null;
}
