"use client";

import { useEffect, useRef } from "react";
import { track } from "@/lib/analytics/client";

/**
 * Records which sections a visitor actually reaches, once each per session.
 * No scroll-depth percentages, no timing beacons — just section reached.
 */
export function SectionTracker({ sections }: { sections: string[] }) {
  const seen = useRef(new Set<string>());

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          if (!entry.isIntersecting || seen.current.has(id)) continue;
          seen.current.add(id);
          track("section_viewed", id);
        }
      },
      { threshold: 0.3 },
    );

    for (const id of sections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [sections]);

  return null;
}
