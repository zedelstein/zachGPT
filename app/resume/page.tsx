import type { Metadata } from "next";
import Link from "next/link";
import { about, capabilityById, education, profile, roles, techGroups } from "@/content";
import { AskButton } from "@/app/components/AskButton";
import { PrintButton } from "@/app/components/PrintButton";

export const metadata: Metadata = {
  title: "Resume",
  description: `Resume for ${profile.name} — ${profile.discipline}.`,
};

export default function ResumePage() {
  const documented = techGroups.flatMap((g) =>
    g.items.filter((i) => i.tier === "documented").map((i) => i.name),
  );
  const listed = techGroups.flatMap((g) =>
    g.items.filter((i) => i.tier === "listed").map((i) => i.name),
  );

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 lg:px-8 lg:py-16">
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="text-[0.8125rem] font-medium text-muted hover:text-accent">
          ← Back to portfolio
        </Link>
        <div className="flex flex-wrap gap-2">
          <PrintButton />
          <AskButton variant="nav">Ask my portfolio</AskButton>
        </div>
      </div>

      <article className="rounded-xl border border-line bg-surface p-7 lg:p-10 print:rounded-none print:border-0 print:p-0">
        <header className="border-b border-line pb-5">
          <h1 className="text-[1.875rem] font-semibold tracking-tight text-ink">{profile.name}</h1>
          <p className="mt-1 text-[0.9375rem] font-medium text-accent">{profile.discipline}</p>
          <p className="mt-2 text-[0.8125rem] text-muted">
            <a href={`mailto:${profile.email}`} className="hover:text-accent">
              {profile.email}
            </a>
            <span className="mx-2 text-faint">·</span>
            {profile.location}
          </p>
        </header>

        <section className="border-b border-line py-5">
          <h2 className="label text-faint">
            Summary
          </h2>
          <p className="mt-2.5 text-[0.875rem leading-relaxed] text-ink-soft">
            {about.paragraphs[0]} {about.paragraphs[1]}
          </p>
        </section>

        <section className="border-b border-line py-5">
          <h2 className="label text-faint">
            Experience
          </h2>
          <ol className="mt-3 space-y-5">
            {roles.map((role) => (
              <li key={role.id} className="break-inside-avoid">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                  <h3 className="text-[0.9375rem] font-semibold text-ink">
                    {role.company}
                  </h3>
                  <p className="text-[0.8125rem] text-muted tnum">{role.dates}</p>
                </div>
                <p className="text-[0.875rem] font-medium text-accent">{role.title}</p>
                <p className="mt-1 text-[0.8125rem] text-faint">
                  {role.location} · {role.industry}
                </p>
                {role.emphasis === "primary" ? (
                  <ul className="mt-2 space-y-1">
                    {role.responsibilities.map((item) => (
                      <li
                        key={item}
                        className="flex gap-2 text-[0.8125rem] leading-snug text-ink-soft"
                      >
                        <span aria-hidden className="mt-[0.5em] h-1 w-1 shrink-0 rounded-full bg-faint" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-soft">{role.focus}</p>
                )}
              </li>
            ))}
          </ol>
        </section>

        <section className="border-b border-line py-5">
          <h2 className="label text-faint">
            Technical skills
          </h2>
          <dl className="mt-3 space-y-2.5">
            <div className="sm:flex sm:gap-4">
              <dt className="w-44 shrink-0 text-[0.8125rem] font-medium text-ink">
                Documented in roles
              </dt>
              <dd className="text-[0.8125rem] leading-relaxed text-ink-soft">
                {documented.join(" · ")}
              </dd>
            </div>
            <div className="sm:flex sm:gap-4">
              <dt className="w-44 shrink-0 text-[0.8125rem] font-medium text-ink">
                Also in skills inventory
              </dt>
              <dd className="text-[0.8125rem] leading-relaxed text-muted">{listed.join(" · ")}</dd>
            </div>
            <div className="sm:flex sm:gap-4">
              <dt className="w-44 shrink-0 text-[0.8125rem] font-medium text-ink">Capabilities</dt>
              <dd className="text-[0.8125rem] leading-relaxed text-ink-soft">
                {[...new Set(roles.flatMap((r) => r.capabilities))]
                  .map((id) => capabilityById.get(id)?.label)
                  .filter(Boolean)
                  .join(" · ")}
              </dd>
            </div>
          </dl>
        </section>

        <section className="border-b border-line py-5">
          <h2 className="label text-faint">Education & certifications</h2>
          <ul className="mt-2.5 space-y-1.5">
            {education.map((item) => (
              <li key={item.institution} className="flex flex-wrap items-baseline gap-x-2">
                <span className="text-[0.875rem] font-semibold text-ink">{item.institution}</span>
                <span className="text-[0.8125rem] text-ink-soft">{item.credential}</span>
                {item.year && <span className="stat text-[0.8125rem] text-muted">{item.year}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="py-5">
          <h2 className="label text-faint">
            Target roles
          </h2>
          <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-soft">
            {profile.targetRoles.join(" · ")}
          </p>
        </section>
      </article>

      <p className="no-print mt-5 text-[0.75rem] leading-relaxed text-faint">
        This page is generated from the same structured content as the rest of the site and the
        portfolio assistant, so the resume, the case studies and the assistant&apos;s answers cannot
        drift out of sync.
      </p>
    </div>
  );
}
