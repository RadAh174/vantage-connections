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
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { posts, tags, type BlogTag } from "@/lib/content/blog";

type Filter = "All" | BlogTag;

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

// ---------------- Hero word-cascade setup ----------------
// Mirrors home + /work + /pricing. Per-word `hero-word` spans with
// inline animation-delay (240ms step) for rhythm consistency.
// Two-line headline: "Notes on craft," / "process, and the work."
// Italic gold ColorWord accent on "Notes" — the journal's identity word.
const HERO_LINE_1 = ["on", "craft,"]; // accent ("Notes") leads, then these
const HERO_LINE_2 = ["process,", "and", "the", "work."];
const STEP_MS = 240;

export default function BlogIndexPage() {
  const [active, setActive] = useState<Filter>("All");

  const visible = useMemo(() => {
    if (active === "All") return posts;
    return posts.filter((p) => p.tag === active);
  }, [active]);

  const hasPosts = posts.length > 0;

  // Word delay sequence:
  //   0:  Notes (accent, line 1)
  //   1:  on
  //   2:  craft,
  //   3:  process,
  //   4:  and
  //   5:  the
  //   6:  work.
  const totalWords = 1 + HERO_LINE_1.length + HERO_LINE_2.length;
  const ledeDelayMs = (totalWords + 1) * STEP_MS;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero pattern (mirrors /work + /pricing): ~52dvh,
            no HeroFader, eyebrow + per-word cascade headline + lede. */}
        <section className="relative min-h-[52dvh] flex flex-col gap-7 pt-20 md:pt-28 pb-16 max-w-4xl">
          <Reveal>
            <Eyebrow color="forest">JOURNAL · NOTES</Eyebrow>
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
            {/* Line 1: "Notes on craft," — italic gold accent on Notes */}
            <span className="block">
              <span
                className="hero-word"
                style={{ animationDelay: `0ms` }}
              >
                <ColorWord>Notes</ColorWord>{" "}
              </span>
              {HERO_LINE_1.map((word, i) => (
                <span
                  key={`l1-${i}`}
                  className="hero-word"
                  style={{ animationDelay: `${(i + 1) * STEP_MS}ms` }}
                >
                  {word}{" "}
                </span>
              ))}
            </span>
            {/* Line 2: "process, and the work." */}
            <span className="block">
              {HERO_LINE_2.map((word, i) => (
                <span
                  key={`l2-${i}`}
                  className="hero-word"
                  style={{
                    animationDelay: `${(1 + HERO_LINE_1.length + i) * STEP_MS}ms`,
                  }}
                >
                  {word}{" "}
                </span>
              ))}
            </span>
          </h1>

          <Reveal delay={ledeDelayMs}>
            <p className="max-w-[540px] text-[18px] leading-[1.55] text-ink-muted">
              Short essays on craft, process, and the work of building
              websites that hold up. Written when there&apos;s something
              worth saying.
            </p>
          </Reveal>
        </section>

        {/* ---------------- Tag filter ---------------- */}
        <section className="pb-10">
          <AuroraHairline />
          <div className="pt-8 flex flex-wrap items-center gap-2.5">
            <Chip
              as="button"
              active={active === "All"}
              onClick={() => setActive("All")}
            >
              All
            </Chip>
            {tags.map((t) => (
              <Chip
                key={t}
                as="button"
                active={active === t}
                onClick={() => setActive(t)}
              >
                {t}
              </Chip>
            ))}
          </div>
        </section>

        {/* ---------------- Posts ---------------- */}
        <section className="pb-24">
          {!hasPosts ? (
            <Reveal>
              <div className="rounded-xl border border-line bg-surface-calm px-8 py-16 flex flex-col gap-5 items-start max-w-3xl">
                <Eyebrow color="ink-muted">EMPTY · TODO</Eyebrow>
                <p
                  className="font-display text-[28px] leading-tight text-ink"
                  style={{ fontWeight: 500 }}
                >
                  First essays shipping May 2026.
                </p>
                <p className="text-ink-muted text-[15px] max-w-xl leading-relaxed">
                  We don&apos;t fill the journal with placeholder posts. When
                  there&apos;s something worth writing, it&apos;ll live here.
                </p>
                <p className="font-mono text-[12px] text-ink-muted">
                  {/* TODO_BLOG_POSTS: fill lib/content/blog.ts > posts with
                      real essays. */}
                  Notes only — no SEO filler.
                </p>
                <Button href="/contact" variant="secondary" size="lg">
                  Get in touch
                </Button>
              </div>
            </Reveal>
          ) : visible.length === 0 ? (
            <Reveal>
              <div className="px-2 py-12 text-ink-muted text-[15px]">
                Nothing tagged <span className="text-ink">{active}</span> yet
                — try another filter.
              </div>
            </Reveal>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {visible.map((p, i) => (
                <Reveal key={p.slug} delay={i * 60}>
                  <li>
                    <Link
                      href={`/blog/${p.slug}`}
                      className="flex flex-col gap-3 group"
                    >
                      <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                        <time dateTime={p.date}>{formatDate(p.date)}</time>
                        <span aria-hidden="true">·</span>
                        <span>{p.readMinutes} min read</span>
                      </div>
                      <h3
                        className="font-display text-[26px] leading-tight text-ink group-hover:text-forest transition-colors"
                        style={{ fontWeight: 600 }}
                      >
                        {p.title}
                      </h3>
                      <p className="text-[15px] text-ink-muted leading-relaxed">
                        {p.excerpt}
                      </p>
                      <div className="mt-1">
                        <Chip>{p.tag}</Chip>
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
