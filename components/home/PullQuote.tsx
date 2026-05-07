"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/ui/Reveal";
import { ColorWord } from "@/components/ui/ColorWord";

/**
 * Editorial pull quote with proximity-based scroll deceleration.
 *
 * The visual is a full viewport-width hero block — image at natural
 * aspect, masked top + bottom edges, dark scrim for text legibility,
 * quote overlaid centered.
 *
 * The novel bit: as the section approaches the viewport center, we
 * progressively reduce Lenis's `wheelMultiplier` so the page
 * physically scrolls slower while the quote is in view. The user
 * feels the page "settle" as they reach the quote, then accelerate
 * back to normal speed when they leave. The lerped multiplier change
 * keeps the transition smooth — no abrupt speed jump.
 */

// Proximity range: how far from the section's center (in viewports)
// the slowdown reaches. Larger = the slow zone catches you earlier
// and lasts longer.
const NEAR_RANGE_VH = 1.0;

// At maximum proximity, scale Lenis's virtual time down to this
// fraction. 0.2 = ~5× slower at peak — fast wheel input still plays
// out (momentum preserved) but takes long enough that the user has
// to actually look at the quote before they're past it.
const SLOW_FACTOR = 0.2;

// Where the slow zone peaks within the viewport, as a fraction from
// the top. 0.5 = peak when the section's center hits viewport center.
// Values > 0.5 shift the peak to an earlier scroll position (the
// section is still lower in the viewport when the slowdown is at
// max), pulling the slow zone "up" in scroll space.
const PEAK_AT_VIEWPORT_FRACTION = 0.6;

// Lerp coefficient for smoothing the time-scale change each frame so
// the slowdown ramps in/out smoothly instead of stepping.
const LERP = 0.12;

// We modulate scroll speed by writing to `window.__lenisTimeScale`,
// which the SmoothScroll component reads each RAF tick to scale
// Lenis's virtual clock. Slower clock = animations progress slower
// = page takes longer to catch up to its target. The user's
// accumulated wheel distance (= momentum) is preserved — it just
// plays out at a reduced rate, like driving through mud.

export function PullQuote() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    let mounted = true;
    let currentScale = 1;

    type ScaleWindow = Window & {
      __lenisTimeScale?: number;
      __lenis?: { resize?: () => void };
    };
    const win = window as ScaleWindow;

    // Defensive reset — if a prior mount left a stale slow value on
    // the window (e.g. the user navigated away mid-zone and the
    // cleanup raced), the new mount should never inherit it.
    win.__lenisTimeScale = 1;

    const tick = () => {
      if (!mounted) return;

      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight;

      // Distance from the section center to the configured peak point
      // in the viewport, in pixels. Falls off linearly across
      // NEAR_RANGE_VH viewports.
      const sectionCenter = rect.top + rect.height / 2;
      const peakY = viewport * PEAK_AT_VIEWPORT_FRACTION;
      const distance = Math.abs(sectionCenter - peakY);
      const range = NEAR_RANGE_VH * viewport;
      const proximity = Math.max(0, Math.min(1, 1 - distance / range));

      // Smoothstep ease so the slowdown ramps in gently rather than
      // linearly.
      const eased = proximity * proximity * (3 - 2 * proximity);
      const targetScale = 1 - eased * (1 - SLOW_FACTOR);

      // Lerp toward target so the actual scale change is smooth.
      currentScale += (targetScale - currentScale) * LERP;
      win.__lenisTimeScale = currentScale;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      mounted = false;
      if (raf !== 0) cancelAnimationFrame(raf);
      // Restore normal time scale on unmount so other pages aren't
      // left with the slow setting.
      win.__lenisTimeScale = 1;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative left-1/2 -ml-[50vw] w-screen overflow-hidden"
    >
      {/* Image — natural aspect, no crop. Mask fades top + bottom edges
          so the section blends into the page bg above and below. */}
      <img
        aria-hidden="true"
        alt=""
        // Local 4800px WebP, migrated from the original Unsplash
        // hot-link via the image-upscale-pipeline skill (skipped the
        // AI upscale step since the Unsplash source is already
        // high-res — fetched at fm=webp&w=4800&q=92 instead).
        src="/images/2026-05-quote-perfection.webp"
        className="block w-full h-auto"
        decoding="async"
        // Image drives the section height (w-full h-auto). When it
        // loads, the page's scrollHeight grows — tell Lenis to
        // re-measure so its scroll cap reflects the new height. Without
        // this, navigating back to the home page from another route can
        // leave Lenis stuck at the pre-load cached max scroll.
        onLoad={() => {
          const w = window as Window & {
            __lenis?: { resize?: () => void };
          };
          w.__lenis?.resize?.();
        }}
        style={{
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 92%, transparent 100%)",
        }}
      />

      {/* Contrast scrim — dark overlay for text legibility, masked to
          the same fade as the image. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(6,10,8,0.78) 0%, rgba(8,16,12,0.72) 50%, rgba(6,10,8,0.82) 100%)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 92%, transparent 100%)",
          maskImage:
            "linear-gradient(to bottom, transparent 0%, black 55%, black 92%, transparent 100%)",
        }}
      />

      {/* Quote content overlay. */}
      <div className="absolute inset-0 flex items-center">
        <div className="mx-auto max-w-[1080px] px-6 md:px-12 flex flex-col gap-10 w-full">
          <Reveal>
            <blockquote
              className="font-display text-white"
              style={{
                fontSize: "clamp(1.75rem, 3.6vw, 3rem)",
                fontWeight: 500,
                lineHeight: 1.22,
                letterSpacing: "-0.012em",
                textWrap: "balance",
              }}
            >
              <span className="text-white/55">&ldquo;</span>
              Perfection is achieved not when there is nothing more to
              add, but when there is{" "}
              <ColorWord italic={true}>nothing left to take away</ColorWord>
              .<span className="text-white/55">&rdquo;</span>
            </blockquote>
          </Reveal>
          <Reveal delay={120}>
            <div className="flex items-center gap-4 pl-12">
              <span
                aria-hidden="true"
                className="block h-px w-10 bg-white/30"
              />
              <span className="font-mono text-[14px] uppercase tracking-[0.14em] text-white/60">
                Antoine de Saint-Exupéry
              </span>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export default PullQuote;
