"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ColorWord } from "@/components/ui/ColorWord";
import { Marginalia } from "@/components/ui/Marginalia";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { BuildSequence } from "@/components/viewport/BuildSequence";

import {
  filters as workFilters,
  featuredProjects,
  type WorkFilter,
} from "@/lib/content/work";

export default function WorkPage() {
  const [active, setActive] = useState<WorkFilter>("All");

  const visible = useMemo(() => {
    if (active === "All") return featuredProjects;
    return featuredProjects.filter((p) => p.category === active);
  }, [active]);

  const hasProjects = featuredProjects.length > 0;

  // ---------------- Hero word-cascade setup ----------------
  // Mirrors the home hero pattern: each word in <span class="hero-word">
  // with an inline animation-delay so the headline cascades in. Same
  // STEP_MS (240ms) used on home for rhythm consistency. The italic
  // ColorWord accent sits inline at the natural emphasis position.
  const HERO_LINE_1 = ["Selected"];
  const HERO_LINE_2 = ["Out", "in", "the"]; // accent ("wild") follows on the same line
  const STEP_MS = 240;
  const accentDelayMs = (HERO_LINE_1.length + HERO_LINE_2.length) * STEP_MS;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero: ~52dvh tall, no HeroFader (that's home-only).
            Headline uses per-word `hero-word` cascade matching the home
            hero rhythm (240ms step). Italic ColorWord accent sits at the
            natural emphasis word. */}
        <section className="relative min-h-[52dvh] grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 pt-20 md:pt-28 pb-16">
          <div className="lg:col-span-9 flex flex-col gap-7">
            <Reveal>
              <Eyebrow color="forest">SELECTED WORK · SHIPPED 2025–2026</Eyebrow>
            </Reveal>

            <h1
              className="font-display text-headline"
              style={{
                fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
                fontWeight: 500,
                lineHeight: 1.15,
                letterSpacing: "-0.018em",
              }}
            >
              {/* Line 1: "Selected work." */}
              <span className="block">
                {HERO_LINE_1.map((word, i) => (
                  <span
                    key={`l1-${i}`}
                    className="hero-word"
                    style={{ animationDelay: `${i * STEP_MS}ms` }}
                  >
                    {word}{" "}
                  </span>
                ))}
                <span
                  className="hero-word"
                  style={{ animationDelay: `${HERO_LINE_1.length * STEP_MS}ms` }}
                >
                  <ColorWord>work</ColorWord>.
                </span>
              </span>
              {/* Line 2: "Out in the wild." — accent word at the end. */}
              <span className="block">
                {HERO_LINE_2.map((word, i) => (
                  <span
                    key={`l2-${i}`}
                    className="hero-word"
                    style={{
                      animationDelay: `${(HERO_LINE_1.length + 1 + i) * STEP_MS}ms`,
                    }}
                  >
                    {word}{" "}
                  </span>
                ))}
                <span
                  className="hero-word"
                  style={{ animationDelay: `${accentDelayMs + STEP_MS}ms` }}
                >
                  <ColorWord>wild</ColorWord>.
                </span>
              </span>
            </h1>

            <Reveal delay={accentDelayMs + 400}>
              <p className="max-w-[540px] text-[18px] leading-[1.55] text-ink-muted">
                A focused list. Each project is a marketing site, e-commerce
                store, or product surface we built end-to-end. We don&apos;t
                pad the page with discovery decks or unfinished work.
              </p>
            </Reveal>
          </div>

          {/* Right-side marginalia, anchored top-right of hero column. */}
          <div className="hidden lg:flex lg:col-span-3 pt-2 justify-end">
            <Marginalia>
              shipped sites only — no concepts, no mockups
            </Marginalia>
          </div>
        </section>

        {/* ---------------- Filter chips ---------------- */}
        <section className="pb-10">
          <AuroraHairline />
          <Reveal>
            <div className="pt-8 flex flex-wrap items-center gap-2.5">
              {workFilters.map((f) => (
                <Chip
                  key={f}
                  as="button"
                  active={active === f}
                  dotColor={active === f ? "forest" : undefined}
                  onClick={() => setActive(f)}
                >
                  {f}
                </Chip>
              ))}
              <div className="ml-auto">
                <Marginalia>we spend ~3 hours per page on craft</Marginalia>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ---------------- Grid ---------------- */}
        <section className="pb-24 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-9">
            {!hasProjects ? (
              <Reveal>
                <div className="rounded-xl border border-line bg-surface-calm px-8 py-16 flex flex-col gap-5 items-start max-w-3xl">
                  <Eyebrow color="ink-muted">EMPTY · TODO</Eyebrow>
                  <p
                    className="font-display text-[28px] leading-tight text-ink"
                    style={{ fontWeight: 500 }}
                  >
                    Case studies launch with the first cohort — May 2026.
                  </p>
                  <p className="text-ink-muted text-[15px] max-w-xl leading-relaxed">
                    We don&apos;t fill this page with placeholder projects, stock
                    imagery, or work we didn&apos;t finish. When real case
                    studies ship, they&apos;ll live here.
                  </p>
                  <p className="font-mono text-[12px] text-ink-muted">
                    {/* TODO_FEATURED_PROJECTS: fill lib/content/work.ts >
                        featuredProjects with real shipped projects. */}
                    No fake clients. No invented testimonials. Real work only.
                  </p>
                  <Button href="/contact" variant="primary" size="lg">
                    Be the first
                  </Button>
                </div>
              </Reveal>
            ) : visible.length === 0 ? (
              <Reveal>
                <div className="px-2 py-12 text-ink-muted text-[15px]">
                  Nothing in <span className="text-ink">{active}</span> yet —
                  try another filter.
                </div>
              </Reveal>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-12">
                {visible.map((p, i) => (
                  <Reveal key={p.slug} delay={i * 60}>
                    <Link
                      href={`/work/${p.slug}`}
                      className="flex flex-col gap-4 group"
                    >
                      <BuildSequence
                        autoLoop
                        // Stagger via different intervals so the wall isn't synced.
                        loopInterval={7000 + (i % 4) * 700}
                        url={p.metadata.liveUrl ?? "vantageconnections.com"}
                      />
                      <div className="flex flex-col gap-2 px-1">
                        <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                          {p.client}
                        </span>
                        <h3
                          className="font-display text-[22px] leading-tight text-ink group-hover:text-forest transition-colors"
                          style={{ fontWeight: 500 }}
                        >
                          {p.title}
                        </h3>
                        {p.tagline && (
                          <p className="text-[14px] text-ink-muted">
                            {p.tagline}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {p.tags.map((t) => (
                            <Chip key={t}>{t}</Chip>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            )}
          </div>

          {/* Right-rail marginalia near the grid. Hidden on small screens
              where it would crowd the cards. */}
          <aside className="hidden lg:flex lg:col-span-3 flex-col gap-8 pt-2">
            <Marginalia>
              every card links to a real shipped URL — no placeholders
            </Marginalia>
            <Marginalia>
              filters are scope, not invented categories
            </Marginalia>
          </aside>
        </section>

        {/* ---------------- Closing ---------------- */}
        <section className="py-24">
          <AuroraHairline />
          <Reveal className="pt-16 flex flex-col gap-6 items-start max-w-2xl">
            <Eyebrow color="forest">START A PROJECT</Eyebrow>
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Have a project in mind? Let&apos;s <ColorWord>talk</ColorWord>.
            </h2>
            <Button href="/contact" variant="primary" size="lg">
              Start a project
            </Button>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
