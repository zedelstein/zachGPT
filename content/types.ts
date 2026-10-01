/**
 * Shared content types.
 *
 * Everything the site renders — and everything the portfolio assistant is
 * allowed to say — originates in `content/`. There is no second copy of the
 * resume for the AI layer: the knowledge base is compiled from these objects
 * (see `lib/kb/build.ts`), so the assistant can never drift from the page.
 */

export type CapabilityId =
  | "bi"
  | "dashboards"
  | "sql"
  | "dataviz"
  | "dataqa"
  | "kpi"
  | "reporting"
  | "marketing"
  | "healthcare"
  | "seo"
  | "experimentation"
  | "leadership";

export interface Capability {
  id: CapabilityId;
  label: string;
  blurb: string;
}

export interface Role {
  id: string;
  company: string;
  /** Compact label for narrow chart axes and table headers. */
  shortName: string;
  /** True when `company` is a placeholder awaiting confirmation. See content/REVIEW.md. */
  companyNeedsReview?: boolean;
  title: string;
  /** Human-readable range shown in the UI, e.g. "June 2025 – Present". */
  dates: string;
  /** Decimal years used for timeline geometry, e.g. 2025.42 for June 2025. */
  start: number;
  /** Decimal year, or null for the current role. */
  end: number | null;
  /** True when only the year is known and the range should be confirmed. */
  datesNeedReview?: boolean;
  industry: string;
  /** One-line summary used on the timeline and in the resume list. */
  focus: string;
  responsibilities: string[];
  tools: string[];
  capabilities: CapabilityId[];
  /** Slugs of case studies drawn from this role. */
  caseStudies: string[];
  /** Keep earlier roles compact so the site emphasises recent senior work. */
  emphasis: "primary" | "secondary";
}

export interface CaseStudySection {
  heading: string;
  body?: string;
  bullets?: string[];
}

export interface DiagramStage {
  label: string;
  detail: string;
}

export interface CaseStudy {
  slug: string;
  title: string;
  company: string;
  roleId: string;
  dates: string;
  industry: string;
  /** One sentence for the card. */
  summary: string;
  context: string;
  problem: string;
  environment: string[];
  approach: string;
  approachBullets: string[];
  sections?: CaseStudySection[];
  outcome: string;
  skills: string[];
  /** A systems-and-scope diagram, not invented business results. */
  diagram: {
    kind: "pipeline" | "fanin" | "funnel" | "grid";
    caption: string;
    stages: DiagramStage[];
  };
}

export type EvidenceTier = "documented" | "listed";

export interface Technology {
  name: string;
  /** "documented" = tied to specific roles. "listed" = in the skills inventory only. */
  tier: EvidenceTier;
  /** Role ids where the portfolio documents use of this technology. */
  roleIds: string[];
  caseStudies: string[];
  /** Shown verbatim when evidence is thin, so the site never over-claims. */
  note?: string;
}

export interface TechGroup {
  id: string;
  label: string;
  blurb: string;
  items: Technology[];
}

export interface WorkSample {
  id: string;
  title: string;
  category: string;
  kind:
    | "dashboard"
    | "diagram"
    | "framework"
    | "workflow"
    | "sql"
    | "architecture"
    | "before-after";
  summary: string;
  detail: string;
  /** Every sample is a recreation; this label is rendered on each item. */
  recreated: true;
  roleIds: string[];
  skills: string[];
  /** Optional sanitized code/table body rendered in a <pre>. */
  code?: string;
}

export interface Stat {
  value: string;
  label: string;
  detail?: string;
}
