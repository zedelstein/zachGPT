"use client";

import { useEffect, useState } from "react";
import { capabilityById, rolesChronological } from "@/content/roles";
import type { Role } from "@/content/types";
import { track } from "@/lib/analytics/client";
import { compactDates } from "@/lib/format";
import { INDUSTRY_FAMILIES, ROLE_TONE, toneFor } from "@/lib/theme";
import { useFocus } from "../assistant/AssistantProvider";
import { FocusBanner } from "./FocusBanner";

/**
 * Interactive career timeline.
 *
 * Horizontal Gantt-style bars on desktop so progression and tenure are both
 * legible at a glance; a vertical rail on mobile. Roles the assistant has
 * cited are highlighted and the rest recede — the highlight set comes from
 * retrieved evidence metadata, so it cannot point at a role the portfolio
 * does not support.
 */
export function CareerTimeline({ now }: { now: number }) {
  const { focus, clearFocus } = useFocus();
  const [selected, setSelected] = useState<string | null>(null);

  const min = 2015;
  const max = Math.ceil(now);
  const span = max - min;

  const highlighted = new Set(focus.roleIds);
  const hasHighlight = highlighted.size > 0;

  // When the assistant highlights a single role, open its detail automatically.
  useEffect(() => {
    if (focus.roleIds.length === 1) setSelected(focus.roleIds[0]);
  }, [focus.roleIds]);

  const active = selected ? rolesChronological.find((r) => r.id === selected) ?? null : null;

  const ticks: number[] = [];
  for (let y = min; y <= max; y += 1) ticks.push(y);

  const pick = (role: Role) => {
    setSelected((prev) => (prev === role.id ? null : role.id));
    track("timeline_role_viewed", `${role.company} — ${role.title}`);
  };

  return (
    <div>
      <FocusBanner scope="roles" />

      {/* ---------- Desktop: horizontal ---------- */}
      <div className="hidden md:block">
        <div className="relative">
          {/* Year axis */}
          <div className="relative mb-2 ml-[13.5rem] h-5 border-b border-line">
            {ticks.map((year) => (
              <span
                key={year}
                className="absolute top-0 -translate-x-1/2 text-[0.6875rem] text-faint tnum"
                style={{ left: `${((year - min) / span) * 100}%` }}
              >
                {year}
              </span>
            ))}
          </div>

          <ol className="space-y-1.5">
            {rolesChronological.map((role) => {
              const left = ((role.start - min) / span) * 100;
              const width = (((role.end ?? now) - role.start) / span) * 100;
              const isHighlighted = highlighted.has(role.id);
              const isSelected = selected === role.id;
              const dimmed = hasHighlight && !isHighlighted;
              const tone = toneFor(ROLE_TONE[role.id]);

              return (
                <li key={role.id} className="group relative flex items-center gap-0">
                  <div
                    className={`w-[13.5rem] shrink-0 pr-3 text-right transition-opacity duration-300 ${
                      dimmed ? "opacity-35" : "opacity-100"
                    }`}
                  >
                    <p className="truncate text-[0.8125rem] font-semibold leading-tight text-ink">
                      {role.title}
                    </p>
                    <p className="flex items-center justify-end gap-1.5 truncate text-[0.6875rem] leading-tight text-muted">
                      <span aria-hidden className="h-2 w-2 shrink-0 rounded-[2px]" style={{ background: tone.solid }} />
                      {role.companyNeedsReview ? "Employer to confirm" : role.company}
                    </p>
                  </div>

                  <div className="relative h-12 flex-1">
                    {/* Row grid lines */}
                    <div aria-hidden className="absolute inset-0">
                      {ticks.map((year) => (
                        <span
                          key={year}
                          className="absolute inset-y-0 w-px bg-line/55"
                          style={{ left: `${((year - min) / span) * 100}%` }}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => pick(role)}
                      aria-pressed={isSelected}
                      className={`absolute top-1/2 flex h-8 -translate-y-1/2 items-center overflow-hidden rounded-[5px] border px-2.5 text-left transition-all duration-300 hover:brightness-105 ${
                        dimmed ? "opacity-25" : "opacity-100"
                      }`}
                      style={{
                        left: `${left}%`,
                        width: `max(5.5rem, ${width}%)`,
                        background: isHighlighted || isSelected ? tone.solid : tone.soft,
                        borderColor: isHighlighted || isSelected ? tone.solid : tone.line,
                        color: isHighlighted || isSelected ? "#fff" : tone.text,
                        boxShadow: isSelected ? `0 0 0 2px var(--color-ground), 0 0 0 4px ${tone.solid}` : undefined,
                      }}
                    >
                      <span className="stat truncate text-[0.6875rem] font-semibold">
                        {compactDates(role.dates)}
                        {role.datesNeedReview ? " ·" : ""}
                      </span>
                    </button>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* "Present" marker */}
          <div className="relative ml-[13.5rem] mt-1 h-4">
            <span
              className="label absolute -translate-x-1/2 font-bold"
              style={{ left: `${((now - min) / span) * 100}%`, color: "var(--color-hot)" }}
            >
              now
            </span>
          </div>
        </div>
      </div>

      {/* ---------- Mobile: vertical ---------- */}
      <ol className="space-y-0 md:hidden">
        {[...rolesChronological].reverse().map((role) => {
          const isHighlighted = highlighted.has(role.id);
          const dimmed = hasHighlight && !isHighlighted;
          const tone = toneFor(ROLE_TONE[role.id]);
          return (
            <li key={role.id} className="relative pl-6">
              <span
                aria-hidden
                className="absolute left-[0.3125rem] top-0 h-full w-px bg-line"
              />
              <span
                aria-hidden
                className="absolute left-0 top-[1.35rem] h-2.5 w-2.5 rounded-full border-2 transition-colors"
                style={{
                  borderColor: tone.solid,
                  background: isHighlighted ? tone.solid : "var(--color-surface)",
                }}
              />
              <button
                type="button"
                onClick={() => pick(role)}
                aria-pressed={selected === role.id}
                className={`w-full py-3.5 text-left transition-opacity duration-300 ${
                  dimmed ? "opacity-40" : "opacity-100"
                }`}
              >
                <p className="stat text-[0.6875rem] font-semibold" style={{ color: tone.text }}>
                  {compactDates(role.dates)}
                </p>
                <p className="mt-0.5 text-sm font-medium text-ink">{role.title}</p>
                <p className="text-[0.8125rem] text-ink-soft">
                  {role.companyNeedsReview ? "Employer to confirm" : role.company}
                </p>
              </button>
            </li>
          );
        })}
      </ol>

      {/* ---------- Industry legend ---------- */}
      <ul className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5">
        <li className="label text-faint">Industry</li>
        {INDUSTRY_FAMILIES.map((family) => (
          <li key={family.label} className="flex items-center gap-1.5 text-[0.75rem] text-muted">
            <span
              aria-hidden
              className="h-2.5 w-2.5 rounded-[2px]"
              style={{ background: toneFor(family.tone).solid }}
            />
            {family.label}
          </li>
        ))}
      </ul>

      {/* ---------- Detail ---------- */}
      <div className="mt-4">
        {active ? (
          <article
            className="rise overflow-hidden rounded-xl border border-line bg-surface shadow-sm shadow-ink/[0.04]"
            style={{ borderTopWidth: 3, borderTopColor: toneFor(ROLE_TONE[active.id]).solid }}
          >
            <div className="p-5">
            <header className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-ink">{active.title}</h3>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {active.companyNeedsReview ? "Employer to confirm" : active.company}
                  <span className="mx-1.5 text-faint">·</span>
                  <span className="tnum">{active.dates}</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold"
                  style={{
                    background: toneFor(ROLE_TONE[active.id]).soft,
                    color: toneFor(ROLE_TONE[active.id]).text,
                  }}
                >
                  {active.industry}
                </span>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close role detail"
                  className="rounded-md p-1 text-muted hover:bg-raised hover:text-ink"
                >
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </div>
            </header>

            <p className="mt-3 text-sm leading-relaxed text-ink-soft">{active.focus}</p>

            <div className="mt-4 grid gap-5 sm:grid-cols-[1.4fr_1fr]">
              <div>
                <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                  Responsibilities
                </h4>
                <ul className="mt-2 space-y-1.5">
                  {active.responsibilities.map((item) => (
                    <li key={item} className="flex gap-2 text-[0.8125rem] leading-snug text-ink-soft">
                      <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-faint" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                    Tools
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {active.tools.map((tool) => (
                      <li
                        key={tool}
                        className="rounded border border-line bg-raised px-1.5 py-0.5 text-[0.75rem] text-ink-soft"
                      >
                        {tool}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                    Capabilities used
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {active.capabilities.map((id) => (
                      <li
                        key={id}
                        className="rounded border border-data/20 bg-data-soft px-1.5 py-0.5 text-[0.75rem] text-data"
                      >
                        {capabilityById.get(id)?.label ?? id}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {active.caseStudies.length > 0 && (
              <footer className="mt-4 flex flex-wrap gap-2 border-t border-line pt-3.5">
                {active.caseStudies.map((slug) => (
                  <a
                    key={slug}
                    href={`/work/${slug}`}
                    className="text-[0.8125rem] font-medium text-accent hover:underline"
                  >
                    Read the case study →
                  </a>
                ))}
              </footer>
            )}
            </div>
          </article>
        ) : (
          <p className="rounded-xl border border-dashed border-line bg-surface/60 px-4 py-4 text-center text-[0.8125rem] text-muted">
            Select a role to see responsibilities, tools and capabilities.
            {hasHighlight && (
              <>
                {" "}
                <button type="button" onClick={clearFocus} className="font-medium text-accent hover:underline">
                  Clear the highlight
                </button>{" "}
                to see every role at full contrast.
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
