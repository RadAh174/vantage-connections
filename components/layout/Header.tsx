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
const CURSOR_FADE_MS = 200; // fast fade for cursor-near-top reveal
const CURSOR_REVEAL_ZONE_PX = 80; // top edge zone that triggers reveal
const CURSOR_HIDE_ZONE_PX = 130; // hysteresis: must move past this to re-hide

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [opacity, setOpacity] = useState(0);
  const [cursorRevealing, setCursorRevealing] = useState(false);
  const [cursorRecentlyChanged, setCursorRecentlyChanged] = useState(false);

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

  // Cursor-proximity reveal: when the cursor enters the top strip of
  // the viewport, force the header to fade in (semi-quickly). When
  // cursor leaves (with hysteresis so micro-jitter doesn't toggle), it
  // fades back out — unless the scroll/time-driven opacity already has
  // it visible, in which case it stays. Tracks `cursorRecentlyChanged`
  // so the fade-out uses the fast cursor transition (not the slower
  // scroll/time transition that's the default).
  useEffect(() => {
    let resetTimer = 0;
    const onMove = (e: MouseEvent) => {
      const y = e.clientY;
      setCursorRevealing((prev) => {
        const next = prev
          ? y < CURSOR_HIDE_ZONE_PX // hysteresis exit
          : y < CURSOR_REVEAL_ZONE_PX; // narrower entry trigger
        if (next !== prev) {
          setCursorRecentlyChanged(true);
          window.clearTimeout(resetTimer);
          resetTimer = window.setTimeout(
            () => setCursorRecentlyChanged(false),
            CURSOR_FADE_MS + 50,
          );
        }
        return next;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.clearTimeout(resetTimer);
    };
  }, []);

  const displayOpacity = cursorRevealing ? 1 : opacity;
  const hidden = displayOpacity < 0.1;
  // Transition selection:
  //   - cursor-driven changes (entering/leaving the top zone, including
  //     the tail of a fade-out) → fast 200ms
  //   - scroll-driven (home): no transition; RAF updates handle smoothness
  //   - time-driven (inner): existing slow 1000ms initial reveal
  const opacityTransition =
    cursorRevealing || cursorRecentlyChanged
      ? `opacity ${CURSOR_FADE_MS}ms ease-out`
      : isHome
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
          opacity: displayOpacity,
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
            opacity: displayOpacity,
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
