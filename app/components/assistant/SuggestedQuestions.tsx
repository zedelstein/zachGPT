"use client";

import { assistant } from "@/content/profile";
import { useAssistant } from "./AssistantProvider";

export function SuggestedQuestions({ limit = 8 }: { limit?: number }) {
  const { ask, busy } = useAssistant();

  return (
    <div className="flex flex-wrap gap-1.5">
      {assistant.suggestedQuestions.slice(0, limit).map((question) => (
        <button
          key={question}
          type="button"
          disabled={busy}
          onClick={() => ask(question, "suggested")}
          className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-[0.8125rem] text-ink-soft transition-colors hover:border-accent-line hover:bg-accent-soft hover:text-accent disabled:opacity-50"
        >
          {question}
        </button>
      ))}
    </div>
  );
}
