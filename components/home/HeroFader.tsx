"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Wraps hero content and fades it out as the user scrolls down.
 *
 * Opacity goes 1 → 0 over the first ~70% of viewport height of scroll.
 * Subtle downward parallax (~0.15× scroll distance) gives a slight
 * "lift away" feel rather than a flat opacity-only fade.
 *
 * RAF-throttled, passive scroll listener — no blocking.
 * Honors `prefers-reduced-motion: reduce` (no parallax in that case;
 * fade still runs because it's not motion-triggering — it's just
 * an opacity change).
 */
export function HeroFader({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;

    const update = () => {
      raf = 0;
      const scrollY = window.scrollY;
      const fadeRange = window.innerHeight * 0.7;
      const t = Math.min(1, Math.max(0, scrollY / fadeRange));
      const opacity = 1 - t;
      const translateY = reduced ? 0 : scrollY * 0.15;
      el.style.opacity = String(opacity);
      el.style.transform = `translate3d(0, ${translateY}px, 0)`;
      // Once fully faded, drop pointer events so links underneath the
      // hero can still be interacted with after the fade completes.
      el.style.pointerEvents = opacity === 0 ? "none" : "";
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="will-change-transform">
      {children}
    </div>
  );
}

export default HeroFader;
