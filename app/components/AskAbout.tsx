"use client";

import { useAssistant } from "./assistant/AssistantProvider";

/** Opens the assistant with a specific question already asked. */
export function AskAbout({
  question,
  children,
  variant = "primary",
}: {
  question: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}) {
  const { ask } = useAssistant();
  return (
    <button
      type="button"
      onClick={() => ask(question, "suggested")}
      className={
        variant === "primary"
          ? "rounded-lg bg-accent px-4.5 py-2.5 text-[0.875rem] font-medium text-white transition-colors hover:bg-ink"
          : "rounded-lg border border-line-strong bg-surface px-4.5 py-2.5 text-[0.875rem] font-medium text-ink transition-colors hover:border-ink"
      }
    >
      {children}
    </button>
  );
}
