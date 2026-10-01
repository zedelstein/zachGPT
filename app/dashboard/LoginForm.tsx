"use client";

import { useActionState } from "react";
import { login } from "./actions";

export function LoginForm() {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <form action={formAction} className="w-full max-w-sm rounded-xl border border-line bg-surface p-6">
      <h1 className="text-lg font-semibold text-ink">Owner dashboard</h1>
      <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
        Aggregate engagement for this portfolio. Private.
      </p>

      <label htmlFor="password" className="mt-5 block text-[0.8125rem] font-medium text-ink">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
        className="mt-1.5 w-full rounded-lg border border-line bg-ground px-3 py-2.5 text-[0.875rem] text-ink focus-visible:border-accent-line"
      />

      {error && (
        <p className="mt-3 rounded-md border border-flag/30 bg-flag-soft px-3 py-2 text-[0.8125rem] text-ink-soft">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-ink disabled:opacity-50"
      >
        {pending ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
