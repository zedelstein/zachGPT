import type { CaseStudy } from "@/content/types";

/**
 * Case-study system diagrams.
 *
 * These visualize scope and systems — the shape of the problem — rather than
 * invented business results. Server-rendered with no client JavaScript, so they
 * are indexable and cost nothing to load.
 */

function Chevron() {
  return (
    <span aria-hidden className="hidden shrink-0 text-line-strong sm:block">
      <svg viewBox="0 0 12 24" className="h-5 w-3" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m3 8 4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function DownChevron() {
  return (
    <span aria-hidden className="flex justify-center py-0.5 text-line-strong sm:hidden">
      <svg viewBox="0 0 24 12" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m8 3 4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Stage({
  label,
  detail,
  tone = "default",
  index,
}: {
  label: string;
  detail: string;
  tone?: "default" | "accent" | "data";
  index: number;
}) {
  const toneClass =
    tone === "accent"
      ? "border-accent-line bg-accent-soft"
      : tone === "data"
        ? "border-data/25 bg-data-soft"
        : "border-line bg-surface";

  return (
    <div className={`min-w-0 flex-1 rounded-lg border p-3 ${toneClass}`}>
      <p className="flex items-baseline gap-1.5">
        <span className="text-[0.625rem] font-semibold text-faint tnum">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span className="text-[0.8125rem] font-semibold leading-tight text-ink">{label}</span>
      </p>
      <p className="mt-1.5 text-[0.75rem] leading-snug text-muted">{detail}</p>
    </div>
  );
}

export function CaseDiagram({ diagram }: { diagram: CaseStudy["diagram"] }) {
  const { kind, caption, stages } = diagram;

  if (kind === "funnel") {
    return (
      <figure>
        <div className="space-y-1.5">
          {stages.map((stage, i) => (
            <div
              key={stage.label}
              className="mx-auto rounded-lg border border-data/25 bg-data-soft p-3"
              style={{ width: `${100 - i * 11}%` }}
            >
              <p className="flex items-baseline gap-1.5">
                <span className="text-[0.625rem] font-semibold text-data/60 tnum">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.8125rem] font-semibold text-ink">{stage.label}</span>
              </p>
              <p className="mt-1 text-[0.75rem] leading-snug text-ink-soft">{stage.detail}</p>
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-[0.75rem] leading-snug text-muted">{caption}</figcaption>
      </figure>
    );
  }

  if (kind === "grid") {
    return (
      <figure>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {stages.map((stage) => (
            <li key={stage.label} className="rounded-lg border border-line bg-surface p-3">
              <p className="text-[0.8125rem] font-semibold text-ink">{stage.label}</p>
              <p className="mt-1 text-[0.75rem] leading-snug text-muted">{stage.detail}</p>
            </li>
          ))}
        </ul>
        <figcaption className="mt-3 text-[0.75rem] leading-snug text-muted">{caption}</figcaption>
      </figure>
    );
  }

  if (kind === "fanin") {
    const [first, ...rest] = stages;
    return (
      <figure>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          {/* The "many independent sources" end of the diagram. */}
          <div className="relative min-w-0 sm:w-48 sm:shrink-0">
            <span
              aria-hidden
              className="absolute inset-x-2 -top-1 h-full rounded-lg border border-line bg-raised/70"
            />
            <span
              aria-hidden
              className="absolute inset-x-1 -top-0.5 h-full rounded-lg border border-line bg-raised"
            />
            <div className="relative rounded-lg border border-accent-line bg-accent-soft p-3">
              <p className="text-[0.8125rem] font-semibold leading-tight text-ink">{first.label}</p>
              <p className="mt-1.5 text-[0.75rem] leading-snug text-ink-soft">{first.detail}</p>
            </div>
          </div>
          <DownChevron />
          <Chevron />
          {rest.map((stage, i) => (
            <div key={stage.label} className="flex min-w-0 flex-1 flex-col gap-2 sm:flex-row sm:items-stretch">
              <Stage label={stage.label} detail={stage.detail} index={i + 1} tone={i === rest.length - 1 ? "data" : "default"} />
              {i < rest.length - 1 && (
                <>
                  <DownChevron />
                  <Chevron />
                </>
              )}
            </div>
          ))}
        </div>
        <figcaption className="mt-3 text-[0.75rem] leading-snug text-muted">{caption}</figcaption>
      </figure>
    );
  }

  // pipeline
  return (
    <figure>
      <div className="flex flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-1">
        {stages.map((stage, i) => (
          <div key={stage.label} className="flex min-w-0 flex-1 flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-1">
            <Stage
              label={stage.label}
              detail={stage.detail}
              index={i}
              tone={i === 0 ? "default" : i === stages.length - 1 ? "data" : i === 3 ? "accent" : "default"}
            />
            {i < stages.length - 1 && (
              <>
                <DownChevron />
                <Chevron />
              </>
            )}
          </div>
        ))}
      </div>
      <figcaption className="mt-3 text-[0.75rem] leading-snug text-muted">{caption}</figcaption>
    </figure>
  );
}
