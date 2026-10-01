import type { Capability, Role } from "./types";

export const capabilities: Capability[] = [
  { id: "bi", label: "Business Intelligence", blurb: "Owning the reporting layer business users actually run on." },
  { id: "dashboards", label: "Dashboard Development", blurb: "Designing and building dashboards in Tableau, Power BI and Looker Studio." },
  { id: "sql", label: "SQL / Data Analysis", blurb: "Querying source data, profiling it, and answering questions with it." },
  { id: "dataviz", label: "Data Visualization", blurb: "Choosing the chart and the layout that make the point legible." },
  { id: "dataqa", label: "Data QA & Validation", blurb: "Reconciling systems and finding the root cause of discrepancies." },
  { id: "kpi", label: "KPI Governance", blurb: "Defining metrics once and keeping the definitions consistent." },
  { id: "reporting", label: "Stakeholder Reporting", blurb: "Translating analysis into reporting executives can act on." },
  { id: "marketing", label: "Marketing Analytics", blurb: "Acquisition, funnel, campaign and revenue measurement." },
  { id: "healthcare", label: "Healthcare Analytics", blurb: "Healthcare and pharmaceutical data, reporting and measurement." },
  { id: "seo", label: "SEO / Digital Analytics", blurb: "Search, audience and site-behaviour measurement." },
  { id: "experimentation", label: "Experimentation & CRO", blurb: "A/B and multivariate testing, and measuring whether changes worked." },
  { id: "attribution", label: "Attribution & MMM", blurb: "Marketing mix models and multi-touch attribution across channels." },
  { id: "predictive", label: "Predictive Modeling", blurb: "Forecasting and modelling in Python, deployed into reporting." },
  { id: "ai", label: "AI & Automation", blurb: "Applying LLMs and ML to real reporting and content problems." },
  { id: "leadership", label: "Analytics Leadership", blurb: "Managing analysts and setting analytics direction." },
];

export const capabilityById = new Map(capabilities.map((c) => [c.id, c]));

/**
 * Employment history, newest first.
 *
 * Compiled from Zach's resumes. Companies, titles and date ranges are taken
 * verbatim; responsibilities are a synthesis across the role-targeted versions
 * of each resume, de-duplicated. Figures in `metrics` appear on those resumes —
 * nothing here is estimated, and roles without documented numbers have none.
 */
export const roles: Role[] = [
  {
    id: "publicis",
    company: "Publicis Groupe",
    shortName: "Publicis",
    location: "New York, NY",
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
    metrics: ["Manages a team of 1 manager and 2 analysts"],
    tools: ["SQL", "Tableau", "Databricks", "Redshift"],
    capabilities: ["bi", "dashboards", "sql", "dataviz", "dataqa", "kpi", "reporting", "healthcare", "leadership"],
    caseStudies: ["pharmaceutical-bi-modernization"],
    emphasis: "primary",
  },
  {
    id: "stratega",
    company: "Stratega",
    shortName: "Stratega",
    location: "New York, NY",
    title: "Analytics Consultant",
    dates: "January 2024 – June 2025",
    start: 2024.0,
    end: 2025.42,
    industry: "Media, Utilities, Higher Education, Financial Services, Real Estate, Energy",
    focus:
      "Independent consultancy: executive dashboards, KPI frameworks, marketing mix models and AI adoption for clients across six industries.",
    responsibilities: [
      "Lead data visualization, migration and ETL projects across media, utilities, real estate, financial services and higher education",
      "Design cross-channel marketing dashboards in Tableau and Power BI",
      "Build marketing mix models (MMM) and omnichannel effectiveness reporting for healthcare clients",
      "Develop attribution models leveraging claims data, digital engagement and sales data to guide budget decisions",
      "Automate forecasting and patient segmentation workflows in Python",
      "Define and run CRO and experimentation programmes using Optimizely and VWO",
      "Analyze behaviour with GA4, Hotjar and FullStory, and turn findings into UX and product recommendations",
      "Shape enterprise AI strategy and deploy generative-AI solutions, including custom GPT instances and knowledge-management tools",
      "Write technical specifications — ER diagrams and data dictionaries — and complex SQL, including PL/SQL",
      "Manage website tagging compliance (GDPR, CCPA)",
    ],
    metrics: [
      "Reduced manual analytics turnaround by 30% through Python automation",
      "Delivered a 20% increase in qualified leads through website engagement and conversion work",
    ],
    tools: ["SQL", "Tableau", "Power BI", "Python", "GA4", "Snowflake", "BigQuery", "AWS", "Optimizely"],
    capabilities: [
      "bi", "dashboards", "sql", "dataviz", "dataqa", "kpi", "reporting", "marketing",
      "healthcare", "experimentation", "attribution", "predictive", "ai",
    ],
    caseStudies: ["executive-bi-consulting"],
    emphasis: "primary",
  },
  {
    id: "ziffdavis",
    company: "Ziff Davis",
    shortName: "Ziff Davis",
    location: "New York, NY",
    title: "Director, Insights & Analytics",
    dates: "December 2021 – January 2024",
    start: 2021.92,
    end: 2024.0,
    industry: "Digital Media",
    focus:
      "Analytics modernization across a portfolio of 20+ digital brands, including an enterprise GA4 migration, shared KPI frameworks and CEO-level M&A analysis.",
    responsibilities: [
      "Lead digital marketing strategy and analytics across Ziff Davis brands, from campaign design through measurement",
      "Provide the CEO with media analytics support for M&A evaluations — traffic profiles, SEO competence, growth potential and strategic fit",
      "Build and maintain enterprise dashboards in Tableau and Looker Studio",
      "Lead the enterprise GA4 migration, including backend integration and advanced event tracking",
      "Direct internal product development for proprietary analytics tools, aligning engineering timelines with business needs",
      "Manage data science initiatives in Python to support predictive models and scalable insight delivery",
      "Build and scale an AI-powered content generation engine trained on behavioural and SEO data",
      "Establish an enterprise-wide A/B testing practice and shared experimentation language",
      "Lead and mentor teams across product analytics, UX insights and content strategy",
    ],
    metrics: [
      "Supported CEO-level analysis for nine-figure M&A evaluations",
      "Influenced $10M+ in marketing spend decisions",
      "Analytics modernization across 20+ digital brands",
    ],
    tools: ["GA4", "SQL", "Tableau", "Looker Studio", "Python", "Adobe Analytics"],
    capabilities: [
      "bi", "dashboards", "sql", "dataviz", "kpi", "reporting", "marketing", "seo",
      "experimentation", "attribution", "predictive", "ai", "leadership",
    ],
    caseStudies: ["enterprise-analytics-20-brands"],
    emphasis: "primary",
  },
  {
    id: "stella-rising",
    company: "Stella Rising",
    shortName: "Stella Rising",
    location: "Westport, CT (Remote)",
    title: "Analytics Manager",
    dates: "August 2020 – December 2021",
    start: 2020.58,
    end: 2021.92,
    industry: "Marketing & Media",
    focus:
      "Enterprise analytics platform adoption, omnichannel reporting and a multivariate testing programme for healthcare and consumer brands.",
    responsibilities: [
      "Lead onboarding of Tableau and Salesforce Datorama as enterprise analytics platforms",
      "Build flexible data models enabling granular or roll-up reporting across marketing channels",
      "Design omnichannel reporting dashboards integrating patient engagement data, CRM systems and paid media",
      "Create ETL pipelines and Python-based automation for scalable data processing",
      "Lead A/B and multivariate testing for healthcare and consumer brands, analyzing statistical significance and lift",
      "Manage full-lifecycle website redesign and CMS migration projects",
      "Deliver strategic insights to senior clients through recurring presentations and ad-hoc deep dives",
    ],
    metrics: [
      "Increased landing page conversion rates by 18% through iterative testing",
      "Synthesized research and analytics into recommendations that increased conversion by 15%",
    ],
    tools: ["Tableau", "Power BI", "SQL", "Python", "Salesforce Datorama", "Webflow"],
    capabilities: [
      "bi", "dashboards", "sql", "dataviz", "dataqa", "kpi", "reporting", "marketing",
      "healthcare", "experimentation", "attribution", "leadership",
    ],
    caseStudies: [],
    emphasis: "secondary",
  },
  {
    id: "uhs",
    company: "Universal Health Services",
    shortName: "UHS",
    location: "Wayne, PA",
    title: "Analytics Lead",
    dates: "August 2018 – August 2020",
    start: 2018.58,
    end: 2020.58,
    industry: "Healthcare",
    focus:
      "Patient-acquisition analytics across a national hospital network — SEO, paid search, CRM and offline campaign data, with MMM and executive reporting.",
    responsibilities: [
      "Build patient acquisition models leveraging SEO, paid search, CRM and offline campaign data",
      "Analyze claims-style data and call centre metrics to optimize Medicare enrollment campaigns and digital patient journeys",
      "Design marketing mix models to evaluate ROI across search, radio, display and field campaigns",
      "Develop executive dashboards reporting campaign ROI, patient admissions and service-line marketing attribution",
      "Spearhead SEO and UX improvement strategies using insights from custom-built dashboards",
      "Design and execute A/B tests to improve conversion funnels across healthcare platforms",
      "Run FullStory session-replay analysis with UX teams to uncover usability barriers",
    ],
    metrics: ["Supported patient acquisition for 350+ acute and behavioral health facilities"],
    tools: ["SQL", "Tableau", "Google Data Studio", "FullStory", "SEO tooling"],
    capabilities: [
      "dashboards", "sql", "dataviz", "kpi", "reporting", "marketing", "healthcare",
      "seo", "experimentation", "attribution", "predictive", "leadership",
    ],
    caseStudies: ["healthcare-digital-analytics"],
    emphasis: "secondary",
  },
  {
    id: "majux",
    company: "Majux Marketing",
    shortName: "Majux",
    location: "Philadelphia, PA",
    title: "Data Analytics Manager",
    dates: "December 2016 – August 2018",
    start: 2016.92,
    end: 2018.58,
    industry: "Marketing Agency",
    focus:
      "Promoted into management after building the processes that integrated analytics into the agency's SEO, paid search and design work.",
    responsibilities: [
      "Develop the processes that integrated data analytics into SEO, paid search and design projects",
      "Create and maintain client-facing website performance dashboards, with written reports and presentations",
      "Translate client objectives into measurable KPIs and data visualizations driving content, design and business strategy",
      "Conduct A/B and multivariate tests to inform design and content decisions",
      "Manage cross-functional teams through full test lifecycles, from hypothesis to rollout",
    ],
    tools: ["Tableau", "SQL", "Google Analytics"],
    capabilities: [
      "bi", "dashboards", "sql", "dataviz", "kpi", "reporting", "marketing", "seo",
      "experimentation", "leadership",
    ],
    caseStudies: [],
    emphasis: "secondary",
  },
  {
    id: "gen3",
    company: "Gen3 Marketing",
    shortName: "Gen3",
    location: "Blue Bell, PA",
    title: "Technical SEO Analyst",
    dates: "December 2015 – December 2016",
    start: 2015.92,
    end: 2016.92,
    industry: "Digital Marketing",
    focus:
      "Originated the firm's technical SEO and CRO practice — the hands-on measurement work the rest of the career builds on.",
    responsibilities: [
      "Originate the company's Technical SEO Analyst role and the processes that became standard in client engagements",
      "Establish conversion rate optimization and analytics frameworks still in use at the firm",
      "Design technical information-architecture improvements to enhance UX and conversion",
    ],
    tools: ["SEO tooling", "Google Analytics"],
    capabilities: ["dataviz", "reporting", "seo", "experimentation"],
    caseStudies: [],
    emphasis: "secondary",
  },
];

export const roleById = new Map(roles.map((r) => [r.id, r]));

/** Oldest-first, for the timeline. */
export const rolesChronological = [...roles].sort((a, b) => a.start - b.start);

/** The capability × role matrix, derived from each role's documented capabilities. */
export function capabilityMatrix(): Record<string, Set<string>> {
  const matrix: Record<string, Set<string>> = {};
  for (const cap of capabilities) matrix[cap.id] = new Set();
  for (const role of roles) {
    for (const cap of role.capabilities) matrix[cap].add(role.id);
  }
  return matrix;
}
