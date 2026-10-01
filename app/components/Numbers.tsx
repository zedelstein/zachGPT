import { numbers } from "@/content/profile";
import { TONES } from "@/lib/theme";

const TILE_TONES = [TONES.red, TONES.orange, TONES.purple, TONES.teal, TONES.blue, TONES.red];

export function Numbers() {
  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {numbers.map((stat, i) => {
          const tone = TILE_TONES[i % TILE_TONES.length];
          return (
            <li
              key={stat.label}
              className="group relative overflow-hidden rounded-xl border border-line bg-surface p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-ink/[0.06]"
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1 transition-all duration-200 group-hover:w-1.5"
                style={{ background: tone.solid }}
              />
              <p
                className="stat text-[2.25rem] font-bold leading-none"
                style={{ color: tone.text }}
              >
                {stat.value}
              </p>
              <p className="mt-2.5 text-[0.875rem] font-semibold text-ink">{stat.label}</p>
              {stat.detail && (
                <p className="mt-1 text-[0.8125rem] leading-snug text-muted">{stat.detail}</p>
              )}
            </li>
          );
        })}
      </ul>
      <p className="mt-5 max-w-2xl text-[0.8125rem] leading-relaxed text-muted">
        Every figure here is one the portfolio can substantiate. Where an exact number
        can&apos;t be, the value is descriptive rather than invented — which is why you won&apos;t
        find a &ldquo;40% faster reporting&rdquo; claim anywhere on this site.
      </p>
    </>
  );
}
