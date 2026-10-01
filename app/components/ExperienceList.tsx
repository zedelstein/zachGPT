import { roles } from "@/content/roles";

/**
 * Conventional resume-style experience list.
 *
 * Recent senior roles get full treatment; earlier positions stay deliberately
 * compact so the page emphasises where the career is now.
 */
export function ExperienceList() {
  const primary = roles.filter((r) => r.emphasis === "primary");
  const earlier = roles.filter((r) => r.emphasis === "secondary");

  return (
    <div className="space-y-10">
      <ol className="space-y-px overflow-hidden rounded-xl border border-line bg-line">
        {primary.map((role) => (
          <li key={role.id} id={`role-${role.id}`} className="scroll-mt-24 bg-surface p-5 lg:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="text-[1.0625rem] font-semibold tracking-tight text-ink">
                {role.company}
              </h3>
              <p className="text-[0.8125rem] text-muted tnum">{role.dates}</p>
            </div>
            <p className="mt-0.5 text-[0.9375rem] font-medium text-accent">{role.title}</p>
            <p className="mt-2.5 max-w-3xl text-[0.875rem] leading-relaxed text-ink-soft">
              {role.focus}
            </p>
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {role.tools.map((tool) => (
                <li
                  key={tool}
                  className="rounded border border-line bg-ground px-1.5 py-0.5 text-[0.6875rem] text-muted"
                >
                  {tool}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <div>
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-faint">
          Earlier analytics roles
        </h3>
        <ol className="mt-3 divide-y divide-line">
          {earlier.map((role) => (
            <li
              key={role.id}
              id={`role-${role.id}`}
              className="scroll-mt-24 py-3.5 sm:flex sm:items-baseline sm:gap-6"
            >
              <p className="w-28 shrink-0 text-[0.8125rem] text-muted tnum">{role.dates}</p>
              <div className="mt-0.5 min-w-0 sm:mt-0">
                <p className="text-[0.9375rem] font-medium text-ink">
                  {role.title}
                  <span className="text-muted">
                    {" · "}
                    {role.company}
                  </span>
                </p>
                <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted">{role.focus}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
