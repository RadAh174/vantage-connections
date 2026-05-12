import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { TimelineCard } from "@/components/process/TimelineCard";
import { PinnedPhaseStack } from "@/components/process/PinnedPhaseStack";

export const metadata = {
  title: "Process",
  description:
    "How we build. Four phases. Honest scope, honest timeline, no surprises.",
};

/* Hero per-word reveal cadence — matches the home page (240ms step). */
const HERO_LINE_1 = ["How", "we"];
const HERO_LINE_2 = ["build."];
const HERO_STEP_MS = 240;

export default function ProcessPage() {
  const totalHeroWords = HERO_LINE_1.length + HERO_LINE_2.length;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero: ~55dvh tall (no HeroFader), eyebrow above
            headline, per-word `hero-word` reveal with the same 240ms
            step the home page uses, gold-gradient italic accent on
            "build", then a lede paragraph below. */}
        <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-16 max-w-4xl">
          <span
            className="hero-word block mb-6"
            style={{ animationDelay: "0ms" }}
          >
            <Eyebrow color="forest">PROCESS · HOW WE BUILD</Eyebrow>
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
                  {word}
                  {" "}
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
                    {punct}
                    {" "}
                  </span>
                );
              })}
            </span>
          </h1>

          <p
            className="hero-word mt-7 max-w-[560px] text-[18px] leading-[1.55] text-ink-muted"
            style={{
              animationDelay: `${(totalHeroWords + 1) * HERO_STEP_MS}ms`,
            }}
          >
            Four phases. Honest scope, honest timeline, no surprises.
          </p>
        </section>

        <AuroraHairline />

        {/* ---------------- Phases ----------------
            Pinned-deck section. Replaces the prior 4 stacked phase
            sections + ConnectionLine separators. As the user scrolls,
            the section pins and the phase inside the centered card
            snap-switches as scroll progress crosses each `i/N`
            threshold. ChapterNav anchors (#phase-1 ... #phase-4) jump
            to the matching scroll offset via the anchor stops the
            component renders internally.

            Wrapped in a full-bleed div (w-screen + negative margin)
            so the tinted pin backdrop reaches edge-to-edge instead of
            being clamped to main's max-width — matches the home
            page's pattern around ProcessHorizontalScroll. */}
        <div
          className="relative w-screen"
          style={{ marginLeft: "calc(50% - 50vw)" }}
        >
          <PinnedPhaseStack />
        </div>

        <AuroraHairline />

        {/* ---------------- Timeline ---------------- */}
        <section className="py-16 md:py-24">
          <Reveal className="flex flex-col gap-3 max-w-2xl">
            <Eyebrow color="forest">TIMELINE</Eyebrow>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(1.75rem, 4vw, 3.5rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Four <ColorWord>weeks</ColorWord>, end to end.
            </h2>
            <p className="text-ink-muted text-[15px] md:text-[16px] leading-relaxed">
              Standard ship cadence. Bespoke projects extend; Starter projects
              compress. Every project has a written ship date before we start.
            </p>
          </Reveal>

          <Reveal>
            {/* 4 floating cards at staggered top offsets (lg+) so each
                sits at its own vertical position. Bottom-only gold
                drop shadow under each. Hover bobs the card up and
                down slowly via JS; mouse-leave smoothly glides back
                to rest over 700ms. See TimelineCard for the
                animation logic. */}
            <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-7 items-start lg:pb-20">
              <TimelineCard
                num="1"
                phase="Discover"
                milestone="Kickoff"
                tasks={["Scope", "Audit", "Documentation"]}
                staggerClass="lg:mt-0"
              />
              <TimelineCard
                num="2"
                phase="Design"
                milestone="Review"
                tasks={["System", "Hero", "Tokens"]}
                staggerClass="lg:mt-12"
              />
              <TimelineCard
                num="3"
                phase="Build"
                milestone="Polish"
                tasks={["Pages", "Accessibility", "Vitals"]}
                staggerClass="lg:mt-4"
              />
              <TimelineCard
                num="4"
                phase="Launch"
                milestone="Ship"
                tasks={["Migrate", "Monitor", "Handover"]}
                staggerClass="lg:mt-16"
              />
            </div>
          </Reveal>
        </section>

        {/* ---------------- Closing ---------------- */}
        <section className="py-16 md:py-24">
          <AuroraHairline />
          <Reveal className="pt-12 md:pt-16 flex flex-col gap-6 md:gap-7 items-start">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.25rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Ready to start? Let&apos;s <ColorWord>talk</ColorWord>.
            </h2>
            <Reveal stagger className="flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                Start a project
              </Button>
              <Button href="/work" variant="ghost">
                See the work →
              </Button>
            </Reveal>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
