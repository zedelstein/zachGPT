/**
 * Generate a personalised interview page config from a job description.
 *
 *   npm run interview:new -- path/to/job-description.txt acme-health
 *
 * Prints a config block to paste into content/interviews.ts. The output is
 * reviewed by a human before it ships, which is why the interview pages
 * themselves are static: a recruiter never waits on a model call, and nothing
 * unreviewed reaches their screen.
 *
 * Requires ANTHROPIC_API_KEY.
 */
import fs from "node:fs";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { anthropic, hasApiKey, MODEL } from "@/lib/anthropic";
import { knowledgeBase } from "@/lib/kb/build";
import { INTERVIEW_RULES } from "@/lib/prompts";

const Overlap = z.object({
  area: z.string().describe("Short label a recruiter would recognise, e.g. 'Power BI' or 'Data Quality'."),
  evidence: z.string().describe("One or two sentences on what the portfolio documents, naming the company or role."),
  tier: z.enum(["documented", "transferable"]),
});

const Schema = z.object({
  company: z.string().describe("The hiring company's name, or an empty string if not stated."),
  roleTitle: z.string().describe("The job title as stated."),
  overlaps: z.array(Overlap).describe("Four to six grounded overlap areas, strongest first."),
});

const [, , file, slugArg] = process.argv;

if (!file) {
  console.error("Usage: npm run interview:new -- <job-description-file> [slug]");
  process.exit(1);
}
if (!hasApiKey()) {
  console.error("ANTHROPIC_API_KEY is not set.");
  process.exit(1);
}

const jobDescription = fs.readFileSync(file, "utf8").trim();
if (jobDescription.length < 60) {
  console.error("That file doesn't contain enough text to analyse.");
  process.exit(1);
}

const kb = knowledgeBase()
  .map((c) => `### ${c.title}\n${c.body}`)
  .join("\n\n");

const response = await anthropic().messages.parse({
  model: MODEL,
  max_tokens: 4000,
  system: [
    { type: "text", text: INTERVIEW_RULES },
    { type: "text", text: `## KNOWLEDGE BASE\n\n${kb}` },
  ],
  output_config: { format: zodOutputFormat(Schema), effort: "high" },
  messages: [{ role: "user", content: `Job description:\n\n"""\n${jobDescription}\n"""` }],
});

const result = response.parsed_output;
if (!result) {
  console.error("The model did not return a usable result.");
  process.exit(1);
}

const slug =
  slugArg ??
  (result.company || "company")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const esc = (s: string) => s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
const context = jobDescription.replace(/\s+/g, " ").slice(0, 600);

console.log(`
Review every line before committing — this is generated output.
Paste into the \`interviews\` array in content/interviews.ts:

  {
    slug: "${slug}",
    company: "${esc(result.company || slug)}",
    roleTitle: "${esc(result.roleTitle)}",
    roleContext:
      "${esc(context)}",
    overlaps: [
${result.overlaps
  .map(
    (o) => `      {
        area: "${esc(o.area)}",
        evidence:
          "${esc(o.evidence)}",
        tier: "${o.tier}",
      },`,
  )
  .join("\n")}
    ],
  },

Then visit /interview/${slug}
`);
