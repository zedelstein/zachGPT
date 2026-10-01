import { toneFor, type ToneName } from "@/lib/theme";

export function Section({
  id,
  eyebrow,
  title,
  lead,
  children,
  tone = "slate",
}: {
  id: string;
  eyebrow: string;
  title: string;
  lead?: string;
  children: React.ReactNode;
  tone?: ToneName;
}) {
  const t = toneFor(tone);
  return (
    <section id={id} className="scroll-mt-24 border-t border-line py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <header className="mb-8 max-w-2xl">
          <p className="label flex items-center gap-2 font-semibold" style={{ color: t.text }}>
            <span aria-hidden className="h-2.5 w-2.5 rounded-[2px]" style={{ background: t.solid }} />
            {eyebrow}
          </p>
          <h2 className="mt-2.5 text-2xl font-semibold tracking-tight text-ink lg:text-[1.75rem]">
            {title}
          </h2>
          {lead && <p className="mt-3 text-[0.9375rem] leading-relaxed text-ink-soft">{lead}</p>}
        </header>
        {children}
      </div>
    </section>
  );
}
