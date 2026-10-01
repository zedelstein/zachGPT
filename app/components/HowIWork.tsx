import { howIWork, howIWorkFlow } from "@/content/profile";
import { TONES } from "@/lib/theme";

const STEP_TONES = [TONES.blue, TONES.purple, TONES.orange, TONES.red];
const FLOW_TONES = [TONES.blue, TONES.purple, TONES.orange, TONES.red];

export function HowIWork() {
  return (
    <>
      <ol className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {howIWork.map((step, i) => {
          const tone = STEP_TONES[i % STEP_TONES.length];
          return (
            <li
              key={step.step}
              className="group relative overflow-hidden rounded-xl border border-line bg-surface p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <span
                aria-hidden
                className="absolute inset-x-0 top-0 h-1"
                style={{ background: tone.solid }}
              />
              <p className="stat text-lg font-bold" style={{ color: tone.text }}>
                {step.step}
              </p>
              <h3 className="mt-1.5 text-[0.9375rem] font-semibold leading-snug text-ink">
                {step.title}
              </h3>
              <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">{step.body}</p>
            </li>
          );
        })}
      </ol>

      {/* Question → Data → Insight → Decision */}
      <div className="mt-8">
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
          {howIWorkFlow.map((node, i) => {
            const tone = FLOW_TONES[i % FLOW_TONES.length];
            return (
              <li key={node} className="flex items-center gap-1.5">
                <span
                  className="rounded-lg px-4 py-2 text-[0.8125rem] font-semibold text-white"
                  style={{ background: tone.solid }}
                >
                  {node}
                </span>
                {i < howIWorkFlow.length - 1 && (
                  <svg
                    aria-hidden
                    viewBox="0 0 16 16"
                    className="h-4 w-4 text-line-strong"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  >
                    <path d="M3 8h9m-3-3 3 3-3 3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            );
          })}
        </ol>
        <p className="mt-3 text-[0.8125rem] text-muted">
          Reporting that skips the first step produces dashboards nobody opens.
        </p>
      </div>
    </>
  );
}
