/**
 * The categorical and diverging colour system.
 *
 * Colour is used to encode, not to decorate: a role's hue is its industry, a
 * technology's hue is its group, and a capability cell's hue is how much of
 * the career it spans — blue for narrow, red for pervasive, the way a
 * percentile bar reads. Keeping the mapping in one module is what stops the
 * timeline, the matrix and the technology map drifting into different palettes.
 */

export interface Tone {
  /** Full-strength fill, for bars and filled cells. */
  solid: string;
  /** Tinted fill, for chips and card washes. */
  soft: string;
  /** Border tint that sits on the soft fill. */
  line: string;
  /** Readable text colour on a light background. */
  text: string;
}

export const TONES = {
  red: {
    solid: "var(--color-hot)",
    soft: "var(--color-hot-soft)",
    line: "var(--color-hot-line)",
    text: "var(--color-hot)",
  },
  orange: {
    solid: "var(--color-warm)",
    soft: "var(--color-warm-soft)",
    line: "var(--color-warm-line)",
    text: "var(--color-flag)",
  },
  blue: {
    solid: "var(--color-cool)",
    soft: "var(--color-cool-soft)",
    line: "var(--color-cool-line)",
    text: "var(--color-cool)",
  },
  teal: {
    solid: "var(--color-teal)",
    soft: "var(--color-teal-soft)",
    line: "var(--color-teal-line)",
    text: "var(--color-teal)",
  },
  purple: {
    solid: "var(--color-purple)",
    soft: "var(--color-purple-soft)",
    line: "var(--color-purple-line)",
    text: "var(--color-purple)",
  },
  slate: {
    solid: "var(--color-line-strong)",
    soft: "var(--color-raised)",
    line: "var(--color-line)",
    text: "var(--color-muted)",
  },
} as const satisfies Record<string, Tone>;

export type ToneName = keyof typeof TONES;

/** Industry families, in legend order. */
export const INDUSTRY_FAMILIES: { label: string; tone: ToneName }[] = [
  { label: "Healthcare & pharma", tone: "red" },
  { label: "Digital media", tone: "orange" },
  { label: "Marketing", tone: "purple" },
  { label: "Multi-industry consulting", tone: "teal" },
  { label: "Digital & SEO", tone: "blue" },
];

/** Role id → industry tone. */
export const ROLE_TONE: Record<string, ToneName> = {
  publicis: "red",
  uhs: "red",
  ziffdavis: "orange",
  "stella-rising": "purple",
  stratega: "teal",
  majux: "purple",
  gen3: "blue",
};

/** Technology group id → tone. */
export const GROUP_TONE: Record<string, ToneName> = {
  bi: "red",
  query: "purple",
  platforms: "teal",
  digital: "orange",
  modeling: "blue",
  ai: "red",
};

/** Work-sample category → tone. */
export const CATEGORY_TONE: Record<string, ToneName> = {
  Dashboards: "red",
  "Data Quality": "blue",
  "KPI Governance": "purple",
  "Analytics Strategy": "teal",
  "Healthcare Analytics": "red",
  "Digital Analytics": "orange",
  Experiments: "purple",
};

export function toneFor(name: ToneName | undefined): Tone {
  return TONES[name ?? "slate"];
}

/**
 * Diverging coverage scale.
 *
 * `ratio` is the share of roles in which a capability is documented. The scale
 * runs cool (narrow) to hot (pervasive) in five steps, so reading down the
 * matrix shows at a glance which capabilities are the through-line of the
 * career and which are specific to one job.
 */
export function coverageTone(ratio: number): Tone & { rank: string } {
  if (ratio >= 0.85) return { ...TONES.red, rank: "Every role" };
  if (ratio >= 0.6) return { ...TONES.orange, rank: "Most roles" };
  if (ratio >= 0.4) return { ...TONES.purple, rank: "About half" };
  if (ratio >= 0.2) return { ...TONES.blue, rank: "Several roles" };
  return { ...TONES.slate, rank: "Role-specific" };
}
