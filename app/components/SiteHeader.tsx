"use client";

import Link from "next/link";
import { nav, profile } from "@/content/profile";
import { AskButton } from "./AskButton";

/**
 * Dark chrome over light, data-dense content — the contrast that makes the
 * colour-coded charts below read as the page's subject rather than as styling.
 */
export function SiteHeader() {
  return (
    <header
      className="no-print sticky top-0 z-30 border-b"
      style={{ background: "var(--color-nav)", borderColor: "var(--color-nav-line)" }}
    >
      <div
        className="mx-auto flex max-w-6xl items-center gap-4 px-5 lg:px-8"
        style={{ height: "var(--nav-height)" }}
      >
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span
            aria-hidden
            className="flex h-6 w-6 items-center justify-center rounded-[5px] text-[0.75rem] font-bold text-white"
            style={{ background: "var(--color-hot)" }}
          >
            Z
          </span>
          <span className="text-[0.9375rem] font-semibold tracking-tight text-white">
            zach
            <span style={{ color: "var(--color-warm)" }}>GPT</span>
          </span>
          <span
            className="label hidden border-l pl-2.5 lg:inline"
            style={{ color: "var(--color-nav-text)", borderColor: "var(--color-nav-line)" }}
          >
            {profile.name}
          </span>
        </Link>

        <nav aria-label="Primary" className="ml-auto hidden items-center gap-0.5 md:flex">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md px-3 py-2 text-[0.8125rem] font-medium transition-colors hover:bg-white/10 hover:text-white"
              style={{ color: "var(--color-nav-text)" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-3">
          <AskButton variant="nav">Ask my portfolio</AskButton>

          {/* No-JavaScript mobile menu. */}
          <details className="relative md:hidden">
            <summary
              aria-label="Menu"
              className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border text-white [&::-webkit-details-marker]:hidden"
              style={{ borderColor: "var(--color-nav-line)", background: "var(--color-nav-soft)" }}
            >
              <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" strokeLinecap="round" />
              </svg>
            </summary>
            <nav
              aria-label="Primary mobile"
              className="absolute right-0 top-11 w-44 overflow-hidden rounded-lg border border-line bg-surface py-1 shadow-lg shadow-ink/20"
            >
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block px-3.5 py-2.5 text-sm text-ink-soft hover:bg-raised hover:text-ink"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </header>
  );
}
