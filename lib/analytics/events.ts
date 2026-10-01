/**
 * The event vocabulary.
 *
 * Privacy posture: no IP address, user-agent string, email, name or any other
 * identifier is recorded. A session id is a random value generated in the
 * visitor's own tab and discarded when the tab closes, so visits cannot be
 * linked across sessions or devices. Device class is recorded as a coarse
 * bucket derived from viewport width, not a fingerprint.
 */
export const EVENT_NAMES = [
  "portfolio_opened",
  "resume_viewed",
  "case_study_viewed",
  "chatbot_opened",
  "suggested_question_clicked",
  "chatbot_question_submitted",
  "work_sample_viewed",
  "jd_comparison_used",
  "source_clicked",
  "section_viewed",
  "timeline_role_viewed",
  "technology_viewed",
  "interview_page_viewed",
] as const;

export type EventName = (typeof EVENT_NAMES)[number];

export interface AnalyticsEvent {
  /** ISO timestamp, assigned server-side. */
  t: string;
  name: EventName;
  /** Random per-tab id. Not persistent, not linkable across sessions. */
  sid: string;
  device: "desktop" | "mobile" | "unknown";
  /** Small, bounded label — a case-study slug, section id, technology name or question text. */
  label?: string;
}

export function isEventName(value: unknown): value is EventName {
  return typeof value === "string" && (EVENT_NAMES as readonly string[]).includes(value);
}
