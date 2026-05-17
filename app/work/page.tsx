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
 * Chapter 1 — 5-card pattern (4 cols × 3 rows):
 *   ┌───┬───┬───┬───┐
 *   │ B │ B │ W │ W │   row 1
 *   │ B │ B │ s │ s │   row 2
 *   │ F │ F │ F │ F │   row 3 — full-width banner
 *   └───┴───┴───┴───┘
 *   BIG anchor on the left, asymmetric WIDE + 2 SMALL satellites on
 *   the right, full-width WIDE banner closing the chapter.
 *
 * Chapter 2 — 2-card pattern (4 cols × 2 rows):
 *   ┌───┬───┬───┬───┐
 *   │ B │ B │ B │ B │   row 1
 *   │ B │ B │ B │ B │   row 2
 *   └───┴───┴───┴───┘
 *   Two BIG anchors side by side — the two PredictBase versions as a
 *   matched pair.
 *
 * BIG = col-span 2 / row-span 2  |  W = col-span 2  |  s = col-span 1  |  F = col-span 4
 *
 * Click → opens the same fullscreen `WorkModal` the home carousel
 * uses (FLIP from the originating card → 96vw × 96dvh viewer with the
 * live site in an iframe).
 */

// 5-card pattern for chapter 1 (4 cols × 3 rows): BIG anchor + WIDE +
// 2 SMALL satellites + full-width banner closer.
const PATTERN_5: readonly string[] = [
  "lg:col-span-2 lg:row-span-2", // 0 — BIG anchor (rows 1-2, cols 1-2)
  "lg:col-span-2 lg:row-span-1", // 1 — WIDE (row 1, cols 3-4)
  "lg:col-span-1 lg:row-span-1", // 2 — SMALL (row 2, col 3)
  "lg:col-span-1 lg:row-span-1", // 3 — SMALL (row 2, col 4)
  "lg:col-span-4 lg:row-span-1", // 4 — Full-width banner (row 3)
];

// 2-card pattern for chapter 2 (4 cols × 2 rows): two BIG anchors
// side by side — the two PredictBase versions as a matched pair.
const PATTERN_2: readonly string[] = [
  "lg:col-span-2 lg:row-span-2", // 0 — BIG anchor (cols 1-2)
  "lg:col-span-2 lg:row-span-2", // 1 — BIG anchor (cols 3-4)
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
    pattern: PATTERN_5,
    slugs: [
      "black-diamond",            // BIG anchor — most photographed
      "pioneer-engineer",         // WIDE — industrial banner energy
      "pacific-family-dental",    // SMALL
      "jenny-smith",              // SMALL
      "patriot-plumbing",         // Full-width banner closer
    ],
  },
  {
    num: "02",
    eyebrow: "PRODUCT SURFACES",
    title: "Where users live, day after day.",
    body: "Dashboards, SaaS UIs, and product interfaces — the work that has to actually function. Not flashy for a screenshot; readable on the 200th visit.",
    pattern: PATTERN_2,
    slugs: [
      "predictbase",              // BIG — v1
      "predictbase-v2",           // BIG — v2
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
  // Fallback chain (primary → fallback → text):
  //   1. thum.io — streams a real screenshot immediately (no
  //      placeholder-while-generating phase). Free tier (1000/mo, no
  //      signup). Primary because mShots' silent-placeholder behavior
  //      caused "thumbnails are random on refresh" — its generated
  //      image isn't ready on first request and it returns a blank
  //      placeholder that the browser treats as a successful load.
  //   2. mShots (s.wordpress.com/mshots) — fallback when thum.io errors
  //      out (e.g. quota exhausted). Output dims match capture viewport
  //      so mShots isn't asked to upscale.
  //   3. Typographic text fallback — if both services fail, show the
  //      client name + "preview unavailable" so the cell never reads
  //      as empty.
  // Cell-aware capture aspect:
  //   - WIDE cells (~2.5:1) get a 16:9 capture for mShots; thum.io
  //     defaults to a wide capture too.
  //   - BIG / SMALL cells (~1.15:1) get a 1:1 capture for mShots.
  const isWideCell = span === "lg:col-span-2 lg:row-span-1";
  const mshotsParams = isWideCell
    ? "w=1440&h=900&vpw=1440&vph=900"
    : "w=1440&h=1440&vpw=1440&vph=1440";
  const thumioUrl = liveUrl
    ? `https://image.thum.io/get/width/1440/noanimate/${liveUrl}`
    : null;
  const mshotsUrl = liveUrl
    ? `https://s.wordpress.com/mshots/v1/${encodeURIComponent(liveUrl)}?${mshotsParams}`
    : null;

  const [imgState, setImgState] = useState<"primary" | "fallback" | "failed">(
    "primary",
  );
  const screenshotUrl =
    imgState === "primary"
      ? thumioUrl
      : imgState === "fallback"
        ? mshotsUrl
        : null;

  // Advance the fallback chain — used by both onError (HTTP failure)
  // and onLoad (when the image loaded but is suspiciously small,
  // suggesting it's a placeholder rather than a real screenshot).
  const advanceFallback = () =>
    setImgState((prev) => (prev === "primary" ? "fallback" : "failed"));

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
        className="group relative block h-full w-full overflow-hidden rounded-lg border border-line/40 shadow-[0_24px_48px_-24px_rgba(0,0,0,0.5),_0_2px_8px_rgba(0,0,0,0.08)] aspect-[16/10] lg:aspect-auto bg-surface-calm transition-transform duration-500 ease-out hover:scale-[1.04] hover:z-10 will-change-transform cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg text-left"
      >
        {screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            // `key` forces React to remount the <img> when src changes
            // so the new request actually fires (some browsers won't
            // re-fetch on src swap of the same element).
            key={screenshotUrl}
            src={screenshotUrl}
            alt={`${project.client} — preview`}
            loading="lazy"
            referrerPolicy="no-referrer"
            draggable={false}
            onError={advanceFallback}
            onLoad={(e) => {
              // Placeholder detection — if the image loaded but its
              // natural dimensions are much smaller than what we
              // requested, the service likely returned a placeholder
              // instead of a real screenshot. Step to the next service.
              const img = e.currentTarget;
              if (img.naturalWidth < 600 || img.naturalHeight < 300) {
                advanceFallback();
              }
            }}
            className="absolute inset-0 block h-full w-full object-cover object-top select-none"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-surface-calm px-4 text-center">
            <span className="font-display text-ink text-[18px] leading-tight">
              {project.client}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              {liveUrl ? "preview unavailable" : "no preview"}
            </span>
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
                <Eyebrow color="forest">SELECTED WORK</Eyebrow>
                <p
                  className="font-display text-[28px] leading-tight text-ink"
                  style={{ fontWeight: 500 }}
                >
                  Curated quarterly. Reach out to see the current portfolio.
                </p>
                <p className="text-ink-muted text-[15px] max-w-xl leading-relaxed">
                  Every case study is built from a real engagement — no
                  placeholder projects, no stock imagery, no work we
                  didn&apos;t finish.
                </p>
                <Button href="/contact" variant="primary" size="lg">
                  Start a project
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
