import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { caseStudies, caseStudyBySlug } from "@/content/case-studies";
import { roleById } from "@/content/roles";
import { AskAbout } from "@/app/components/AskAbout";
import { ViewTracker } from "@/app/components/ViewTracker";
import { CaseDiagram } from "@/app/components/viz/CaseDiagram";

export function generateStaticParams() {
  return caseStudies.map((cs) => ({ slug: cs.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cs = caseStudyBySlug.get(slug);
  if (!cs) return { title: "Case study not found" };
  return {
    title: cs.title,
    description: cs.summary,
    openGraph: { title: cs.title, description: cs.summary, type: "article" },
  };
}

function Block({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-line py-7 first:border-t-0 first:pt-0">
      <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">
        {label}
      </h2>
      <div className="mt-3">{children}</div>
    </section>
  );
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cs = caseStudyBySlug.get(slug);
  if (!cs) notFound();

  const role = roleById.get(cs.roleId);
  const others = caseStudies.filter((c) => c.slug !== cs.slug);

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
      <ViewTracker event="case_study_viewed" label={cs.slug} />

      <nav aria-label="Breadcrumb" className="mb-8">
        <Link href="/#work" className="text-[0.8125rem] font-medium text-muted hover:text-accent">
          ← All case studies
        </Link>
      </nav>

      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded border border-line bg-surface px-2 py-0.5 text-[0.75rem] font-medium text-ink-soft">
            {cs.company}
          </span>
          <span className="text-[0.75rem] text-faint tnum">{cs.dates}</span>
          <span className="text-[0.75rem] text-faint">·</span>
          <span className="text-[0.75rem] text-muted">{cs.industry}</span>
        </div>
        <h1 className="mt-4 text-[2rem] font-semibold leading-tight tracking-[-0.02em] text-ink lg:text-[2.375rem]">
          {cs.title}
        </h1>
        <p className="mt-4 text-[1.0625rem] leading-relaxed text-ink-soft">{cs.summary}</p>
        {role && (
          <p className="mt-4 text-[0.8125rem] text-muted">
            Role:{" "}
            <Link href={`/#role-${role.id}`} className="font-medium text-accent hover:underline">
              {role.title}
            </Link>
          </p>
        )}
      </header>

      <div className="mt-10 rounded-xl border border-line bg-surface p-5">
        <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-faint">
          The system
        </h2>
        <div className="mt-4">
          <CaseDiagram diagram={cs.diagram} />
        </div>
      </div>

      <div className="mt-10">
        <Block label="Context">
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{cs.context}</p>
        </Block>

        <Block label="Problem">
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{cs.problem}</p>
        </Block>

        <Block label="Environment">
          <ul className="grid gap-2 sm:grid-cols-2">
            {cs.environment.map((item) => (
              <li
                key={item}
                className="rounded-lg border border-line bg-surface px-3 py-2 text-[0.8125rem] leading-snug text-ink-soft"
              >
                {item}
              </li>
            ))}
          </ul>
        </Block>

        <Block label="Approach">
          <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{cs.approach}</p>
        </Block>

        <Block label="What I did">
          <ul className="grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {cs.approachBullets.map((item) => (
              <li key={item} className="flex gap-2.5 text-[0.875rem] leading-snug text-ink-soft">
                <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        </Block>

        {cs.sections?.map((section) => (
          <Block key={section.heading} label={section.heading}>
            {section.body && (
              <p className="text-[0.9375rem] leading-relaxed text-ink-soft">{section.body}</p>
            )}
            {section.bullets && (
              <ul className="mt-2 space-y-1.5">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2.5 text-[0.875rem] text-ink-soft">
                    <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-faint" />
                    {b}
                  </li>
                ))}
              </ul>
            )}
          </Block>
        ))}

        <Block label="Outcome">
          <p className="text-[0.9375rem] leading-relaxed text-ink">{cs.outcome}</p>
          <p className="mt-3 text-[0.8125rem] leading-relaxed text-muted">
            Stated as scope and effect rather than a percentage. No performance-improvement figures
            are documented for this work, so none are claimed.
          </p>
        </Block>

        <Block label="Skills demonstrated">
          <ul className="flex flex-wrap gap-1.5">
            {cs.skills.map((skill) => (
              <li
                key={skill}
                className="rounded-md border border-line bg-surface px-2 py-1 text-[0.8125rem] text-ink-soft"
              >
                {skill}
              </li>
            ))}
          </ul>
        </Block>
      </div>

      <aside className="mt-12 rounded-xl border border-accent-line bg-accent-soft/50 p-5">
        <h2 className="text-[0.9375rem] font-semibold text-ink">Questions about this work?</h2>
        <p className="mt-1.5 text-[0.875rem] leading-relaxed text-ink-soft">
          Ask the portfolio assistant. It answers from this case study and the rest of my documented
          material, and shows you the sources.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <AskAbout question={`Tell me more about the ${cs.title} work at ${cs.company}.`}>
            Ask about this case study
          </AskAbout>
          <AskAbout
            question={`What skills did Zach demonstrate in the ${cs.title} work?`}
            variant="secondary"
          >
            What skills does it show?
          </AskAbout>
        </div>
      </aside>

      <nav aria-label="Other case studies" className="mt-12 border-t border-line pt-8">
        <h2 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-faint">
          More work
        </h2>
        <ul className="mt-3 space-y-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                href={`/work/${other.slug}`}
                className="group flex items-baseline justify-between gap-4 rounded-lg border border-line bg-surface px-4 py-3 hover:border-line-strong"
              >
                <span>
                  <span className="block text-[0.875rem] font-medium text-ink group-hover:text-accent">
                    {other.title}
                  </span>
                  <span className="block text-[0.75rem] text-muted">{other.company}</span>
                </span>
                <span aria-hidden className="text-muted transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </article>
  );
}
