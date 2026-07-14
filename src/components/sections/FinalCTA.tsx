import { Reveal } from "@/components/ui/Reveal";
import { GetStartedButton } from "@/components/ui/GetStartedButton";
import { finalCta } from "@/lib/content";

export function FinalCTA() {
  return (
    <section
      id="cta"
      className="band-soft grain relative scroll-mt-24 overflow-hidden py-16 text-ink md:py-36"
    >
      {/* accent glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(var(--c-accent-rgb),0.26), rgba(var(--c-accent-rgb),0) 70%)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <Reveal>
            <span className="kicker text-accent-deep">{finalCta.kicker}</span>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="font-display mt-5 text-balance text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl md:text-[4.25rem]">
              {finalCta.title}
            </h2>
          </Reveal>
          <Reveal delay={150}>
            <p className="mx-auto mt-7 max-w-xl text-pretty text-[1.1rem] leading-relaxed text-ink-soft">
              {finalCta.body}
            </p>
          </Reveal>

          <Reveal delay={220}>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <GetStartedButton
                variant="primary"
                size="lg"
                withArrow
                className="w-full max-w-sm sm:w-auto sm:max-w-none"
              >
                {finalCta.primary.label}
              </GetStartedButton>
              <a
                href={finalCta.secondary.href}
                className="w-full max-w-sm rounded-full border border-line-strong px-7 py-4 text-center text-[1rem] font-medium text-ink transition-all duration-200 hover:bg-paper-raised sm:w-auto sm:max-w-none"
              >
                {finalCta.secondary.label}
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
