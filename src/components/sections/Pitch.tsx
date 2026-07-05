import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { Wordmark } from "@/components/site/Wordmark";
import { pitch } from "@/lib/content";

export function Pitch() {
  return (
    <section className="relative overflow-hidden bg-paper-sunken/50 py-24 md:py-32">
      <div className="container-page">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Copy */}
          <div className="max-w-xl">
            <Reveal>
              <span className="kicker text-accent-deep">{pitch.kicker}</span>
            </Reveal>
            <Reveal delay={80}>
              <h2 className="font-display mt-4 text-balance text-3xl font-medium leading-[1.08] tracking-[-0.018em] text-ink sm:text-4xl md:text-[2.85rem]">
                {pitch.title}
              </h2>
            </Reveal>
            <Reveal delay={150}>
              <p className="mt-6 text-pretty text-[1.05rem] leading-relaxed text-ink-soft">
                {pitch.body}
              </p>
            </Reveal>
          </div>

          {/* Roles → Otto diagram — stacks vertically on mobile (roles, arrow
              down, card), flows left-to-right from sm up */}
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

              {/* connector — points down when stacked, right when side-by-side */}
              <div className="flex items-center justify-center text-accent">
                <ArrowRight className="h-6 w-6 rotate-90 sm:rotate-0" strokeWidth={1.5} />
              </div>

              {/* Otto card */}
              <div className="flex h-full min-h-[140px] flex-col items-center justify-center rounded-xl border border-accent/30 bg-paper-raised px-7 py-8 text-center shadow-soft sm:min-h-[180px]">
                <Wordmark />
                <p className="mt-3 max-w-[12rem] text-[0.82rem] leading-snug text-ink-soft sm:max-w-[9rem]">
                  One teammate. Always in context.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
