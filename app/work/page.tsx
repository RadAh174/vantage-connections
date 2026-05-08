"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { WorkModal } from "@/components/home/WorkModal";

import {
  featuredProjects,
  type FeaturedProject,
} from "@/lib/content/work";
import type { FeaturedWork } from "@/lib/content/home";

/**
 * Work index — chaptered gallery.
 *
 * Projects split into two thematic chapters, each with its own
 * eyebrow + display title + intro paragraph and its own asymmetric
 * grid pattern (chapters can have different layouts — 6-card or
 * 8-card). The chapter dividers (text + hairline + generous
 * whitespace) give the page editorial rhythm — a wall of uniform
 * cells reads as a wall of squares; chapters let the eye rest and
 * give it something to read between rows.
 *
 * Chapter 1 — 8-card pattern (4 cols × 4 rows):
 *   ┌───┬───┬───┬───┐
 *   │ B │ B │ s │ s │   row 1
 *   │ B │ B │ W │ W │   row 2
 *   │ B │ B │ s │ s │   row 3
 *   │ B │ B │ W │ W │   row 4
 *   └───┴───┴───┴───┘
 *   Two BIG anchors stacked on the left, satellites on the right.
 *
 * Chapter 2 — 6-card pattern (4 cols × 3 rows):
 *   ┌───┬───┬───┬───┐
 *   │ B │ B │ s │ s │   row 1
 *   │ B │ B │ W │ W │   row 2
 *   │ W │ W │ W │ W │   row 3
 *   └───┴───┴───┴───┘
 *
 * BIG = col-span 2 / row-span 2  |  W = col-span 2  |  s = col-span 1
 *
 * Click → opens the same fullscreen `WorkModal` the home carousel
 * uses (FLIP from the originating card → 96vw × 96dvh viewer with the
 * live site in an iframe).
 */

// 6-card pattern: 1 BIG + 2 SMALL + 3 WIDE = 12 cells, 3 rows.
const PATTERN_6: readonly string[] = [
  "lg:col-span-2 lg:row-span-2", // 0 — BIG anchor
  "lg:col-span-1 lg:row-span-1", // 1 — SMALL
  "lg:col-span-1 lg:row-span-1", // 2 — SMALL
  "lg:col-span-2 lg:row-span-1", // 3 — WIDE
  "lg:col-span-2 lg:row-span-1", // 4 — WIDE
  "lg:col-span-2 lg:row-span-1", // 5 — WIDE
];

// 8-card pattern: 2 BIG + 4 SMALL + 2 WIDE = 16 cells, 4 rows.
// Two BIG anchors on the left rail, satellites on the right.
const PATTERN_8: readonly string[] = [
  "lg:col-span-2 lg:row-span-2", // 0 — BIG anchor
  "lg:col-span-1 lg:row-span-1", // 1 — SMALL
  "lg:col-span-1 lg:row-span-1", // 2 — SMALL
  "lg:col-span-2 lg:row-span-1", // 3 — WIDE
  "lg:col-span-2 lg:row-span-2", // 4 — BIG anchor
  "lg:col-span-1 lg:row-span-1", // 5 — SMALL
  "lg:col-span-1 lg:row-span-1", // 6 — SMALL
  "lg:col-span-2 lg:row-span-1", // 7 — WIDE
];

type Chapter = {
  num: string;
  eyebrow: string;
  title: string;
  body: string;
  /** Project slugs in render order — index N renders into pattern[N]. */
  slugs: string[];
  /** Pattern array; index lines up with slugs. */
  pattern: readonly string[];
};

const CHAPTERS: readonly Chapter[] = [
  {
    num: "01",
    eyebrow: "MARKETING SURFACES",
    title: "Where clients meet you for the first time.",
    body: "Marketing sites, editorial portfolios, brand surfaces — the front door of the business. Built to convert and to look like you actually run something.",
    pattern: PATTERN_8,
    slugs: [
      "jenny-smith",              // BIG (real)
      "pacific-family-dental",    // SMALL (real)
      "test-compass",             // SMALL
      "patriot-plumbing",         // WIDE (real)
      "black-diamond",            // BIG (real)
      "test-studio-mcgee",        // SMALL
      "test-amber-interior",      // SMALL
      "test-daylight",            // WIDE
    ],
  },
  {
    num: "02",
    eyebrow: "PRODUCT SURFACES",
    title: "Where users live, day after day.",
    body: "Dashboards, SaaS UIs, and product interfaces — the work that has to actually function. Not flashy for a screenshot; readable on the 200th visit.",
    pattern: PATTERN_6,
    slugs: [
      "predictbase",              // BIG (real)
      "test-shadcn",              // SMALL
      "test-cal",                 // SMALL
      "test-supabase",            // WIDE
      "predictbase-v2",           // WIDE (real)
      "test-retool",              // WIDE
    ],
  },
];

function findProject(slug: string): FeaturedProject | undefined {
  return featuredProjects.find((p) => p.slug === slug);
}

/** Adapter — `WorkModal` expects the home content's `FeaturedWork`
 *  shape (top-level `liveUrl`); the work page tracks projects in the
 *  richer `FeaturedProject` shape. */
function toFeaturedWork(p: FeaturedProject): FeaturedWork {
  return {
    slug: p.slug,
    client: p.client,
    title: p.title,
    liveUrl: p.metadata.liveUrl ?? "",
    tags: p.tags,
  };
}

function CollageCard({
  project,
  span,
  delay,
  onOpen,
}: {
  project: FeaturedProject;
  span: string;
  delay: number;
  onOpen: (project: FeaturedProject, rect: DOMRect) => void;
}) {
  const liveUrl = project.metadata.liveUrl;
  // mShots `w`/`h` are output dimensions, NOT capture viewport — without
  // explicit `vpw`/`vph`, mShots' default viewport can be served the
  // site's mobile breakpoint when its UA gets sniffed mobile, producing
  // a phone-shaped thumbnail. Forcing `vpw=1440&vph=900` makes mShots
  // render the page at desktop width every time, then output at our
  // requested 2000×1250.
  const screenshotUrl = liveUrl
    ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(liveUrl)}?w=2000&h=1250&vpw=1440&vph=900`
    : null;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!liveUrl) return;
    const rect = e.currentTarget.getBoundingClientRect();
    onOpen(project, rect);
  };

  return (
    <Reveal delay={delay} className={span}>
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Open ${project.client} preview`}
        className="group relative block h-full w-full overflow-hidden rounded-lg border border-line/40 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5),_0_2px_8px_rgba(0,0,0,0.08)] aspect-[16/10] lg:aspect-auto transition-transform duration-500 ease-out hover:scale-[1.04] hover:z-10 will-change-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg text-left"
      >
        {screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={screenshotUrl}
            alt={`${project.client} — preview`}
            loading="lazy"
            referrerPolicy="no-referrer"
            draggable={false}
            className="absolute inset-0 block h-full w-full object-cover object-top select-none"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-surface-calm text-ink-muted text-[12px] font-mono uppercase tracking-[0.18em]">
            no preview
          </div>
        )}

        {/* Caption + scrim are desktop-only. On mobile each tile is
            small enough that an overlay buries the screenshot — the
            actual artifact the user came to see — so we hide both
            below the md breakpoint and let the thumbnail speak for
            itself. The client name + project title still surface in
            the modal that opens on tap. */}
        <div
          aria-hidden="true"
          className="hidden md:block absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
          style={{
            background:
              "linear-gradient(to top, rgba(6,10,8,0.92) 0%, rgba(6,10,8,0.6) 45%, rgba(6,10,8,0) 100%)",
          }}
        />

        <div className="hidden md:flex absolute inset-x-0 bottom-0 p-4 md:p-5 lg:p-6 flex-col gap-1.5">
          <span className="font-mono text-[10px] lg:text-[11px] uppercase tracking-[0.2em] text-white/65">
            {project.client}
            {project.metadata.year ? ` · ${project.metadata.year}` : ""}
          </span>
          <h3
            className="font-display text-white leading-tight"
            style={{
              fontSize: "clamp(0.95rem, 1.1vw, 1.5rem)",
              fontWeight: 500,
              letterSpacing: "-0.012em",
            }}
          >
            {project.title}
          </h3>
        </div>
      </button>
    </Reveal>
  );
}

function ChapterHeader({ chapter }: { chapter: Chapter }) {
  return (
    <Reveal>
      <div className="flex flex-col gap-5 md:gap-6">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[11px] md:text-[12px] uppercase tracking-[0.22em] text-forest">
            {chapter.num}
          </span>
          <span
            aria-hidden="true"
            className="block h-px w-12 md:w-16 bg-forest/40"
          />
          <Eyebrow color="forest">{chapter.eyebrow}</Eyebrow>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-12 items-start">
          <h2
            className="lg:col-span-7 font-display text-ink"
            style={{
              fontSize: "clamp(1.875rem, 3.6vw, 3rem)",
              fontWeight: 500,
              lineHeight: 1.1,
              letterSpacing: "-0.018em",
            }}
          >
            {chapter.title}
          </h2>
          <p className="lg:col-span-5 text-[15px] md:text-[16px] leading-[1.6] text-ink-muted lg:pt-3 max-w-[480px]">
            {chapter.body}
          </p>
        </div>
      </div>
    </Reveal>
  );
}

function ChapterGrid({
  projects,
  pattern,
  onOpen,
  startDelay = 0,
}: {
  projects: FeaturedProject[];
  pattern: readonly string[];
  onOpen: (project: FeaturedProject, rect: DOMRect) => void;
  startDelay?: number;
}) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-7 md:gap-10 lg:gap-12"
      style={{
        gridAutoRows: "clamp(200px, 20vw, 340px)",
      }}
    >
      {projects.map((project, i) => (
        <CollageCard
          key={project.slug}
          project={project}
          span={pattern[i % pattern.length]}
          delay={startDelay + i * 60}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}

export default function WorkPage() {
  const hasProjects = featuredProjects.length > 0;

  // Modal state — selected project + the rect of the card that was
  // clicked, used by WorkModal for its FLIP open/close transition.
  const [selected, setSelected] = useState<{
    project: FeaturedProject;
    rect: DOMRect;
  } | null>(null);

  const handleOpen = (project: FeaturedProject, rect: DOMRect) =>
    setSelected({ project, rect });
  const handleClose = () => setSelected(null);

  // Hero word-cascade setup — same rhythm as home (240ms step).
  const HERO_LINE_1 = ["Selected"];
  const HERO_LINE_2 = ["Out", "in", "the"];
  const STEP_MS = 240;
  const accentDelayMs = (HERO_LINE_1.length + HERO_LINE_2.length) * STEP_MS;

  // Resolve chapters → projects.
  const chapters = CHAPTERS.map((chapter) => ({
    chapter,
    projects: chapter.slugs
      .map((slug) => findProject(slug))
      .filter((p): p is FeaturedProject => p !== undefined),
  }));

  return (
    <>
      <ScrollProgress />
      <Header />

      {/* ---------------- Hero (full-bleed) ---------------- */}
      <section
        className="relative pt-24 md:pt-32 pb-10 md:pb-14 px-8 md:px-16 lg:px-24"
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
        }}
      >
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10 md:gap-12">
          <div className="flex flex-col gap-7 max-w-[920px]">
            <Reveal>
              <Eyebrow color="forest">SELECTED WORK</Eyebrow>
            </Reveal>

            <h1
              className="font-display text-headline"
              style={{
                fontSize: "clamp(3rem, 6.5vw, 6rem)",
                fontWeight: 500,
                lineHeight: 1.04,
                letterSpacing: "-0.022em",
              }}
            >
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
              <p className="max-w-[600px] text-[17px] md:text-[18px] leading-[1.55] text-ink-muted">
                Each tile is a live URL — shipped, in production, earning its
                keep.
              </p>
            </Reveal>
          </div>

          <Reveal
            delay={accentDelayMs + 600}
            className="hidden md:flex flex-col items-end gap-1.5 shrink-0 mb-2 lg:mb-3"
          >
            <span
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.5rem, 4.5vw, 4rem)",
                fontWeight: 500,
                lineHeight: 0.9,
                letterSpacing: "-0.025em",
              }}
            >
              {featuredProjects.length.toString().padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted">
              live sites · 2025–2026
            </span>
          </Reveal>
        </div>
      </section>

      {/* Hairline marking the transition into the gallery — full-bleed. */}
      <div
        className="px-8 md:px-16 lg:px-24"
        style={{
          marginLeft: "calc(50% - 50vw)",
          width: "100vw",
        }}
      >
        <AuroraHairline />
      </div>

      {/* ---------------- Gallery (chaptered, full-bleed) ---------------- */}
      {!hasProjects ? (
        <section
          className="pt-14 md:pt-20 pb-28 px-8 md:px-16 lg:px-24"
          style={{
            marginLeft: "calc(50% - 50vw)",
            width: "100vw",
          }}
        >
          <div className="mx-auto max-w-3xl">
            <Reveal>
              <div className="rounded-xl border border-line bg-surface-calm px-8 py-16 flex flex-col gap-5 items-start">
                <Eyebrow color="ink-muted">EMPTY · TODO</Eyebrow>
                <p
                  className="font-display text-[28px] leading-tight text-ink"
                  style={{ fontWeight: 500 }}
                >
                  Case studies launch with the first cohort.
                </p>
                <p className="text-ink-muted text-[15px] max-w-xl leading-relaxed">
                  We don&apos;t fill this page with placeholder projects, stock
                  imagery, or work we didn&apos;t finish. When real case
                  studies ship, they&apos;ll live here.
                </p>
                <Button href="/contact" variant="primary" size="lg">
                  Be the first
                </Button>
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        chapters.map(({ chapter, projects }, idx) => (
          <section
            key={chapter.num}
            className={`px-8 md:px-16 lg:px-24 ${
              idx === 0 ? "pt-16 md:pt-24" : "pt-24 md:pt-32"
            } ${idx === chapters.length - 1 ? "pb-28" : "pb-12 md:pb-16"}`}
            style={{
              marginLeft: "calc(50% - 50vw)",
              width: "100vw",
            }}
          >
            {/* Chapter header */}
            <div className="mb-12 md:mb-16">
              <ChapterHeader chapter={chapter} />
            </div>

            {/* Chapter grid */}
            <ChapterGrid
              projects={projects}
              pattern={chapter.pattern}
              onOpen={handleOpen}
              startDelay={idx * 200}
            />

            {/* Inter-chapter hairline (after grid, except the last) */}
            {idx < chapters.length - 1 && (
              <div className="mt-20 md:mt-28">
                <AuroraHairline />
              </div>
            )}
          </section>
        ))
      )}

      {/* ---------------- Closing CTA ---------------- */}
      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        <section className="py-20 md:py-24">
          <AuroraHairline />
          <Reveal className="pt-14 md:pt-16 flex flex-col gap-6 items-start max-w-2xl">
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

      {/* Fullscreen FLIP modal */}
      <WorkModal
        project={selected ? toFeaturedWork(selected.project) : null}
        originRect={selected?.rect ?? null}
        onClose={handleClose}
      />
    </>
  );
}
