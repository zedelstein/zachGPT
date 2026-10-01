import type { WorkSample } from "./types";

export const workSampleCategories = [
  "Dashboards",
  "Data Quality",
  "KPI Governance",
  "Analytics Strategy",
  "Healthcare Analytics",
  "Digital Analytics",
  "Experiments",
] as const;

/**
 * Sanitized work samples.
 *
 * Every item is a portfolio recreation built with sample data. No client
 * dashboard, proprietary metric, patient data or confidential business figure
 * appears here, and the `recreated` flag is rendered as a label on each item.
 */
export const workSamples: WorkSample[] = [
  {
    id: "exec-bi-dashboard",
    title: "Executive BI dashboard layout",
    category: "Dashboards",
    kind: "dashboard",
    summary:
      "The structure I use for an executive dashboard: three decision-relevant KPIs above the fold, trend beneath, and detail available but not shouting.",
    detail:
      "Executive dashboards fail more often from layout than from data. This recreation shows the pattern I default to — a small number of governed KPIs with period-over-period context at the top, a single trend view that explains the direction, and a breakdown table one scroll down for the follow-up question. Every KPI tile is traceable to a written definition, so a number on the dashboard and a number in a board deck cannot diverge.",
    recreated: true,
    roleIds: ["independent", "ziffdavis", "publicis"],
    skills: ["Dashboard design", "Data visualization", "KPI governance", "Stakeholder reporting"],
  },
  {
    id: "reconciliation-workbook",
    title: "Source-to-dashboard reconciliation check",
    category: "Data Quality",
    kind: "sql",
    summary:
      "The sanitized shape of a reconciliation query: compare a metric as the source system reports it against the same metric as the reporting layer reports it, and surface the variance.",
    detail:
      "When a stakeholder says a dashboard looks wrong, the useful first move is a row-level comparison between the source and the reporting layer at the same grain. This pattern groups both sides to a common key, joins them, and returns only the periods where the variance exceeds a tolerance — which turns 'the dashboard is off' into a specific, investigable list. Table and column names below are generic placeholders.",
    recreated: true,
    roleIds: ["publicis", "independent"],
    skills: ["SQL", "Data QA", "Data reconciliation"],
    code: `-- Portfolio recreation using sample data and generic object names.
-- Compare a metric at source grain vs. the reporting layer, flag variances.

with source_grain as (
    select
        report_date,
        channel_key,
        sum(event_count) as source_events
    from raw.vendor_events
    where report_date >= date '2024-01-01'
    group by 1, 2
),

reporting_grain as (
    select
        report_date,
        channel_key,
        sum(event_count) as reported_events
    from analytics.fct_channel_daily
    where report_date >= date '2024-01-01'
    group by 1, 2
)

select
    coalesce(s.report_date, r.report_date)   as report_date,
    coalesce(s.channel_key, r.channel_key)   as channel_key,
    s.source_events,
    r.reported_events,
    coalesce(r.reported_events, 0)
      - coalesce(s.source_events, 0)         as variance,
    case
        when s.source_events is null  then 'missing_in_source'
        when r.reported_events is null then 'missing_in_reporting'
        else 'variance'
    end                                      as finding
from source_grain s
full outer join reporting_grain r
    on  s.report_date  = r.report_date
    and s.channel_key  = r.channel_key
where coalesce(s.source_events, 0) <> coalesce(r.reported_events, 0)
order by abs(coalesce(r.reported_events, 0) - coalesce(s.source_events, 0)) desc;`,
  },
  {
    id: "qa-checklist",
    title: "Pre-release dashboard QA checklist",
    category: "Data Quality",
    kind: "workflow",
    summary:
      "The checks that run before a dashboard reaches a stakeholder — because the cheapest discrepancy to fix is the one found before anyone relies on it.",
    detail:
      "A written QA pass is what separates reporting people trust from reporting people quietly stop opening. This is the recreation of the checklist I apply: row-count and totals reconciliation against source, join-fan-out detection, filter and default-state verification, date-grain and timezone consistency, refresh and freshness confirmation, null and unknown-member handling, and a definition review against the KPI dictionary.",
    recreated: true,
    roleIds: ["publicis", "independent"],
    skills: ["Data QA", "Analytics documentation", "KPI governance"],
    code: `Portfolio recreation using sample data.

PRE-RELEASE DASHBOARD QA

1. Totals          Dashboard total == source total at the same grain and filter state
2. Grain           One row per key; no silent fan-out from a many-to-many join
3. Filters         Default filter state documented; "no selection" behaviour verified
4. Dates           Date grain, fiscal calendar and timezone consistent across views
5. Freshness       Refresh schedule confirmed; last-updated surfaced on the dashboard
6. Nulls           Unknown / unmapped members shown explicitly, never dropped
7. Definitions     Every metric matches the written KPI definition, name included
8. Change log      What changed since the last version, and who approved it`,
  },
  {
    id: "kpi-dictionary",
    title: "KPI definition entry",
    category: "KPI Governance",
    kind: "framework",
    summary:
      "What a governed metric definition actually contains — the artifact that stops two teams reporting different numbers for the same word.",
    detail:
      "Most 'the numbers don't match' problems are definition problems, not data problems. A KPI dictionary entry fixes the name, the owner, the exact calculation, the grain, the inclusions and exclusions, and the known caveats. Once that exists, reconciliation stops being an argument and becomes a lookup. This is the generic template, filled with sample values.",
    recreated: true,
    roleIds: ["publicis", "ziffdavis", "independent"],
    skills: ["KPI governance", "Data governance", "Analytics documentation"],
    code: `Portfolio recreation using sample data.

METRIC            Engaged Session Rate
OWNER             Business owner (named), with analytics as co-signer
DEFINITION        engaged_sessions / total_sessions
GRAIN             Day × property × channel
INCLUSIONS        Sessions with a qualifying engagement event
EXCLUSIONS        Internal traffic; known bot sources; sessions under 1s
SOURCE OF TRUTH   analytics.fct_sessions_daily
REPORTED IN       Executive dashboard, portfolio brand reporting
CAVEATS           Definition changed with the GA4 migration; pre-migration
                  periods are not directly comparable and are labelled as such
REVIEWED          Quarterly, with the business owner`,
  },
  {
    id: "brand-standardization",
    title: "Multi-brand measurement standardization",
    category: "Analytics Strategy",
    kind: "architecture",
    summary:
      "How independent brand analytics becomes portfolio-level reporting: a shared implementation standard, one KPI dictionary, then aggregate reporting.",
    detail:
      "With 20+ brands operating independently, the blocker to portfolio analysis is rarely tooling — it's that each brand's numbers mean something slightly different. The sequence that works is implementation standard first, definitions second, dashboards third. Reversing the order produces dashboards that have to be reconciled every month forever.",
    recreated: true,
    roleIds: ["ziffdavis"],
    skills: ["Analytics strategy", "KPI governance", "Digital analytics", "Data governance"],
  },
  {
    id: "reporting-architecture",
    title: "Reporting architecture during a platform migration",
    category: "Analytics Strategy",
    kind: "architecture",
    summary:
      "Running two warehouse platforms in parallel and proving they agree, so stakeholder reporting doesn't break mid-migration.",
    detail:
      "The risk in a warehouse migration is not the migration — it's the week a stakeholder opens a dashboard and the number moved. The recreation shows the parallel-run pattern: both platforms produce the same metric, a reconciliation layer compares them at a defined grain and tolerance, and the reporting layer only cuts over for a metric once it reconciles clean. Variances get triaged to a root cause rather than reconciled by hand each cycle.",
    recreated: true,
    roleIds: ["publicis"],
    skills: ["Data reconciliation", "Data QA", "Databricks", "Redshift", "SQL"],
  },
  {
    id: "patient-journey-measurement",
    title: "Digital acquisition measurement framework",
    category: "Healthcare Analytics",
    kind: "diagram",
    summary:
      "Framing healthcare digital measurement as acquisition → behaviour → engagement → conversion, rather than as a traffic report.",
    detail:
      "Healthcare digital analytics gets more useful the moment it stops reporting sessions and starts reporting the journey a prospective patient takes. This recreation maps each stage to the question it answers and the KPI that answers it, which is also what makes the reporting legible to executives outside the analytics function. No patient-level or protected health information is represented — the framework is structural only.",
    recreated: true,
    roleIds: ["uhs"],
    skills: ["Healthcare analytics", "Digital analytics", "KPI development", "Executive reporting"],
  },
  {
    id: "ga4-migration-plan",
    title: "Enterprise GA4 migration sequence",
    category: "Digital Analytics",
    kind: "workflow",
    summary:
      "The order of operations for migrating analytics across many properties without losing reporting continuity.",
    detail:
      "A multi-property GA4 migration is a governance project wearing an implementation costume. The recreation shows the sequence: inventory current measurement, agree the shared event and parameter taxonomy, implement against that standard, dual-tag and validate, rebuild reporting on the new definitions, then document which historical periods are and aren't comparable. The last step is the one most often skipped and the one stakeholders ask about first.",
    recreated: true,
    roleIds: ["ziffdavis"],
    skills: ["GA4", "Digital analytics", "Data governance", "Analytics documentation"],
  },
  {
    id: "funnel-redesign",
    title: "Funnel report: before and after",
    category: "Dashboards",
    kind: "before-after",
    summary:
      "The same funnel data presented two ways — one that reports stages, one that shows where the loss actually is.",
    detail:
      "A funnel chart that lists stage volumes tells a stakeholder what happened; one that surfaces step-to-step drop-off tells them where to act. This recreation puts the two side by side with sample data. The redesign changes no underlying numbers — only which comparison the layout makes easy, which is usually the highest-leverage thing a dashboard can change.",
    recreated: true,
    roleIds: ["independent", "uhs"],
    skills: ["Data visualization", "Dashboard design", "Conversion analysis"],
  },
  {
    id: "ab-test-readout",
    title: "A/B test readout structure",
    category: "Experiments",
    kind: "framework",
    summary:
      "A test readout that states the hypothesis, the primary metric, the result and the decision — in that order.",
    detail:
      "Experiment readouts go wrong when the result arrives before the hypothesis and the primary metric is chosen after the data. The structure in this recreation fixes the primary metric and the decision rule up front, reports the outcome against it, lists what the test does not tell you, and ends with an explicit ship / don't-ship / re-run recommendation. Figures shown are sample values.",
    recreated: true,
    roleIds: ["uhs"],
    skills: ["Experimentation", "Conversion analysis", "Analytics documentation"],
  },
];

export const workSamplesByCategory = workSampleCategories.map((category) => ({
  category,
  items: workSamples.filter((s) => s.category === category),
}));
