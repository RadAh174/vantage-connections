import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Marginalia } from "@/components/ui/Marginalia";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { pricingTiers, faqs } from "@/lib/content/pricing";

export const metadata = {
  title: "Pricing",
  description:
    "Simple pricing. Honest scope. Three tiers — Starter, Standard, Bespoke.",
};

// ---------------- Hero word-cascade setup ----------------
// Mirrors home + /work: per-word `hero-word` spans with inline
// animation-delay so the headline cascades in. Same 240ms step for
// rhythm consistency. Italic ColorWord accent on "Simple" — the
// natural emphasis (this is the studio's pricing posture).
const HERO_LINE_1 = ["Simple"]; // accent renders here as "Simple"
const HERO_LINE_2 = ["Honest", "scope."];
const STEP_MS = 240;

export default function PricingPage() {
  // Delay sequence:
  //   0:  "Simple" (accent, line 1)
  //   1:  "pricing." (line 1)
  //   2:  "Honest" (line 2)
  //   3:  "scope." (line 2)
  const accentDelayMs = 0;
  const pricingDelayMs = STEP_MS;
  const line2BaseDelayMs = 2 * STEP_MS;
  const totalWords = 4;
  const ledeDelayMs = (totalWords + 1) * STEP_MS;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero pattern (mirrors /work): ~52dvh, no
            HeroFader, eyebrow + per-word cascade headline + lede. */}
        <section className="relative min-h-[52dvh] flex flex-col gap-6 md:gap-7 pt-16 md:pt-28 pb-12 md:pb-16 max-w-4xl">
          <Reveal>
            <Eyebrow color="forest">PRICING · HONEST SCOPE</Eyebrow>
          </Reveal>

          <h1
            className="font-display text-headline"
            style={{
              fontSize: "clamp(2.25rem, 5.5vw, 4.75rem)",
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: "-0.018em",
            }}
          >
            {/* Line 1: "Simple pricing." — italic gold accent on "Simple" */}
            <span className="block">
              <span
                className="hero-word"
                style={{ animationDelay: `${accentDelayMs}ms` }}
              >
                <ColorWord>Simple</ColorWord>{" "}
              </span>
              <span
                className="hero-word"
                style={{ animationDelay: `${pricingDelayMs}ms` }}
              >
                pricing.
              </span>
            </span>
            {/* Line 2: "Honest scope." */}
            <span className="block">
              {HERO_LINE_2.map((word, i) => (
                <span
                  key={`l2-${i}`}
                  className="hero-word"
                  style={{
                    animationDelay: `${line2BaseDelayMs + i * STEP_MS}ms`,
                  }}
                >
                  {word}{" "}
                </span>
              ))}
            </span>
          </h1>

          <Reveal delay={ledeDelayMs}>
            <p className="max-w-[540px] text-[16px] md:text-[18px] leading-[1.55] text-ink-muted">
              Three tiers. Fixed scope, fixed timeline, fixed price. No
              hourly. No retainers. Every project ships and we move on.
            </p>
          </Reveal>
        </section>

        <AuroraHairline />

        {/* ---------------- Tiers ---------------- */}
        <section className="pt-12 md:pt-16 pb-16 md:pb-20">
          {pricingTiers.length === 0 ? (
            <Reveal>
              <div className="rounded-xl border border-line bg-surface-calm px-6 md:px-8 py-10 md:py-14 flex flex-col gap-5 items-start max-w-3xl">
                <Eyebrow color="forest">ENGAGEMENT MODEL</Eyebrow>
                <p
                  className="font-display text-[22px] md:text-[28px] leading-tight text-ink"
                  style={{ fontWeight: 500 }}
                >
                  Pricing is scoped per engagement — Starter, Standard,
                  Bespoke. Get in touch for a tailored quote.
                </p>
                <p className="text-ink-muted text-[15px] max-w-xl leading-relaxed">
                  Every project is scoped honestly — what it costs, what it
                  includes, what it doesn&apos;t.
                </p>
                <p className="font-mono text-[12px] text-ink-muted">
                  {/* TODO_PRICING_TIERS: fill lib/content/pricing.ts >
                      pricingTiers with real Starter / Standard / Bespoke
                      ranges. */}
                  No invented numbers.
                </p>
                <Button href="/contact" variant="secondary" size="lg">
                  Get a quote
                </Button>
              </div>
            </Reveal>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
              {pricingTiers.map((t, i) => (
                <Reveal key={t.name} delay={i * 80}>
                  {/* Highlighted tier: gold-gradient ring (via box-shadow) on
                      a normal surface card. The inner contents stay legible
                      against bg-surface in both light and dark mode. */}
                  <article
                    className={`relative rounded-2xl p-5 md:p-7 flex flex-col gap-4 md:gap-5 border h-full bg-surface text-ink ${
                      t.highlighted
                        ? "border-transparent shadow-[0_0_0_1.5px_var(--color-gold)]"
                        : "border-line"
                    }`}
                  >
                    <header className="flex flex-col gap-1.5 md:gap-2">
                      <h3
                        className="font-display text-[24px] md:text-[28px]"
                        style={{ fontWeight: 600 }}
                      >
                        {t.name}
                      </h3>
                      <span className="text-[14px] text-ink-muted">
                        {t.tagline}
                      </span>
                    </header>

                    <div className="font-mono text-[14px] text-ink-muted">
                      {t.range}
                    </div>

                    <p className="text-[14px] leading-relaxed text-ink-muted">
                      <span className="font-mono uppercase tracking-[0.14em] text-[10.5px] block mb-1">
                        Best for
                      </span>
                      {t.bestFor}
                    </p>

                    {/* Forest+gold hairline divider inside card */}
                    <AuroraHairline animate={false} />

                    <ul className="flex flex-col gap-2.5 text-[14px]">
                      {t.included.map((f) => (
                        <li
                          key={f}
                          className="flex items-start gap-2.5 font-mono"
                        >
                          <CheckIcon className="text-forest" />
                          <span className="text-ink">{f}</span>
                        </li>
                      ))}
                      {t.notIncluded?.map((f) => (
                        <li
                          key={`x-${f}`}
                          className="flex items-start gap-2.5 font-mono line-through text-ink-muted"
                        >
                          <span aria-hidden="true" className="opacity-60">
                            ×
                          </span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-auto">
                      <Button
                        href={t.ctaHref ?? "/contact"}
                        variant={t.highlighted ? "primary" : "secondary"}
                        size="md"
                      >
                        {t.ctaLabel}
                      </Button>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          )}
        </section>

        {/* ---------------- Marginalia row ---------------- */}
        <section className="pb-16 flex justify-end">
          <Marginalia className="max-w-sm">
            we don&apos;t do hourly. we don&apos;t do retainers. we ship and
            we move on.
          </Marginalia>
        </section>

        {/* ---------------- FAQ ---------------- */}
        <section className="py-16 md:py-20">
          <AuroraHairline />
          <div className="pt-10 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow color="forest">FAQ</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Common <ColorWord>questions</ColorWord>.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              {faqs.length === 0 ? (
                <Reveal>
                  <div className="rounded-xl border border-line bg-surface-calm px-6 py-8 max-w-xl flex flex-col gap-2">
                    <Eyebrow color="forest">QUESTIONS</Eyebrow>
                    <p className="font-mono text-[13px] text-ink-muted">
                      Specific question? Reach out below — usually answered
                      within 24 hours.
                    </p>
                    {/* TODO_PRICING_FAQS: fill lib/content/pricing.ts > faqs. */}
                  </div>
                </Reveal>
              ) : (
                <ul className="flex flex-col">
                  {faqs.map((item, i) => (
                    <Reveal key={item.q} delay={i * 60}>
                      <li className="border-b border-line last:border-b-0">
                        <details className="group py-5 md:py-6">
                          <summary className="flex items-start justify-between gap-4 md:gap-6 cursor-pointer list-none">
                            <span
                              className="font-display text-[17px] md:text-[20px] text-ink leading-snug min-w-0"
                              style={{ fontWeight: 500 }}
                            >
                              {item.q}
                            </span>
                            <span
                              aria-hidden="true"
                              className="font-mono text-ink-muted text-[14px] group-open:rotate-45 transition-transform shrink-0 mt-1"
                            >
                              +
                            </span>
                          </summary>
                          <p className="mt-3 text-ink-muted text-[15px] md:text-[16px] leading-relaxed max-w-[640px]">
                            {item.a}
                          </p>
                        </details>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- Closing ---------------- */}
        <section className="py-16 md:py-20">
          <AuroraHairline />
          <Reveal className="pt-12 md:pt-14 flex flex-col gap-5 md:gap-6 items-start">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Need a custom <ColorWord>quote</ColorWord>?
            </h2>
            <Button href="/contact" variant="primary" size="lg">
              Get in touch
            </Button>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      aria-hidden="true"
      className={`mt-[3px] shrink-0 ${className}`}
    >
      <path
        d="M2 7.5 L5.5 11 L12 3.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
