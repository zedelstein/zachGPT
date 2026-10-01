"use client";

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="no-print rounded-lg border border-line-strong bg-surface px-4 py-2 text-[0.8125rem] font-medium text-ink transition-colors hover:border-ink"
    >
      Print / save as PDF
    </button>
  );
}
