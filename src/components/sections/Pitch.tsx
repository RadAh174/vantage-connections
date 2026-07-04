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

          {/* Roles → Otto diagram */}
          <Reveal delay={120} className="relative">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-5 gap-y-3 sm:gap-x-8">
              <ul className="flex flex-col gap-2.5">
                {pitch.replaces.map((role) => (
                  <li
                    key={role}
                    className="flex items-center justify-between rounded-lg border border-line bg-paper-raised px-4 py-2.5"
                  >
                    <span className="text-[0.92rem] text-ink-soft line-through decoration-accent/50 decoration-1">
                      {role}
                    </span>
                  </li>
                ))}
              </ul>

              {/* connector */}
              <div className="flex items-center justify-center text-accent">
                <ArrowRight className="h-6 w-6" strokeWidth={1.5} />
              </div>

              {/* Otto card */}
              <div className="flex h-full min-h-[180px] flex-col items-center justify-center rounded-xl border border-accent/30 bg-paper-raised px-7 py-8 text-center shadow-soft">
                <Wordmark />
                <p className="mt-3 max-w-[9rem] text-[0.82rem] leading-snug text-ink-soft">
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
