import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { services } from "@/lib/content/services";

export const metadata = {
  title: "Services",
  description:
    "Vantage Connections services — luxury web design across real estate and premium artisan ecommerce. Pillar, sub-pillar, and dedicated spoke pages for each specialization.",
  alternates: { canonical: "/services" },
};

const HERO_LINE_1 = ["What", "we"];
const HERO_LINE_2 = ["build."];
const HERO_STEP_MS = 240;

export default function ServicesHubPage() {
  const pillar = services.find((s) => s.category === "pillar");
  const subPillars = services.filter((s) => s.category === "sub-pillar");
  const spokesByParent = (parentSlug: string) =>
    services.filter(
      (s) => s.category === "spoke" && s.parentSlug === parentSlug
    );
  const totalHeroWords = HERO_LINE_1.length + HERO_LINE_2.length;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Hero */}
        <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-16 max-w-4xl">
          <span
            className="hero-word block mb-6"
            style={{ animationDelay: "0ms" }}
          >
            <Eyebrow color="forest">SERVICES · WHAT WE BUILD</Eyebrow>
          </span>

          <h1
            className="font-display text-headline"
            style={{
              fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.018em",
            }}
          >
            <span className="block">
              {HERO_LINE_1.map((word, i) => (
                <span
                  key={`l1-${i}`}
                  className="hero-word"
                  style={{ animationDelay: `${(i + 1) * HERO_STEP_MS}ms` }}
                >
                  {word}{" "}
                </span>
              ))}
            </span>
            <span className="block">
              {HERO_LINE_2.map((word, i) => {
                const bare = word.replace(/[.,]$/, "");
                const punct = word.slice(bare.length);
                return (
                  <span
                    key={`l2-${i}`}
                    className="hero-word"
                    style={{
                      animationDelay: `${
                        (HERO_LINE_1.length + i + 1) * HERO_STEP_MS
                      }ms`,
                    }}
                  >
                    <ColorWord>{bare}</ColorWord>
                    {punct}{" "}
                  </span>
                );
              })}
            </span>
          </h1>

          <p
            className="hero-word mt-7 max-w-[640px] text-[18px] leading-[1.55] text-ink-muted"
            style={{
              animationDelay: `${(totalHeroWords + 1) * HERO_STEP_MS}ms`,
            }}
          >
            Bespoke websites with deep focus on luxury real estate and
            premium artisan brands — and a track record across adjacent
            verticals. Every engagement runs on a managed-monthly model:
            design, build, host, and care, under one fee.
          </p>
        </section>

        <AuroraHairline />

        {/* Top pillar */}
        {pillar && (
          <section className="py-16 md:py-20">
            <Reveal>
              <Link
                href={`/services/${pillar.slug}`}
                className="mobile-tap-scale group block rounded-2xl border border-line bg-surface px-6 md:px-10 py-10 md:py-14 hover:border-forest/40 hover:shadow-[0_8px_30px_-15px_rgba(212,158,15,0.35)] transition-all"
              >
                <Eyebrow color="forest">{pillar.eyebrow}</Eyebrow>
                <h2
                  className="font-display mt-4 text-ink group-hover:text-forest transition-colors"
                  style={{
                    fontSize: "clamp(2.25rem, 4.5vw, 3.75rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.018em",
                  }}
                >
                  {pillar.title} →
                </h2>
                <p className="mt-5 max-w-2xl text-ink-muted text-[16px] md:text-[17px] leading-relaxed">
                  {pillar.directAnswer}
                </p>
              </Link>
            </Reveal>
          </section>
        )}

        <AuroraHairline />

        {/* Verticals: sub-pillars with spoke lists */}
        {subPillars.map((sp) => {
          const spokes = spokesByParent(sp.slug);
          return (
            <section key={sp.slug} className="py-16 md:py-20">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                <div className="lg:col-span-4">
                  <Reveal className="flex flex-col gap-4 lg:sticky lg:top-28">
                    <Eyebrow color="forest">{sp.eyebrow}</Eyebrow>
                    <h2
                      className="font-display"
                      style={{
                        fontSize: "clamp(2rem, 4vw, 3.25rem)",
                        fontWeight: 600,
                        lineHeight: 1.05,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {sp.title}
                    </h2>
                    <p className="text-ink-muted text-[15px] leading-relaxed max-w-xs">
                      {sp.directAnswer}
                    </p>
                    <Link
                      href={`/services/${sp.slug}`}
                      className="self-start text-forest text-[14px] inline-flex items-center gap-1.5 border-b border-current pb-0.5 mt-1 hover:text-ink transition-colors"
                    >
                      Read the vertical overview →
                    </Link>
                  </Reveal>
                </div>
                <div className="lg:col-span-8">
                  <Reveal
                    stagger
                    staggerStep={60}
                    as="ul"
                    className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4"
                  >
                    {spokes.map((spoke) => (
                      <li key={spoke.slug}>
                        <Link
                          href={`/services/${spoke.slug}`}
                          className="mobile-tap-scale group block rounded-xl border border-line bg-surface p-5 hover:border-forest/40 transition-all h-full"
                        >
                          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest block mb-2">
                            {spoke.eyebrow}
                          </span>
                          <h3
                            className="font-display text-[19px] md:text-[20px] text-ink group-hover:text-forest transition-colors"
                            style={{ fontWeight: 500, lineHeight: 1.2 }}
                          >
                            {spoke.title}
                          </h3>
                          <span className="font-mono text-[11px] text-ink-muted mt-3 inline-block group-hover:text-forest transition-colors">
                            Learn more →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </Reveal>
                </div>
              </div>
            </section>
          );
        })}

        {/* Closing CTA */}
        <section className="py-16 md:py-24">
          <AuroraHairline />
          <Reveal stagger staggerStep={140} className="pt-12 md:pt-16 flex flex-col gap-6 md:gap-7 items-start">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.25rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Not sure where you <ColorWord>fit</ColorWord>?
            </h2>
            <p className="text-ink-muted text-[16px] leading-relaxed max-w-xl">
              We&apos;re happy to talk it through. A short call usually makes
              the right tier and the right vertical obvious in fifteen
              minutes.
            </p>
            <Reveal stagger className="flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                Start a conversation
              </Button>
              <Button href="/pricing" variant="ghost">
                See pricing →
              </Button>
            </Reveal>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
