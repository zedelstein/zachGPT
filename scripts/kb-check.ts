/**
 * Retrieval smoke test.
 *
 * Run: npm run kb:check
 * Prints, for each probe question, the evidence the retriever selects and the
 * highlight payload the visualizations would receive. Use this when tuning the
 * synonym table in lib/kb/text.ts — if the right chunk isn't in the top few,
 * the assistant will not have it either.
 */
import { knowledgeBase } from "@/lib/kb/build";
import { focusFrom, relevant, search } from "@/lib/kb/retrieve";
import { assistant } from "@/content/profile";

const probes = [
  ...assistant.suggestedQuestions,
  "Does he know Looker?",
  "Where has Zach used Tableau?",
  "Has he worked with Snowflake or BigQuery?",
  "What is his experience with reconciliation and discrepancies?",
  "Does he have experience with Adobe Analytics?",
  "Has he done marketing mix modeling?",
  "What AI work has Zach done?",
  "Tell me about his experimentation and CRO experience.",
  "Where did he go to school?",
  "What did he do at Universal Health Services?",
  "What's his favourite restaurant?",
];

const kb = knowledgeBase();
console.log(`Knowledge base: ${kb.length} chunks\n`);

for (const q of probes) {
  const results = search(q, 8);
  const kept = relevant(results);
  const focus = focusFrom(results);
  console.log(`Q: ${q}`);
  if (kept.length === 0) {
    console.log("   (no evidence above the relevance floor)\n");
    continue;
  }
  for (const r of kept.slice(0, 4)) {
    console.log(`   ${r.score.toFixed(2).padStart(6)}  ${r.chunk.title}`);
  }
  console.log(
    `   highlight -> roles=[${focus.roleIds.join(",")}] tech=[${focus.technologies.join(",")}] caps=[${focus.capabilities.join(",")}]`,
  );
  console.log();
}
