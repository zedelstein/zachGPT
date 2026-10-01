/**
 * Personalised interview pages, served at /interview/[company].
 *
 * Each entry is curated — written once from a real job description and then
 * committed — so the page is server-rendered, instant, indexable and cannot
 * hallucinate on a recruiter's screen. To produce a new entry from a job
 * description, run:
 *
 *     npm run interview:new -- path/to/job-description.txt acme
 *
 * which calls the model with the same grounding rules as the assistant and
 * prints a ready-to-paste config block. Review it, then add it here.
 */
export interface InterviewOverlap {
  area: string;
  evidence: string;
  /** "documented" = tied to specific roles. "transferable" = adjacent evidence. */
  tier: "documented" | "transferable";
}

export interface InterviewConfig {
  slug: string;
  company: string;
  roleTitle: string;
  /** Marks a page that exists to demonstrate the format rather than a live role. */
  demo?: boolean;
  overlaps: InterviewOverlap[];
  /** Primes the assistant so follow-up questions are answered in the role's context. */
  roleContext?: string;
}

export const interviews: InterviewConfig[] = [
  {
    slug: "example",
    company: "Example Health Systems",
    roleTitle: "Senior Business Intelligence Analyst",
    demo: true,
    roleContext:
      "Senior Business Intelligence Analyst at a healthcare organization. Requirements: advanced SQL; Power BI dashboard development; data quality and validation; KPI definition and governance; working directly with business stakeholders to gather reporting requirements; healthcare data experience preferred.",
    overlaps: [
      {
        area: "Power BI",
        evidence:
          "Documented in independent consulting work, where executive dashboards were built in both Power BI and Tableau across five industries.",
        tier: "documented",
      },
      {
        area: "SQL",
        evidence:
          "Used throughout his analytics roles for analysis, reconciliation, reporting and QA — including source-data analysis and discrepancy investigation in his current pharmaceutical analytics role at Publicis Groupe.",
        tier: "documented",
      },
      {
        area: "Healthcare",
        evidence:
          "Spans healthcare digital analytics at Universal Health Services and pharmaceutical reporting at Publicis Groupe.",
        tier: "documented",
      },
      {
        area: "Data quality",
        evidence:
          "Current work includes Tableau dashboard validation, metric reconciliation across systems, discrepancy root-cause investigation and KPI governance during a Redshift-to-Databricks migration.",
        tier: "documented",
      },
      {
        area: "Stakeholder requirements",
        evidence:
          "Requirements gathering is documented at Publicis Groupe, Ziff Davis and across consulting engagements, where business stakeholders — not analytics teams — were the primary audience.",
        tier: "documented",
      },
      {
        area: "Analytics leadership",
        evidence:
          "Currently manages an analytics team of one manager and two analysts, following a Director-level role at Ziff Davis.",
        tier: "documented",
      },
    ],
  },
];

export const interviewBySlug = new Map(interviews.map((i) => [i.slug, i]));
