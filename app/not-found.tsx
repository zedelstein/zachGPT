import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60dvh] max-w-xl flex-col justify-center px-5 py-16 lg:px-8">
      <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-accent">404</p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-ink">
        That page doesn&apos;t exist
      </h1>
      <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">
        The link may be out of date. The portfolio, case studies and resume are all reachable from
        the home page.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href="/"
          className="rounded-lg bg-accent px-4 py-2.5 text-[0.875rem] font-medium text-white hover:bg-ink"
        >
          Back to the portfolio
        </Link>
        <Link
          href="/resume"
          className="rounded-lg border border-line-strong bg-surface px-4 py-2.5 text-[0.875rem] font-medium text-ink hover:border-ink"
        >
          View the resume
        </Link>
      </div>
    </div>
  );
}
