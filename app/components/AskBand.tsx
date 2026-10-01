import { AskButton } from "./AskButton";
import { SuggestedQuestions } from "./assistant/SuggestedQuestions";

/**
 * The explainer for the conversational layer.
 *
 * Framed as what it is — an information-retrieval tool over a two-page resume —
 * rather than as an AI demonstration.
 */
export function AskBand() {
  return (
    <section id="ask" className="scroll-mt-24 border-t border-line bg-surface py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
          <div>
            <p className="label flex items-center gap-2 font-bold" style={{ color: "var(--color-hot)" }}>
              <span aria-hidden className="h-2.5 w-2.5 rounded-[2px]" style={{ background: "var(--color-hot)" }} />
              Interactive portfolio
            </p>
            <h2 className="mt-2.5 max-w-xl text-2xl font-semibold tracking-tight text-ink lg:text-[1.75rem]">
              Talk to my experience with{" "}
              <span className="whitespace-nowrap">
                zach<span style={{ color: "var(--color-warm)" }}>GPT</span>
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-[0.9375rem] leading-relaxed text-ink-soft">
              A resume makes you guess. Instead of reading two pages and inferring whether my
              background fits your role, ask directly — and get an answer with the portfolio
              sections it came from, so you can check it.
            </p>

            <ul className="mt-6 space-y-3">
              {[
                [
                  "Answers are grounded, not generated",
                  "Every response comes from my documented portfolio. If the evidence isn't there, it says so rather than filling the gap.",
                ],
                [
                  "Evidence is attached to every answer",
                  "Each answer expands into the exact sections behind it. Click a source and you land on it.",
                ],
                [
                  "The charts respond to the question",
                  "Ask where I've used Tableau and the career timeline highlights those roles — driven by the retrieved evidence, not by what the model felt like mentioning.",
                ],
              ].map(([title, body]) => (
                <li key={title} className="flex gap-3">
                  <span
                    aria-hidden
                    className="mt-[0.4rem] h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ background: "var(--color-hot)" }}
                  />
                  <span>
                    <span className="block text-[0.875rem] font-semibold text-ink">{title}</span>
                    <span className="mt-0.5 block text-[0.875rem] leading-relaxed text-muted">
                      {body}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <AskButton variant="primary">Ask my portfolio</AskButton>
              <AskButton variant="secondary" mode="match">
                Compare to your role
              </AskButton>
            </div>
          </div>

          <div className="rounded-xl border border-line bg-ground p-5">
            <p className="text-[0.6875rem] font-medium uppercase tracking-wider text-faint">
              Questions recruiters actually ask
            </p>
            <div className="mt-3">
              <SuggestedQuestions />
            </div>
            <p className="mt-5 border-t border-line pt-4 text-[0.75rem] leading-relaxed text-muted">
              Retrieval runs over structured versions of my resume, employment history, case studies,
              skills inventory and sanitized work samples — each chunk tagged with the company,
              industry and skills it covers.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
