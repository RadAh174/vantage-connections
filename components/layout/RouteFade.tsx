"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";

/**
 * Lightweight CSS fade between routes. Wraps page <main>.
 *
 * When `usePathname()` changes, we briefly drop opacity then fade
 * the new route in. The transition runs purely via the CSS `transition`
 * declared in globals.css (`.route-fade`). 250ms ease-out.
 *
 * Why CSS over the View Transitions API:
 *   - React 19 stable does not export `unstable_ViewTransition` (only
 *     react-experimental does), and Next 15.5 only ships the experimental
 *     `viewTransition` flag — production-stable on this build is the
 *     CSS approach.
 *   - The native `@view-transition { navigation: auto; }` rule only
 *     covers MPA navigations, not Next's client-side route transitions.
 *   - Honors `prefers-reduced-motion` via the CSS itself (transition
 *     duration drops to 0).
 */
export function RouteFade({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reset scroll to the top on every route change. Next.js's
    // default scroll-to-top can race with Lenis — Lenis virtualizes
    // scroll via its own targetScroll, so a native window.scrollTo(0)
    // gets clobbered by Lenis's next RAF tick (it lerps back to its
    // OLD targetScroll). Telling Lenis directly with `immediate: true`
    // syncs animatedScroll, targetScroll, and the native scroll
    // position to 0 in one shot — no lerp, no flash of the previous
    // scroll position, no sticky half-page state. Falls through to
    // window.scrollTo if Lenis isn't mounted yet (e.g. first paint).
    //
    // Skip when there's a hash (#section) so anchor links still work.
    if (!window.location.hash) {
      type LenisHandle = {
        scrollTo: (target: number, options?: { immediate?: boolean }) => void;
      };
      const lenis = (window as Window & { __lenis?: LenisHandle }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo(0, 0);
      }
    }

    // Snap to faded-out state, then on next frame fade back in.
    el.classList.add("route-fade-out");
    const id = requestAnimationFrame(() => {
      el.classList.remove("route-fade-out");
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  return (
    <div ref={ref} className="route-fade flex flex-col flex-1 min-h-0">
      {children}
    </div>
  );
}

export default RouteFade;
