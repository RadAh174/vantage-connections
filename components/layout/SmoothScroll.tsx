"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Global smooth-scroll wrapper. Lerps the page's vertical scroll so the
 * wheel feels weighted instead of snapping pixel-for-pixel — a small
 * deceleration after each wheel tick.
 *
 * Tuned soft: `duration: 1.1`, default exponential easing. Heavier
 * settings (e.g. duration 1.6) feel sluggish; this just adds a
 * noticeable trail.
 *
 * Coexists with the existing custom wheel handlers:
 *   - `WorkCarousel`: marks its scene element with `data-lenis-prevent`
 *     so Lenis doesn't intercept horizontal wheel that the carousel
 *     uses for ring rotation.
 *   - `ProcessHorizontalScroll`: ALSO uses `data-lenis-prevent` on the
 *     section so its custom horizontal-→-vertical redirect can run.
 *     The redirect calls window.scrollBy on the page, which Lenis
 *     picks up via its programmatic-scroll integration.
 *   - `WorkModal`: sets html/body overflow:hidden when open, which
 *     Lenis honors (it bails out when the page can't scroll).
 *
 * Touch / keyboard / native anchor scroll all unaffected — Lenis only
 * intercepts the wheel event (mouse + trackpad), and falls back to
 * native for everything else.
 */
export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      // Middle-ground weight: between the original (1.1, no multiplier)
      // and the heavy version (1.6 / 0.85). Noticeable coast without
      // the sluggish feel of the heavier setting.
      duration: 1.35,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 0.92,
      // Don't intercept on elements (or their descendants) that opt out.
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
