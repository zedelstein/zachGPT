"use client";

import { useState } from "react";
import { capabilities, roleById, rolesChronological } from "@/content/roles";
import { compactDates } from "@/lib/format";
import { coverageTone, ROLE_TONE, toneFor } from "@/lib/theme";
import { useFocus } from "../assistant/AssistantProvider";
import { FocusBanner } from "./FocusBanner";

/**
 * Capability × role matrix with a coverage scale.
 *
 * No invented per-skill year counts: a filled cell means the capability is
 * documented in that role. The row colour encodes coverage — how much of the
 * career a capability spans — so the through-lines (SQL, dashboards,
 * visualization, stakeholder reporting) run hot and the role-specific ones run
 * cool. Cells take their hue from the row, so a column reads as a role's
 * profile and a row reads as a capability's reach.
 */
export function CapabilityMatrix() {
  const { focus, setManualFocus } = useFocus();
  const [hover, setHover] = useState<{ cap: string; role: string } | null>(null);

  const roleCols = rolesChronological;
  const total = roleCols.length;
  const highlightedRoles = new Set(focus.roleIds);
  const highlightedCaps = new Set<string>(focus.capabilities);
  const hasHighlight = highlightedRoles.size > 0 || highlightedCaps.size > 0;

  return (
    <div>
      <FocusBanner scope="capabilities" />

      <div className="thin-scroll -mx-5 overflow-x-auto px-5 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[52rem] border-separate border-spacing-0 text-left">
          <caption className="sr-only">
            Analytics capabilities by role. A filled cell means the capability is documented in that
            role; colour intensity shows how much of the career the capability spans.
          </caption>
          <thead>
            <tr>
              <th scope="col" className="sticky left-0 z-10 bg-ground pb-2 pr-3 align-bottom">
                <span className="label text-faint">Capability</span>
              </th>
              {roleCols.map((role) => {
                const isOn = highlightedRoles.has(role.id);
                const tone = toneFor(ROLE_TONE[role.id]);
                return (
                  <th key={role.id} scope="col" className="pb-2 align-bottom">
                    <button
                      type="button"
                      onClick={() =>
                        setManualFocus(
                          { roleIds: [role.id], caseStudies: role.caseStudies },
                          role.companyNeedsReview ? role.title : role.company,
                        )
                      }
                      className={`mx-auto block w-full px-1 pb-1.5 text-center transition-opacity ${
                        hasHighlight && !isOn ? "opacity-35" : "opacity-100"
                      }`}
                      title={`${role.title} — ${role.companyNeedsReview ? "employer to confirm" : role.company} (${role.dates})`}
                    >
                      <span
                        className={`block text-[0.6875rem] font-semibold leading-tight ${
                          isOn ? "text-ink" : "text-ink-soft"
                        }`}
                      >
                        {role.shortName}
                      </span>
                      <span className="stat mt-0.5 block text-[0.625rem] leading-tight text-faint">
                        {compactDates(role.dates)}
                      </span>
                      <span
                        aria-hidden
                        className="mx-auto mt-1.5 block h-1 w-full rounded-full"
                        style={{ background: tone.solid, opacity: isOn || !hasHighlight ? 1 : 0.3 }}
                      />
                    </button>
                  </th>
                );
              })}
              <th scope="col" className="pb-2 pl-4 align-bottom">
                <span className="label text-faint">Coverage</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {capabilities.map((cap) => {
              const owning = roleCols.filter((r) => r.capabilities.includes(cap.id));
              const ratio = owning.length / total;
              const tone = coverageTone(ratio);
              const rowOn = highlightedCaps.has(cap.id);
              const rowDim = hasHighlight && highlightedCaps.size > 0 && !rowOn;

              return (
                <tr key={cap.id}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 border-t border-line bg-ground py-0 pr-3 font-normal transition-opacity ${
                      rowDim ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setManualFocus(
                          { capabilities: [cap.id], roleIds: owning.map((r) => r.id) },
                          cap.label,
                        )
                      }
                      title={cap.blurb}
                      className="flex w-full items-center gap-2 py-2.5 text-left text-[0.8125rem] leading-tight transition-colors hover:text-ink"
                    >
                      <span
                        aria-hidden
                        className="h-4 w-1 shrink-0 rounded-full"
                        style={{ background: tone.solid }}
                      />
                      <span className={rowOn ? "font-bold text-ink" : "font-medium text-ink-soft"}>
                        {cap.label}
                      </span>
                    </button>
                  </th>

                  {roleCols.map((role) => {
                    const filled = role.capabilities.includes(cap.id);
                    const colOn = highlightedRoles.has(role.id);
                    const cellOn = filled && (rowOn || colOn);
                    const cellDim = hasHighlight && !cellOn;
                    const isHovered = hover?.cap === cap.id && hover?.role === role.id;

                    return (
                      <td
                        key={role.id}
                        className="border-t border-line px-1 py-2 text-center align-middle"
                        onMouseEnter={() => filled && setHover({ cap: cap.id, role: role.id })}
                        onMouseLeave={() => setHover(null)}
                      >
                        {filled ? (
                          <span
                            title={`${cap.label} — ${role.title}, ${role.companyNeedsReview ? "earlier role" : role.company}`}
                            className={`mx-auto block h-5 w-full max-w-[2.25rem] rounded-[4px] transition-all duration-300 ${
                              cellOn || isHovered ? "scale-105 shadow-sm" : ""
                            } ${cellDim ? "opacity-20" : "opacity-100"}`}
                            style={{
                              background: tone.solid,
                              boxShadow: cellOn ? `0 0 0 2px var(--color-surface), 0 0 0 3.5px ${tone.solid}` : undefined,
                            }}
                          >
                            <span className="sr-only">
                              {cap.label} used in {role.title}
                            </span>
                          </span>
                        ) : (
                          <span
                            aria-hidden
                            className="mx-auto block h-5 w-full max-w-[2.25rem] rounded-[4px] border border-line bg-raised/70"
                          />
                        )}
                      </td>
                    );
                  })}

                  <td
                    className={`border-t border-line py-2 pl-4 transition-opacity ${
                      rowDim ? "opacity-40" : "opacity-100"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 shrink-0 overflow-hidden rounded-full bg-raised">
                        <div
                          className="grow h-full rounded-full"
                          style={{ width: `${ratio * 100}%`, background: tone.solid }}
                        />
                      </div>
                      <span className="stat shrink-0 text-[0.75rem] font-bold" style={{ color: tone.text }}>
                        {owning.length}/{total}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="label text-faint">Coverage</span>
          <span className="flex items-center gap-1">
            {[0.1, 0.3, 0.5, 0.7, 0.95].map((r) => (
              <span
                key={r}
                aria-hidden
                className="h-3.5 w-6 rounded-[3px]"
                style={{ background: coverageTone(r).solid }}
              />
            ))}
          </span>
          <span className="text-[0.75rem] text-muted">role-specific → every role</span>
        </div>
        <span className="flex items-center gap-2 text-[0.75rem] text-muted">
          <span aria-hidden className="h-3.5 w-6 rounded-[3px] border border-line bg-raised/70" />
          Not documented
        </span>
        <span className="text-[0.75rem] text-faint">
          Click any capability or role to highlight it across the portfolio.
        </span>
      </div>
      {focus.roleIds.length === 1 && roleById.get(focus.roleIds[0]) && (
        <p className="mt-2 text-[0.75rem] font-medium text-accent">
          Showing the column for {roleById.get(focus.roleIds[0])!.title}.
        </p>
      )}
    </div>
  );
}
