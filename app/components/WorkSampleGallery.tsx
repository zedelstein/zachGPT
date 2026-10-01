"use client";

import { useEffect, useState } from "react";
import { roleById } from "@/content/roles";
import { workSampleCategories, workSamples } from "@/content/work-samples";
import type { WorkSample } from "@/content/types";
import { track } from "@/lib/analytics/client";
import { CATEGORY_TONE, toneFor } from "@/lib/theme";
import { SampleThumb } from "./viz/SampleThumb";

const RECREATION_LABEL = "Portfolio recreation using sample data.";

function RecreatedBadge({ subtle = false }: { subtle?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border border-flag/25 bg-flag-soft px-1.5 py-0.5 text-[0.625rem] font-medium text-flag ${
        subtle ? "" : "shadow-sm shadow-ink/5"
      }`}
    >
      <svg aria-hidden viewBox="0 0 12 12" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="1.4">
        <circle cx="6" cy="6" r="4.6" />
        <path d="M6 3.6v2.6M6 8.2h.01" strokeLinecap="round" />
      </svg>
      Recreation
    </span>
  );
}

export function WorkSampleGallery() {
  const [category, setCategory] = useState<string>("All");
  const [active, setActive] = useState<WorkSample | null>(null);

  const visible =
    category === "All" ? workSamples : workSamples.filter((s) => s.category === category);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActive(null);
    };
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [active]);

  const open = (sample: WorkSample) => {
    setActive(sample);
    track("work_sample_viewed", sample.id);
  };

  return (
    <>
      <div className="thin-scroll -mx-5 mb-6 flex gap-1.5 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
        {["All", ...workSampleCategories].map((name) => {
          const t = name === "All" ? toneFor("slate") : toneFor(CATEGORY_TONE[name]);
          const on = category === name;
          return (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name)}
              aria-pressed={on}
              className="flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-[0.8125rem] font-semibold transition-all duration-200"
              style={
                on
                  ? {
                      background: name === "All" ? "var(--color-ink)" : t.solid,
                      borderColor: name === "All" ? "var(--color-ink)" : t.solid,
                      color: "#fff",
                    }
                  : { background: "var(--color-surface)", borderColor: "var(--color-line)", color: "var(--color-ink-soft)" }
              }
            >
              {name !== "All" && (
                <span
                  aria-hidden
                  className="h-2 w-2 rounded-[2px]"
                  style={{ background: on ? "rgba(255,255,255,0.8)" : t.solid }}
                />
              )}
              {name}
              {name !== "All" && (
                <span className="stat text-[0.6875rem] opacity-70">
                  {workSamples.filter((s) => s.category === name).length}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((sample) => {
          const tone = toneFor(CATEGORY_TONE[sample.category]);
          return (
          <li key={sample.id}>
            <button
              type="button"
              onClick={() => open(sample)}
              className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-line bg-surface text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink/[0.07]"
            >
              <div className="relative aspect-[16/9] border-b border-line p-3" style={{ background: tone.soft }}>
                <SampleThumb kind={sample.kind} accent={tone.solid} />
                <span className="absolute right-2 top-2">
                  <RecreatedBadge />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="label flex items-center gap-1.5 font-bold" style={{ color: tone.text }}>
                  <span aria-hidden className="h-2 w-2 rounded-[2px]" style={{ background: tone.solid }} />
                  {sample.category}
                </p>
                <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-ink">
                  {sample.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[0.8125rem] leading-relaxed text-muted">
                  {sample.summary}
                </p>
              </div>
            </button>
          </li>
          );
        })}
      </ul>

      <p className="mt-5 text-[0.8125rem] leading-relaxed text-muted">
        {RECREATION_LABEL} Every item here is rebuilt from scratch with sample data — no client
        dashboard, proprietary metric, patient information or confidential business figure is
        published on this site.
      </p>

      {/* ---- Detail dialog ---- */}
      {active && (
        <div className="panel-enter fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setActive(null)}
            className="absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={active.title}
            className="panel-sheet thin-scroll relative max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-line bg-surface shadow-2xl shadow-ink/20 sm:max-h-[86vh] sm:rounded-2xl"
          >
            <header className="sticky top-0 z-10 flex items-start justify-between gap-3 border-b border-line bg-surface/95 px-5 py-4 backdrop-blur">
              <div className="min-w-0">
                <p className="label font-bold" style={{ color: toneFor(CATEGORY_TONE[active.category]).text }}>
                  {active.category}
                </p>
                <h3 className="mt-0.5 text-lg font-semibold leading-snug tracking-tight text-ink">
                  {active.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActive(null)}
                aria-label="Close"
                className="shrink-0 rounded-md p-1.5 text-muted hover:bg-raised hover:text-ink"
              >
                <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
                </svg>
              </button>
            </header>

            <div className="px-5 py-5">
              <div className="rounded-xl border border-line bg-ground p-4">
                <div className="aspect-[16/7]">
                  <SampleThumb kind={active.kind} accent={toneFor(CATEGORY_TONE[active.category]).solid} />
                </div>
              </div>

              <p className="mt-3 flex items-center gap-2 text-[0.75rem] text-flag">
                <RecreatedBadge subtle />
                {RECREATION_LABEL}
              </p>

              <p className="mt-5 text-[0.9375rem] leading-relaxed text-ink">{active.summary}</p>
              <p className="mt-3 text-[0.875rem] leading-relaxed text-ink-soft">{active.detail}</p>

              {active.code && (
                <pre className="thin-scroll mt-5 overflow-x-auto rounded-xl border border-line bg-raised p-4 text-[0.75rem] leading-relaxed text-ink-soft">
                  <code className="font-mono">{active.code}</code>
                </pre>
              )}

              <div className="mt-6 grid gap-5 border-t border-line pt-5 sm:grid-cols-2">
                <div>
                  <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                    Drawn from
                  </h4>
                  <ul className="mt-2 space-y-1">
                    {active.roleIds.map((id) => {
                      const role = roleById.get(id);
                      if (!role) return null;
                      return (
                        <li key={id} className="text-[0.8125rem] text-ink-soft">
                          <span className="font-medium text-ink">
                            {role.company}
                          </span>{" "}
                          — {role.title}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                    Skills shown
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {active.skills.map((skill) => (
                      <li
                        key={skill}
                        className="rounded border border-line bg-ground px-1.5 py-0.5 text-[0.75rem] text-muted"
                      >
                        {skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
