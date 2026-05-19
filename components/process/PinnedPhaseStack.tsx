"use client";

import { useEffect, useRef, useState } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ColorWord } from "@/components/ui/ColorWord";
import { phaseDetails, type PhaseDetail } from "@/lib/content/process";

/**
 * Pinned phase deck — scroll-driven card stack.
 *
 *   <section .process-pinned  height = 100vh + N * dwell-vh>     ← runway
 *     <span#phase-i .anchor /> ...                                ← ChapterNav targets
 *     <div .pin sticky top:0 h:100vh>
 *       <div .stage>
 *         <div .caption>OUR PROCESS · i / N</div>
 *         <div .card>                                             ← stationary frame
 *           <div .layer i=0  z=0  ty=0%>panel 0</div>            ← always at rest
 *           <div .layer i=1  z=1  ty=100→0%>panel 1</div>        ← slides up
 *           <div .layer i=2  z=2  ty=100→0%>panel 2</div>
 *           <div .layer i=3  z=3  ty=100→0%>panel 3</div>
 *         </div>
 *         <div .stepper />
 *       </div>
 *     </div>
 *   </section>
 *
 * Per-layer scroll mapping (i ≥ 1):
 *
 *   phaseLength = scrollable / N                ← one phase's runway
 *   slideStart  = i * phaseLength               ← scroll where layer i starts sliding
 *   slideRange  = phaseLength * SLIDE_FRACTION  ← short window
 *   t           = clamp((scroll - slideStart) / slideRange, 0, 1)
 *   eased       = easeOutCubic(t)
 *   translateY  = (1 - eased) * 100%
 *
 * Before slideStart: layer sits at translateY(100%), below the card frame.
 * During slide: layer rises from 100% to 0%, covering the layer beneath.
 * After slideEnd: layer rests at translateY(0%), z-index keeps it on top.
 *
 * Scrolling back reverses the mapping naturally — layer slides back down,
 * revealing the previous layer underneath.
 *
 * Layer 0 is always at translateY(0%); it's the bottom of the deck.
 *
 * UI state (stepper + caption) snaps to the next phase the moment its
 * slide-in begins — uses the same floor-based formula as before.
 *
 * Wheel boost: while wheeling over the section, push extra deltaY into
 * Lenis's target so each wheel tick advances ~2× normal speed. Lenis
 * smooths the boosted target.
 *
 * Mobile / reduced-motion: CSS collapses pin to display:none and the
 * mobile fallback container renders every phase as a normal stack.
 */

const SLIDE_FRACTION = 0.2; // 20% of each phase is the slide-in window; 80% dwell.

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

export function PinnedPhaseStack() {
  const outerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const panels = phaseDetails;
  const N = panels.length;

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    // Skip only on reduced-motion. Mobile uses the same scroll-driven
    // activeIndex as desktop — the mobile UI is a scroll-driven
    // accordion timeline (see the `.process-pinned__mobile` block in
    // JSX + globals.css) which reads `activeIndex` to expand/collapse.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = outer.getBoundingClientRect();
      // Use the viewport height as the pin height. The desktop `pinRef`
      // and the mobile `.process-pinned__mobile` are both `100vh` sticky
      // pins, but one of them is `display: none` at any given breakpoint
      // (their `offsetHeight` would be 0). `window.innerHeight` works
      // for both.
      const pinHeight = window.innerHeight;
      const scrollable = outer.offsetHeight - pinHeight;
      if (scrollable <= 0) return;
      const scrolled = Math.min(Math.max(-rect.top, 0), scrollable);
      const progress = scrolled / scrollable;

      // UI active index — snaps to phase i the moment scroll crosses
      // i/N of the runway (i.e. the moment its slide-in begins).
      const next = Math.min(
        N - 1,
        Math.max(0, Math.floor(progress * N * 0.9999)),
      );
      setActiveIndex((prev) => (prev === next ? prev : next));

      // Per-layer translateY (desktop card stack). Layer 0 stays at
      // rest; layers 1..N-1 slide up from below within their
      // `slideRange` window. Layers don't exist on mobile (display:
      // none on .process-pinned__pin) so the refs are null on the
      // mobile-only DOM tree — the null check below is the guard.
      const phaseLength = scrollable / N;
      const slideRange = phaseLength * SLIDE_FRACTION;
      for (let i = 0; i < N; i++) {
        const layer = layerRefs.current[i];
        if (!layer) continue;
        if (i === 0) {
          layer.style.transform = "translate3d(0, 0%, 0)";
          continue;
        }
        const slideStart = i * phaseLength;
        const tRaw = (scrolled - slideStart) / slideRange;
        const t = tRaw < 0 ? 0 : tRaw > 1 ? 1 : tRaw;
        const eased = easeOutCubic(t);
        const ty = (1 - eased) * 100;
        layer.style.transform = `translate3d(0, ${ty}%, 0)`;
      }
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
  }, [N]);

  /* Wheel boost. See header doc comment. */
  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;

    const mql = window.matchMedia(
      "(max-width: 767px), (prefers-reduced-motion: reduce)",
    );
    if (mql.matches) return;

    const BOOST = 1.0;

    type LenisHandle = {
      scrollTo: (
        target: number,
        opts?: { immediate?: boolean; lerp?: number; lock?: boolean },
      ) => void;
      targetScroll: number;
    };

    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const lenis = (window as Window & { __lenis?: LenisHandle }).__lenis;
      if (!lenis) return;
      lenis.scrollTo(lenis.targetScroll + e.deltaY * BOOST, { lerp: 0.12 });
    };

    outer.addEventListener("wheel", onWheel, { passive: true });
    return () => outer.removeEventListener("wheel", onWheel);
  }, []);

  return (
    <section
      ref={outerRef}
      aria-label="Our process, four phases"
      className="process-pinned"
      style={
        {
          ["--panel-count" as string]: N,
        } as React.CSSProperties
      }
    >
      {panels.map((phase, i) => {
        const DWELL_VH = 100;
        const topVh = i === 0 ? 0 : i * DWELL_VH + 0.5;
        return (
          <span
            key={phase.number}
            id={`phase-${phase.number}`}
            aria-hidden
            className="process-pinned__anchor"
            style={{ top: `${topVh}vh` }}
          />
        );
      })}

      {/* DESKTOP: pinned card stack. */}
      <div
        ref={pinRef}
        className="process-pinned__pin"
        data-active-index={activeIndex}
      >
        <div className="process-pinned__stage">
          <div className="process-pinned__caption">
            <span className="process-pinned__caption-label">
              OUR PROCESS
            </span>
            <span aria-hidden className="process-pinned__caption-rule" />
            <span className="process-pinned__caption-count">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="process-pinned__caption-count-of">
                {" "}/ {String(N).padStart(2, "0")}
              </span>
            </span>
          </div>

          <div className="process-pinned__card">
            {/* All panels rendered as stacked layers. Layer 0 sits at
                rest under everything; layers 1..N-1 start translated
                100% below the card and slide up to 0% as scroll
                progresses through their slide-in window. Z-index
                ascending so each new card covers the one beneath. */}
            {panels.map((phase, i) => (
              <div
                key={phase.number}
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                className="process-pinned__layer"
                style={{
                  zIndex: i,
                  // Initial pre-script position so the first paint
                  // doesn't flash all four layers at translateY(0).
                  transform:
                    i === 0 ? "translate3d(0, 0, 0)" : "translate3d(0, 100%, 0)",
                }}
                aria-hidden={i !== activeIndex}
              >
                <PhasePanelContent phase={phase} />
              </div>
            ))}
          </div>

          <div
            className="process-pinned__stepper"
            role="tablist"
            aria-label="Process phase"
          >
            {panels.map((phase, i) => (
              <span
                key={phase.number}
                aria-hidden
                className="process-pinned__step"
                data-active={i === activeIndex}
                data-past={i < activeIndex}
              />
            ))}
          </div>
        </div>
      </div>

      {/* MOBILE: scroll-driven accordion timeline. The outer
          `.process-pinned__mobile` is `position: sticky; top: 0;
          h:100vh` (display: block on mobile, display: none on
          desktop). All N phases are rendered as accordion items in a
          vertical stack with a gold-gradient timeline rail down the
          left side. The active phase (driven by the same `activeIndex`
          state the desktop pin uses, set by the scroll handler above)
          is expanded — its eyebrow, name, week range, and step list
          are visible. The others collapse to a compact header row
          (number + name + dot). As the user scrolls, the active
          changes; the previous active collapses smoothly, the new one
          expands. Net effect: each phase rises into the prominent
          slot in turn. */}
      <div className="process-pinned__mobile">
        <div className="process-pinned__mobile-stack">
          {panels.map((phase, i) => {
            const isActive = i === activeIndex;
            const isPast = i < activeIndex;
            return (
              <article
                key={phase.number}
                className="process-pinned__mobile-item"
                data-active={isActive}
                data-past={isPast}
                aria-expanded={isActive}
              >
                {/* Compact header — always visible. Dot on the left
                    sits on the timeline rail. */}
                <header className="process-pinned__mobile-item-header">
                  <span
                    aria-hidden
                    className="process-pinned__mobile-dot"
                  />
                  <span className="process-pinned__mobile-number">
                    {phase.number}
                  </span>
                  <span className="process-pinned__mobile-name">
                    {phase.name}
                  </span>
                  <span className="process-pinned__mobile-week">
                    {phase.weekRange}
                  </span>
                </header>

                {/* Expanded content — animates max-height + opacity
                    on the active state. The grid keeps the same
                    structure as the desktop panel content, just
                    stacked single-column. */}
                <div className="process-pinned__mobile-item-body">
                  <Eyebrow color="forest">
                    PHASE {phase.number} — {phase.name.toUpperCase()}
                  </Eyebrow>
                  <ol className="process-pinned__mobile-item-steps">
                    {phase.steps.map((step, j, arr) => (
                      <li
                        key={j}
                        style={{
                          borderBottom:
                            j < arr.length - 1
                              ? "1px solid var(--color-line)"
                              : "none",
                        }}
                      >
                        <span className="process-pinned__mobile-item-step-num">
                          {String(j + 1).padStart(2, "0")}
                        </span>
                        <div>
                          <span className="process-pinned__mobile-item-step-title">
                            {step.title}
                          </span>
                          <span className="process-pinned__mobile-item-step-body">
                            {step.body}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function PhasePanelContent({ phase }: { phase: PhaseDetail }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">
      <div className="lg:col-span-5 flex flex-col">
        <span
          className="color-word color-word--has-fallback font-display block"
          style={{
            fontSize: "clamp(4.5rem, 13vw, 12rem)",
            fontWeight: 700,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            backgroundImage: "var(--gold-grad)",
          }}
        >
          {phase.number}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted mt-4 block">
          {phase.weekRange}
        </span>
      </div>

      <div className="lg:col-span-7 flex flex-col gap-4 md:gap-5">
        <Eyebrow color="forest">
          PHASE {phase.number} — {phase.name.toUpperCase()}
        </Eyebrow>
        <h2
          className="font-display text-ink"
          style={{
            fontSize: "clamp(1.75rem, 3.4vw, 2.75rem)",
            fontWeight: 600,
            lineHeight: 1.05,
            letterSpacing: "-0.015em",
          }}
        >
          {phase.name}
          <ColorWord>.</ColorWord>
        </h2>
        <ol className="flex flex-col max-w-[640px] mt-1">
          {phase.steps.map((step, j, arr) => (
            <li
              key={j}
              className="flex items-baseline gap-4 md:gap-5 py-3 md:py-4"
              style={{
                borderBottom:
                  j < arr.length - 1 ? "1px solid var(--color-line)" : "none",
              }}
            >
              <span className="font-mono text-[11px] tracking-[0.22em] uppercase text-forest shrink-0 self-start mt-1.5">
                {String(j + 1).padStart(2, "0")}
              </span>
              <div className="flex flex-col gap-1 min-w-0">
                <span
                  className="font-display text-ink leading-tight"
                  style={{
                    fontSize: "clamp(15px, 1.45vw, 21px)",
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
    </div>
  );
}

export default PinnedPhaseStack;
