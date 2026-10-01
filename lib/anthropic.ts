import Anthropic from "@anthropic-ai/sdk";

/** The portfolio assistant runs on Claude Opus 5. */
export const MODEL = "claude-opus-5";

/**
 * Server-side refusal fallback. Routes by refusal category so there is no model
 * list to maintain. If the account doesn't have the beta, the request is retried
 * once without it (see `withRefusalFallback`).
 */
export const FALLBACK_BETA = "server-side-fallback-2026-07-01" as const;

/**
 * Extra params merged into a request. `fallbacks` exists only on the beta
 * Messages API, which is why both routes call `client.beta.messages.*`.
 */
export interface FallbackExtra {
  betas?: (typeof FALLBACK_BETA)[];
  fallbacks?: "default";
}

let client: Anthropic | null = null;

export function hasApiKey(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY?.trim());
}

export function anthropic(): Anthropic {
  if (!client) client = new Anthropic();
  return client;
}

/**
 * Run a request with server-side refusal fallbacks, retrying once without them
 * if the API rejects the beta. Keeps the site working on accounts that don't
 * have the flag enabled rather than failing the whole request.
 */
export async function withRefusalFallback<T>(
  run: (extra: FallbackExtra) => Promise<T>,
): Promise<T> {
  try {
    return await run({ betas: [FALLBACK_BETA], fallbacks: "default" });
  } catch (error) {
    const status = (error as { status?: number }).status;
    if (status === 400 || status === 404) return await run({});
    throw error;
  }
}

/** True when the model declined the request rather than answering it. */
export function isRefusal(stopReason: string | null | undefined): boolean {
  return stopReason === "refusal";
}
