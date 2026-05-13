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
      // Lighter coast — was 1.35 (middle-ground), now 1.0. Still adds
      // smoothing over native scroll but feels markedly less weighty;
      // wheel input resolves to its target ~25% faster. Drop further
      // (0.7–0.9) for an even snappier feel; raise back toward 1.3+
      // if smoothing reads as too clipped.
      duration: 1.0,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      // Don't intercept on elements (or their descendants) that opt out.
      prevent: (node) => node.hasAttribute("data-lenis-prevent"),
    });

    // Expose Lenis for in-page modulation hooks.
    (window as Window & { __lenis?: Lenis }).__lenis = lenis;

    // Drive Lenis with a virtual clock so a `__lenisTimeScale` set
    // anywhere on the page (e.g. PullQuote) can slow Lenis's
    // animations without killing momentum. Scale < 1 advances virtual
    // time slower → animations progress slower → page takes longer to
    // catch up to its scroll target. The target itself (= the user's
    // accumulated wheel distance) is untouched, so all the momentum
    // is preserved; it just plays out at a reduced rate.
    let rafId = 0;
    let virtualTime = 0;
    let lastRealTime: number | null = null;
    const raf = (realTime: number) => {
      if (lastRealTime === null) {
        virtualTime = realTime;
      } else {
        const realDt = realTime - lastRealTime;
        const scale =
          (window as Window & { __lenisTimeScale?: number })
            .__lenisTimeScale ?? 1;
        virtualTime += realDt * scale;
      }
      lastRealTime = realTime;
      lenis.raf(virtualTime);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      delete (window as Window & { __lenis?: Lenis }).__lenis;
      delete (window as Window & { __lenisTimeScale?: number })
        .__lenisTimeScale;
      lenis.destroy();
    };
  }, []);

  return null;
}

export default SmoothScroll;
