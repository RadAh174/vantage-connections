import { ArrowRight, Check, X } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Wordmark } from "@/components/site/Wordmark";
import { operator, pitch, problem } from "@/lib/content";

/**
 * The single positioning section — merges what used to be three sections
 * (Problem, Pitch, OperatorBand) into one argument told once:
 * quiet rot -> the hire that fixes it -> one brain vs. the tool stack.
 */
export function Positioning() {
  const { them, otto } = operator.contrast;

  return (
    <section
      id="operator"
      className="grain band-soft relative scroll-mt-24 overflow-hidden py-16 text-ink md:py-32"
    >
      {/* accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-[55vh] w-[55vw] -translate-x-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(var(--c-accent-rgb),0.3), rgba(var(--c-accent-rgb),0) 70%)",
        }}
      />

      <div className="container-page relative z-10">
        {/* the quiet-rot problem, told once */}
        <SectionHeading
          kicker={problem.kicker}
          title={problem.title}
          body={problem.body}
        />

        {/* the hire that fixes it */}
        <div className="mt-12 grid items-center gap-12 md:mt-24 lg:grid-cols-2 lg:gap-20">
          <div className="max-w-xl">
            <Reveal>
              <span className="kicker text-accent-deep">{pitch.kicker}</span>
            </Reveal>
            <Reveal delay={80}>
              <h3 className="font-display mt-4 text-balance text-3xl font-medium leading-[1.08] tracking-[-0.018em] text-ink sm:text-4xl">
                {pitch.title}
              </h3>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 text-pretty text-[1.05rem] leading-relaxed text-ink-soft">
                {pitch.body}
              </p>
            </Reveal>
          </div>

          {/* Roles → Vantage diagram — stacks vertically on mobile */}
          <Reveal delay={120} className="relative">
            <div className="flex flex-col gap-4 sm:grid sm:grid-cols-[1fr_auto_auto] sm:items-center sm:gap-x-8 sm:gap-y-3">
              <ul className="grid grid-cols-2 gap-2.5 sm:flex sm:flex-col">
                {pitch.replaces.map((role) => (
                  <li
                    key={role}
                    className="flex items-center justify-center rounded-lg border border-line bg-paper-raised px-3 py-2.5 text-center sm:justify-between sm:px-4 sm:text-left"
                  >
                    <span className="text-[0.9rem] text-ink-soft line-through decoration-accent/50 decoration-1 sm:text-[0.92rem]">
                      {role}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-center text-accent">
                <ArrowRight className="h-6 w-6 rotate-90 sm:rotate-0" strokeWidth={1.5} />
              </div>

              <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-xl border border-accent/30 bg-paper-raised px-7 py-8 text-center shadow-soft sm:min-h-[180px]">
                <Wordmark />
                <p className="mt-3 max-w-[12rem] text-[0.82rem] leading-snug text-ink-soft sm:max-w-[9rem]">
                  One teammate. Always in context.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* one brain vs. the tool stack */}
        <Reveal className="mx-auto mt-12 max-w-4xl text-center md:mt-24">
          <h3 className="font-display text-2xl font-medium leading-tight text-ink sm:text-3xl">
            {operator.title}
          </h3>
        </Reveal>
        <div className="mx-auto mt-8 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-line bg-paper-raised p-7 shadow-soft">
            <h4 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-muted">
              {them.label}
            </h4>
            <ul className="mt-5 space-y-3.5">
              {them.items.map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted"
                    strokeWidth={2.25}
                  />
                  <span className="text-[0.95rem] text-ink-soft">{it}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-2xl border border-accent/40 bg-paper-raised bg-gradient-to-b from-accent/[0.07] to-transparent p-7 shadow-soft"
          >
            <h4 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-accent-deep">
              {otto.label}
            </h4>
            <ul className="mt-5 space-y-3.5">
              {otto.items.map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-deep">
                    <Check
                      className="h-2.5 w-2.5 text-on-accent"
                      strokeWidth={3.5}
                    />
                  </span>
                  <span className="text-[0.95rem] text-ink">{it}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
