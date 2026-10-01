import type { CapabilityId } from "@/content/types";
import { knowledgeBase } from "./build";
import { expandQuery, tokenize } from "./text";
import type { Chunk, FocusPayload, ScoredChunk, Source } from "./types";

const K1 = 1.4;
const B = 0.72;

/** Chunk types nudged up slightly — these answer "what has he actually done" questions. */
const TYPE_PRIOR: Record<string, number> = {
  case_study: 1.12,
  role: 1.1,
  technology: 1.06,
  work_sample: 1.0,
  discipline: 1.0,
  capability: 0.98,
  bio: 0.96,
  numbers: 0.78,
  method: 0.92,
  targets: 0.9,
};

interface Index {
  chunks: Chunk[];
  /** term -> chunk index -> term frequency */
  postings: Map<string, Map<number, number>>;
  lengths: number[];
  avgLength: number;
  /** Per-chunk set of tokens appearing in high-signal metadata fields. */
  metaTokens: Set<string>[];
}

function buildIndex(): Index {
  const chunks = knowledgeBase();
  const postings = new Map<string, Map<number, number>>();
  const lengths: number[] = [];
  const metaTokens: Set<string>[] = [];

  chunks.forEach((chunk, i) => {
    // The title and metadata are repeated into the indexed text so that a query
    // matching a company, technology or capability name scores strongly.
    const metaText = [
      chunk.meta.company ?? "",
      chunk.meta.industry ?? "",
      chunk.meta.topic ?? "",
      chunk.meta.skills.join(" "),
      chunk.meta.technologies.join(" "),
      chunk.meta.capabilities.join(" "),
    ].join(" ");

    const tokens = [
      ...tokenize(chunk.title),
      ...tokenize(chunk.title),
      ...tokenize(metaText),
      ...tokenize(chunk.body),
    ];

    lengths.push(tokens.length);
    metaTokens.push(new Set([...tokenize(chunk.title), ...tokenize(metaText)]));

    for (const token of tokens) {
      let bucket = postings.get(token);
      if (!bucket) {
        bucket = new Map();
        postings.set(token, bucket);
      }
      bucket.set(i, (bucket.get(i) ?? 0) + 1);
    }
  });

  const avgLength = lengths.reduce((a, b) => a + b, 0) / Math.max(lengths.length, 1);
  return { chunks, postings, lengths, avgLength, metaTokens };
}

let index: Index | null = null;
function getIndex(): Index {
  if (!index) index = buildIndex();
  return index;
}

/** BM25 with query-term weighting, a metadata-match bonus and a small type prior. */
export function search(query: string, limit = 8): ScoredChunk[] {
  const idx = getIndex();
  const terms = expandQuery(query);
  if (terms.size === 0) return [];

  const N = idx.chunks.length;
  const scores = new Map<number, number>();

  for (const [term, weight] of terms) {
    const bucket = idx.postings.get(term);
    if (!bucket) continue;
    const df = bucket.size;
    const idf = Math.log(1 + (N - df + 0.5) / (df + 0.5));

    for (const [docId, tf] of bucket) {
      const len = idx.lengths[docId] || 1;
      const norm = tf * (K1 + 1) / (tf + K1 * (1 - B + B * (len / idx.avgLength)));
      let contribution = idf * norm * weight;
      // A query term that names the company, technology or capability itself is
      // worth more than the same term buried in prose.
      if (idx.metaTokens[docId].has(term)) contribution *= 1.35;
      scores.set(docId, (scores.get(docId) ?? 0) + contribution);
    }
  }

  const ranked: ScoredChunk[] = [...scores.entries()]
    .map(([docId, score]) => ({
      chunk: idx.chunks[docId],
      score: score * (TYPE_PRIOR[idx.chunks[docId].type] ?? 1),
    }))
    .sort((a, b) => b.score - a.score);

  // Keep at most two chunks per case study so one case study can't crowd out
  // everything else for a broad question.
  const perCase = new Map<string, number>();
  const diversified: ScoredChunk[] = [];
  for (const item of ranked) {
    const slug = item.chunk.meta.caseStudies[0];
    if (item.chunk.type === "case_study" && slug) {
      const seen = perCase.get(slug) ?? 0;
      if (seen >= 2) continue;
      perCase.set(slug, seen + 1);
    }
    diversified.push(item);
    if (diversified.length >= limit) break;
  }

  return diversified;
}

/** Below this fraction of the top score, a chunk is treated as noise. */
const RELEVANCE_FLOOR = 0.28;

export function relevant(results: ScoredChunk[]): ScoredChunk[] {
  if (results.length === 0) return [];
  const top = results[0].score;
  return results.filter((r) => r.score >= top * RELEVANCE_FLOOR);
}

/**
 * The highlight payload for the portfolio visualizations.
 *
 * Built by unioning metadata from the retrieved evidence, so the timeline can
 * only ever highlight roles the retrieved evidence actually references.
 */
export function focusFrom(results: ScoredChunk[]): FocusPayload {
  const ranked = relevant(results);
  const strong = ranked.slice(0, 6);
  // Naming a technology in the UI is a stronger claim than listing a chunk as
  // evidence, so it takes a higher bar. Without this, asking about Power BI
  // also highlighted Looker, whose entry mentions Power BI as the transferable
  // alternative.
  const techFloor = (ranked[0]?.score ?? 0) * 0.55;
  const roleIds = new Set<string>();
  const caseStudies = new Set<string>();
  const technologies = new Set<string>();
  const capabilities = new Set<CapabilityId>();

  for (const { chunk } of strong) {
    chunk.meta.roleIds.forEach((r) => roleIds.add(r));
    chunk.meta.caseStudies.forEach((c) => caseStudies.add(c));
    // Only name a technology when the chunk is specifically about that one. A
    // role or bio chunk lists everything it touched, which would light up the
    // entire technology map and tell the reader nothing.
    if (chunk.type === "technology") {
      const score = ranked.find((r) => r.chunk.id === chunk.id)?.score ?? 0;
      if (score >= techFloor) chunk.meta.technologies.forEach((t) => technologies.add(t));
    }
    // Same reasoning for capabilities: take them from chunks whose subject is a
    // capability, not from role chunks that enumerate all nine of theirs.
    if (chunk.type === "capability" || chunk.type === "method") {
      chunk.meta.capabilities.forEach((c) => capabilities.add(c));
    }
  }

  return {
    roleIds: [...roleIds],
    caseStudies: [...caseStudies],
    technologies: [...technologies],
    capabilities: [...capabilities].slice(0, 6),
  };
}

export function toSources(results: ScoredChunk[]): Source[] {
  const seen = new Set<string>();
  const sources: Source[] = [];
  for (const { chunk } of relevant(results)) {
    // De-duplicate by display title so three chunks of one case study show once.
    const key = `${chunk.type}:${chunk.title}`;
    if (seen.has(key)) continue;
    seen.add(key);
    sources.push({
      id: chunk.id,
      type: chunk.type,
      title: chunk.title,
      href: chunk.href,
      excerpt: chunk.body.replace(/\s+/g, " ").slice(0, 280).trim(),
    });
  }
  return sources.slice(0, 6);
}

/** The evidence block injected into the system prompt. */
export function renderEvidence(results: ScoredChunk[]): string {
  return relevant(results)
    .map((r, i) => {
      const m = r.chunk.meta;
      const metaLine = [
        `type: ${r.chunk.type}`,
        m.company ? `company: ${m.company}` : "",
        m.industry ? `industry: ${m.industry}` : "",
        m.skills.length ? `skills: ${m.skills.join(", ")}` : "",
        m.topic ? `topic: ${m.topic}` : "",
      ]
        .filter(Boolean)
        .join(" | ");
      return `[S${i + 1}] ${r.chunk.title}\n(${metaLine})\n${r.chunk.body}`;
    })
    .join("\n\n---\n\n");
}

export { knowledgeBase };
