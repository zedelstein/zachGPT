"use client";

import { useEffect, useRef, useState } from "react";
import { assistant } from "@/content/profile";
import { roleById } from "@/content/roles";
import { AnswerText } from "./AnswerText";
import { EvidencePanel } from "./EvidencePanel";
import { JobMatch } from "./JobMatch";
import { SuggestedQuestions } from "./SuggestedQuestions";
import { useAssistant } from "./AssistantProvider";

function Dots() {
  return (
    <span className="inline-flex items-center gap-1 py-1" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-pulse rounded-full bg-faint"
          style={{ animationDelay: `${i * 160}ms`, animationDuration: "1.1s" }}
        />
      ))}
    </span>
  );
}

/**
 * Chips naming what the answer just highlighted in the portfolio.
 *
 * Clicking one scrolls to the visualization. This is the bridge between the
 * conversation and the charts: the answer says where the evidence is, and the
 * timeline, matrix and technology map are already showing it.
 */
function HighlightBridge() {
  const { focus, closeAssistant } = useAssistant();
  const roleNames = focus.roleIds
    .map((id) => roleById.get(id))
    .filter(Boolean)
    .map((r) => (r!.company));

  const hasAnything =
    roleNames.length > 0 || focus.technologies.length > 0 || focus.capabilities.length > 0;
  if (!hasAnything) return null;

  const goTo = (hash: string) => {
    if (window.innerWidth < 768) closeAssistant();
    // Give the sheet a moment to close on mobile before scrolling.
    window.setTimeout(() => {
      document.querySelector(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, window.innerWidth < 768 ? 260 : 0);
  };

  return (
    <div className="mt-3 rounded-lg border border-accent-line/60 bg-accent-soft/50 p-3">
      <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-accent">
        Highlighted in the portfolio
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {roleNames.length > 0 && (
          <button
            type="button"
            onClick={() => goTo("#experience")}
            className="rounded-full border border-accent-line bg-surface px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-white"
          >
            {roleNames.length === 1 ? roleNames[0] : `${roleNames.length} roles`} on the timeline →
          </button>
        )}
        {focus.technologies.length > 0 && (
          <button
            type="button"
            onClick={() => goTo("#skills")}
            className="rounded-full border border-accent-line bg-surface px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-white"
          >
            {focus.technologies.slice(0, 2).join(", ")}
            {focus.technologies.length > 2 ? ` +${focus.technologies.length - 2}` : ""} in the tech map →
          </button>
        )}
        {focus.capabilities.length > 0 && (
          <button
            type="button"
            onClick={() => goTo("#matrix")}
            className="rounded-full border border-accent-line bg-surface px-2.5 py-1 text-xs font-medium text-accent hover:bg-accent hover:text-white"
          >
            In the capability matrix →
          </button>
        )}
      </div>
    </div>
  );
}

export function AssistantPanel() {
  const { open, closeAssistant, mode, setMode, messages, busy, ask, reset } = useAssistant();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAssistant();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeAssistant]);

  useEffect(() => {
    if (open && mode === "chat") inputRef.current?.focus();
  }, [open, mode]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  // The mobile sheet covers the page, so scrolling behind it is locked. On
  // desktop the panel sits beside the page deliberately — the visitor needs to
  // see the timeline light up while they read the answer.
  useEffect(() => {
    if (!open) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    if (!isMobile) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const submit = () => {
    const value = draft;
    setDraft("");
    ask(value, "typed");
  };

  return (
    <>
      {/* Mobile-only scrim. Absent on desktop by design. */}
      {open && (
        <button
          type="button"
          aria-label="Close assistant"
          onClick={closeAssistant}
          className="no-print fixed inset-0 z-40 bg-ink/20 backdrop-blur-[2px] md:hidden"
        />
      )}

      <aside
        role="dialog"
        aria-modal="false"
        aria-label="Ask my portfolio"
        aria-hidden={!open}
        className={`no-print fixed inset-0 z-50 flex flex-col border-line bg-surface transition-transform duration-300 md:inset-y-0 md:left-auto md:right-0 md:w-[27rem] md:border-l md:shadow-[-8px_0_40px_-24px_rgba(20,23,27,0.35)] lg:w-[30rem] ${
          open ? "translate-y-0 md:translate-x-0" : "translate-y-full md:translate-y-0 md:translate-x-full"
        }`}
        style={{ visibility: open ? "visible" : "hidden" }}
      >
        <header
          className="flex shrink-0 items-start justify-between gap-3 border-b px-4 py-3.5"
          style={{ background: "var(--color-nav)", borderColor: "var(--color-nav-line)" }}
        >
          <div className="min-w-0">
            <h2 className="flex items-center gap-2 text-sm font-semibold text-white">
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center rounded-[4px] text-[0.625rem] font-bold text-white"
                style={{ background: "var(--color-hot)" }}
              >
                Z
              </span>
              zach<span style={{ color: "var(--color-warm)" }}>GPT</span>
            </h2>
            <p className="mt-1 text-[0.6875rem] leading-snug" style={{ color: "var(--color-nav-text)" }}>
              Grounded in Zach&apos;s resume and portfolio materials
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {mode === "chat" && messages.length > 0 && (
              <button
                type="button"
                onClick={reset}
                className="rounded-md px-2 py-1.5 text-xs text-white/60 hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={closeAssistant}
              aria-label="Close"
              className="rounded-md p-1.5 text-white/60 hover:bg-white/10 hover:text-white"
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="m4 4 8 8M12 4l-8 8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </header>

        <nav className="flex shrink-0 gap-1 border-b border-line px-3 py-2" aria-label="Assistant mode">
          {([
            ["chat", "Ask"],
            ["match", "Compare a role"],
          ] as const).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setMode(value)}
              aria-current={mode === value}
              className={`rounded-md px-3 py-1.5 text-[0.8125rem] font-semibold transition-colors ${
                mode === value
                  ? "bg-[var(--color-hot-soft)] text-[var(--color-hot)]"
                  : "text-muted hover:text-ink"
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        <div ref={scrollRef} className="thin-scroll flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          {mode === "match" ? (
            <JobMatch />
          ) : messages.length === 0 ? (
            <div className="space-y-4">
              <div className="space-y-3 text-[0.9375rem] leading-relaxed text-ink-soft">
                {assistant.greeting.split("\n\n").map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <div className="space-y-2">
                <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
                  Try one of these
                </p>
                <SuggestedQuestions />
              </div>
            </div>
          ) : (
            <ol className="space-y-5">
              {messages.map((message) =>
                message.role === "user" ? (
                  <li key={message.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-2xl rounded-br-md bg-raised px-3.5 py-2 text-[0.9375rem] leading-relaxed text-ink">
                      {message.content}
                    </p>
                  </li>
                ) : (
                  <li key={message.id}>
                    {message.content ? (
                      <AnswerText content={message.content} sources={message.sources ?? []} />
                    ) : message.streaming ? (
                      <Dots />
                    ) : null}

                    {message.error && (
                      <p className="mt-2 rounded-md border border-flag/30 bg-flag-soft px-3 py-2 text-[0.8125rem] text-ink-soft">
                        {message.error}
                      </p>
                    )}

                    {!message.streaming && (
                      <>
                        <EvidencePanel sources={message.sources ?? []} />
                        <HighlightBridge />
                      </>
                    )}
                  </li>
                ),
              )}
            </ol>
          )}
        </div>

        {mode === "chat" && (
          <div className="shrink-0 border-t border-line bg-surface px-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit();
              }}
              className="flex items-end gap-2"
            >
              <label htmlFor="assistant-input" className="sr-only">
                Ask a question about Zach&apos;s experience
              </label>
              <textarea
                id="assistant-input"
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    submit();
                  }
                }}
                rows={1}
                placeholder="Ask about a tool, a role, an industry…"
                className="thin-scroll max-h-32 min-h-[2.5rem] flex-1 resize-none rounded-lg border border-line bg-ground px-3 py-2.5 text-[0.9375rem] leading-snug text-ink placeholder:text-faint focus-visible:border-accent-line"
              />
              <button
                type="submit"
                disabled={busy || !draft.trim()}
                aria-label="Send"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-hot)] text-white transition-transform hover:scale-105 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
              >
                <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7">
                  <path d="M10 16V4.5M5 9l5-5 5 5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </form>
            <p className="mt-2 px-1 text-[0.6875rem] leading-snug text-faint">
              Answers come only from Zach&apos;s portfolio. If the evidence isn&apos;t there, the
              assistant says so rather than guessing.
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
