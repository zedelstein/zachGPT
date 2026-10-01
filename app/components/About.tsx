import { about, profile } from "@/content/profile";
import { AskButton } from "./AskButton";

export function About() {
  return (
    <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
      <div className="max-w-2xl space-y-4">
        {about.paragraphs.map((paragraph, i) => (
          <p
            key={paragraph}
            className={
              i === 0
                ? "text-[1.0625rem] leading-relaxed text-ink"
                : "text-[0.9375rem] leading-relaxed text-ink-soft"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>

      <aside className="rounded-xl border border-line bg-surface p-5">
        <h3 className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-faint">
          Roles I&apos;m targeting
        </h3>
        <ul className="mt-3 space-y-1.5">
          {profile.targetRoles.map((role) => (
            <li key={role} className="text-[0.875rem] text-ink-soft">
              {role}
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-line pt-4">
          <p className="text-[0.8125rem] leading-relaxed text-muted">
            Hiring for one of these? Paste the job description and get three honest lists — direct
            evidence, adjacent evidence, and what my portfolio doesn&apos;t document.
          </p>
          <AskButton variant="ghost" mode="match" className="mt-2.5 block">
            Compare my experience to your role →
          </AskButton>
        </div>
      </aside>
    </div>
  );
}
