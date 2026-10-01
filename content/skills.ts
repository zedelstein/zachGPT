import type { TechGroup } from "./types";

/**
 * The technology map.
 *
 * Every item carries an evidence tier:
 *   "documented" — the portfolio ties it to specific roles and case studies.
 *   "listed"     — it appears in the skills inventory, but no role-level detail
 *                  is documented. These render with the note shown, and the
 *                  assistant is instructed to describe them that way too.
 *
 * This distinction is deliberate: it is what lets a recruiter verify a skill
 * instead of taking a keyword list on faith.
 */
export const techGroups: TechGroup[] = [
  {
    id: "bi",
    label: "BI & Visualization",
    blurb: "The layer business stakeholders actually open.",
    items: [
      {
        name: "Tableau",
        tier: "documented",
        roleIds: ["publicis", "independent", "ziffdavis", "stella-rising", "analytics-lead"],
        caseStudies: [
          "pharmaceutical-bi-modernization",
          "enterprise-analytics-20-brands",
          "executive-bi-consulting",
        ],
      },
      {
        name: "Power BI",
        tier: "documented",
        roleIds: ["independent"],
        caseStudies: ["executive-bi-consulting"],
        note: "Documented in independent consulting work, alongside Tableau.",
      },
      {
        name: "Looker / Looker Studio",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Named in the skills inventory. No role-level evidence is recorded — the closest transferable evidence is Tableau and Power BI dashboard development.",
      },
    ],
  },
  {
    id: "query",
    label: "Data & Querying",
    blurb: "How the underlying questions get answered.",
    items: [
      {
        name: "SQL",
        tier: "documented",
        roleIds: ["publicis", "independent", "ziffdavis", "uhs", "analytics-lead", "stella-rising"],
        caseStudies: [
          "pharmaceutical-bi-modernization",
          "enterprise-analytics-20-brands",
          "executive-bi-consulting",
        ],
        note: "Used throughout analytics roles for analysis, reconciliation, reporting and QA.",
      },
      {
        name: "Python",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Named in the skills inventory and the professional biography; no role-level detail is recorded.",
      },
      {
        name: "R",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Named in the skills inventory; no role-level detail is recorded.",
      },
    ],
  },
  {
    id: "platforms",
    label: "Data Platforms",
    blurb: "Where the data lives.",
    items: [
      {
        name: "Databricks",
        tier: "documented",
        roleIds: ["publicis"],
        caseStudies: ["pharmaceutical-bi-modernization"],
        note: "Current role: target platform of an in-progress Redshift-to-Databricks migration.",
      },
      {
        name: "Redshift",
        tier: "documented",
        roleIds: ["publicis"],
        caseStudies: ["pharmaceutical-bi-modernization"],
        note: "Current role: the source platform being migrated away from.",
      },
      {
        name: "Snowflake",
        tier: "documented",
        roleIds: ["independent"],
        caseStudies: ["executive-bi-consulting"],
        note: "Documented at the level of cloud data platforms used in consulting engagements.",
      },
      {
        name: "BigQuery",
        tier: "documented",
        roleIds: ["independent"],
        caseStudies: ["executive-bi-consulting"],
        note: "Documented at the level of cloud data platforms used in consulting engagements.",
      },
    ],
  },
  {
    id: "digital",
    label: "Digital Analytics",
    blurb: "Audience, search and site behaviour.",
    items: [
      {
        name: "GA4",
        tier: "documented",
        roleIds: ["ziffdavis", "independent"],
        caseStudies: ["enterprise-analytics-20-brands", "executive-bi-consulting"],
        note: "Includes leading an enterprise GA4 migration across 20+ brands at Ziff Davis.",
      },
      {
        name: "Adobe Analytics",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Named in the skills inventory. No role-level evidence is recorded — the closest transferable evidence is GA4 and SEO/digital analytics.",
      },
    ],
  },
];

/** Analytics disciplines — practices rather than products. */
export const disciplines: { name: string; blurb: string; roleIds: string[] }[] = [
  { name: "Dashboard development", blurb: "Tableau and Power BI dashboards built for business users, not analysts.", roleIds: ["publicis", "independent", "ziffdavis", "stella-rising", "analytics-lead"] },
  { name: "KPI frameworks", blurb: "Defining the metric once, with the business owner, before anything gets built.", roleIds: ["publicis", "independent", "ziffdavis", "uhs"] },
  { name: "Data QA", blurb: "Validating dashboards against source systems before stakeholders find the problem.", roleIds: ["publicis", "independent", "uhs"] },
  { name: "Reconciliation", blurb: "Making numbers from different systems agree, and explaining why they didn't.", roleIds: ["publicis", "independent"] },
  { name: "Data governance", blurb: "Taxonomy and definition consistency across a reporting ecosystem.", roleIds: ["publicis", "ziffdavis"] },
  { name: "Data visualization", blurb: "Chart and layout choices that make the point legible at a glance.", roleIds: ["publicis", "independent", "ziffdavis", "uhs", "stella-rising", "analytics-lead", "seo-analyst"] },
  { name: "Experimentation", blurb: "A/B testing site experiences and measuring whether they moved conversion.", roleIds: ["uhs"] },
  { name: "Reporting automation", blurb: "Turning recurring manual pulls into maintainable reporting.", roleIds: ["publicis", "independent", "ziffdavis"] },
  { name: "Requirements gathering", blurb: "Getting to the decision behind the dashboard request.", roleIds: ["publicis", "independent", "ziffdavis"] },
  { name: "Analytics documentation", blurb: "Written definitions and QA processes so reporting survives staff turnover.", roleIds: ["publicis", "independent", "ziffdavis"] },
];

export const allTechnologies = techGroups.flatMap((g) =>
  g.items.map((item) => ({ ...item, groupId: g.id, groupLabel: g.label })),
);
