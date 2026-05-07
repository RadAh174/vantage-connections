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
import { RotatingWord } from "@/components/ui/RotatingWord";
import { ProcessHorizontalScroll } from "@/components/home/ProcessHorizontalScroll";
import { WorkCarousel } from "@/components/home/WorkCarousel";
import { HeroFader } from "@/components/home/HeroFader";
import { ContactDrawerMount } from "@/components/home/ContactDrawerMount";
import { PullQuote } from "@/components/home/PullQuote";

import { site } from "@/lib/content/site";
import { home } from "@/lib/content/home";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero — minimal, fades on scroll ----------------
            Headline centered vertically + horizontally. Scroll cue
            anchored at the bottom edge of the viewport. Both wrapped in
            <HeroFader> so they lift away as the page scrolls. The
            <Header /> stays hidden until you scroll past ~60% of the
            viewport — see Header.tsx. */}
        {/* Section is 140dvh tall — first viewport holds the hero, next
            ~40dvh is intentional empty space so subsequent sections sit
            well below the fold. Inner wrapper is exactly one viewport
            tall and serves as the positioning context for the
            absolutely-anchored scroll cue. */}
        {(() => {
          // Hero text split into individual words for the staggered
          // per-word reveal. Each <span class="hero-word"> uses CSS
          // animation-delay so words cascade in. The rotating accent
          // word follows at the end with the same staggered delay.
          // Two-line hero: "Websites that put your" / "business in [rot]"
          // Per-word reveal cascades across both lines with the same
          // animation-delay sequence. STEP_MS doubled (140→280) so the
          // whole headline takes its time to land.
          const LINE_1 = ["Websites", "that", "put", "your"];
          const LINE_2 = ["business", "in"];
          const STEP_MS = 240;
          const totalWords = LINE_1.length + LINE_2.length + 1; // +1 = rotating word
          return (
            <section className="relative min-h-[140dvh]">
              <HeroFader>
                <div className="relative h-[100dvh] flex flex-col items-center justify-start pt-[27dvh] px-6 text-center">
                  <h1
                    className="font-display text-headline"
                    style={{
                      // Smaller + less bold per request — still display-scale
                      // but reads as editorial instead of poster-bold.
                      fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
                      fontWeight: 500,
                      lineHeight: 1.15,
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {/* Line 1: "Websites that put your" */}
                    <span className="block">
                      {LINE_1.map((word, i) => (
                        <span
                          key={`l1-${i}`}
                          className="hero-word"
                          style={{ animationDelay: `${i * STEP_MS}ms` }}
                        >
                          {word}
                          {" "}
                        </span>
                      ))}
                    </span>
                    {/* Line 2: "business in [rotating word]" */}
                    <span className="block">
                      {LINE_2.map((word, i) => (
                        <span
                          key={`l2-${i}`}
                          className="hero-word"
                          style={{ animationDelay: `${(LINE_1.length + i) * STEP_MS}ms` }}
                        >
                          {word}
                          {" "}
                        </span>
                      ))}
                      <span
                        className="hero-word"
                        style={{ animationDelay: `${(LINE_1.length + LINE_2.length) * STEP_MS}ms` }}
                      >
                        <RotatingWord words={home.hero.rotatingWords} />
                      </span>
                    </span>
                  </h1>

                  {/* Scroll cue — not wrapped in <Reveal> so it's
                      visible immediately at scrollY=0 (it sits at the
                      viewport bottom edge, where Reveal's
                      "10% inside viewport" trigger wouldn't fire). */}
                  <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                    <p
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted hero-word"
                      style={{ animationDelay: `${(totalWords + 1) * STEP_MS}ms` }}
                    >
                      ↓ {home.hero.scrollCue}
                    </p>
                  </div>
                </div>
              </HeroFader>
            </section>
          );
        })()}

        {/* ---------------- Pull quote ----------------
            Extracted to a client component so it can modulate the
            global Lenis wheelMultiplier as the user scrolls near it
            (slow approach, normal speed once past). See PullQuote.tsx. */}
        <PullQuote />

        {/* ---------------- Selected Work teaser ---------------- */}
        <section className="py-20">
          <AuroraHairline />
          <div className="pt-14 flex flex-col gap-8">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow color="forest">LIVE WORK · SHIPPED 2025–2026</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Out in the <ColorWord>wild</ColorWord>.
                </h2>
              </Reveal>
            </div>

            {home.featuredWork.length === 0 ? (
              <Reveal>
                <div className="rounded-xl border border-line bg-surface-calm px-8 py-14 flex flex-col gap-4 items-start max-w-2xl">
                  <Eyebrow color="ink-muted">EMPTY · TODO</Eyebrow>
                  <p
                    className="font-display text-[24px] leading-tight text-ink"
                    style={{ fontWeight: 500 }}
                  >
                    Selected work coming soon — we&apos;re shipping the first
                    cohort May 2026.
                  </p>
                  <p className="text-ink-muted text-[14px] font-mono">
                    {/* TODO_FEATURED_WORK: fill home.ts > featuredWork with
                        real shipped projects. NEVER invent client names. */}
                    Real projects only. No stock screenshots, no fake brands.
                  </p>
                  <Button href="/contact" variant="secondary" size="md">
                    Be the first
                  </Button>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <WorkCarousel items={home.featuredWork} />
              </Reveal>
            )}

            <Link
              href="/work"
              className="text-forest text-[14px] inline-flex items-center gap-1.5 self-start border-b border-current pb-0.5"
            >
              View all work →
            </Link>
          </div>
        </section>

        {/* ---------------- Process (horizontal scroll) ---------------- */}
        <section className="py-20">
          <AuroraHairline />
          <div className="pt-14 flex flex-col gap-8">
            <Reveal className="flex flex-col gap-3 max-w-2xl">
              <Eyebrow color="forest">PROCESS · ~14 DAYS</Eyebrow>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                }}
              >
                How we <ColorWord>build</ColorWord>.
              </h2>
            </Reveal>
          </div>
        </section>

        {/* Horizontal scroll is now FULL-BLEED — breaks out of the 1320px
            container so cards extend to the viewport edges. The
            `w-screen left-1/2 -translate-x-1/2` trick centers a
            viewport-wide element inside a narrower flow parent. */}
        <div className="relative w-screen left-1/2 -translate-x-1/2">
          <ProcessHorizontalScroll />
        </div>

        {/* Vertical breathing space between horizontal section and the
            next vertical section so the transition out feels intentional. */}
        <div aria-hidden style={{ height: "16vh" }} />

        <section className="pt-12 pb-20">
          <Link
            href="/process"
            className="text-forest text-[14px] inline-flex items-center gap-1.5 self-start border-b border-current pb-0.5"
          >
            Read the full process →
          </Link>
        </section>

      </main>

      {/* ---------------- Closing CTA + scroll-driven contact drawer ----
          Pin-and-scrub: the closing CTA is wrapped in ContactDrawerMount,
          which pins it to viewport bottom while the user scrolls through
          a 100vh runway. Over that runway, the drawer (85vw, rounded
          top, centered) rises up from below — closing CTA stays visible
          as a frame around it instead of scrolling away. */}
      <ContactDrawerMount>
        <section className="mx-auto max-w-[1320px] px-6 md:px-10 pt-32 pb-56">
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
              {home.closing.headline}{" "}
              <ColorWord>{home.closing.accent}</ColorWord>
              {home.closing.trailing}
            </h2>

            <Reveal stagger className="flex flex-wrap items-center gap-4">
              {site.email ? (
                <Button
                  href={`mailto:${site.email}`}
                  variant="primary"
                  size="lg"
                  external
                >
                  {site.email}
                </Button>
              ) : (
                <Button href="/contact" variant="primary" size="lg">
                  {/* TODO: set site.email so this becomes a mailto */}
                  Get in touch
                </Button>
              )}
              {site.schedulingUrl ? (
                <Button href={site.schedulingUrl} variant="ghost" external>
                  Schedule a 30-min intro →
                </Button>
              ) : (
                <span className="font-mono text-[12px] text-ink-muted">
                  {/* TODO: site.schedulingUrl */}
                  scheduling link: TODO
                </span>
              )}
            </Reveal>

            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {site.availability.bookingNote}
            </p>
          </Reveal>
        </section>
      </ContactDrawerMount>

      {/* Footer temporarily removed — see note above where Header was. */}
    </>
  );
}
