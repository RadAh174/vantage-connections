import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { how } from "@/lib/content";

export function HowItWorks() {
  return (
    <section id="how" className="scroll-mt-24 py-16 md:py-32">
      <div className="container-page">
        <SectionHeading kicker={how.kicker} title={how.title} />

        <div className="relative mx-auto mt-16 max-w-5xl">
          {/* connecting line */}
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[2.15rem] hidden h-px bg-gradient-to-r from-transparent via-line-strong to-transparent md:block"
          />
          <ol className="grid gap-10 md:grid-cols-3 md:gap-8">
            {how.steps.map((step, i) => (
              <Reveal
                key={step.n}
                delay={i * 120}
                as="li"
                className="relative flex flex-col items-start"
              >
                <span className="font-display relative z-10 flex h-[4.3rem] w-[4.3rem] items-center justify-center rounded-full border border-line bg-paper-raised text-xl font-semibold text-accent-deep shadow-soft">
                  {step.n}
                </span>
                <h3 className="font-display mt-6 text-xl font-medium text-ink">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.96rem] leading-relaxed text-ink-soft">
                  {step.desc}
                </p>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
