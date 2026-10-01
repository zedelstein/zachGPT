"use client";

import { useState } from "react";
import { useAssistant, type MatchGap, type MatchRequirement } from "./AssistantProvider";

function RequirementList({
  items,
  tone,
}: {
  items: MatchRequirement[];
  tone: "strong" | "related";
}) {
  const accent = tone === "strong" ? "border-l-data bg-data-soft/40" : "border-l-flag bg-flag-soft/40";
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.requirement} className={`rounded-r-md border-l-2 py-2 pl-3 pr-3 ${accent}`}>
          <p className="text-[0.8125rem] font-semibold text-ink">{item.requirement}</p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-ink-soft">{item.evidence}</p>
        </li>
      ))}
    </ul>
  );
}

function GapList({ items }: { items: MatchGap[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.requirement} className="rounded-r-md border-l-2 border-l-line-strong bg-raised/60 py-2 pl-3 pr-3">
          <p className="text-[0.8125rem] font-semibold text-ink">{item.requirement}</p>
          <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">{item.note}</p>
        </li>
      ))}
    </ul>
  );
}

function Group({
  title, blurb, count, children,
}: {
  title: string; blurb: string; count: number; children: React.ReactNode;
}) {
  if (count === 0) return null;
  return (
    <section className="space-y-2">
      <div>
        <h4 className="flex items-baseline gap-2 text-sm font-semibold text-ink">
          {title}
          <span className="text-xs font-normal text-faint tnum">{count}</span>
        </h4>
        <p className="text-xs text-muted">{blurb}</p>
      </div>
      {children}
    </section>
  );
}

export function JobMatch() {
  const { match, matchBusy, matchError, runMatch, clearMatch, setMode, ask } = useAssistant();
  const [draft, setDraft] = useState("");

  if (match) {
    return (
      <div className="space-y-5">
        <header className="space-y-1">
          <p className="text-xs uppercase tracking-wider text-faint">Comparison</p>
          <h3 className="text-base font-semibold leading-snug text-ink">
            {match.roleTitle?.trim() || "This role"}
          </h3>
          <p className="text-[0.8125rem] leading-relaxed text-ink-soft">{match.summary}</p>
        </header>

        <Group
          title="Relevant experience"
          blurb="Requirements with direct supporting evidence."
          count={match.relevant.length}
        >
          <RequirementList items={match.relevant} tone="strong" />
        </Group>

        <Group
          title="Related experience"
          blurb="Transferable or adjacent evidence — not the specific thing asked for."
          count={match.related.length}
        >
          <RequirementList items={match.related} tone="related" />
        </Group>

        <Group
          title="Not documented"
          blurb="The portfolio contains insufficient evidence for these."
          count={match.notDocumented.length}
        >
          <GapList items={match.notDocumented} />
        </Group>

        <div className="flex flex-wrap gap-2 border-t border-line pt-4">
          <button
            type="button"
            onClick={() => {
              setMode("chat");
              ask("Based on this role, which parts of Zach's experience are most relevant?", "suggested");
            }}
            className="rounded-md bg-accent px-3.5 py-2 text-[0.8125rem] font-medium text-white hover:bg-ink"
          >
            Ask questions about this match
          </button>
          <button
            type="button"
            onClick={() => {
              clearMatch();
              setDraft("");
            }}
            className="rounded-md border border-line bg-surface px-3.5 py-2 text-[0.8125rem] font-medium text-ink-soft hover:border-line-strong"
          >
            Compare another role
          </button>
        </div>
        <p className="text-xs leading-relaxed text-faint">
          Buckets are assigned from Zach&apos;s documented portfolio only. Adjacent tools are never
          counted as direct experience — a Looker requirement lands in &ldquo;related&rdquo; on the
          strength of his Tableau and Power BI work, not in &ldquo;relevant&rdquo;.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <header className="space-y-1.5">
        <h3 className="text-base font-semibold text-ink">Compare my experience to your role</h3>
        <p className="text-[0.8125rem] leading-relaxed text-ink-soft">
          Paste a job description. You&apos;ll get three lists: requirements with direct evidence,
          requirements where my experience is adjacent, and requirements my portfolio doesn&apos;t
          document. The third list is the honest one — it&apos;s there on purpose.
        </p>
      </header>

      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="Paste the job description here — the requirements section is the most useful part."
        rows={10}
        className="thin-scroll w-full resize-y rounded-lg border border-line bg-surface p-3 text-[0.8125rem] leading-relaxed text-ink placeholder:text-faint focus-visible:border-accent-line"
      />

      {matchError && (
        <p className="rounded-md border border-flag/30 bg-flag-soft px-3 py-2 text-[0.8125rem] text-ink-soft">
          {matchError}
        </p>
      )}

      <button
        type="button"
        disabled={matchBusy || draft.trim().length < 60}
        onClick={() => runMatch(draft)}
        className="w-full rounded-md bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink disabled:cursor-not-allowed disabled:opacity-40"
      >
        {matchBusy ? "Analysing the role…" : "Compare to my experience"}
      </button>
    </div>
  );
}
