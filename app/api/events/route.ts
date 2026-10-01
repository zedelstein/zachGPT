import { isEventName } from "@/lib/analytics/events";
import { recordEvent } from "@/lib/analytics/store";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Privacy-conscious event intake.
 *
 * Only the fields below are read off the request. The request's IP address and
 * user-agent header are never read, logged or stored.
 */
export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: unknown;
      sid?: unknown;
      device?: unknown;
      label?: unknown;
    };

    if (!isEventName(body.name) || typeof body.sid !== "string" || !body.sid) {
      return new Response(null, { status: 204 });
    }

    recordEvent({
      t: new Date().toISOString(),
      name: body.name,
      sid: body.sid,
      device: body.device === "mobile" || body.device === "desktop" ? body.device : "unknown",
      label: typeof body.label === "string" ? body.label : undefined,
    });
  } catch {
    // Never surface analytics failures to the visitor.
  }
  return new Response(null, { status: 204 });
}
