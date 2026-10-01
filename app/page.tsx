import { About } from "./components/About";
import { AskBand } from "./components/AskBand";
import { CaseStudyCards } from "./components/CaseStudyCards";
import { ExperienceList } from "./components/ExperienceList";
import { Hero } from "./components/Hero";
import { HowIWork } from "./components/HowIWork";
import { Numbers } from "./components/Numbers";
import { Section } from "./components/Section";
import { SectionTracker } from "./components/SectionTracker";
import { WorkSampleGallery } from "./components/WorkSampleGallery";
import { CapabilityMatrix } from "./components/viz/CapabilityMatrix";
import { CareerTimeline } from "./components/viz/CareerTimeline";
import { TechMap } from "./components/viz/TechMap";

const TRACKED_SECTIONS = [
  "experience",
  "matrix",
  "numbers",
  "work",
  "ask",
  "skills",
  "work-samples",
  "roles",
  "method",
  "about",
];

export default function HomePage() {
  // Computed on the server so the timeline's "now" marker never goes stale.
  const today = new Date();
  const now = today.getFullYear() + today.getMonth() / 12;

  return (
    <>
      <Hero />

      <Section
        id="experience"
        tone="red"
        eyebrow="Experience at a glance"
        title="Ten years from hands-on digital analytics to enterprise BI"
        lead="Technical SEO analysis into marketing and healthcare analytics, then analytics leadership, governed reporting and enterprise data platforms. Select any role for its responsibilities, tools and capabilities."
      >
        <CareerTimeline now={now} />
      </Section>

      <Section
        id="matrix"
        tone="purple"
        eyebrow="10+ years of analytics"
        title="Which capabilities each role actually involved"
        lead="No invented per-skill year counts. A filled cell means the capability is documented in that role — which is why SQL, dashboards, visualization and stakeholder reporting show up as a continuous thread rather than a one-off."
      >
        <CapabilityMatrix />
      </Section>

      <Section
        id="numbers"
        tone="teal"
        eyebrow="Experience by the numbers"
        title="Career scale, using only defensible figures"
      >
        <Numbers />
      </Section>

      <Section
        id="work"
        tone="orange"
        eyebrow="Featured work"
        title="Four case studies, written around the problem"
        lead="Each one follows the same arc: the problem, the environment it lived in, the approach, what I did, and the outcome — with a diagram of the system rather than a chart of invented results."
      >
        <CaseStudyCards />
      </Section>

      <AskBand />

      <Section
        id="skills"
        tone="blue"
        eyebrow="Technology experience"
        title="Every tool, traceable to the work it came from"
        lead="Grouped rather than piled into a logo wall. Select a technology to see the roles and case studies that evidence it — and which entries are in the skills inventory with no role-level evidence behind them."
      >
        <TechMap />
      </Section>

      <Section
        id="work-samples"
        tone="purple"
        eyebrow="Work samples"
        title="Sanitized recreations of the artifacts"
        lead="Dashboards, QA checklists, KPI definitions, reconciliation SQL and reporting architecture — rebuilt with sample data so the thinking is visible without exposing anything confidential."
      >
        <WorkSampleGallery />
      </Section>

      <Section id="roles" tone="teal" eyebrow="Professional experience" title="Employment history">
        <ExperienceList />
      </Section>

      <Section
        id="method"
        tone="blue"
        eyebrow="How I work"
        title="How I approach analytics"
        lead="The same four steps, whether the deliverable is one executive dashboard or a portfolio-wide measurement framework."
      >
        <HowIWork />
      </Section>

      <Section id="about" tone="red" eyebrow="About" title="A decade between the data and the people using it">
        <About />
      </Section>

      <SectionTracker sections={TRACKED_SECTIONS} />
    </>
  );
}
