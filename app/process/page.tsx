import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChapterNav } from "@/components/layout/ChapterNav";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Marginalia } from "@/components/ui/Marginalia";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { ConnectionLine } from "@/components/process/ConnectionLine";

import { phaseDetails } from "@/lib/content/process";

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
  const navItems = phaseDetails.map((p) => ({
    id: `phase-${p.number}`,
    label: p.name,
    short: `${p.number} ${p.name.toUpperCase()}`,
  }));

  const totalHeroWords = HERO_LINE_1.length + HERO_LINE_2.length;

  return (
    <>
      <ScrollProgress />
      <Header />
      <ChapterNav items={navItems} />

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
            Four phases. Honest scope, honest timeline, no surprises. Every
            project moves through the same shape — only the prose changes.
          </p>
        </section>

        <AuroraHairline />

        {/* ---------------- Phases ---------------- */}
        {phaseDetails.map((phase, i) => {
          const id = `phase-${phase.number}`;
          const isLast = i === phaseDetails.length - 1;
          return (
            <div key={id}>
              <section
                id={id}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-32 pb-16"
              >
                {/* Big number — gold gradient, sets the rhythm of the page. */}
                <div className="lg:col-span-5">
                  <Reveal>
                    <span
                      className="color-word color-word--has-fallback font-display block"
                      style={{
                        fontSize: "clamp(7rem, 18vw, 16rem)",
                        fontWeight: 700,
                        lineHeight: 0.9,
                        letterSpacing: "-0.04em",
                        backgroundImage: "var(--gold-grad)",
                      }}
                    >
                      {phase.number}
                    </span>
                  </Reveal>
                  <Reveal delay={120}>
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted mt-3 block">
                      {phase.weekRange}
                    </span>
                  </Reveal>
                </div>

                {/* Body */}
                <div className="lg:col-span-7 flex flex-col gap-6">
                  <Reveal>
                    <Eyebrow color="forest">
                      PHASE {phase.number} — {phase.name.toUpperCase()}
                    </Eyebrow>
                  </Reveal>
                  <Reveal delay={80}>
                    <h2
                      className="font-display text-ink"
                      style={{
                        fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                        fontWeight: 600,
                        lineHeight: 1.05,
                        letterSpacing: "-0.015em",
                      }}
                    >
                      {phase.name}
                      <ColorWord>.</ColorWord>
                    </h2>
                  </Reveal>
                  <Reveal delay={160}>
                    <p
                      className="text-ink text-[18px] leading-[1.7] max-w-[640px]"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {phase.description}
                    </p>
                  </Reveal>

                  {phase.marginalia.length > 0 && (
                    <Reveal delay={240}>
                      <div className="flex flex-col gap-2 mt-4 max-w-md">
                        {phase.marginalia.map((m) => (
                          <Marginalia key={m}>— {m}</Marginalia>
                        ))}
                      </div>
                    </Reveal>
                  )}
                </div>
              </section>

              <AuroraHairline />

              {!isLast && (
                <ConnectionLine
                  direction={i % 2 === 0 ? "left-to-right" : "right-to-left"}
                />
              )}
            </div>
          );
        })}

        {/* ---------------- Timeline ---------------- */}
        <section className="py-24">
          <Reveal className="flex flex-col gap-3 max-w-2xl">
            <Eyebrow color="forest">TIMELINE</Eyebrow>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Four <ColorWord>weeks</ColorWord>, end to end.
            </h2>
            <p className="text-ink-muted text-[16px] leading-relaxed">
              Standard ship cadence. Bespoke projects extend; Starter projects
              compress. Every project has a written ship date before we start.
            </p>
          </Reveal>

          <Reveal>
            <div className="mt-12 rounded-xl border border-line bg-surface-calm px-6 py-8 overflow-x-auto">
              <pre
                className="font-mono text-[13px] leading-[1.7] text-ink"
                style={{ whiteSpace: "pre", margin: 0 }}
              >
{`╔══════════╤══════════╤══════════╤══════════╗
║  WEEK 1  │  WEEK 2  │  WEEK 3  │  WEEK 4  ║
╠══════════╪══════════╪══════════╪══════════╣
║ DISCOVER │  DESIGN  │  BUILD   │  LAUNCH  ║
║          │          │          │          ║
║ scope    │ system   │ pages    │ migrate  ║
║ audit    │ hero     │ a11y     │ monitor  ║
║ doc      │ tokens   │ vitals   │ handover ║
╚══════════╧══════════╧══════════╧══════════╝
   ▲          ▲          ▲          ▲
   │          │          │          │
  kick      review     review      ship`}
              </pre>
            </div>
          </Reveal>
        </section>

        {/* ---------------- Closing ---------------- */}
        <section className="py-24">
          <AuroraHairline />
          <Reveal className="pt-16 flex flex-col gap-7 items-start">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
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
