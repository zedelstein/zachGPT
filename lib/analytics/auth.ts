import { createHash, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const OWNER_COOKIE = "zgpt_owner";

function digest(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

function constantTimeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function dashboardPassword(): string | null {
  const value = process.env.OWNER_DASHBOARD_PASSWORD?.trim();
  return value ? value : null;
}

/** Token stored in the cookie. Never the password itself. */
export function tokenFor(password: string): string {
  return digest(`zachgpt:${password}`);
}

export async function isOwner(): Promise<boolean> {
  const password = dashboardPassword();
  // With no password configured the dashboard is open — intended for local dev.
  // Set OWNER_DASHBOARD_PASSWORD before deploying anywhere public.
  if (!password) return true;
  const cookie = (await cookies()).get(OWNER_COOKIE)?.value;
  if (!cookie) return false;
  return constantTimeEqual(cookie, tokenFor(password));
}

export function checkPassword(candidate: string): boolean {
  const password = dashboardPassword();
  if (!password) return true;
  return constantTimeEqual(digest(candidate), digest(password));
}
