import type { CaseStudy } from "./types";

export const caseStudies: CaseStudy[] = [
  {
    slug: "pharmaceutical-bi-modernization",
    title: "Pharmaceutical BI & Reporting Modernization",
    company: "Publicis Groupe",
    roleId: "publicis",
    dates: "June 2025 – Present",
    industry: "Pharmaceutical / Healthcare",
    summary:
      "Keeping enterprise pharmaceutical reporting trustworthy while the data platform underneath it migrates from Redshift to Databricks.",
    context:
      "At Publicis Groupe I work as an Associate Director, Data Platforms, supporting analytics and reporting for a major global pharmaceutical client. The reporting ecosystem includes large healthcare and marketing datasets, SQL-based transformations, enterprise BI dashboards, and multiple upstream data sources.",
    problem:
      "Enterprise reporting requires data coming from different systems and vendors to reconcile correctly before it reaches dashboards and executive reporting. At the same time, the underlying data environment has been undergoing modernization, including migration from Redshift to Databricks. Changing infrastructure creates a significant reporting challenge: how do you modernize the underlying data environment without breaking the reporting that business stakeholders already rely on?",
    environment: [
      "Large healthcare and marketing datasets",
      "SQL-based transformations",
      "Enterprise Tableau dashboards",
      "Multiple upstream vendor and system feeds",
      "Redshift, migrating to Databricks",
    ],
    approach:
      "I work across the whole reporting and data lifecycle rather than at a single layer of it — because a discrepancy a stakeholder notices in a dashboard is almost never a dashboard problem.",
    approachBullets: [
      "Analyzing source data with SQL",
      "Investigating discrepancies between source systems and reporting outputs",
      "Validating Tableau dashboards",
      "Reconciling metrics across systems",
      "Identifying root causes of reporting differences",
      "Maintaining KPI and taxonomy consistency",
      "Supporting the Redshift-to-Databricks migration",
      "Working with stakeholders to clarify reporting requirements",
      "Coordinating analytics QA",
    ],
    sections: [
      {
        heading: "Leadership",
        body: "I also manage an analytics team consisting of one manager and two analysts.",
      },
    ],
    outcome:
      "The work helps maintain trusted reporting during an enterprise data-platform transition while improving consistency between underlying datasets, KPI definitions, and business-facing dashboards.",
    skills: [
      "SQL",
      "Tableau",
      "Databricks",
      "Redshift",
      "Data QA",
      "Data reconciliation",
      "Healthcare analytics",
      "KPI governance",
      "Stakeholder management",
      "Analytics leadership",
    ],
    diagram: {
      kind: "pipeline",
      caption: "The reporting lifecycle this role spans — a discrepancy can originate at any stage, so validation has to cover all of them.",
      stages: [
        { label: "Vendor & source data", detail: "Multiple upstream systems and vendor feeds, each with its own definitions and delivery cadence." },
        { label: "Redshift → Databricks", detail: "The warehouse layer, mid-migration. Both platforms have to produce the same numbers during the transition." },
        { label: "SQL transformation", detail: "Joins, filters and business logic that turn source records into reportable metrics." },
        { label: "QA & reconciliation", detail: "Compare metrics across systems, isolate variances, and trace each one to a root cause." },
        { label: "Tableau", detail: "Validated dashboards with consistent KPI definitions and taxonomy." },
        { label: "Stakeholder reporting", detail: "Business and executive audiences who need the number to be the same one they saw last week." },
      ],
    },
  },
  {
    slug: "enterprise-analytics-20-brands",
    title: "Enterprise Analytics Across 20+ Digital Brands",
    company: "Ziff Davis",
    roleId: "ziffdavis",
    dates: "December 2021 – January 2024",
    industry: "Digital Media",
    summary:
      "Replacing per-brand analytics improvisation with a shared measurement framework across a portfolio of more than 20 digital brands.",
    context:
      "As Director, Analytics & Insights at Ziff Davis, I supported analytics modernization across a portfolio of more than 20 digital brands. The organization generated large volumes of audience, content, product, acquisition, and revenue data.",
    problem:
      "When many brands operate independently, analytics becomes fragmented. Different teams can develop different KPI definitions, different dashboards, different reporting conventions, inconsistent implementations, and incompatible interpretations of performance. That makes portfolio-level analysis difficult.",
    environment: [
      "20+ independently operated digital brands",
      "Audience, content, product, acquisition and revenue datasets",
      "GA4 (migrated from the previous analytics implementation)",
      "SQL and Tableau reporting layer",
    ],
    approach:
      "Rather than treating dashboards as isolated deliverables, the work focused on creating more consistent measurement across brands — so a metric meant the same thing whichever brand reported it.",
    approachBullets: [
      "Enterprise GA4 migration",
      "Shared KPI frameworks",
      "Dashboard redesign",
      "Reporting governance",
      "Audience analytics",
      "Content analytics",
      "Product analytics",
      "Revenue reporting",
      "Go-to-market reporting",
      "Executive analytics",
    ],
    sections: [
      {
        heading: "Executive analytics",
        body: "I also supported senior leadership with analytical work used to evaluate strategic initiatives and potential acquisitions, including analyses related to large-scale M&A opportunities. Transaction details are confidential and are not described here.",
      },
    ],
    outcome:
      "The organization gained a more standardized analytics framework across a portfolio of 20+ brands, creating greater consistency in how teams measured and communicated performance.",
    skills: [
      "GA4",
      "SQL",
      "Tableau",
      "Data visualization",
      "KPI governance",
      "Digital analytics",
      "Media analytics",
      "Executive reporting",
      "Analytics strategy",
      "Stakeholder management",
    ],
    diagram: {
      kind: "fanin",
      caption: "Fragmented brand-level measurement converging on a shared framework, which is what makes portfolio reporting possible.",
      stages: [
        { label: "20+ brands", detail: "Each with its own teams, dashboards, reporting conventions and analytics implementation." },
        { label: "Shared measurement framework", detail: "Common implementation standards and reporting governance across the portfolio." },
        { label: "Standardized KPIs", detail: "One definition per metric, documented, so brands can be compared rather than reconciled." },
        { label: "Portfolio reporting", detail: "Audience, content, product and revenue reporting that aggregates across brands for executives." },
      ],
    },
  },
  {
    slug: "executive-bi-consulting",
    title: "Executive BI & Analytics Consulting",
    company: "Independent",
    roleId: "independent",
    dates: "January 2024 – June 2025",
    industry: "Media, Utilities, Higher Education, Financial Services, Real Estate",
    summary:
      "Turning raw operational and marketing data into repeatable reporting frameworks for organizations across five industries.",
    context:
      "From 2024 to 2025 I worked independently as an analytics consultant across organizations and industries including media, utilities, higher education, financial services, and real estate.",
    problem:
      "Organizations often had plenty of data but lacked reporting systems that translated it into clear operational or executive information. The recurring questions were: What should we measure? Which KPIs actually matter? How should reporting be structured? How do we reconcile conflicting data? How do we make dashboards useful to business users?",
    environment: [
      "Five industries, each with different data maturity",
      "SQL, Tableau, Power BI, GA4",
      "Cloud data platforms",
      "Business stakeholders rather than analytics teams as the primary audience",
    ],
    approach:
      "Each engagement started from the decision the organization was trying to make, then worked backwards into the metrics and the reporting that would support it.",
    approachBullets: [
      "Executive dashboards",
      "KPI frameworks",
      "Operational reporting",
      "Customer engagement reporting",
      "Funnel reporting",
      "Acquisition analytics",
      "Workflow reporting",
      "Content analytics",
      "User-behavior analysis",
      "Conversion reporting",
    ],
    outcome:
      "The work transformed raw operational and marketing data into repeatable reporting frameworks that stakeholders could use to understand performance and make decisions.",
    skills: [
      "Power BI",
      "Tableau",
      "SQL",
      "Dashboard design",
      "Requirements gathering",
      "KPI development",
      "Stakeholder reporting",
      "Analytics consulting",
    ],
    diagram: {
      kind: "grid",
      caption: "Industries served and the reporting types delivered across them — the same reporting problems recur regardless of sector.",
      stages: [
        { label: "Media", detail: "Content analytics, audience and engagement reporting." },
        { label: "Utilities", detail: "Operational and workflow reporting." },
        { label: "Higher education", detail: "Acquisition, funnel and conversion reporting." },
        { label: "Financial services", detail: "Executive dashboards and KPI frameworks." },
        { label: "Real estate", detail: "Customer engagement and user-behaviour analysis." },
      ],
    },
  },
  {
    slug: "healthcare-digital-analytics",
    title: "Healthcare Digital Analytics & Experimentation",
    company: "Universal Health Services",
    roleId: "uhs",
    dates: "2020 – 2021",
    industry: "Healthcare",
    summary:
      "Connecting digital behaviour on healthcare properties to patient-acquisition objectives, and testing the changes meant to improve it.",
    context:
      "At Universal Health Services I worked in healthcare digital analytics. The work focused on understanding how prospective patients interacted with digital properties and how digital experiences influenced acquisition and conversion.",
    problem:
      "Stakeholders needed answers to questions web metrics alone don't settle: How are people discovering healthcare properties? Which digital experiences generate engagement? Where do users abandon important journeys? Which site changes improve conversion? How should executives understand digital performance?",
    environment: [
      "Healthcare digital properties",
      "Search, acquisition and site-behaviour data",
      "A/B testing programme",
      "Executive stakeholders outside the analytics function",
    ],
    approach:
      "The through-line was treating digital measurement as a patient-acquisition question rather than a web-traffic question.",
    approachBullets: [
      "Healthcare digital analytics",
      "SEO analytics",
      "UX measurement",
      "Acquisition analysis",
      "Site behaviour analysis",
      "Conversion analysis",
      "Experimentation / A/B testing",
      "Executive reporting",
    ],
    outcome:
      "Analytics connected digital behaviour with business and patient-acquisition objectives, helping stakeholders evaluate digital performance through measurable KPIs rather than isolated web metrics.",
    skills: [
      "Healthcare analytics",
      "Digital analytics",
      "Experimentation",
      "Conversion analysis",
      "Executive reporting",
      "SEO analytics",
      "KPI development",
    ],
    diagram: {
      kind: "funnel",
      caption: "The measurement chain this role covered end to end, rather than optimising one stage in isolation.",
      stages: [
        { label: "Acquisition", detail: "How prospective patients discover healthcare properties — search, referral and campaign sources." },
        { label: "Site behaviour", detail: "What people do once they arrive, and which paths they actually take." },
        { label: "Engagement", detail: "Which experiences hold attention and move someone toward a decision." },
        { label: "Conversion", detail: "Completion of the journeys that matter, and the experiments that tried to improve them." },
      ],
    },
  },
];

export const caseStudyBySlug = new Map(caseStudies.map((c) => [c.slug, c]));
