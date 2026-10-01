import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";
import { interviewBySlug, interviews, type InterviewConfig } from "@/content/interviews";
import { techGroups } from "@/content/skills";
import { roleById } from "@/content/roles";
import { InterviewAsk } from "@/app/components/InterviewAsk";

export function generateStaticParams() {
  return interviews.map((i) => ({ company: i.slug }));
}

/** Turn an unknown slug into a readable company name. */
function titleise(slug: string): string {
  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/**
 * Fallback page for a slug with no curated config.
 *
 * Rather than 404 or invent role-specific claims, it presents the portfolio's
 * strongest documented evidence and says plainly that it isn't tailored yet.
 */
function genericConfig(slug: string): InterviewConfig {
  const documented = techGroups
    .flatMap((g) => g.items)
    .filter((i) => i.tier === "documented")
    .sort((a, b) => b.roleIds.length - a.roleIds.length)
    .slice(0, 4);

  return {
    slug,
    company: titleise(slug),
    roleTitle: "",
    overlaps: documented.map((item) => ({
      area: item.name,
      evidence: `Documented in ${item.roleIds.length} role${item.roleIds.length === 1 ? "" : "s"}: ${item.roleIds
        .map((id) => {
          const role = roleById.get(id);
          if (!role) return null;
          return role.company;
        })
        .filter(Boolean)
        .join(", ")}.`,
      tier: "documented" as const,
    })),
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}): Promise<Metadata> {
  const { company } = await params;
  const config = interviewBySlug.get(company) ?? genericConfig(company);
  return {
    title: `${profile.name} × ${config.company}`,
    description: `Where ${profile.name}'s documented analytics and BI experience overlaps with the ${config.roleTitle || "role"} at ${config.company}.`,
    // Personalised pages are for a specific recipient, not for search engines.
    robots: { index: false, follow: false },
  };
}

export default async function InterviewPage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  const curated = interviewBySlug.get(company);
  const config = curated ?? genericConfig(company);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
      <nav aria-label="Breadcrumb" className="mb-8">
        <Link href="/" className="text-[0.8125rem] font-medium text-muted hover:text-accent">
          ← {profile.name}
        </Link>
      </nav>

      {config.demo && (
        <p className="mb-6 rounded-lg border border-flag/30 bg-flag-soft px-4 py-2.5 text-[0.8125rem] leading-relaxed text-ink-soft">
          <span className="font-semibold">Demonstration page.</span> {config.company} is an example,
          not a live role — this page shows the format a job-specific URL takes.
        </p>
      )}

      <header>
        <h1 className="text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-ink lg:text-[2.375rem]">
          {profile.name}
          <span className="mx-2.5 font-normal text-faint">×</span>
          {config.company}
        </h1>
        {config.roleTitle && (
          <p className="mt-2 text-[1.0625rem] text-ink-soft">{config.roleTitle}</p>
        )}
      </header>

      <section className="mt-10">
        <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
          Why my background overlaps with this role
        </h2>
        {!curated && (
          <p className="mt-3 text-[0.875rem] leading-relaxed text-muted">
            This page isn&apos;t tailored to a specific job description yet, so it shows the
            strongest documented areas of my portfolio rather than role-specific overlap.
          </p>
        )}
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {config.overlaps.map((overlap) => (
            <li key={overlap.area} className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-[0.9375rem] font-semibold text-ink">{overlap.area}</h3>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[0.625rem] font-medium ${
                    overlap.tier === "documented"
                      ? "bg-data-soft text-data"
                      : "bg-flag-soft text-flag"
                  }`}
                >
                  {overlap.tier === "documented" ? "Documented" : "Transferable"}
                </span>
              </div>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
                {overlap.evidence}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <InterviewAsk
          company={config.company}
          roleTitle={config.roleTitle}
          roleContext={config.roleContext}
        />
      </section>

      <nav className="mt-10 flex flex-wrap gap-3 border-t border-line pt-7">
        <Link
          href="/#work"
          className="rounded-lg border border-line-strong bg-surface px-4 py-2.5 text-[0.875rem] font-medium text-ink hover:border-ink"
        >
          See the case studies
        </Link>
        <Link
          href="/resume"
          className="rounded-lg border border-line-strong bg-surface px-4 py-2.5 text-[0.875rem] font-medium text-ink hover:border-ink"
        >
          View the resume
        </Link>
      </nav>
    </div>
  );
}
