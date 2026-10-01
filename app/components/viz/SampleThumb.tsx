import type { WorkSample } from "@/content/types";

/**
 * Abstract thumbnails, drawn per sample kind.
 *
 * Deliberately schematic: they convey the shape of the artifact without
 * implying a screenshot of real client work. Inline SVG, no image requests.
 */
export function SampleThumb({
  kind,
  accent = "var(--color-cool)",
  data = "var(--color-hot)",
}: {
  kind: WorkSample["kind"];
  /** Primary mark colour, usually the sample category's hue. */
  accent?: string;
  /** Secondary mark colour for contrast within the thumbnail. */
  data?: string;
}) {
  const line = "var(--color-line-strong)";
  const ink = "var(--color-ink-soft)";

  const common = {
    viewBox: "0 0 160 90",
    className: "h-full w-full",
    role: "img" as const,
    "aria-hidden": true,
  };

  if (kind === "dashboard") {
    return (
      <svg {...common}>
        {[8, 60, 112].map((x) => (
          <g key={x}>
            <rect x={x} y={10} width={40} height={22} rx={3} fill="var(--color-surface)" stroke={line} />
            <rect x={x + 5} y={16} width={16} height={3} rx={1.5} fill={line} />
            <rect x={x + 5} y={22} width={24} height={5} rx={2} fill={accent} opacity={0.75} />
          </g>
        ))}
        <rect x={8} y={40} width={144} height={42} rx={3} fill="var(--color-surface)" stroke={line} />
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <rect
            key={i}
            x={16 + i * 17}
            y={74 - (i % 4) * 7 - 6}
            width={9}
            height={(i % 4) * 7 + 6}
            rx={1.5}
            fill={data}
            opacity={0.55 + (i % 4) * 0.12}
          />
        ))}
      </svg>
    );
  }

  if (kind === "sql") {
    const widths = [60, 92, 44, 108, 76, 50, 96, 38];
    return (
      <svg {...common}>
        <rect x={8} y={8} width={144} height={74} rx={3} fill="var(--color-surface)" stroke={line} />
        {widths.map((w, i) => (
          <g key={i}>
            <rect x={14} y={16 + i * 8} width={4} height={3} rx={1.5} fill={line} />
            <rect
              x={22 + (i === 2 || i === 5 || i === 7 ? 8 : 0)}
              y={16 + i * 8}
              width={w}
              height={3}
              rx={1.5}
              fill={i % 3 === 0 ? accent : ink}
              opacity={i % 3 === 0 ? 0.8 : 0.35}
            />
          </g>
        ))}
      </svg>
    );
  }

  if (kind === "workflow") {
    return (
      <svg {...common}>
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={14} y={10 + i * 19} width={132} height={14} rx={3} fill="var(--color-surface)" stroke={line} />
            <circle cx={23} cy={17 + i * 19} r={4} fill={i < 2 ? data : "none"} stroke={i < 2 ? data : line} opacity={i < 2 ? 0.8 : 1} />
            <rect x={33} y={15.5 + i * 19} width={70 - i * 9} height={3} rx={1.5} fill={ink} opacity={0.35} />
          </g>
        ))}
      </svg>
    );
  }

  if (kind === "framework") {
    return (
      <svg {...common}>
        <rect x={8} y={8} width={144} height={74} rx={3} fill="var(--color-surface)" stroke={line} />
        <line x1={58} y1={8} x2={58} y2={82} stroke={line} />
        {[0, 1, 2, 3, 4, 5, 6].map((i) => (
          <g key={i}>
            {i > 0 && <line x1={8} y1={8 + i * 10.5} x2={152} y2={8 + i * 10.5} stroke={line} opacity={0.6} />}
            <rect x={14} y={13 + i * 10.5} width={32} height={3} rx={1.5} fill={i === 0 ? accent : ink} opacity={i === 0 ? 0.85 : 0.4} />
            <rect x={64} y={13 + i * 10.5} width={62 - (i % 3) * 14} height={3} rx={1.5} fill={ink} opacity={0.3} />
          </g>
        ))}
      </svg>
    );
  }

  if (kind === "architecture") {
    return (
      <svg {...common}>
        {[12, 64, 116].map((x, i) => (
          <rect key={x} x={x} y={i === 1 ? 20 : 12} width={32} height={i === 1 ? 50 : 28} rx={3} fill="var(--color-surface)" stroke={i === 1 ? accent : line} />
        ))}
        <rect x={12} y={54} width={32} height={28} rx={3} fill="var(--color-surface)" stroke={line} />
        <path d="M44 26h20M44 68h20M96 45h20" stroke={line} strokeWidth={1.2} strokeDasharray="3 3" />
        <circle cx={80} cy={45} r={5} fill={data} opacity={0.75} />
        <rect x={120} y={46} width={24} height={3} rx={1.5} fill={ink} opacity={0.35} />
        <rect x={120} y={53} width={16} height={3} rx={1.5} fill={ink} opacity={0.25} />
      </svg>
    );
  }

  if (kind === "before-after") {
    return (
      <svg {...common}>
        <rect x={8} y={10} width={68} height={70} rx={3} fill="var(--color-surface)" stroke={line} />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={16} y={20 + i * 15} width={52 - i * 4} height={9} rx={2} fill={ink} opacity={0.2} />
        ))}
        <rect x={84} y={10} width={68} height={70} rx={3} fill="var(--color-surface)" stroke={accent} />
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <rect x={92} y={20 + i * 15} width={52 - i * 13} height={9} rx={2} fill={data} opacity={0.65} />
            {i > 0 && (
              <rect x={92 + (52 - i * 13)} y={23 + i * 15} width={i * 13 - 2} height={3} rx={1.5} fill={accent} opacity={0.4} />
            )}
          </g>
        ))}
      </svg>
    );
  }

  // diagram
  return (
    <svg {...common}>
      {[[24, 24], [80, 16], [80, 46], [136, 32], [80, 74]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r={i === 0 ? 9 : 7} fill={i === 0 ? accent : "var(--color-surface)"} stroke={i === 0 ? accent : line} strokeWidth={1.4} opacity={i === 0 ? 0.85 : 1} />
      ))}
      <path
        d="M33 24 73 17M33 26 73 45M33 29 73 71M87 18l42 12M87 45l42-11"
        stroke={line}
        strokeWidth={1.2}
        fill="none"
      />
      <circle cx={80} cy={16} r={2.5} fill={data} opacity={0.7} />
      <circle cx={80} cy={46} r={2.5} fill={data} opacity={0.7} />
    </svg>
  );
}
