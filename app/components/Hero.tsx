import Link from "next/link";
import { profile, summaryStrip } from "@/content/profile";
import { TONES } from "@/lib/theme";
import { AskButton } from "./AskButton";

const STRIP_TONES = [TONES.red, TONES.orange, TONES.purple, TONES.teal];

export function Hero() {
  return (
    <div className="relative overflow-hidden">
      {/* Faint grid, the way a chart ground reads behind a scatter plot. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, #000 30%, transparent 75%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-14 pt-14 lg:px-8 lg:pb-16 lg:pt-20">
        <div className="max-w-3xl">
          <p className="rise label flex flex-wrap items-center gap-2 font-semibold">
            <span
              className="rounded-[4px] px-1.5 py-1 text-white"
              style={{ background: "var(--color-hot)" }}
            >
              Analytics
            </span>
            <span
              className="rounded-[4px] px-1.5 py-1 text-white"
              style={{ background: "var(--color-purple)" }}
            >
              Business Intelligence
            </span>
            <span
              className="rounded-[4px] px-1.5 py-1 text-white"
              style={{ background: "var(--color-teal)" }}
            >
              Data Governance
            </span>
          </p>

          <h1
            className="rise mt-5 text-[2.5rem] font-bold leading-[1.02] tracking-[-0.035em] text-ink sm:text-[3.25rem] lg:text-[3.75rem]"
            style={{ animationDelay: "60ms" }}
          >
            {profile.name}
          </h1>

          <p
            className="rise mt-5 max-w-2xl text-xl leading-snug text-ink-soft sm:text-[1.4rem]"
            style={{ animationDelay: "120ms" }}
          >
            {profile.headline}
          </p>
          <p
            className="rise mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-muted"
            style={{ animationDelay: "180ms" }}
          >
            {profile.subhead}
          </p>

          <div
            className="rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <AskButton variant="primary">Ask my portfolio</AskButton>
            <Link
              href="/#work"
              className="rounded-lg border border-line-strong bg-surface px-5 py-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
            >
              View my work
            </Link>
            <Link
              href="/resume"
              className="px-1 text-sm font-medium text-accent underline decoration-accent-line decoration-1 underline-offset-4 hover:decoration-accent"
            >
              View resume
            </Link>
          </div>
        </div>

        {/* Summary strip — scoreboard tiles. */}
        <dl
          className="rise mt-14 grid grid-cols-2 gap-2 sm:grid-cols-4"
          style={{ animationDelay: "300ms" }}
        >
          {summaryStrip.map((stat, i) => {
            const tone = STRIP_TONES[i % STRIP_TONES.length];
            return (
              <div
                key={stat.label}
                className="group relative overflow-hidden rounded-xl border border-line bg-surface px-4 pb-4 pt-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: tone.solid }}
                />
                <dd
                  className={`stat font-bold text-ink ${
                    stat.value.length > 12 ? "text-[0.9375rem] leading-snug" : "text-xl"
                  }`}
                >
                  {stat.value}
                </dd>
                <dt className="label mt-1.5 text-muted">{stat.label}</dt>
              </div>
            );
          })}
        </dl>
      </div>
    </div>
  );
}
