import type { TechGroup } from "./types";

/**
 * The technology map.
 *
 * Every item carries an evidence tier:
 *   "documented" — resumes tie it to specific roles.
 *   "listed"     — it appears in a skills inventory, but no role-level detail
 *                  is recorded. These render with the note shown, and the
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
        roleIds: ["publicis", "stratega", "ziffdavis", "stella-rising", "uhs", "majux"],
        caseStudies: [
          "pharmaceutical-bi-modernization",
          "enterprise-analytics-20-brands",
          "executive-bi-consulting",
          "healthcare-digital-analytics",
        ],
        note: "The through-line of the career — in use from the agency years to the current pharmaceutical role.",
      },
      {
        name: "Power BI",
        tier: "documented",
        roleIds: ["stratega", "stella-rising"],
        caseStudies: ["executive-bi-consulting"],
        note: "Cross-channel marketing dashboards in consulting, and funnel dashboards at Stella Rising.",
      },
      {
        name: "Looker Studio",
        tier: "documented",
        roleIds: ["ziffdavis", "uhs"],
        caseStudies: ["enterprise-analytics-20-brands"],
        note: "Enterprise dashboard ecosystems at Ziff Davis, and executive ROI reporting at UHS (as Google Data Studio).",
      },
      {
        name: "Salesforce Datorama",
        tier: "documented",
        roleIds: ["stella-rising"],
        caseStudies: [],
        note: "Led its onboarding as an enterprise analytics platform at Stella Rising.",
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
        roleIds: ["publicis", "stratega", "ziffdavis", "stella-rising", "uhs", "majux"],
        caseStudies: [
          "pharmaceutical-bi-modernization",
          "enterprise-analytics-20-brands",
          "executive-bi-consulting",
        ],
        note: "Analysis, reconciliation, reporting and QA throughout — plus DDL/DML, complex joins, stored procedures and PL/SQL in consulting.",
      },
      {
        name: "Python",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis", "stella-rising"],
        caseStudies: ["executive-bi-consulting"],
        note: "Pandas, NumPy, Seaborn, scikit-learn. Forecasting and segmentation automation in consulting, predictive models at Ziff Davis, ETL automation at Stella Rising.",
      },
      {
        name: "ETL & data pipelines",
        tier: "documented",
        roleIds: ["stratega", "stella-rising"],
        caseStudies: ["executive-bi-consulting"],
        note: "Data ingestion pipelines unifying disparate sources into central reporting databases.",
      },
      {
        name: "R",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Listed at a basic level on Zach's resumes; no role-level detail is recorded.",
      },
    ],
  },
  {
    id: "platforms",
    label: "Data Platforms & Cloud",
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
        roleIds: ["stratega"],
        caseStudies: ["executive-bi-consulting"],
        note: "Listed among the cloud data platforms used in consulting engagements.",
      },
      {
        name: "BigQuery",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis"],
        caseStudies: ["executive-bi-consulting"],
        note: "GCP data warehousing across consulting engagements and at Ziff Davis.",
      },
      {
        name: "AWS",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis"],
        caseStudies: [],
        note: "S3, EC2, Lambda and SageMaker, in consulting and at Ziff Davis.",
      },
      {
        name: "GCP / Vertex AI",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis"],
        caseStudies: [],
        note: "Cloud platform for data warehousing and model deployment.",
      },
    ],
  },
  {
    id: "digital",
    label: "Digital & Marketing Analytics",
    blurb: "Audience, search and site behaviour.",
    items: [
      {
        name: "GA4",
        tier: "documented",
        roleIds: ["ziffdavis", "stratega", "stella-rising"],
        caseStudies: ["enterprise-analytics-20-brands", "executive-bi-consulting"],
        note: "Includes leading an enterprise GA4 migration across 20+ brands at Ziff Davis.",
      },
      {
        name: "Adobe Analytics",
        tier: "documented",
        roleIds: ["ziffdavis", "stratega"],
        caseStudies: ["enterprise-analytics-20-brands"],
        note: "Integrated into website ecosystems at Ziff Davis alongside Marketo; part of the marketing-technology stack in consulting.",
      },
      {
        name: "Google Tag Manager",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis"],
        caseStudies: [],
        note: "Tagging implementation and GDPR/CCPA compliance in consulting engagements.",
      },
      {
        name: "SEO tooling",
        tier: "documented",
        roleIds: ["ziffdavis", "uhs", "majux", "gen3"],
        caseStudies: ["healthcare-digital-analytics"],
        note: "BrightEdge, SEMrush, Moz, Conductor and Ahrefs, from the agency years through Ziff Davis.",
      },
      {
        name: "Paid media platforms",
        tier: "documented",
        roleIds: ["ziffdavis", "uhs", "majux"],
        caseStudies: [],
        note: "Meta Ads, Google Ads, Campaign Manager, DV360, YouTube Ads and Supermetrics.",
      },
    ],
  },
  {
    id: "modeling",
    label: "Modeling & Experimentation",
    blurb: "Where the analysis gets quantitative.",
    items: [
      {
        name: "Marketing Mix Modeling",
        tier: "documented",
        roleIds: ["stratega", "uhs", "ziffdavis"],
        caseStudies: ["healthcare-digital-analytics", "executive-bi-consulting"],
        note: "MMM to evaluate ROI across search, radio, display and field campaigns at UHS, and for healthcare clients in consulting.",
      },
      {
        name: "Multi-touch attribution",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis", "stella-rising", "uhs"],
        caseStudies: ["executive-bi-consulting"],
        note: "Attribution models built on claims data, digital engagement and sales data.",
      },
      {
        name: "Predictive modeling",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis", "uhs"],
        caseStudies: ["executive-bi-consulting"],
        note: "Forecasting, patient segmentation and student-success models deployed into executive dashboards.",
      },
      {
        name: "A/B & multivariate testing",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis", "stella-rising", "uhs", "majux", "gen3"],
        caseStudies: ["healthcare-digital-analytics"],
        note: "Documented in six of seven roles — hypothesis design, statistical significance and lift measurement.",
      },
      {
        name: "Optimizely / VWO",
        tier: "documented",
        roleIds: ["stratega"],
        caseStudies: [],
        note: "Experimentation platforms used to run CRO programmes in consulting.",
      },
      {
        name: "Hotjar / FullStory",
        tier: "documented",
        roleIds: ["stratega", "uhs"],
        caseStudies: ["healthcare-digital-analytics"],
        note: "Session replay and behavioural analysis to uncover usability barriers.",
      },
    ],
  },
  {
    id: "ai",
    label: "AI & Machine Learning",
    blurb: "Applied to reporting problems, not as an end in itself.",
    items: [
      {
        name: "Generative AI / LLMs",
        tier: "documented",
        roleIds: ["stratega", "ziffdavis"],
        caseStudies: [],
        note: "Enterprise AI strategy and custom GPT instances in consulting; an AI-powered content generation engine at Ziff Davis.",
      },
      {
        name: "scikit-learn",
        tier: "documented",
        roleIds: ["stratega"],
        caseStudies: [],
        note: "Machine learning for forecasting and segmentation in consulting engagements.",
      },
      {
        name: "TensorFlow",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Listed in Zach's AI/ML toolset; no role-level detail is recorded.",
      },
      {
        name: "NLP",
        tier: "listed",
        roleIds: [],
        caseStudies: [],
        note: "Listed among analytics and research methods; no specific project is recorded.",
      },
    ],
  },
];

/** Analytics disciplines — practices rather than products. */
export const disciplines: { name: string; blurb: string; roleIds: string[] }[] = [
  { name: "Dashboard development", blurb: "Tableau, Power BI and Looker Studio dashboards built for business users, not analysts.", roleIds: ["publicis", "stratega", "ziffdavis", "stella-rising", "uhs", "majux"] },
  { name: "KPI frameworks", blurb: "Defining the metric once, with the business owner, before anything gets built.", roleIds: ["publicis", "stratega", "ziffdavis", "stella-rising", "uhs", "majux"] },
  { name: "Data QA", blurb: "Validating dashboards against source systems before stakeholders find the problem.", roleIds: ["publicis", "stratega", "stella-rising"] },
  { name: "Reconciliation", blurb: "Making numbers from different systems agree, and explaining why they didn't.", roleIds: ["publicis", "stratega"] },
  { name: "Data governance", blurb: "Taxonomy and definition consistency, plus tagging compliance (GDPR, CCPA, WCAG).", roleIds: ["publicis", "stratega", "ziffdavis"] },
  { name: "Requirements gathering", blurb: "Getting to the decision behind the dashboard request; ER diagrams and data dictionaries when it goes deeper.", roleIds: ["publicis", "stratega", "ziffdavis", "majux"] },
  { name: "Experimentation & CRO", blurb: "Hypothesis design, multivariate tests, significance and lift — in six of seven roles.", roleIds: ["stratega", "ziffdavis", "stella-rising", "uhs", "majux", "gen3"] },
  { name: "Reporting automation", blurb: "Turning recurring manual pulls into maintainable reporting, often in Python.", roleIds: ["publicis", "stratega", "ziffdavis", "stella-rising"] },
  { name: "Executive & M&A analysis", blurb: "CEO-level analysis supporting strategic evaluations and acquisitions.", roleIds: ["ziffdavis"] },
  { name: "Analytics documentation", blurb: "Written definitions and QA processes so reporting survives staff turnover.", roleIds: ["publicis", "stratega", "ziffdavis"] },
];

export const allTechnologies = techGroups.flatMap((g) =>
  g.items.map((item) => ({ ...item, groupId: g.id, groupLabel: g.label })),
);
