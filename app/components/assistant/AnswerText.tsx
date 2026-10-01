"use client";

import type { Source } from "./AssistantProvider";
import { track } from "@/lib/analytics/client";

/**
 * Minimal answer renderer.
 *
 * Handles the only three things the model is asked to produce — paragraphs,
 * simple bullet lists and inline [S1] citation markers — rather than pulling in
 * a markdown library for a 200-word answer.
 */
function Inline({ text, sources }: { text: string; sources: Source[] }) {
  const parts = text.split(/(\[S\d+\]|\*\*[^*]+\*\*)/g).filter(Boolean);

  return (
    <>
      {parts.map((part, i) => {
        const citation = /^\[S(\d+)\]$/.exec(part);
        if (citation) {
          const index = Number(citation[1]) - 1;
          const source = sources[index];
          if (!source) return null;
          return (
            <a
              key={i}
              href={source.href}
              onClick={() => track("source_clicked", source.title)}
              title={source.title}
              className="mx-0.5 inline-flex h-[1.1em] min-w-[1.1em] translate-y-[-0.15em] items-center justify-center rounded-[3px] border border-accent-line bg-accent-soft px-1 align-middle text-[0.64em] font-semibold text-accent no-underline tnum hover:bg-accent hover:text-white"
            >
              {citation[1]}
            </a>
          );
        }
        const bold = /^\*\*([^*]+)\*\*$/.exec(part);
        if (bold) {
          return (
            <strong key={i} className="font-semibold text-ink">
              {bold[1]}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export function AnswerText({ content, sources }: { content: string; sources: Source[] }) {
  const blocks = content.split(/\n{2,}/).filter((b) => b.trim());

  return (
    <div className="space-y-3 text-[0.9375rem] leading-relaxed text-ink-soft">
      {blocks.map((block, i) => {
        const lines = block.split("\n").filter((l) => l.trim());
        const isList = lines.length > 0 && lines.every((l) => /^\s*[-*•]\s+/.test(l));

        if (isList) {
          return (
            <ul key={i} className="space-y-1.5 pl-1">
              {lines.map((line, j) => (
                <li key={j} className="flex gap-2.5">
                  <span aria-hidden className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-faint" />
                  <span>
                    <Inline text={line.replace(/^\s*[-*•]\s+/, "")} sources={sources} />
                  </span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i}>
            <Inline text={block.replace(/\n/g, " ")} sources={sources} />
          </p>
        );
      })}
    </div>
  );
}
