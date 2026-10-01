"use client";

import { useEffect } from "react";
import { useAssistant } from "./assistant/AssistantProvider";

/**
 * Primes the assistant with the role being discussed, so follow-up questions
 * are answered in that context. The role description is never treated as
 * evidence about Zach — that separation is enforced in the system prompt.
 */
export function InterviewAsk({
  company,
  roleContext,
}: {
  company: string;
  roleTitle: string;
  roleContext?: string;
}) {
  const { setJobDescription, ask, openAssistant } = useAssistant();

  useEffect(() => {
    if (roleContext) setJobDescription(roleContext);
  }, [roleContext, setJobDescription]);

  const questions = [
    `Which parts of Zach's experience are most relevant to this role?`,
    `What has Zach documented that this role doesn't ask for?`,
    `Where is his evidence thinnest for this role?`,
  ];

  return (
    <div className="rounded-xl border border-accent-line bg-accent-soft/50 p-5">
      <h2 className="text-[1.0625rem] font-semibold text-ink">Ask about my experience</h2>
      <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">
        The assistant knows both my documented background and the {company} role, and will tell you
        where the evidence is thin as readily as where it&apos;s strong.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => openAssistant("chat")}
          className="rounded-lg bg-accent px-4 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-ink"
        >
          Open the assistant
        </button>
        {questions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => ask(question, "suggested")}
            className="rounded-lg border border-accent-line bg-surface px-3.5 py-2.5 text-left text-[0.8125rem] font-medium text-accent transition-colors hover:bg-accent hover:text-white"
          >
            {question}
          </button>
        ))}
      </div>
    </div>
  );
}
