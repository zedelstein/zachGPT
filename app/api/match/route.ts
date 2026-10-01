import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, hasApiKey, isRefusal, MODEL, withRefusalFallback } from "@/lib/anthropic";
import { focusFrom, knowledgeBase, search } from "@/lib/kb/retrieve";
import { MATCH_RULES } from "@/lib/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_JD = 20000;

const Requirement = z.object({
  requirement: z.string().describe("The requirement as the job description states it, condensed to a short phrase."),
  evidence: z.string().describe("What Zach's portfolio documents for this, naming the company and role. One or two sentences."),
});

const GapRequirement = z.object({
  requirement: z.string().describe("The requirement as the job description states it, condensed to a short phrase."),
  note: z.string().describe("One short sentence on what the portfolio does and does not contain for this."),
});

const MatchSchema = z.object({
  roleTitle: z.string().describe("The job title from the description, or an empty string if none is stated."),
  summary: z.string().describe("One or two plain sentences on the shape of the overlap. No prediction of hiring success."),
  relevant: z.array(Requirement).describe("Requirements with direct supporting evidence in the portfolio."),
  related: z.array(Requirement).describe("Requirements with transferable or adjacent evidence only."),
  notDocumented: z.array(GapRequirement).describe("Requirements the portfolio has insufficient evidence for."),
});

export type MatchResult = z.infer<typeof MatchSchema>;

/**
 * The entire knowledge base, not a retrieved slice.
 *
 * "Not documented" is a claim about absence, and you cannot judge absence from
 * a top-k retrieval. At ~10k tokens the whole base fits comfortably, so the
 * model sees everything and the gap list is trustworthy.
 */
function fullKnowledgeBase(): string {
  return knowledgeBase()
    .map((chunk) => {
      const m = chunk.meta;
      const metaLine = [
        `type: ${chunk.type}`,
        m.company ? `company: ${m.company}` : "",
        m.industry ? `industry: ${m.industry}` : "",
        m.skills.length ? `skills: ${m.skills.join(", ")}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
      return `### ${chunk.title}\n(${metaLine})\n${chunk.body}`;
    })
    .join("\n\n");
}

export async function POST(request: Request) {
  let jobDescription = "";
  try {
    const body = (await request.json()) as { jobDescription?: string };
    jobDescription = (body.jobDescription ?? "").trim().slice(0, MAX_JD);
  } catch {
    return Response.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (jobDescription.length < 60) {
    return Response.json(
      { error: "Paste a bit more of the job description — at least a sentence or two of requirements." },
      { status: 400 },
    );
  }

  if (!hasApiKey()) {
    return Response.json(
      {
        error:
          "Job-description matching needs an ANTHROPIC_API_KEY to be configured on this deployment. The portfolio, case studies and skills evidence are all browsable without it.",
      },
      { status: 503 },
    );
  }

  try {
    const result = await withRefusalFallback(async (extra) =>
      anthropic().beta.messages.parse({
        model: MODEL,
        max_tokens: 8000,
        system: [
          { type: "text", text: MATCH_RULES, cache_control: { type: "ephemeral" } },
          { type: "text", text: `## ZACH'S COMPLETE PORTFOLIO KNOWLEDGE BASE\n\n${fullKnowledgeBase()}` },
        ],
        output_config: {
          format: zodOutputFormat(MatchSchema),
          // This is a real analysis task, not extraction — it decides what each
          // requirement means and resists the pull toward a flattering answer.
          effort: "high",
        },
        messages: [
          {
            role: "user",
            content: `Analyse this job description against Zach's documented portfolio.\n\n"""\n${jobDescription}\n"""`,
          },
        ],
        ...extra,
      }),
    );

    if (isRefusal(result.stop_reason) || !result.parsed_output) {
      return Response.json(
        { error: "I couldn't analyse that text. Try pasting the requirements section of the job description." },
        { status: 422 },
      );
    }

    // Highlighting is derived from retrieval over the job description, so the
    // timeline and technology map respond to the role without the model being
    // able to point at experience the evidence doesn't support.
    const focus = focusFrom(search(jobDescription, 12));

    return Response.json({ match: result.parsed_output, focus });
  } catch (error) {
    console.error("[match] request failed", error);
    return Response.json(
      { error: "Something went wrong analysing that job description. Please try again." },
      { status: 502 },
    );
  }
}
