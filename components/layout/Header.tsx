"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wordmark } from "./Wordmark";
import { ThemeToggle } from "./ThemeToggle";
import { AvailableStamp } from "@/components/ui/AvailableStamp";
import { site } from "@/lib/content/site";

/**
 * Sticky header. The wordmark is ALWAYS visible (brand anchor in the
 * top-left, even on the hero).
 *
 * The rest of the chrome (nav, theme toggle, available stamp, bg plate)
 * fades in differently per route:
 *   - Home (`/`): scroll-driven — invisible at top, fully visible by
 *     ~110% of viewport scroll. The hero is full-viewport tall so the
 *     scroll mechanism gives the right pacing.
 *   - Inner pages: time-driven — waits ~3500ms after mount, then fades
 *     in over 1000ms. That's the rough duration of the per-word hero
 *     `hero-word` cascade + lede across the inner pages, so the chrome
 *     appears just AFTER the last letter of the hero finishes landing.
 */
const INNER_PAGE_HERO_DURATION_MS = 3500;
const INNER_PAGE_FADE_MS = 1000;

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (isHome) {
      let raf = 0;
      const update = () => {
        raf = 0;
        const y = window.scrollY;
        const start = window.innerHeight * 0.6;
        const end = window.innerHeight * 1.1;
        const t = Math.min(1, Math.max(0, (y - start) / (end - start)));
        setOpacity(t);
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
    }

    // Inner-page path: time-based fade-in after hero cascade finishes.
    setOpacity(0);
    const timer = window.setTimeout(() => {
      setOpacity(1);
    }, INNER_PAGE_HERO_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isHome]);

  const hidden = opacity < 0.1;
  // Home uses RAF-driven incremental opacity that updates many times per
  // frame; a CSS transition on top would cause visible lag. Inner pages
  // toggle from 0→1 in a single state change, so the transition gives
  // the smooth fade-up.
  const opacityTransition = isHome
    ? "none"
    : `opacity ${INNER_PAGE_FADE_MS}ms ease-out`;

  return (
    <header className="sticky top-0 z-50">
      {/* Background plate (blur + bg + bottom border). Fades in with the
          rest of the chrome. Sits behind the bar content via z-0. */}
      <div
        aria-hidden
        className="absolute inset-0 z-0 bg-bg/85 backdrop-blur-md border-b border-line"
        style={{
          opacity,
          pointerEvents: "none",
          transition: opacityTransition,
        }}
      />

      <div className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-6 md:px-10 py-4">
        {/* Wordmark — always visible, doesn't fade */}
        <Wordmark />

        {/* Everything to the right of the wordmark fades together */}
        <div
          className="flex items-center gap-6"
          style={{
            opacity,
            pointerEvents: hidden ? "none" : undefined,
            transition: opacityTransition,
          }}
        >
          <nav
            aria-label="Primary"
            className="hidden md:flex items-center gap-6 text-[13px] text-ink-muted"
          >
            {site.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-forest transition-colors py-1"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <span className="hidden sm:inline-block">
              <AvailableStamp size={56} />
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
