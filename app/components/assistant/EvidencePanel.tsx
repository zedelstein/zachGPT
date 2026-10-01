"use client";

import { track } from "@/lib/analytics/client";
import type { Source } from "./AssistantProvider";

const TYPE_LABEL: Record<string, string> = {
  role: "Employment history",
  case_study: "Case study",
  technology: "Technical skills",
  discipline: "Analytics discipline",
  capability: "Capability",
  work_sample: "Work sample",
  bio: "About",
  numbers: "Career scale",
  method: "How I work",
  targets: "Target roles",
};

/**
 * The expandable evidence list under every answer.
 *
 * This is what turns the assistant into a navigation system rather than a
 * black box: each source is the portfolio section the claim came from, and
 * clicking it goes there.
 */
export function EvidencePanel({ sources }: { sources: Source[] }) {
  if (sources.length === 0) return null;

  return (
    <details className="group mt-3 rounded-lg border border-line bg-raised/60">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2 text-xs font-medium text-muted hover:text-ink [&::-webkit-details-marker]:hidden">
        <span>
          Evidence
          <span className="ml-1.5 rounded bg-line/80 px-1.5 py-0.5 text-[0.6875rem] tnum text-ink-soft">
            {sources.length}
          </span>
        </span>
        <svg
          aria-hidden
          viewBox="0 0 16 16"
          className="h-3.5 w-3.5 shrink-0 transition-transform duration-200 group-open:rotate-180"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M4 6.5 8 10.5l4-4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <ol className="space-y-px border-t border-line px-1 py-1">
        {sources.map((source, i) => (
          <li key={source.id}>
            <a
              href={source.href}
              onClick={() => track("source_clicked", source.title)}
              className="group/src flex gap-2.5 rounded-md px-2 py-2 hover:bg-surface"
            >
              <span className="mt-px flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-[3px] border border-accent-line bg-accent-soft text-[0.6875rem] font-semibold text-accent tnum">
                {i + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-[0.6875rem] uppercase tracking-wider text-faint">
                  {TYPE_LABEL[source.type] ?? source.type}
                </span>
                <span className="block text-[0.8125rem] font-medium text-ink group-hover/src:text-accent">
                  {source.title}
                </span>
                <span className="mt-0.5 block line-clamp-2 text-xs leading-snug text-muted">
                  {source.excerpt}
                </span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </details>
  );
}
