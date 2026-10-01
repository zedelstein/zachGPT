import {
  about,
  capabilities,
  caseStudies,
  disciplines,
  howIWork,
  numbers,
  profile,
  roleById,
  roles,
  techGroups,
  workSamples,
} from "@/content";
import type { CapabilityId } from "@/content/types";
import type { Chunk, ChunkMeta } from "./types";

function meta(partial: Partial<ChunkMeta>): ChunkMeta {
  return {
    skills: [],
    roleIds: [],
    caseStudies: [],
    technologies: [],
    capabilities: [],
    ...partial,
  };
}

/** Technologies a role documents, resolved from the tech map rather than restated. */
function technologiesForRole(roleId: string): string[] {
  const names: string[] = [];
  for (const group of techGroups) {
    for (const item of group.items) {
      if (item.roleIds.includes(roleId)) names.push(item.name);
    }
  }
  return names;
}

/**
 * Compile the knowledge base.
 *
 * Chunks are intentionally small and single-topic: a question about data quality
 * should retrieve the QA paragraph of the pharmaceutical case study, not the
 * whole case study. Each chunk carries the metadata the UI needs to highlight
 * the right roles, technologies and capabilities.
 */
export function buildKnowledgeBase(): Chunk[] {
  const chunks: Chunk[] = [];

  // ---- Professional biography -------------------------------------------
  chunks.push({
    id: "bio:about",
    type: "bio",
    title: "About — professional biography",
    href: "/#about",
    body: `${profile.name}. ${profile.discipline}. ${profile.headline} ${profile.subhead}\n\n${about.paragraphs.join("\n\n")}`,
    meta: meta({
      topic: "biography",
      skills: ["SQL", "Tableau", "Power BI", "Databricks", "Redshift", "Snowflake", "BigQuery", "GA4", "Python"],
      technologies: ["SQL", "Tableau", "Power BI", "Databricks", "Redshift", "Snowflake", "BigQuery", "GA4", "Python"],
      capabilities: ["bi", "sql", "dataqa", "kpi", "reporting", "dashboards"],
    }),
  });

  chunks.push({
    id: "targets:roles",
    type: "targets",
    title: "Target roles",
    href: "/#about",
    body: `Zach is targeting roles including: ${profile.targetRoles.join(", ")}. He positions himself as an analytics, business intelligence and data governance practitioner and leader — not primarily as a data scientist, software engineer, AI engineer or data engineer.`,
    meta: meta({ topic: "target_roles" }),
  });

  // ---- Employment history ------------------------------------------------
  for (const role of roles) {
    const tech = technologiesForRole(role.id);
    const caps = role.capabilities
      .map((id) => capabilities.find((c) => c.id === id)?.label ?? id)
      .join(", ");
    const companyLine = role.companyNeedsReview ? "Earlier role" : role.company;
    const companyDetail = role.companyNeedsReview
      ? "Employer name is not recorded in this portfolio."
      : role.company;
    chunks.push({
      id: `role:${role.id}`,
      type: "role",
      title: `${companyLine} — ${role.title}`,
      href: `/#role-${role.id}`,
      body: [
        `${role.title} at ${companyDetail}. ${role.dates}${role.datesNeedReview ? " (approximate dates)" : ""}. Industry: ${role.industry}.`,
        role.focus,
        `Responsibilities: ${role.responsibilities.join("; ")}.`,
        `Tools used in this role: ${role.tools.join(", ")}.`,
        `Capabilities materially used in this role: ${caps}.`,
      ].join("\n"),
      meta: meta({
        company: role.company,
        industry: role.industry,
        topic: "employment",
        skills: role.tools,
        roleIds: [role.id],
        caseStudies: role.caseStudies,
        technologies: tech.length ? tech : role.tools,
        capabilities: role.capabilities,
      }),
    });
  }

  // ---- Case studies, split by section -----------------------------------
  for (const cs of caseStudies) {
    const role = roleById.get(cs.roleId);
    const base = meta({
      company: cs.company,
      industry: cs.industry,
      skills: cs.skills,
      roleIds: [cs.roleId],
      caseStudies: [cs.slug],
      technologies: cs.skills,
      capabilities: role?.capabilities ?? [],
    });

    chunks.push({
      id: `case:${cs.slug}:problem`,
      type: "case_study",
      title: `${cs.title} — context & problem`,
      href: `/work/${cs.slug}`,
      body: `Case study: ${cs.title} (${cs.company}, ${cs.dates}, ${cs.industry}).\nContext: ${cs.context}\nProblem: ${cs.problem}\nEnvironment: ${cs.environment.join("; ")}.`,
      meta: { ...base, topic: "problem" },
    });

    chunks.push({
      id: `case:${cs.slug}:approach`,
      type: "case_study",
      title: `${cs.title} — approach & what I did`,
      href: `/work/${cs.slug}`,
      body: `Case study: ${cs.title} (${cs.company}).\nApproach: ${cs.approach}\nWhat the work involved: ${cs.approachBullets.join("; ")}.\nReporting lifecycle: ${cs.diagram.stages.map((s) => s.label).join(" → ")}.`,
      meta: { ...base, topic: "approach" },
    });

    chunks.push({
      id: `case:${cs.slug}:outcome`,
      type: "case_study",
      title: `${cs.title} — outcome & skills`,
      href: `/work/${cs.slug}`,
      body: `Case study: ${cs.title} (${cs.company}).\nOutcome: ${cs.outcome}\nSkills demonstrated: ${cs.skills.join(", ")}.`,
      meta: { ...base, topic: "outcome" },
    });

    for (const section of cs.sections ?? []) {
      chunks.push({
        id: `case:${cs.slug}:${section.heading.toLowerCase().replace(/\W+/g, "-")}`,
        type: "case_study",
        title: `${cs.title} — ${section.heading}`,
        href: `/work/${cs.slug}`,
        body: `Case study: ${cs.title} (${cs.company}). ${section.heading}: ${section.body ?? ""} ${(section.bullets ?? []).join("; ")}`.trim(),
        meta: { ...base, topic: section.heading.toLowerCase() },
      });
    }
  }

  // ---- Technologies ------------------------------------------------------
  for (const group of techGroups) {
    for (const item of group.items) {
      const roleLines = item.roleIds
        .map((id) => {
          const r = roleById.get(id);
          if (!r) return null;
          const company = r.companyNeedsReview ? "an earlier role" : r.company;
          return `${company} — ${r.title} (${r.dates})`;
        })
        .filter(Boolean)
        .join("; ");

      const evidence =
        item.tier === "documented"
          ? `Evidence tier: DOCUMENTED. Used in: ${roleLines}.`
          : "Evidence tier: LISTED ONLY — named in the skills inventory, with no role-level evidence recorded.";

      chunks.push({
        id: `tech:${item.name.toLowerCase().replace(/\W+/g, "-")}`,
        type: "technology",
        title: `Technical skills — ${item.name}`,
        href: `/#skills`,
        body: [
          `Technology: ${item.name}.`,
          evidence,
          item.note ? `Note: ${item.note}` : "",
          item.caseStudies.length
            ? `Related case studies: ${item.caseStudies
                .map((slug) => caseStudies.find((c) => c.slug === slug)?.title ?? slug)
                .join("; ")}.`
            : "",
        ]
          .filter(Boolean)
          .join("\n"),
        meta: meta({
          topic: item.tier === "documented" ? "technology_documented" : "technology_listed",
          skills: [item.name],
          roleIds: item.roleIds,
          caseStudies: item.caseStudies,
          technologies: [item.name],
        }),
      });
    }
  }

  // ---- Analytics disciplines --------------------------------------------
  for (const d of disciplines) {
    const roleLines = d.roleIds
      .map((id) => {
        const r = roleById.get(id);
        if (!r) return null;
        return `${r.companyNeedsReview ? "an earlier role" : r.company} (${r.title})`;
      })
      .filter(Boolean)
      .join("; ");
    chunks.push({
      id: `discipline:${d.name.toLowerCase().replace(/\W+/g, "-")}`,
      type: "discipline",
      title: `Analytics discipline — ${d.name}`,
      href: "/#skills",
      body: `Analytics discipline: ${d.name}. ${d.blurb} Documented in: ${roleLines}.`,
      meta: meta({
        topic: "discipline",
        skills: [d.name],
        roleIds: d.roleIds,
        technologies: [d.name],
      }),
    });
  }

  // ---- Capability matrix -------------------------------------------------
  for (const cap of capabilities) {
    const owning = roles.filter((r) => r.capabilities.includes(cap.id as CapabilityId));
    chunks.push({
      id: `capability:${cap.id}`,
      type: "capability",
      title: `Capability — ${cap.label}`,
      href: "/#experience",
      body: `Capability: ${cap.label}. ${cap.blurb} Materially used in ${owning.length} of ${roles.length} roles: ${owning
        .map((r) => `${r.companyNeedsReview ? "an earlier role" : r.company} — ${r.title}`)
        .join("; ")}.`,
      meta: meta({
        topic: "capability",
        roleIds: owning.map((r) => r.id),
        capabilities: [cap.id],
        skills: [cap.label],
      }),
    });
  }

  // ---- Work samples ------------------------------------------------------
  for (const sample of workSamples) {
    chunks.push({
      id: `sample:${sample.id}`,
      type: "work_sample",
      title: `Work sample — ${sample.title}`,
      href: `/#work-samples`,
      body: `Work sample (portfolio recreation using sample data): ${sample.title}. Category: ${sample.category}. ${sample.summary} ${sample.detail} Skills: ${sample.skills.join(", ")}.`,
      meta: meta({
        topic: "work_sample",
        skills: sample.skills,
        roleIds: sample.roleIds,
        technologies: sample.skills,
      }),
    });
  }

  // ---- Scale and method --------------------------------------------------
  chunks.push({
    id: "numbers:scale",
    type: "numbers",
    title: "Experience by the numbers",
    href: "/#numbers",
    body: [
      "Career scale, using only figures the portfolio can substantiate:",
      ...numbers.map((n) => `${n.value} — ${n.label}${n.detail ? ` (${n.detail})` : ""}`),
    ].join("\n"),
    meta: meta({ topic: "scale" }),
  });

  chunks.push({
    id: "method:how-i-work",
    type: "method",
    title: "How I approach analytics",
    href: "/#method",
    body: `Zach's four-step approach to analytics work:\n${howIWork
      .map((s) => `${s.step} ${s.title}: ${s.body}`)
      .join("\n")}\nThe flow he describes: Question → Data → Insight → Decision.`,
    meta: meta({ topic: "method", capabilities: ["kpi", "dataqa", "reporting", "dashboards"] }),
  });

  return chunks;
}

/** Built once per server process — the content is static. */
let cached: Chunk[] | null = null;

export function knowledgeBase(): Chunk[] {
  if (!cached) cached = buildKnowledgeBase();
  return cached;
}
