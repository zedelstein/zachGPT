import type { Capability, Role } from "./types";

export const capabilities: Capability[] = [
  { id: "bi", label: "Business Intelligence", blurb: "Owning the reporting layer business users actually run on." },
  { id: "dashboards", label: "Dashboard Development", blurb: "Designing and building dashboards in Tableau and Power BI." },
  { id: "sql", label: "SQL / Data Analysis", blurb: "Querying source data, profiling it, and answering questions with it." },
  { id: "dataviz", label: "Data Visualization", blurb: "Choosing the chart and the layout that make the point legible." },
  { id: "dataqa", label: "Data QA & Validation", blurb: "Reconciling systems and finding the root cause of discrepancies." },
  { id: "kpi", label: "KPI Governance", blurb: "Defining metrics once and keeping the definitions consistent." },
  { id: "reporting", label: "Stakeholder Reporting", blurb: "Translating analysis into reporting executives can act on." },
  { id: "marketing", label: "Marketing Analytics", blurb: "Acquisition, funnel, campaign and revenue measurement." },
  { id: "healthcare", label: "Healthcare Analytics", blurb: "Healthcare and pharmaceutical data, reporting and measurement." },
  { id: "seo", label: "SEO / Digital Analytics", blurb: "Search, audience and site-behaviour measurement." },
  { id: "experimentation", label: "Experimentation", blurb: "A/B testing and measuring whether changes worked." },
  { id: "leadership", label: "Analytics Leadership", blurb: "Managing analysts and setting analytics direction." },
];

export const capabilityById = new Map(capabilities.map((c) => [c.id, c]));

/**
 * Employment history, newest first.
 *
 * Roles tagged `companyNeedsReview` / `datesNeedReview` carry placeholder values
 * that Zach should confirm before the site goes live — see content/REVIEW.md.
 * Nothing in this file states an outcome, percentage or metric that was not
 * supplied directly; descriptive language is used wherever a number is unknown.
 */
export const roles: Role[] = [
  {
    id: "publicis",
    company: "Publicis Groupe",
    shortName: "Publicis",
    title: "Associate Director, Data Platforms",
    dates: "June 2025 – Present",
    start: 2025.42,
    end: null,
    industry: "Pharmaceutical / Healthcare",
    focus:
      "Enterprise reporting and analytics for a major global pharmaceutical client, through a Redshift-to-Databricks platform migration.",
    responsibilities: [
      "Analyze source data with SQL and investigate discrepancies between source systems and reporting outputs",
      "Validate Tableau dashboards and reconcile metrics across systems",
      "Identify root causes of reporting differences and drive them to resolution",
      "Maintain KPI and taxonomy consistency across the reporting ecosystem",
      "Support migration from Redshift to Databricks without breaking stakeholder reporting",
      "Work with stakeholders to clarify and document reporting requirements",
      "Coordinate analytics QA across the team",
      "Manage an analytics team of one manager and two analysts",
    ],
    tools: ["SQL", "Tableau", "Databricks", "Redshift"],
    capabilities: ["bi", "dashboards", "sql", "dataviz", "dataqa", "kpi", "reporting", "healthcare", "leadership"],
    caseStudies: ["pharmaceutical-bi-modernization"],
    emphasis: "primary",
  },
  {
    id: "independent",
    company: "Independent",
    shortName: "Independent",
    title: "Analytics Consultant",
    dates: "January 2024 – June 2025",
    start: 2024.0,
    end: 2025.42,
    industry: "Media, Utilities, Higher Education, Financial Services, Real Estate",
    focus:
      "Executive dashboards, KPI frameworks and operational reporting for organizations across five industries.",
    responsibilities: [
      "Design executive dashboards in Power BI and Tableau",
      "Develop KPI frameworks and metric definitions with business owners",
      "Build operational, workflow and customer-engagement reporting",
      "Deliver funnel, acquisition and conversion analytics",
      "Gather and document reporting requirements",
      "Reconcile conflicting data across systems before it reaches reporting",
    ],
    tools: ["SQL", "Tableau", "Power BI", "GA4", "Snowflake", "BigQuery"],
    capabilities: ["bi", "dashboards", "sql", "dataviz", "dataqa", "kpi", "reporting", "marketing"],
    caseStudies: ["executive-bi-consulting"],
    emphasis: "primary",
  },
  {
    id: "ziffdavis",
    company: "Ziff Davis",
    shortName: "Ziff Davis",
    title: "Director, Analytics & Insights",
    dates: "December 2021 – January 2024",
    start: 2021.92,
    end: 2024.0,
    industry: "Digital Media",
    focus:
      "Analytics modernization across a portfolio of 20+ digital brands, including an enterprise GA4 migration and shared KPI frameworks.",
    responsibilities: [
      "Lead analytics modernization across a portfolio of more than 20 digital brands",
      "Run an enterprise GA4 migration",
      "Establish shared KPI frameworks and reporting governance across brands",
      "Redesign dashboards for audience, content, product and revenue reporting",
      "Deliver go-to-market and executive analytics",
      "Support senior leadership with analysis used to evaluate strategic initiatives and potential acquisitions",
    ],
    tools: ["GA4", "SQL", "Tableau"],
    capabilities: ["bi", "dashboards", "sql", "dataviz", "kpi", "reporting", "marketing", "seo", "leadership"],
    caseStudies: ["enterprise-analytics-20-brands"],
    emphasis: "primary",
  },
  {
    id: "uhs",
    company: "Universal Health Services",
    shortName: "UHS",
    title: "Analytics Manager",
    dates: "2020 – 2021",
    start: 2020.0,
    end: 2021.92,
    datesNeedReview: true,
    industry: "Healthcare",
    focus:
      "Healthcare digital analytics: how prospective patients discover and move through digital properties, and which changes improve conversion.",
    responsibilities: [
      "Measure how prospective patients discover and engage with healthcare digital properties",
      "Run SEO and acquisition analysis",
      "Analyze site behaviour and where users abandon important journeys",
      "Design and measure A/B tests on site experiences",
      "Build executive reporting that frames digital performance as business KPIs",
    ],
    tools: ["GA4", "SQL", "SEO analytics tooling"],
    capabilities: ["sql", "dataviz", "dataqa", "kpi", "reporting", "healthcare", "seo", "experimentation", "leadership"],
    caseStudies: ["healthcare-digital-analytics"],
    emphasis: "secondary",
  },
  {
    id: "analytics-lead",
    company: "[Company — add in content/roles.ts]",
    shortName: "Analytics Lead",
    companyNeedsReview: true,
    title: "Analytics Lead",
    dates: "2019 – 2020",
    start: 2019.0,
    end: 2020.0,
    datesNeedReview: true,
    industry: "Digital Analytics",
    focus: "Hands-on digital and marketing analytics, dashboard development and stakeholder reporting.",
    responsibilities: [
      "Own recurring dashboards and stakeholder reporting",
      "Run SQL analysis across marketing and behavioural datasets",
      "Translate analysis into recommendations for business teams",
    ],
    tools: ["SQL", "Tableau"],
    capabilities: ["sql", "dashboards", "dataviz", "reporting", "marketing", "leadership"],
    caseStudies: [],
    emphasis: "secondary",
  },
  {
    id: "stella-rising",
    company: "Stella Rising",
    shortName: "Stella Rising",
    title: "Data Analytics Manager",
    dates: "2017 – 2019",
    start: 2017.0,
    end: 2019.0,
    datesNeedReview: true,
    industry: "Marketing & Media",
    focus: "Marketing and media analytics, Tableau dashboard development and client reporting.",
    responsibilities: [
      "Build Tableau dashboards for marketing and media performance",
      "Run SQL analysis across campaign and audience datasets",
      "Deliver recurring client and stakeholder reporting",
    ],
    tools: ["Tableau", "SQL"],
    capabilities: ["bi", "dashboards", "sql", "dataviz", "reporting", "marketing", "leadership"],
    caseStudies: [],
    emphasis: "secondary",
  },
  {
    id: "seo-analyst",
    company: "[Company — add in content/roles.ts]",
    shortName: "SEO Analyst",
    companyNeedsReview: true,
    title: "Technical SEO Analyst",
    dates: "2015 – 2017",
    start: 2015.0,
    end: 2017.0,
    datesNeedReview: true,
    industry: "Digital Marketing",
    focus: "Technical SEO and digital analytics — the hands-on measurement work the rest of the career builds on.",
    responsibilities: [
      "Technical SEO analysis and site measurement",
      "Search and traffic reporting for stakeholders",
      "Diagnose how site structure affects discovery and engagement",
    ],
    tools: ["SEO analytics tooling", "Web analytics"],
    capabilities: ["seo", "dataviz", "reporting"],
    caseStudies: [],
    emphasis: "secondary",
  },
];

export const roleById = new Map(roles.map((r) => [r.id, r]));

/** Oldest-first, for the timeline. */
export const rolesChronological = [...roles].sort((a, b) => a.start - b.start);

export const timelineBounds = { min: 2015, max: 2026 };

/** The capability × role matrix, derived from each role's documented capabilities. */
export function capabilityMatrix(): Record<string, Set<string>> {
  const matrix: Record<string, Set<string>> = {};
  for (const cap of capabilities) matrix[cap.id] = new Set();
  for (const role of roles) {
    for (const cap of role.capabilities) matrix[cap].add(role.id);
  }
  return matrix;
}
