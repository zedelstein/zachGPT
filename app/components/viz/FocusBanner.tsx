"use client";

import { useFocus } from "../assistant/AssistantProvider";

/**
 * Appears above a visualization when the assistant (or a click on the page) has
 * narrowed it to a subject, and offers the way back out.
 */
export function FocusBanner({ scope }: { scope: "roles" | "capabilities" | "technologies" }) {
  const { focus, focusLabel, clearFocus } = useFocus();

  const active =
    scope === "roles"
      ? focus.roleIds.length > 0
      : scope === "capabilities"
        ? focus.capabilities.length > 0 || focus.roleIds.length > 0
        : focus.technologies.length > 0;

  if (!active || !focusLabel) return null;

  return (
    <div className="mb-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-accent-line/70 bg-accent-soft/60 px-3.5 py-2.5">
      <span className="flex items-center gap-2 text-[0.8125rem] text-ink-soft">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-accent" />
        Highlighting evidence for
        <span className="font-medium text-ink">
          {focusLabel.length > 70 ? `${focusLabel.slice(0, 70)}…` : focusLabel}
        </span>
      </span>
      <button
        type="button"
        onClick={clearFocus}
        className="ml-auto rounded-md border border-accent-line bg-surface px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-white"
      >
        Show everything
      </button>
    </div>
  );
}
