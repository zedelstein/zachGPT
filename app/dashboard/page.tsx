import type { Metadata } from "next";
import Link from "next/link";
import { aggregate, readEvents, type Aggregate } from "@/lib/analytics/store";
import { dashboardPassword, isOwner } from "@/lib/analytics/auth";
import { LoginForm } from "./LoginForm";
import { logout } from "./actions";

export const metadata: Metadata = {
  title: "Owner dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const EVENT_LABELS: Record<string, string> = {
  portfolio_opened: "Portfolio opened",
  resume_viewed: "Resume viewed",
  case_study_viewed: "Case study viewed",
  chatbot_opened: "Assistant opened",
  suggested_question_clicked: "Suggested question clicked",
  chatbot_question_submitted: "Question submitted",
  work_sample_viewed: "Work sample viewed",
  jd_comparison_used: "Job description compared",
  source_clicked: "Evidence source clicked",
  section_viewed: "Section reached",
  timeline_role_viewed: "Timeline role opened",
  technology_viewed: "Technology opened",
  interview_page_viewed: "Interview page viewed",
};

function Tile({ value, label, detail }: { value: string | number; label: string; detail?: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4">
      <p className="text-2xl font-semibold tracking-tight text-ink tnum">{value}</p>
      <p className="mt-1 text-[0.8125rem] font-medium text-ink">{label}</p>
      {detail && <p className="mt-0.5 text-[0.75rem] text-muted">{detail}</p>}
    </div>
  );
}

function BarList({
  title,
  items,
  empty,
}: {
  title: string;
  items: { label: string; count: number }[];
  empty: string;
}) {
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-[0.8125rem] font-semibold text-ink">{title}</h2>
      {items.length === 0 ? (
        <p className="mt-2 text-[0.8125rem] text-muted">{empty}</p>
      ) : (
        <ol className="mt-3 space-y-2">
          {items.map((item) => (
            <li key={item.label}>
              <div className="flex items-baseline justify-between gap-3">
                <span className="min-w-0 truncate text-[0.8125rem] text-ink-soft" title={item.label}>
                  {EVENT_LABELS[item.label] ?? item.label}
                </span>
                <span className="shrink-0 text-[0.75rem] font-medium text-muted tnum">
                  {item.count}
                </span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-raised">
                <div
                  className="h-full rounded-full bg-data/70"
                  style={{ width: `${(item.count / max) * 100}%` }}
                />
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

function Sparkline({ daily }: { daily: Aggregate["daily"] }) {
  if (daily.length < 2) {
    return (
      <p className="mt-3 text-[0.8125rem] text-muted">
        Not enough history yet for a trend — at least two days of events are needed.
      </p>
    );
  }

  const max = Math.max(...daily.map((d) => d.events), 1);
  const width = 600;
  const height = 90;
  const step = width / (daily.length - 1);
  const points = daily
    .map((d, i) => `${(i * step).toFixed(1)},${(height - (d.events / max) * (height - 10)).toFixed(1)}`)
    .join(" ");

  return (
    <figure className="mt-3">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-24 w-full" role="img" aria-label="Daily events">
        <polyline
          points={points}
          fill="none"
          stroke="var(--color-data)"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={`0,${height} ${points} ${width},${height}`}
          fill="var(--color-data)"
          opacity="0.08"
          stroke="none"
        />
      </svg>
      <figcaption className="mt-1 flex justify-between text-[0.6875rem] text-faint tnum">
        <span>{daily[0].date}</span>
        <span>
          peak {max} events/day
        </span>
        <span>{daily.at(-1)!.date}</span>
      </figcaption>
    </figure>
  );
}

function Funnel({ funnel }: { funnel: Aggregate["funnel"] }) {
  const top = Math.max(funnel[0]?.sessions ?? 0, 1);
  return (
    <section className="rounded-xl border border-line bg-surface p-5">
      <h2 className="text-[0.8125rem] font-semibold text-ink">Engagement funnel</h2>
      <p className="mt-1 text-[0.75rem] text-muted">Sessions reaching each step.</p>
      <ol className="mt-3 space-y-1.5">
        {funnel.map((step) => (
          <li key={step.step} className="flex items-center gap-3">
            <div
              className="flex h-9 min-w-[3rem] items-center rounded-md bg-accent/90 px-2.5"
              style={{ width: `${Math.max((step.sessions / top) * 100, 12)}%` }}
            >
              <span className="text-[0.75rem] font-semibold text-white tnum">{step.sessions}</span>
            </div>
            <span className="text-[0.8125rem] text-ink-soft">{step.step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default async function DashboardPage() {
  if (!(await isOwner())) {
    return (
      <div className="flex min-h-[70dvh] items-center justify-center px-5 py-16">
        <LoginForm />
      </div>
    );
  }

  const data = aggregate(readEvents());
  const open = !dashboardPassword();

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 lg:px-8 lg:py-16">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
            Private
          </p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">
            Portfolio engagement
          </h1>
          <p className="mt-1.5 max-w-xl text-[0.8125rem] leading-relaxed text-muted">
            The analytics portfolio, instrumented as an analytics product. Aggregate only — no IP
            addresses, user agents or identifying information are collected.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/"
            className="rounded-lg border border-line-strong bg-surface px-3.5 py-2 text-[0.8125rem] font-medium text-ink hover:border-ink"
          >
            View site
          </Link>
          {!open && (
            <form action={logout}>
              <button
                type="submit"
                className="rounded-lg border border-line bg-surface px-3.5 py-2 text-[0.8125rem] font-medium text-muted hover:text-ink"
              >
                Sign out
              </button>
            </form>
          )}
        </div>
      </header>

      {open && (
        <p className="mt-6 rounded-lg border border-flag/30 bg-flag-soft px-4 py-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
          <span className="font-semibold">No password set.</span> This dashboard is currently
          unprotected. Set <code className="font-mono text-[0.75rem]">OWNER_DASHBOARD_PASSWORD</code>{" "}
          before deploying.
        </p>
      )}

      {data.totalEvents === 0 ? (
        <p className="mt-8 rounded-xl border border-dashed border-line bg-surface/60 px-5 py-8 text-center text-[0.875rem] text-muted">
          No events recorded yet. Browse the portfolio in another tab and reload this page.
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Tile value={data.sessions} label="Sessions" detail="Unique visits (per tab)" />
            <Tile value={data.totalEvents} label="Events" />
            <Tile
              value={data.byEvent.find((e) => e.name === "chatbot_question_submitted")?.count ?? 0}
              label="Questions asked"
              detail="Typed into the assistant"
            />
            <Tile
              value={data.byEvent.find((e) => e.name === "jd_comparison_used")?.count ?? 0}
              label="Role comparisons"
            />
          </div>

          <section className="mt-4 rounded-xl border border-line bg-surface p-5">
            <h2 className="text-[0.8125rem] font-semibold text-ink">Activity over time</h2>
            <Sparkline daily={data.daily} />
          </section>

          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <Funnel funnel={data.funnel} />
            <BarList
              title="Events by type"
              items={data.byEvent.map((e) => ({ label: e.name, count: e.count }))}
              empty="No events yet."
            />
            <BarList
              title="Questions asked"
              items={data.topQuestions}
              empty="No questions asked yet."
            />
            <BarList
              title="Case studies viewed"
              items={data.topCaseStudies}
              empty="No case studies opened yet."
            />
            <BarList
              title="Technologies opened"
              items={data.topTechnologies}
              empty="Nothing opened in the technology map yet."
            />
            <BarList
              title="Work samples viewed"
              items={data.topWorkSamples}
              empty="No work samples opened yet."
            />
          </div>

          <p className="mt-6 text-[0.75rem] leading-relaxed text-faint">
            Session counts are per browser tab: the session id lives in sessionStorage and is
            discarded when the tab closes, so a returning visitor cannot be recognised. Stored
            events contain a timestamp, an event name, a hashed session id, a coarse device class
            and a short label — nothing more.
          </p>
        </>
      )}
    </div>
  );
}
