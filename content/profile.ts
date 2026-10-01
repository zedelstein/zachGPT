import type { Stat } from "./types";

export const profile = {
  name: "Zachary Edelstein",
  discipline: "Analytics · Business Intelligence · Data Governance",
  headline:
    "I turn complicated data into reporting systems, governed metrics, and decision-ready insights.",
  subhead:
    "10+ years across healthcare, media, marketing, business intelligence, and analytics consulting.",
  /** Used for metadata and the JSON-LD Person block. */
  shortBio:
    "Senior analytics and business intelligence leader with 10+ years across BI, reporting, healthcare and pharmaceutical analytics, digital media, data governance and analytics consulting.",
  email: "edelstein.zach@gmail.com",
  location: "United States",
  resumePath: "/resume",
  targetRoles: [
    "Senior Data Analyst",
    "Business Intelligence Analyst",
    "Senior BI Analyst",
    "Reporting Analyst",
    "Power BI Analyst",
    "Analytics Manager",
    "Insights & Analytics",
    "Data Governance / Analytics Enablement",
    "Analytics leadership",
  ],
};

/** The compact strip under the hero. */
export const summaryStrip: Stat[] = [
  { value: "10+", label: "Years experience" },
  { value: "20+", label: "Digital brands" },
  { value: "Healthcare + Media", label: "Primary industries" },
  { value: "SQL · Tableau · Power BI", label: "Core stack" },
];

/**
 * "Experience by the Numbers".
 *
 * Only defensible figures appear here. Where an exact number cannot be
 * substantiated the value is descriptive ("Multiple", "5") rather than an
 * invented percentage. There are deliberately no efficiency or improvement
 * metrics anywhere on this site.
 */
export const numbers: Stat[] = [
  { value: "10+", label: "Years in analytics", detail: "2015 to present, across seven roles." },
  { value: "20+", label: "Digital brands supported", detail: "Portfolio-wide analytics at Ziff Davis." },
  { value: "3", label: "Current team members managed", detail: "1 manager + 2 analysts." },
  { value: "Multiple", label: "Enterprise data platforms", detail: "Databricks · Redshift · Snowflake · BigQuery." },
  { value: "6", label: "Industries", detail: "Healthcare · Pharmaceutical · Media · Marketing · Utilities · Higher education · Financial services." },
  { value: "2", label: "BI platforms built in", detail: "Tableau and Power BI, across four roles." },
];

export const howIWork = [
  {
    step: "01",
    title: "Understand the question",
    body: "Start with the decision someone is trying to make rather than immediately building a dashboard.",
  },
  {
    step: "02",
    title: "Establish trustworthy data",
    body: "Validate sources, definitions, joins, filters, refreshes, and KPI logic.",
  },
  {
    step: "03",
    title: "Build useful reporting",
    body: "Translate complex datasets into dashboards and reporting that business users can understand.",
  },
  {
    step: "04",
    title: "Create repeatability",
    body: "Document definitions, standardize metrics, establish QA processes, and make reporting maintainable.",
  },
];

export const howIWorkFlow = ["Question", "Data", "Insight", "Decision"];

export const about = {
  paragraphs: [
    "I've spent more than a decade working with organizations that have plenty of data but still struggle to answer seemingly simple business questions.",
    "My work sits between the data and the people trying to use it: writing SQL, validating reporting, defining KPIs, building dashboards, investigating discrepancies, and translating analytical results into something stakeholders can actually act on.",
    "I've worked across healthcare, pharmaceutical analytics, digital media, marketing, and consulting, using tools including SQL, Tableau, Power BI, Databricks, Redshift, Snowflake, BigQuery, GA4, and Python.",
    "I'm particularly interested in business intelligence, reporting, analytics enablement, data quality, and data governance — the systems and processes that make analytics trustworthy and useful.",
  ],
};

export const nav = [
  { label: "About", href: "/#about" },
  { label: "Experience", href: "/#experience" },
  { label: "Work", href: "/#work" },
  { label: "Skills", href: "/#skills" },
  { label: "Resume", href: "/resume" },
];

export const assistant = {
  greeting:
    "Hi — I'm an interactive version of Zach's professional portfolio.\n\nYou can ask me about his experience, projects, technical skills, industries, or specific examples of his work. My answers are grounded in Zach's resume and portfolio materials.",
  suggestedQuestions: [
    "What is Zach's Power BI experience?",
    "Tell me about his healthcare analytics work.",
    "What kind of dashboards has he built?",
    "How strong is his SQL experience?",
    "Tell me about his experience with data quality.",
    "Has Zach managed analytics teams?",
    "What experience does he have with Databricks?",
    "Show me his most relevant BI projects.",
  ],
  insufficientEvidence:
    "I don't have enough information in Zach's portfolio to answer that accurately.",
};
