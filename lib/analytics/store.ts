import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import type { AnalyticsEvent, EventName } from "./events";

/**
 * Append-only JSONL event store.
 *
 * Deliberately file-based: it has no infrastructure dependency, which keeps the
 * whole site runnable with `npm run dev` and a single env var. All reads and
 * writes go through this module, so swapping in Postgres, SQLite or a hosted
 * analytics product means rewriting this file only.
 *
 * Note: on an ephemeral serverless filesystem (e.g. Vercel's default runtime)
 * writes do not persist between invocations. For a deployment that needs
 * durable counts, point DATA_DIR at a mounted volume or replace this module.
 */
const DATA_DIR = process.env.DATA_DIR ?? path.join(process.cwd(), ".data");
const EVENTS_FILE = path.join(DATA_DIR, "events.jsonl");

const MAX_LABEL = 300;

export function recordEvent(event: AnalyticsEvent): void {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const safe: AnalyticsEvent = {
      ...event,
      label: event.label?.slice(0, MAX_LABEL),
      // Store a short hash of the session id rather than the id itself, so the
      // stored data can group events by visit without holding the raw token.
      sid: createHash("sha256").update(event.sid).digest("hex").slice(0, 12),
    };
    fs.appendFileSync(EVENTS_FILE, `${JSON.stringify(safe)}\n`, "utf8");
  } catch {
    // Analytics must never break the page. Swallow and move on.
  }
}

export function readEvents(): AnalyticsEvent[] {
  try {
    const raw = fs.readFileSync(EVENTS_FILE, "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .flatMap((line) => {
        try {
          return [JSON.parse(line) as AnalyticsEvent];
        } catch {
          return [];
        }
      });
  } catch {
    return [];
  }
}

export interface Aggregate {
  totalEvents: number;
  sessions: number;
  firstSeen: string | null;
  lastSeen: string | null;
  byEvent: { name: EventName; count: number }[];
  byDevice: { device: string; count: number }[];
  daily: { date: string; events: number; sessions: number }[];
  topQuestions: { label: string; count: number }[];
  topCaseStudies: { label: string; count: number }[];
  topWorkSamples: { label: string; count: number }[];
  topTechnologies: { label: string; count: number }[];
  funnel: { step: string; sessions: number }[];
}

function countBy<T extends string>(items: T[]): { label: T; count: number }[] {
  const counts = new Map<T, number>();
  for (const item of items) counts.set(item, (counts.get(item) ?? 0) + 1);
  return [...counts.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function sessionsWith(events: AnalyticsEvent[], names: EventName[]): number {
  const set = new Set(
    events.filter((e) => names.includes(e.name)).map((e) => e.sid),
  );
  return set.size;
}

export function aggregate(events: AnalyticsEvent[]): Aggregate {
  const sorted = [...events].sort((a, b) => a.t.localeCompare(b.t));
  const labelsFor = (name: EventName) =>
    sorted.filter((e) => e.name === name && e.label).map((e) => e.label as string);

  const dailyMap = new Map<string, { events: number; sids: Set<string> }>();
  for (const e of sorted) {
    const date = e.t.slice(0, 10);
    const entry = dailyMap.get(date) ?? { events: 0, sids: new Set<string>() };
    entry.events += 1;
    entry.sids.add(e.sid);
    dailyMap.set(date, entry);
  }

  return {
    totalEvents: sorted.length,
    sessions: new Set(sorted.map((e) => e.sid)).size,
    firstSeen: sorted[0]?.t ?? null,
    lastSeen: sorted.at(-1)?.t ?? null,
    byEvent: countBy(sorted.map((e) => e.name)).map(({ label, count }) => ({
      name: label,
      count,
    })),
    byDevice: countBy(sorted.map((e) => e.device)).map(({ label, count }) => ({
      device: label,
      count,
    })),
    daily: [...dailyMap.entries()]
      .map(([date, v]) => ({ date, events: v.events, sessions: v.sids.size }))
      .sort((a, b) => a.date.localeCompare(b.date)),
    topQuestions: countBy([
      ...labelsFor("chatbot_question_submitted"),
      ...labelsFor("suggested_question_clicked"),
    ]).slice(0, 15),
    topCaseStudies: countBy(labelsFor("case_study_viewed")).slice(0, 10),
    topWorkSamples: countBy(labelsFor("work_sample_viewed")).slice(0, 10),
    topTechnologies: countBy(labelsFor("technology_viewed")).slice(0, 12),
    funnel: [
      { step: "Opened the portfolio", sessions: sessionsWith(sorted, ["portfolio_opened"]) },
      { step: "Explored a section", sessions: sessionsWith(sorted, ["section_viewed", "timeline_role_viewed", "technology_viewed"]) },
      { step: "Viewed a case study", sessions: sessionsWith(sorted, ["case_study_viewed"]) },
      { step: "Opened the assistant", sessions: sessionsWith(sorted, ["chatbot_opened"]) },
      { step: "Asked a question", sessions: sessionsWith(sorted, ["chatbot_question_submitted", "suggested_question_clicked"]) },
      { step: "Compared a job description", sessions: sessionsWith(sorted, ["jd_comparison_used"]) },
    ],
  };
}
