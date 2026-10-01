import { assistant } from "@/content/profile";
import { anthropic, hasApiKey, isRefusal, MODEL, withRefusalFallback } from "@/lib/anthropic";
import { focusFrom, relevant, renderEvidence, search, toSources } from "@/lib/kb/retrieve";
import { chatSystemPrompt } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_TURNS = 12;
const MAX_QUESTION = 2000;

interface Turn {
  role: "user" | "assistant";
  content: string;
}

interface ChatRequest {
  messages: Turn[];
  jobDescription?: string;
}

function encodeLine(payload: unknown): Uint8Array {
  return new TextEncoder().encode(`${JSON.stringify(payload)}\n`);
}

/**
 * Retrieval-only answer, used when no API key is configured.
 *
 * It states plainly that the assistant is unavailable and shows the evidence the
 * retriever found, so the feature degrades into something honest and still
 * useful rather than an error dialog.
 */
function fallbackAnswer(question: string, evidenceCount: number): string {
  if (evidenceCount === 0) return assistant.insufficientEvidence;
  return [
    "The conversational assistant isn't configured on this deployment (no API key is set), so I can't write a synthesised answer.",
    `What I can do is show you the portfolio evidence that matches "${question.trim()}" — it's listed under Evidence below, and each source links to the section it came from.`,
  ].join("\n\n");
}

export async function POST(request: Request) {
  let body: ChatRequest;
  try {
    body = (await request.json()) as ChatRequest;
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const turns = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-MAX_TURNS)
    .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_QUESTION) }));

  const question = [...turns].reverse().find((m) => m.role === "user")?.content ?? "";
  if (!question.trim()) {
    return Response.json({ error: "No question supplied." }, { status: 400 });
  }

  // Retrieval uses the current question plus the previous one, so follow-ups
  // like "what about in healthcare?" keep the earlier subject in scope.
  const priorUser = turns.filter((m) => m.role === "user").at(-2)?.content ?? "";
  const retrievalQuery = `${priorUser} ${question}`.trim();

  const results = search(retrievalQuery, 10);
  const kept = relevant(results);
  const sources = toSources(results);
  const focus = focusFrom(results);

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      // Sources and the visualization highlight go first, so the UI can light
      // up the timeline and technology map while the text is still streaming.
      controller.enqueue(encodeLine({ type: "evidence", sources, focus }));

      if (!hasApiKey()) {
        controller.enqueue(encodeLine({ type: "delta", text: fallbackAnswer(question, kept.length) }));
        controller.enqueue(encodeLine({ type: "done", degraded: true }));
        controller.close();
        return;
      }

      try {
        const system = chatSystemPrompt(renderEvidence(results), body.jobDescription);

        await withRefusalFallback(async (extra) => {
          const message = anthropic().beta.messages.stream({
            model: MODEL,
            max_tokens: 2000,
            // The grounding rules are byte-stable across requests, so they sit
            // in front of the per-question evidence as a cacheable prefix.
            system: [{ type: "text", text: system, cache_control: { type: "ephemeral" } }],
            // Low effort: this is grounded extraction over a small evidence set,
            // and a recruiter is waiting for the first token.
            output_config: { effort: "low" },
            messages: turns,
            ...extra,
          });

          for await (const event of message) {
            if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
              controller.enqueue(encodeLine({ type: "delta", text: event.delta.text }));
            }
          }

          const final = await message.finalMessage();
          if (isRefusal(final.stop_reason)) {
            controller.enqueue(
              encodeLine({
                type: "delta",
                text: "\n\nI wasn't able to answer that one. Try rephrasing, or ask about a specific role, tool or case study.",
              }),
            );
          }
          return final;
        });

        controller.enqueue(encodeLine({ type: "done" }));
      } catch (error) {
        console.error("[chat] request failed", error);
        controller.enqueue(
          encodeLine({
            type: "error",
            message:
              "Something went wrong reaching the model. The portfolio evidence above is still accurate — every source links to the section it came from.",
          }),
        );
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Accel-Buffering": "no",
    },
  });
}
