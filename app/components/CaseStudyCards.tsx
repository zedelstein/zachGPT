"use client";

import Link from "next/link";
import { caseStudies } from "@/content/case-studies";
import { track } from "@/lib/analytics/client";
import { ROLE_TONE, toneFor } from "@/lib/theme";
import { useFocus } from "./assistant/AssistantProvider";

export function CaseStudyCards() {
  const { focus } = useFocus();
  const highlighted = new Set(focus.caseStudies);
  const hasHighlight = highlighted.size > 0;

  return (
    <ul className="grid gap-4 lg:grid-cols-2">
      {caseStudies.map((cs) => {
        const isOn = highlighted.has(cs.slug);
        const tone = toneFor(ROLE_TONE[cs.roleId]);
        return (
          <li key={cs.slug}>
            <Link
              href={`/work/${cs.slug}`}
              onClick={() => track("case_study_viewed", cs.slug)}
              className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-surface p-5 pt-6 transition-all duration-300 hover:-translate-y-0.5 ${
                isOn ? "shadow-lg shadow-ink/[0.08]" : "border-line hover:shadow-md hover:shadow-ink/[0.06]"
              } ${hasHighlight && !isOn ? "opacity-50" : "opacity-100"}`}
              style={isOn ? { borderColor: tone.solid } : undefined}
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1.5 transition-all duration-200 group-hover:h-2"
                style={{ background: tone.solid }}
              />
              <div className="flex items-center gap-2">
                <span
                  className="label rounded px-1.5 py-1 font-bold"
                  style={{ background: tone.soft, color: tone.text }}
                >
                  {cs.company}
                </span>
                <span className="stat text-[0.6875rem] text-faint">{cs.dates}</span>
              </div>

              <h3 className="mt-3 text-[1.0625rem] font-semibold leading-snug tracking-tight text-ink group-hover:text-accent">
                {cs.title}
              </h3>
              <p className="mt-2 flex-1 text-[0.875rem] leading-relaxed text-ink-soft">{cs.summary}</p>

              <ul className="mt-4 flex flex-wrap gap-1.5">
                {cs.skills.slice(0, 5).map((skill) => (
                  <li
                    key={skill}
                    className="rounded border border-line bg-ground px-1.5 py-0.5 text-[0.6875rem] text-muted"
                  >
                    {skill}
                  </li>
                ))}
                {cs.skills.length > 5 && (
                  <li className="px-1 py-0.5 text-[0.6875rem] text-faint tnum">
                    +{cs.skills.length - 5}
                  </li>
                )}
              </ul>

              <p className="mt-4 text-[0.8125rem] font-semibold" style={{ color: tone.text }}>
                Problem → Approach → Outcome
                <span aria-hidden className="ml-1 inline-block transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
