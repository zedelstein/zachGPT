import Link from "next/link";
import { nav, profile } from "@/content/profile";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-5 py-12 lg:px-8">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <p className="flex items-center gap-2 text-sm font-semibold text-ink">
              <span
                aria-hidden
                className="flex h-5 w-5 items-center justify-center rounded-[4px] text-[0.625rem] font-bold text-white"
                style={{ background: "var(--color-hot)" }}
              >
                Z
              </span>
              zach<span style={{ color: "var(--color-warm)" }}>GPT</span>
              <span className="font-normal text-muted">· {profile.name}</span>
            </p>
            <p className="mt-1 text-[0.8125rem] leading-relaxed text-muted">{profile.discipline}</p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-3 inline-block text-[0.8125rem] font-medium text-accent hover:underline"
            >
              {profile.email}
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-1.5 sm:flex sm:gap-6">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[0.8125rem] text-ink-soft hover:text-accent"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-10 border-t border-line pt-6">
          <p className="text-[0.75rem] leading-relaxed text-faint">
            Work samples on this site are portfolio recreations built with sample data. No client
            dashboards, proprietary metrics, patient information or confidential business figures are
            published here. The portfolio assistant answers only from documented portfolio material
            and says so when the evidence isn&apos;t there.
          </p>
        </div>
      </div>
    </footer>
  );
}
