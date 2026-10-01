/**
 * Text normalization shared by indexing and querying.
 *
 * The same pipeline must run on both sides or the scores are meaningless, so
 * everything lives in this one file.
 */

/** Multi-word terms collapsed to a single token before tokenization. */
const PHRASES: [RegExp, string][] = [
  [/\bpower\s*bi\b/g, "powerbi"],
  [/\bpower-bi\b/g, "powerbi"],
  [/\bpbi\b/g, "powerbi"],
  [/\blooker\s*studio\b/g, "lookerstudio"],
  [/\badobe\s+analytics\b/g, "adobeanalytics"],
  [/\bgoogle\s+analytics\s*4?\b/g, "ga4"],
  [/\bbig\s*query\b/g, "bigquery"],
  [/\bbusiness\s+intelligence\b/g, "businessintelligence bi"],
  [/\bdata\s+quality\b/g, "dataquality"],
  [/\bdata\s+governance\b/g, "datagovernance governance"],
  [/\bdata\s+qa\b/g, "dataqa qa"],
  [/\bdata\s+viz\b/g, "dataviz visualization"],
  [/\bdata\s+visuali[sz]ation\b/g, "visualization"],
  [/\ba\/b\s*test(?:ing|s)?\b/g, "abtest experimentation"],
  [/\bab\s*test(?:ing|s)?\b/g, "abtest experimentation"],
  [/\bkpis?\b/g, "kpi"],
  [/\bhigher\s+education\b/g, "highereducation education"],
  [/\bfinancial\s+services\b/g, "financialservices finance"],
  [/\breal\s+estate\b/g, "realestate"],
  [/\bm&a\b/g, "ma acquisition merger"],
  [/\bmarketing\s+mix\s+model(?:ing|s)?\b/g, "mmm marketing mix modeling"],
  [/\bmulti[-\s]?touch\b/g, "multitouch attribution"],
  [/\bmachine\s+learning\b/g, "ml machinelearning predictive"],
  [/\bgenerative\s+ai\b/g, "generativeai ai llm"],
  [/\bconversion\s+rate\s+optimi[sz]ation\b/g, "cro conversion optimization"],
];

/** Query-side only: broaden a term to the vocabulary the portfolio actually uses. */
const SYNONYMS: Record<string, string[]> = {
  bi: ["businessintelligence", "reporting", "dashboard"],
  businessintelligence: ["bi", "reporting", "dashboard"],
  viz: ["visualization", "dataviz", "chart"],
  visualisation: ["visualization"],
  chart: ["visualization", "dashboard"],
  dashboarding: ["dashboard"],
  dashboards: ["dashboard"],
  etl: ["transformation", "pipeline", "sql"],
  warehouse: ["redshift", "databricks", "snowflake", "bigquery", "platform"],
  warehousing: ["redshift", "databricks", "snowflake", "bigquery", "platform"],
  cloud: ["databricks", "snowflake", "bigquery", "redshift"],
  dataquality: ["qa", "validation", "reconciliation", "discrepancy", "accuracy"],
  quality: ["qa", "validation", "reconciliation"],
  governance: ["kpi", "taxonomy", "definition", "documentation", "standard"],
  pharma: ["pharmaceutical"],
  pharmaceutical: ["publicis", "healthcare"],
  health: ["healthcare"],
  patient: ["healthcare", "acquisition"],
  medical: ["healthcare"],
  manage: ["leadership", "manager", "team"],
  managing: ["leadership", "manager", "team"],
  managed: ["leadership", "manager", "team"],
  management: ["leadership", "manager", "team"],
  team: ["leadership", "manager", "analyst"],
  teams: ["leadership", "manager", "analyst"],
  lead: ["leadership", "director"],
  leader: ["leadership", "director"],
  leadership: ["manager", "director", "team"],
  experiment: ["experimentation", "abtest", "test"],
  experiments: ["experimentation", "abtest", "test"],
  testing: ["experimentation", "abtest"],
  seo: ["search", "digital", "organic"],
  metric: ["kpi", "definition"],
  metrics: ["kpi", "definition"],
  stakeholder: ["executive", "business", "reporting"],
  executive: ["stakeholder", "leadership", "reporting"],
  requirement: ["requirements", "gathering", "stakeholder"],
  query: ["sql"],
  querying: ["sql"],
  python: ["python"],
  migration: ["migrate", "databricks", "redshift", "ga4"],
  migrate: ["migration"],
  model: ["modeling", "transformation"],
  reconcile: ["reconciliation", "variance", "discrepancy"],
  discrepancies: ["discrepancy", "variance", "reconciliation"],
  media: ["ziffdavis", "digital", "brand"],
  brands: ["brand", "portfolio"],
  consulting: ["consultant", "stratega", "independent", "client"],
  independent: ["stratega", "consultant", "consulting"],
  stratega: ["consultant", "consulting", "independent"],
  mmm: ["marketing", "mix", "modeling", "attribution"],
  attribution: ["mmm", "attribution", "multitouch", "channel"],
  ml: ["machine", "learning", "predictive", "model", "python"],
  ai: ["generative", "llm", "gpt", "automation"],
  cro: ["conversion", "experimentation", "abtest", "optimization"],
  forecast: ["forecasting", "predictive", "model"],
  forecasting: ["predictive", "model", "python"],
  education: ["highereducation", "university", "student", "degree", "nyu"],
  school: ["education", "university", "degree", "college", "nyu"],
  college: ["education", "university", "degree"],
  degree: ["education", "university", "bachelor", "nyu"],
  study: ["education", "university", "degree"],
  studied: ["education", "university", "degree"],
  university: ["education", "nyu", "degree"],
  nyu: ["university", "education", "degree"],
  certification: ["certification", "credential", "education"],
  certifications: ["certification", "credential", "education"],
  certified: ["certification", "credential"],
  qualification: ["education", "degree", "certification"],
  energy: ["utilities", "exelon", "demand"],
  years: ["year", "experience"],
  strongest: ["strong", "experience", "documented"],
};

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "been", "but", "by", "can", "did", "do", "does",
  "for", "from", "had", "has", "have", "he", "her", "him", "his", "how", "i", "if", "in", "into",
  "is", "it", "its", "me", "my", "of", "on", "or", "that", "the", "their", "them", "there",
  "these", "they", "this", "to", "told", "us", "was", "we", "were", "what", "when", "where",
  "which", "who", "why", "will", "with", "you", "your", "about", "any", "some", "more", "most",
  "tell", "show", "give", "like", "much", "many", "zach", "zachary", "edelstein", "s",
  // Near-universal question words. Dropping these makes "how strong is his SQL
  // experience?" reduce to the one term that actually discriminates.
  "experience", "experienced", "strong", "strongest", "kind", "sort", "know", "knows",
  "use", "used", "uses", "using", "doing", "done", "really", "actually", "ever",
]);

/** Light suffix stripping. Crude on purpose — it only has to be consistent. */
function stem(token: string): string {
  if (token.length <= 3) return token;
  for (const suffix of ["ations", "ation", "ingly", "ing", "edly", "ies", "ed", "es", "s"]) {
    if (token.length - suffix.length >= 4 && token.endsWith(suffix)) {
      const base = token.slice(0, -suffix.length);
      if (suffix === "ies") return `${base}y`;
      return base;
    }
  }
  return token;
}

export function normalize(input: string): string {
  let text = input.toLowerCase();
  for (const [pattern, replacement] of PHRASES) {
    text = text.replace(pattern, replacement);
  }
  return text;
}

export function tokenize(input: string): string[] {
  return normalize(input)
    .split(/[^a-z0-9+#.]+/)
    .map((t) => t.replace(/^[.+]+|[.+]+$/g, ""))
    .filter((t) => t.length > 1 && !STOPWORDS.has(t))
    .map(stem)
    .filter(Boolean);
}

/** Query-side expansion. Returns weighted terms: originals at 1, synonyms discounted. */
export function expandQuery(query: string): Map<string, number> {
  const terms = new Map<string, number>();
  const base = tokenize(query);
  for (const token of base) {
    terms.set(token, Math.max(terms.get(token) ?? 0, 1));
  }
  // Synonyms are looked up on both the raw and stemmed form, since the synonym
  // table is written in natural spelling.
  for (const raw of normalize(query).split(/[^a-z0-9+#]+/)) {
    const candidates = SYNONYMS[raw] ?? SYNONYMS[stem(raw)];
    if (!candidates) continue;
    for (const syn of candidates) {
      const t = stem(syn);
      terms.set(t, Math.max(terms.get(t) ?? 0, 0.45));
    }
  }
  return terms;
}
