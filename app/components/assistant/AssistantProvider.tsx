"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { CapabilityId } from "@/content/types";
import { track } from "@/lib/analytics/client";

export interface Source {
  id: string;
  type: string;
  title: string;
  href: string;
  excerpt: string;
}

export interface Focus {
  roleIds: string[];
  caseStudies: string[];
  technologies: string[];
  capabilities: CapabilityId[];
}

export const EMPTY_FOCUS: Focus = {
  roleIds: [],
  caseStudies: [],
  technologies: [],
  capabilities: [],
};

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: Source[];
  focus?: Focus;
  streaming?: boolean;
  error?: string;
  degraded?: boolean;
}

export interface MatchRequirement {
  requirement: string;
  evidence: string;
}

export interface MatchGap {
  requirement: string;
  note: string;
}

export interface MatchResult {
  roleTitle: string;
  summary: string;
  relevant: MatchRequirement[];
  related: MatchRequirement[];
  notDocumented: MatchGap[];
}

type Mode = "chat" | "match";

interface AssistantContextValue {
  open: boolean;
  mode: Mode;
  messages: ChatMessage[];
  busy: boolean;
  /** What the portfolio visualizations should currently highlight. */
  focus: Focus;
  /** The question or role that produced the current focus, for the banner. */
  focusLabel: string | null;
  jobDescription: string;
  match: MatchResult | null;
  matchBusy: boolean;
  matchError: string | null;
  openAssistant: (mode?: Mode) => void;
  closeAssistant: () => void;
  setMode: (mode: Mode) => void;
  ask: (question: string, origin?: "typed" | "suggested") => void;
  reset: () => void;
  clearFocus: () => void;
  /** Highlight directly from the page (clicking a technology, a timeline role). */
  setManualFocus: (focus: Partial<Focus>, label: string) => void;
  setJobDescription: (value: string) => void;
  runMatch: (jd: string) => void;
  clearMatch: () => void;
}

const AssistantContext = createContext<AssistantContextValue | null>(null);

export function useAssistant(): AssistantContextValue {
  const ctx = useContext(AssistantContext);
  if (!ctx) throw new Error("useAssistant must be used inside <AssistantProvider>");
  return ctx;
}

/** Narrow hook for the visualizations, so they don't re-render on every token. */
export function useFocus() {
  const { focus, focusLabel, clearFocus, setManualFocus, openAssistant } = useAssistant();
  return { focus, focusLabel, clearFocus, setManualFocus, openAssistant };
}

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `m${idCounter}`;
}

export function AssistantProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);
  const [focus, setFocus] = useState<Focus>(EMPTY_FOCUS);
  const [focusLabel, setFocusLabel] = useState<string | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [match, setMatch] = useState<MatchResult | null>(null);
  const [matchBusy, setMatchBusy] = useState(false);
  const [matchError, setMatchError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);
  // Mirrors `open` so the tracking decision happens outside the state updater.
  // React re-invokes updater functions under StrictMode, which double-counted
  // the open event when the call lived inside setOpen.
  const openRef = useRef(false);

  const openAssistant = useCallback((next?: Mode) => {
    if (!openRef.current) {
      openRef.current = true;
      track("chatbot_opened", next ?? "chat");
    }
    setOpen(true);
    if (next) setMode(next);
  }, []);

  const closeAssistant = useCallback(() => {
    openRef.current = false;
    setOpen(false);
  }, []);

  const clearFocus = useCallback(() => {
    setFocus(EMPTY_FOCUS);
    setFocusLabel(null);
  }, []);

  const setManualFocus = useCallback((partial: Partial<Focus>, label: string) => {
    setFocus({ ...EMPTY_FOCUS, ...partial });
    setFocusLabel(label);
  }, []);

  const ask = useCallback(
    (question: string, origin: "typed" | "suggested" = "typed") => {
      const trimmed = question.trim();
      if (!trimmed || busy) return;

      track(origin === "suggested" ? "suggested_question_clicked" : "chatbot_question_submitted", trimmed);

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const userMessage: ChatMessage = { id: nextId(), role: "user", content: trimmed };
      const replyId = nextId();
      const reply: ChatMessage = { id: replyId, role: "assistant", content: "", streaming: true };

      // Snapshot the history before this turn, so the request carries the same
      // conversation the user can see.
      const history = [...messages, userMessage].map(({ role, content }) => ({ role, content }));

      setMessages((prev) => [...prev, userMessage, reply]);
      setBusy(true);
      openRef.current = true;
      setOpen(true);

      const update = (patch: Partial<ChatMessage>) => {
        setMessages((prev) => prev.map((m) => (m.id === replyId ? { ...m, ...patch } : m)));
      };

      (async () => {
        try {
          const response = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              messages: history,
              jobDescription: jobDescription.trim() || undefined,
            }),
            signal: controller.signal,
          });

          if (!response.ok || !response.body) {
            throw new Error(`Request failed (${response.status})`);
          }

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let text = "";

          // NDJSON: evidence frame first, then text deltas, then done.
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() ?? "";

            for (const line of lines) {
              if (!line.trim()) continue;
              let frame: Record<string, unknown>;
              try {
                frame = JSON.parse(line) as Record<string, unknown>;
              } catch {
                continue;
              }

              if (frame.type === "evidence") {
                const sources = (frame.sources as Source[]) ?? [];
                const nextFocus = (frame.focus as Focus) ?? EMPTY_FOCUS;
                update({ sources, focus: nextFocus });
                // Highlight the portfolio from the retrieved evidence — this is
                // why a question about Tableau lights up the right roles on the
                // timeline rather than whatever the model decided to mention.
                setFocus(nextFocus);
                setFocusLabel(trimmed);
              } else if (frame.type === "delta") {
                text += String(frame.text ?? "");
                update({ content: text });
              } else if (frame.type === "done") {
                update({ streaming: false, degraded: Boolean(frame.degraded) });
              } else if (frame.type === "error") {
                update({ streaming: false, error: String(frame.message ?? "Request failed.") });
              }
            }
          }

          update({ streaming: false });
        } catch (error) {
          if ((error as Error).name === "AbortError") return;
          update({
            streaming: false,
            error: "I couldn't reach the assistant. Please try again in a moment.",
          });
        } finally {
          setBusy(false);
        }
      })();
    },
    [busy, jobDescription, messages],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setBusy(false);
    clearFocus();
  }, [clearFocus]);

  const runMatch = useCallback((jd: string) => {
    const trimmed = jd.trim();
    if (trimmed.length < 60) {
      setMatchError("Paste a bit more of the job description — at least a sentence or two of requirements.");
      return;
    }
    track("jd_comparison_used");
    setMatchBusy(true);
    setMatchError(null);
    setMatch(null);

    (async () => {
      try {
        const response = await fetch("/api/match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobDescription: trimmed }),
        });
        const data = (await response.json()) as {
          match?: MatchResult;
          focus?: Focus;
          error?: string;
        };
        if (!response.ok || !data.match) {
          setMatchError(data.error ?? "Something went wrong analysing that job description.");
          return;
        }
        setMatch(data.match);
        setJobDescription(trimmed);
        if (data.focus) {
          setFocus(data.focus);
          setFocusLabel(data.match.roleTitle?.trim() || "this role");
        }
      } catch {
        setMatchError("Something went wrong analysing that job description. Please try again.");
      } finally {
        setMatchBusy(false);
      }
    })();
  }, []);

  const clearMatch = useCallback(() => {
    setMatch(null);
    setMatchError(null);
    setJobDescription("");
    clearFocus();
  }, [clearFocus]);

  const value = useMemo<AssistantContextValue>(
    () => ({
      open,
      mode,
      messages,
      busy,
      focus,
      focusLabel,
      jobDescription,
      match,
      matchBusy,
      matchError,
      openAssistant,
      closeAssistant,
      setMode,
      ask,
      reset,
      clearFocus,
      setManualFocus,
      setJobDescription,
      runMatch,
      clearMatch,
    }),
    [
      open, mode, messages, busy, focus, focusLabel, jobDescription, match,
      matchBusy, matchError, openAssistant, closeAssistant, ask, reset,
      clearFocus, setManualFocus, runMatch, clearMatch,
    ],
  );

  return <AssistantContext.Provider value={value}>{children}</AssistantContext.Provider>;
}
