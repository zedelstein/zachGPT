"use client";

import { useAssistant } from "./AssistantProvider";

/** The persistent "Ask My Portfolio" affordance. Hidden while the panel is open. */
export function AskPortfolioFab() {
  const { open, openAssistant } = useAssistant();

  return (
    <button
      type="button"
      onClick={() => openAssistant("chat")}
      aria-hidden={open}
      tabIndex={open ? -1 : 0}
      style={{ background: "var(--color-hot)" }}
      className={`no-print fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full px-4.5 py-3 text-sm font-semibold text-white shadow-lg shadow-[var(--color-hot)]/30 transition-all duration-200 hover:scale-105 focus-visible:outline-offset-4 md:bottom-7 md:right-7 ${
        open ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"
      }`}
    >
      <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path
          d="M3.5 5.5A2 2 0 0 1 5.5 3.5h9a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H9l-3.5 3v-3h-.5a2 2 0 0 1-2-2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Ask my portfolio
    </button>
  );
}
