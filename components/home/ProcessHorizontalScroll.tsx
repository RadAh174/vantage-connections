"use client";

import { useEffect, useRef, useState } from "react";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { phaseDetails, type PhaseDetail } from "@/lib/content/process";

/**
 * Horizontal-scroll-pinned section.
 *
 * Layout (post-resize):
 *   <section ref=parent height: cardCount * 70vh>
 *     <div sticky top: ~15vh height: 70vh>      // pinned mid-viewport
 *       <div flex track translateX(...)>        // 4 cards
 *         [Card 01] [Card 02] [Card 03] [Card 04]
 *       </div>
 *     </div>
 *   </section>
 *
 * Section now lives INSIDE the regular content container (no full-bleed
 * breakout). Cards are ~85% of the container width with a gap, so the
 * previous + next cards peek at the edges — feels like a curated
 * carousel, not a takeover.
 *
 * Scroll-to-translate maths (driven by single RAF-throttled scroll
 * listener on `window`):
 *
 *   raw   = clamp((-rect.top) / (parent.height - pinHeight), 0, 1)
 *   gated = (raw - LEAD_IN) / (1 - LEAD_IN - LEAD_OUT)   // hold still
 *           clamp(gated, 0, 1)                            // for the
 *                                                         // first/last
 *                                                         // 8% of scroll
 *   eased = easeInOutCubic(gated)                         // soften joins
 *   x     = -eased * (cardCount - 1) * cardWidthPx        // translate
 *
 * Reduced-motion path: render a static vertical stack, no pinning.
 */

const LEAD_IN = 0;
const LEAD_OUT = 0;
// Overlap zone (in viewport heights) — extends the active horizontal-scroll
// detection BEYOND the section's pinned region on both ends. The track
// starts translating before the section is fully pinned (during entry)
// and finishes translating after the pin starts releasing (during exit),
// so the horizontal motion overlaps with the surrounding vertical scroll
// instead of starting/stopping abruptly at the pin boundaries.
const OVERLAP_VH = 0.35;

/** Linear easing (identity). easeInOutCubic was peaking ~1.5x speed at the
 *  midpoint, which made the middle of the scroll feel rushed. Linear keeps
 *  a constant rate throughout — combined with the lead-in/out zones below,
 *  the entry and exit still settle, but the middle no longer whips past. */
function ease(t: number): number {
  return t;
}

export function ProcessHorizontalScroll() {
  const parentRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [showHint, setShowHint] = useState(false);
  const hintShownRef = useRef(false);
  const phases = phaseDetails;
  const cardCount = phases.length;

  // Ephemeral "scroll down" hint — appears the first time the section
  // enters the viewport, fades out via its own CSS animation (~4s).
  // Once shown, never shows again in the session. Helps first-time
  // visitors realize the cards advance on VERTICAL scroll even though
  // they translate horizontally.
  useEffect(() => {
    const parent = parentRef.current;
    if (!parent) return;
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hintShownRef.current) {
          hintShownRef.current = true;
          setShowHint(true);
          // Match the keyframes total — 4.2s — then unmount the node
          // so it doesn't stay around as a stale fixed element.
          window.setTimeout(() => setShowHint(false), 4200);
        }
      },
      { threshold: 0.25 },
    );
    io.observe(parent);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const parent = parentRef.current;
    const pin = pinRef.current;
    const track = trackRef.current;
    if (!parent || !pin || !track) return;

    // Bail out of pin/scrub when reduced-motion is requested OR the
    // viewport is mobile — the matching CSS media query collapses the
    // layout to a vertical card stack, so any inline transform would
    // fight that. Also the wheel→scrollBy redirect (below) does
    // nothing on touch, so the pin pattern was unusable on phones.
    const isMobileOrReduced =
      typeof window !== "undefined" &&
      (window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
        window.matchMedia("(max-width: 767px)").matches);
    if (isMobileOrReduced) {
      track.style.transform = "translate3d(0, 0, 0)";
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = parent.getBoundingClientRect();
      const pinHeight = pin.offsetHeight;
      const scrollable = parent.offsetHeight - pinHeight;

      // Extend the active range by OVERLAP_VH on each end. Translation
      // begins when the section is `overlap` away from being pinned
      // (still vertically scrolling toward viewport top) and continues
      // until the section is `overlap` past the end of the pin
      // (already vertically scrolling out). This overlaps horizontal
      // motion with the surrounding vertical scroll on both sides.
      const overlap = window.innerHeight * OVERLAP_VH;
      const totalRange = scrollable + 2 * overlap;
      const scrolled = Math.min(
        Math.max(-rect.top + overlap, 0),
        totalRange,
      );
      const raw = totalRange > 0 ? scrolled / totalRange : 0;

      const window_ = 1 - LEAD_IN - LEAD_OUT;
      const gated = Math.min(
        Math.max((raw - LEAD_IN) / window_, 0),
        1,
      );
      const eased = ease(gated);

      // Card width in px: read first card's actual width so we translate
      // by the real distance (cards now use a % of pin width + gap, not
      // 100vw, so we can't hardcode `100vw`).
      const firstCard = track.firstElementChild as HTMLElement | null;
      const cardWidthPx = firstCard ? firstCard.offsetWidth : 0;
      const gapPx = parseFloat(getComputedStyle(track).columnGap || "0") || 0;
      const step = cardWidthPx + gapPx;

      const translate = -eased * (cardCount - 1) * step;
      track.style.transform = `translate3d(${translate}px, 0, 0)`;
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [cardCount]);

  // Redirect horizontal wheel/trackpad input to vertical page scroll while
  // the user is over the section. This way a sideways trackpad swipe
  // advances the cards (because card position is driven by vertical
  // scroll). Non-passive so we can preventDefault and stop the browser
  // from also trying to scroll the page horizontally. Only kicks in when
  // the dominant wheel axis is horizontal — vertical scroll passes
  // through normally.
  useEffect(() => {
    const section = parentRef.current;
    if (!section) return;

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      window.scrollBy(0, e.deltaX);
    };

    section.addEventListener("wheel", onWheel, { passive: false });
    return () => section.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      ref={parentRef}
      // No `data-lenis-prevent` here. The wheel handler below only
      // preventDefaults on HORIZONTAL wheel; pure vertical wheel passes
      // through to Lenis for the same weighted-smooth feel as the rest
      // of the page. Without this, scroll glitched at the section edge
      // where Lenis handed off to native (jumpy) scroll.
      className="process-horizontal relative"
      style={
        {
          ["--card-count" as string]: cardCount,
        } as React.CSSProperties
      }
      aria-label="Our process, four phases"
    >
      <div
        ref={pinRef}
        className="process-horizontal__pin sticky top-[15vh] overflow-hidden"
      >
        <div
          ref={trackRef}
          className="process-horizontal__track flex h-full will-change-transform"
          style={{
            // Cards are 85% of the pin width with a 6vw gap so the
            // previous/next card peeks ~7.5% on each side — the
            // contained carousel feel.
            columnGap: "6vw",
            transform: "translate3d(0, 0, 0)",
            // Pad start so the first card sits centered with the same
            // peek as the rest. Equal to (100% - 85%) / 2 = 7.5%.
            paddingInline: "7.5%",
          }}
        >
          {phases.map((phase) => (
            <PhaseCard key={phase.number} phase={phase} />
          ))}
        </div>

        {/* Ephemeral hint — fixed at the bottom of the viewport so it
            doesn't compete with card content. Shows once, fades out. */}
        {showHint && (
          <div
            aria-hidden
            className="process-horizontal__hint"
          >
            <span className="process-horizontal__hint-label">SCROLL</span>
            <span className="process-horizontal__hint-arrow">↓</span>
          </div>
        )}
      </div>
    </section>
  );
}

function PhaseCard({ phase }: { phase: PhaseDetail }) {
  return (
    <article
      className="relative flex h-full shrink-0 flex-col justify-start"
      style={{
        // 85% of the pin width — leaves 7.5% peek on each side once the
        // track's paddingInline pulls things in.
        width: "85%",
        padding: "5vw 5vw 4vw",
      }}
    >
      {/* Subtle frosted surface so text stays legible against the
          atmospheric glow stack beneath. No solid bg — just blur. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-2 md:inset-4 rounded-2xl border border-line"
        style={{
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          background:
            "color-mix(in oklab, var(--color-surface) 35%, transparent)",
        }}
      />

      {/* Massive gradient phase number — absolutely positioned so its
          12rem height doesn't inflate the title block and push the steps
          down. Sits top-right of the card; visually overlaps the steps
          column on the right side, which reads fine because the steps
          live in the left 7-of-12 columns of the grid. */}
      <span
        aria-hidden
        className="color-word color-word--has-fallback font-display pointer-events-none absolute select-none leading-none"
        style={{
          top: "5vw",
          right: "5vw",
          fontSize: "clamp(6rem, 14vw, 12rem)",
          fontWeight: 700,
          letterSpacing: "-0.04em",
          backgroundImage: "var(--gold-grad)",
          zIndex: 0,
        }}
      >
        {phase.number}
      </span>

      <div className="relative z-10 flex flex-col gap-4">
        <Eyebrow color="forest">PHASE {phase.number}</Eyebrow>
        <h3
          className="font-display text-headline"
          style={{
            fontSize: "clamp(2.25rem, 4.5vw, 4.5rem)",
            fontWeight: 600,
            lineHeight: 1.02,
            letterSpacing: "-0.02em",
          }}
        >
          {phase.name}.
        </h3>
      </div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* Numbered process list with two-tier hierarchy per step:
            - mono forest "01/02/03" anchor on the left
            - display-weight title on the right
            - muted supporting body underneath the title
            - hairline divider between items
            Gives the card editorial structure rather than a text slab. */}
        <ol className="lg:col-span-7 flex flex-col max-w-[640px]">
          {phase.steps.map((step, i, arr) => (
            <li
              key={i}
              className="flex items-baseline gap-5 py-3.5"
              style={{
                borderBottom:
                  i < arr.length - 1 ? "1px solid var(--color-line)" : "none",
              }}
            >
              <span className="font-mono text-[10px] tracking-[0.22em] uppercase text-forest shrink-0 self-start mt-1.5">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1">
                <span
                  className="font-display text-ink leading-tight"
                  style={{
                    fontSize: "clamp(15px, 1.4vw, 20px)",
                    fontWeight: 500,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {step.title}
                </span>
                <span
                  className="text-ink-muted leading-[1.5]"
                  style={{ fontSize: "clamp(13px, 1.05vw, 15px)" }}
                >
                  {step.body}
                </span>
              </div>
            </li>
          ))}
        </ol>

      </div>

      {/* mt-auto pushes the bottom hairline to the bottom of the card
          while the title + steps stay anchored to the top above it. */}
      <div className="relative z-10 flex items-end justify-between gap-6 mt-auto pt-6">
        <AuroraHairline className="flex-1" />
      </div>
    </article>
  );
}

export default ProcessHorizontalScroll;
