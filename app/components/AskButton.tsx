"use client";

import { useAssistant } from "./assistant/AssistantProvider";

type Variant = "primary" | "secondary" | "ghost" | "nav";

const STYLES: Record<Variant, string> = {
  primary:
    "rounded-lg bg-[var(--color-hot)] px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-[var(--color-hot)]/25 transition-transform hover:scale-[1.02] active:scale-100",
  secondary:
    "rounded-lg border border-line-strong bg-surface px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink",
  ghost: "text-sm font-medium text-accent hover:underline",
  nav: "rounded-md bg-[var(--color-hot)] px-3.5 py-2 text-[0.8125rem] font-semibold text-white transition-transform hover:scale-[1.03] active:scale-100",
};

export function AskButton({
  children,
  variant = "primary",
  mode = "chat",
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  mode?: "chat" | "match";
  className?: string;
}) {
  const { openAssistant } = useAssistant();
  return (
    <button type="button" onClick={() => openAssistant(mode)} className={`${STYLES[variant]} ${className}`}>
      {children}
    </button>
  );
}
