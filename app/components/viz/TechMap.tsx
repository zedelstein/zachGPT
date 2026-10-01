"use client";

import { useEffect, useState } from "react";
import { caseStudyBySlug } from "@/content/case-studies";
import { roleById } from "@/content/roles";
import { disciplines, techGroups } from "@/content/skills";
import { track } from "@/lib/analytics/client";
import { GROUP_TONE, toneFor } from "@/lib/theme";
import { useFocus } from "../assistant/AssistantProvider";
import { FocusBanner } from "./FocusBanner";

const allItems = techGroups.flatMap((g) => g.items);

/**
 * Interactive technology map.
 *
 * Grouped rather than a logo wall, and every entry resolves to the roles and
 * case studies that evidence it. Entries with no role-level evidence are
 * labelled as such instead of being quietly mixed in with the rest — that
 * distinction is the whole reason this is a map and not a skills list.
 */
export function TechMap() {
  const { focus, setManualFocus } = useFocus();
  const [selected, setSelected] = useState<string | null>(null);

  const highlighted = new Set(focus.technologies);
  const hasHighlight = highlighted.size > 0;

  // Follow the assistant: if it cited exactly one technology, open it.
  useEffect(() => {
    if (focus.technologies.length === 1) {
      const match = allItems.find((i) => i.name === focus.technologies[0]);
      if (match) setSelected(match.name);
    }
  }, [focus.technologies]);

  const active = selected ? allItems.find((i) => i.name === selected) ?? null : null;

  const choose = (name: string) => {
    const item = allItems.find((i) => i.name === name);
    if (!item) return;
    setSelected((prev) => (prev === name ? null : name));
    track("technology_viewed", name);
    setManualFocus(
      { technologies: [item.name], roleIds: item.roleIds, caseStudies: item.caseStudies },
      item.name,
    );
  };

  return (
    <div>
      <FocusBanner scope="technologies" />

      <div className="grid gap-x-8 gap-y-7 lg:grid-cols-[1fr_20rem]">
        <div className="space-y-6">
          {techGroups.map((group) => {
            const gt = toneFor(GROUP_TONE[group.id]);
            return (
            <section key={group.id}>
              <header className="mb-2.5 border-l-[3px] pl-2.5" style={{ borderColor: gt.solid }}>
                <h3 className="label font-bold" style={{ color: gt.text }}>
                  {group.label}
                </h3>
                <p className="text-[0.75rem] text-muted">{group.blurb}</p>
              </header>
              <ul className="flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const isOn = highlighted.has(item.name);
                  const isSelected = selected === item.name;
                  const dim = hasHighlight && !isOn;
                  const listedOnly = item.tier === "listed";

                  return (
                    <li key={item.name}>
                      <button
                        type="button"
                        onClick={() => choose(item.name)}
                        aria-pressed={isSelected}
                        className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-left transition-all duration-200 hover:-translate-y-0.5 ${
                          listedOnly ? "border-dashed" : ""
                        } ${dim ? "opacity-35" : "opacity-100"}`}
                        style={
                          isOn || isSelected
                            ? { background: gt.solid, borderColor: gt.solid, color: "#fff" }
                            : listedOnly
                              ? {
                                  background: "var(--color-surface)",
                                  borderColor: "var(--color-line-strong)",
                                  color: "var(--color-muted)",
                                }
                              : { background: gt.soft, borderColor: gt.line, color: "var(--color-ink)" }
                        }
                      >
                        <span className="text-[0.8125rem] font-semibold">{item.name}</span>
                        <span
                          aria-hidden
                          className="stat rounded px-1 text-[0.625rem] font-bold"
                          style={
                            isOn || isSelected
                              ? { background: "rgba(255,255,255,0.22)", color: "#fff" }
                              : listedOnly
                                ? { color: "var(--color-faint)" }
                                : { color: gt.text }
                          }
                        >
                          {listedOnly ? "listed" : `${item.roleIds.length}\u00d7`}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
            );
          })}

          <section>
            <header className="mb-2.5">
              <h3 className="text-[0.8125rem] font-semibold text-ink">Analytics disciplines</h3>
              <p className="text-[0.75rem] text-muted">Practices rather than products.</p>
            </header>
            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {disciplines.map((d) => (
                <li key={d.name} className="border-t border-line pt-2">
                  <p className="text-[0.8125rem] font-medium text-ink">{d.name}</p>
                  <p className="text-[0.75rem] leading-snug text-muted">{d.blurb}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* ---- Detail rail ---- */}
        <aside className="lg:sticky lg:top-[calc(var(--nav-height)+1.5rem)] lg:self-start">
          {active ? (
            <div
              className="rise rounded-xl border border-line bg-surface p-4 shadow-sm shadow-ink/[0.04]"
              style={{
                borderTopWidth: 3,
                borderTopColor: toneFor(GROUP_TONE[techGroups.find((g) => g.items.some((i) => i.name === active.name))?.id ?? ""]).solid,
              }}
            >
              <header className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-base font-semibold text-ink">{active.name}</h3>
                  <p
                    className={`label mt-1 inline-flex items-center gap-1.5 rounded-full px-2 py-1 font-bold ${
                      active.tier === "documented"
                        ? "bg-data-soft text-data"
                        : "bg-flag-soft text-flag"
                    }`}
                  >
                    {active.tier === "documented" ? "Documented in roles" : "Listed in skills only"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="rounded-md p-1 text-muted hover:bg-raised hover:text-ink"
                >
                  <svg aria-hidden viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
                  </svg>
                </button>
              </header>

              {active.note && (
                <p className="mt-3 text-[0.8125rem] leading-relaxed text-ink-soft">{active.note}</p>
              )}

              {active.roleIds.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                    Used across
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {active.roleIds.map((id) => {
                      const role = roleById.get(id);
                      if (!role) return null;
                      return (
                        <li key={id} className="text-[0.8125rem] leading-snug">
                          <span className="font-medium text-ink">
                            {role.company}
                          </span>
                          <span className="text-muted"> — {role.title}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {active.caseStudies.length > 0 && (
                <div className="mt-4 border-t border-line pt-3">
                  <h4 className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                    Related work
                  </h4>
                  <ul className="mt-2 space-y-1.5">
                    {active.caseStudies.map((slug) => (
                      <li key={slug}>
                        <a
                          href={`/work/${slug}`}
                          className="text-[0.8125rem] font-medium text-accent hover:underline"
                        >
                          → {caseStudyBySlug.get(slug)?.title ?? slug}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-line bg-surface/60 p-4">
              <p className="text-[0.8125rem] leading-relaxed text-muted">
                Select a technology to see the roles and case studies that evidence it.
              </p>
              <p className="mt-3 flex items-center gap-2 text-[0.75rem] text-faint">
                <span aria-hidden className="h-3 w-5 rounded border border-dashed border-line-strong" />
                A dashed entry is in the skills inventory with no role-level evidence recorded.
              </p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
