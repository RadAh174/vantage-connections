import { Check, BadgePercent, Sparkles } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GetStartedButton } from "@/components/ui/GetStartedButton";
import { pricing } from "@/lib/content";

export function Pricing() {
  const { plan } = pricing;

  return (
    <section
      id="pricing"
      className="scroll-mt-24 border-t border-line bg-paper-sunken/50 py-16 md:py-32"
    >
      <div className="container-page">
        <SectionHeading
          kicker={pricing.kicker}
          title={pricing.title}
          body={pricing.body}
        />

        <Reveal delay={120} className="mt-7 flex justify-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/[0.08] px-4 py-1.5 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-accent-deep">
            <BadgePercent className="h-3.5 w-3.5" strokeWidth={2} />
            {pricing.offerBadge}
          </span>
        </Reveal>

        {/* Single, everything-included plan. */}
        <Reveal delay={160} className="mx-auto mt-12 max-w-xl">
          <div className="relative flex flex-col rounded-2xl border-2 border-accent/50 bg-paper-raised p-6 text-ink shadow-lift ring-1 ring-accent/10 sm:p-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl font-medium">{plan.name}</h3>
                <p className="mt-2 text-[0.95rem] text-ink-soft">{plan.tagline}</p>
              </div>
              {/* duplicate of the section badge just above — desktop only,
                  where the card is far enough from it to need the reminder */}
              <span className="hidden shrink-0 rounded-full border border-accent/40 bg-accent/12 px-3 py-1 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-accent-deep sm:inline-flex">
                {pricing.offerBadge}
              </span>
            </div>

            <div className="mt-7 flex items-baseline gap-2">
              <span className="font-display text-[3.25rem] font-semibold leading-none">
                {plan.price}
              </span>
              <span className="text-sm text-ink-muted">during beta</span>
            </div>
            <p className="mt-2 text-[0.82rem] text-ink-muted">{plan.priceNote}</p>

            <div className="my-8 h-px w-full bg-line" />

            <ul className="flex-1 space-y-3.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-[1.15rem] w-[1.15rem] shrink-0 items-center justify-center rounded-full bg-accent-deep">
                    <Check className="h-2.5 w-2.5 text-on-accent" strokeWidth={3.5} />
                  </span>
                  <span className="text-[0.95rem] leading-snug text-ink">{f}</span>
                </li>
              ))}
            </ul>

            <GetStartedButton
              plan={plan.name}
              variant="primary"
              withArrow
              size="lg"
              className="mt-9 w-full"
            >
              {plan.cta}
            </GetStartedButton>
          </div>
        </Reveal>

        {/* Coming-soon band — replaces the old launch-offer countdown. */}
        <Reveal
          delay={220}
          className="mx-auto mt-8 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-line bg-paper-raised px-6 py-5 text-center"
        >
          <Sparkles className="h-4 w-4 shrink-0 text-accent-deep" strokeWidth={2} />
          <p className="text-[0.92rem] text-ink-soft">
            <span className="font-medium text-ink">{pricing.comingSoon}.</span>{" "}
            {pricing.comingSoonNote}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
