import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Marginalia } from "@/components/ui/Marginalia";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { about } from "@/lib/content/about";

export const metadata = {
  title: "About",
  description:
    "Real people, real work. Vantage Connections is a freelance web studio building modern, conversion-focused websites.",
};

/* Hero per-word reveal cadence — matches the home page (240ms step). */
const HERO_LINE_1 = ["Real", "people,"];
const HERO_LINE_2 = ["real", "work."];
const HERO_STEP_MS = 240;

export default function AboutPage() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero: ~55dvh tall (no HeroFader), eyebrow above
            headline, per-word `hero-word` reveal with the same 240ms
            step the home page uses, gold-gradient italic accent on the
            opening word, then a lede paragraph below. */}
        {(() => {
          const totalWords = HERO_LINE_1.length + HERO_LINE_2.length;
          return (
            <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-16 max-w-4xl">
              <span
                className="hero-word block mb-6"
                style={{ animationDelay: "0ms" }}
              >
                <Eyebrow color="forest">ABOUT VANTAGE CONNECTIONS</Eyebrow>
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
                  {HERO_LINE_1.map((word, i) => {
                    const isAccent = word === "Real";
                    return (
                      <span
                        key={`l1-${i}`}
                        className="hero-word"
                        style={{
                          animationDelay: `${(i + 1) * HERO_STEP_MS}ms`,
                        }}
                      >
                        {isAccent ? <ColorWord>{word}</ColorWord> : word}
                        {" "}
                      </span>
                    );
                  })}
                </span>
                <span className="block">
                  {HERO_LINE_2.map((word, i) => (
                    <span
                      key={`l2-${i}`}
                      className="hero-word"
                      style={{
                        animationDelay: `${
                          (HERO_LINE_1.length + i + 1) * HERO_STEP_MS
                        }ms`,
                      }}
                    >
                      {word}
                      {" "}
                    </span>
                  ))}
                </span>
              </h1>

              <p
                className="hero-word mt-7 max-w-[560px] text-[18px] leading-[1.55] text-ink-muted"
                style={{
                  animationDelay: `${(totalWords + 1) * HERO_STEP_MS}ms`,
                }}
              >
                A freelance web studio. We pick a small number of projects
                each quarter and build each one as if it were our own.
              </p>
            </section>
          );
        })()}

        <AuroraHairline />

        {/* ---------------- Bio ----------------
            Editorial wide-bio layout. No portrait — we don't ship
            individual photos. Eyebrow + marginalia anchor the left
            column; the bio body lives on the right with generous
            measure. Empty state is a typographic statement, not a
            wireframe TODO card. */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-20 pb-24">
          <div className="lg:col-span-4">
            <Reveal className="flex flex-col gap-4 lg:sticky lg:top-28">
              <Eyebrow color="forest">WHO WE ARE</Eyebrow>
              <Marginalia>we don&apos;t take every project</Marginalia>
            </Reveal>
          </div>
          <div className="lg:col-span-8">
            {about.bio ? (
              <Reveal>
                <div
                  className="text-ink text-[19px] leading-[1.75] max-w-[640px]"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {about.bio}
                </div>
              </Reveal>
            ) : (
              <Reveal className="flex flex-col gap-5 max-w-[640px]">
                <p
                  className="font-display italic text-ink leading-[1.1]"
                  style={{
                    fontWeight: 500,
                    fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                    letterSpacing: "-0.012em",
                  }}
                >
                  A focused studio. Built around the work, not the
                  founder&apos;s headshot.
                </p>
                <p className="text-ink-muted text-[16px] leading-relaxed">
                  We let the work introduce us. Background details share
                  best over a project conversation.
                </p>
                <Link
                  href="/contact"
                  className="mt-2 self-start text-forest text-[15px] inline-flex items-center gap-1.5 border-b border-current pb-0.5 hover:text-ink transition-colors"
                >
                  Start a conversation →
                </Link>
              </Reveal>
            )}
          </div>
        </section>

        {/* ---------------- Mission ---------------- */}
        <section className="py-20">
          <AuroraHairline />
          <div className="pt-14">
            {about.mission ? (
              <Reveal>
                <figure className="relative pl-10 md:pl-14 max-w-4xl">
                  {/* Pull-quote curly mark — gold gradient, the signature accent. */}
                  <span
                    aria-hidden="true"
                    className="color-word color-word--has-fallback absolute -left-1 top-[-0.4em] font-display select-none"
                    style={{
                      fontSize: "5.5rem",
                      lineHeight: 1,
                      fontStyle: "italic",
                      fontWeight: 500,
                      backgroundImage: "var(--gold-grad)",
                    }}
                  >
                    &ldquo;
                  </span>
                  <blockquote
                    className="font-display italic text-ink"
                    style={{
                      fontSize: "clamp(1.75rem, 3.5vw, 3.5rem)",
                      fontWeight: 500,
                      lineHeight: 1.15,
                    }}
                  >
                    {about.mission}
                  </blockquote>
                  <figcaption className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted mt-5">
                    — Our mission
                  </figcaption>
                </figure>
              </Reveal>
            ) : (
              <Reveal>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-5xl">
                  <div className="lg:col-span-4">
                    <Eyebrow color="forest">MISSION</Eyebrow>
                  </div>
                  <div className="lg:col-span-8 flex flex-col gap-5">
                    <p
                      className="font-display italic text-ink leading-[1.1]"
                      style={{
                        fontWeight: 500,
                        fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                        letterSpacing: "-0.012em",
                      }}
                    >
                      Websites that put your business in view.
                    </p>
                    <p className="text-ink-muted text-[16px] leading-relaxed max-w-[560px]">
                      Concise, useful, beautiful. The studio runs on those
                      three priorities — in that order.
                    </p>
                    <Link
                      href="/process"
                      className="mt-2 self-start text-forest text-[15px] inline-flex items-center gap-1.5 border-b border-current pb-0.5 hover:text-ink transition-colors"
                    >
                      Read the process →
                    </Link>
                  </div>
                </div>
              </Reveal>
            )}
          </div>
        </section>

        {/* ---------------- Values ---------------- */}
        <section className="py-20">
          <AuroraHairline />
          <div className="pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow color="forest">VALUES</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  How we <ColorWord>think</ColorWord> about work.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              {about.values.length === 0 ? (
                <Reveal className="flex flex-col gap-5 max-w-[640px]">
                  <p
                    className="font-display italic text-ink leading-[1.1]"
                    style={{
                      fontWeight: 500,
                      fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                      letterSpacing: "-0.012em",
                    }}
                  >
                    The list lands with launch.
                  </p>
                  <p className="text-ink-muted text-[16px] leading-relaxed">
                    No filler principles. We&apos;ll publish the values that
                    actually shape the work when the studio opens.
                  </p>
                  <Link
                    href="/contact"
                    className="mt-2 self-start text-forest text-[15px] inline-flex items-center gap-1.5 border-b border-current pb-0.5 hover:text-ink transition-colors"
                  >
                    Get in touch →
                  </Link>
                </Reveal>
              ) : (
                <ol className="flex flex-col">
                  {about.values.map((v, i) => (
                    <Reveal key={v.title} delay={i * 60}>
                      <li className="flex flex-col gap-2 py-7 border-b border-line last:border-b-0">
                        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest">
                          0{i + 1}
                        </span>
                        <h3
                          className="font-display text-[26px]"
                          style={{ fontWeight: 500 }}
                        >
                          {v.title}
                        </h3>
                        <p className="text-ink-muted text-[16px] leading-relaxed max-w-[640px]">
                          {v.body}
                        </p>
                      </li>
                    </Reveal>
                  ))}
                </ol>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- Tools ---------------- */}
        <section className="py-20">
          <AuroraHairline />
          <div className="pt-14 flex flex-col gap-8">
            <Reveal className="flex items-end justify-between flex-wrap gap-5">
              <div className="flex flex-col gap-3 max-w-2xl">
                <Eyebrow color="forest">TOOLS</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  What we <ColorWord>build</ColorWord> with.
                </h2>
              </div>
              <Marginalia>chosen for resilience, not novelty</Marginalia>
            </Reveal>

            <Reveal>
              <ul className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {about.tools.map((t) => (
                  <li key={t.name}>
                    {t.href ? (
                      <a
                        href={t.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="group block rounded-xl border border-line bg-surface px-5 py-6 transition-all hover:border-forest/40 hover:shadow-[0_8px_30px_-15px_rgba(212,158,15,0.35)] relative overflow-hidden"
                      >
                        <span
                          aria-hidden="true"
                          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(26,77,51,0.08), rgba(224,180,66,0.10))",
                          }}
                        />
                        <span
                          className="font-display relative text-[20px] text-ink group-hover:text-forest transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          {t.name}
                        </span>
                      </a>
                    ) : (
                      <span className="block rounded-xl border border-line bg-surface px-5 py-6 font-display text-[20px] text-ink">
                        {t.name}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ---------------- Clients (only if populated) ---------------- */}
        {about.clients.length > 0 && (
          <section className="py-20">
            <AuroraHairline />
            <div className="pt-14 flex flex-col gap-6">
              <Reveal>
                <Eyebrow color="forest">SELECTED CLIENTS</Eyebrow>
              </Reveal>
              <Reveal>
                <div className="overflow-hidden">
                  <ul className="flex flex-wrap gap-x-10 gap-y-4">
                    {about.clients.map((c) => (
                      <li
                        key={c.name}
                        className="font-display text-[22px] text-ink-muted hover:text-ink transition-colors"
                        style={{ fontWeight: 500 }}
                      >
                        {c.href ? (
                          <a
                            href={c.href}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            {c.name}
                          </a>
                        ) : (
                          c.name
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </section>
        )}

        {/* ---------------- Closing ---------------- */}
        <section className="py-24">
          <AuroraHairline />
          <Reveal className="pt-16 flex flex-col gap-7 items-start max-w-3xl">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              See what we&apos;ve <ColorWord>made</ColorWord> — or start a
              project.
            </h2>
            <Reveal stagger className="flex flex-wrap items-center gap-4">
              <Button href="/work" variant="primary" size="lg">
                See the work
              </Button>
              <Link
                href="/contact"
                className="text-forest text-[15px] inline-flex items-center gap-1.5 self-center border-b border-current pb-0.5"
              >
                Or get in touch →
              </Link>
            </Reveal>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

