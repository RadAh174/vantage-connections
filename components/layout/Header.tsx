"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Wordmark } from "./Wordmark";
// import { ThemeToggle } from "./ThemeToggle";
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
 *
 * Mobile (< md): the desktop nav row collapses behind a hamburger
 * trigger that opens a full-screen sheet with the nav links. Sheet is
 * rendered as a sibling overlay, locks body scroll while open, and
 * closes on link tap or backdrop click.
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
  const [mobileOpen, setMobileOpen] = useState(false);

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

  // Cursor-proximity reveal — desktop pointers only.
  useEffect(() => {
    let resetTimer = 0;
    const onMove = (e: MouseEvent) => {
      const y = e.clientY;
      setCursorRevealing((prev) => {
        const next = prev
          ? y < CURSOR_HIDE_ZONE_PX
          : y < CURSOR_REVEAL_ZONE_PX;
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

  // Defensive: on mount AND on every route change, clear any stale
  // html/body overflow lock left behind by a sibling component (the
  // mobile sheet, the WorkModal, etc.) whose cleanup didn't fire
  // correctly during HMR or fast navigation. Without this, an
  // interrupted lock freezes the whole page (every scroll-driven
  // animation, every section, every pin runway) until a full reload —
  // and the user has to rediscover the bug per route.
  useEffect(() => {
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }, [pathname]);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    if (mobileOpen) {
      const prevHtmlOverflow = html.style.overflow;
      const prevBodyOverflow = body.style.overflow;
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
      return () => {
        html.style.overflow = prevHtmlOverflow;
        body.style.overflow = prevBodyOverflow;
      };
    }
    // Sheet is closed — make sure overflow is clear (covers any state
    // mismatch from an interrupted prior open).
    html.style.overflow = "";
    body.style.overflow = "";
  }, [mobileOpen]);

  // Close on route change. The pathname changing is the only reliable
  // signal across in-sheet link taps and external navigations.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close on Escape.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const displayOpacity = cursorRevealing ? 1 : opacity;
  const hidden = displayOpacity < 0.1;
  const opacityTransition =
    cursorRevealing || cursorRecentlyChanged
      ? `opacity ${CURSOR_FADE_MS}ms ease-out`
      : isHome
        ? "none"
        : `opacity ${INNER_PAGE_FADE_MS}ms ease-out`;

  // When the mobile sheet is open, force the header chrome (and its
  // bg plate) fully visible so the wordmark + close affordance are
  // legible regardless of scroll position.
  const effectiveOpacity = mobileOpen ? 1 : displayOpacity;
  const effectiveHidden = mobileOpen ? false : hidden;

  return (
    <>
      <header
        className="sticky top-0 z-50"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        {/* Background plate — fades with chrome. */}
        <div
          aria-hidden
          className="absolute inset-0 z-0 bg-bg/85 backdrop-blur-md border-b border-line"
          style={{
            opacity: effectiveOpacity,
            pointerEvents: "none",
            transition: opacityTransition,
          }}
        />

        <div className="relative z-10 mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-6 md:px-10 py-4">
          {/* Wordmark — always visible, doesn't fade */}
          <Wordmark />

          {/* Right cluster — desktop nav + chrome, OR hamburger on mobile */}
          <div
            className="flex items-center gap-6"
            style={{
              opacity: effectiveOpacity,
              pointerEvents: effectiveHidden ? "none" : undefined,
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
              {/* <ThemeToggle /> — hidden until light/dark theming is finalized */}
              <span className="hidden sm:inline-block">
                <AvailableStamp size={56} />
              </span>

              {/* Hamburger trigger — mobile only. 44×44 tap target. */}
              <button
                type="button"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-sheet"
                onClick={() => setMobileOpen((v) => !v)}
                className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md border border-line text-ink hover:text-forest transition-colors"
              >
                {/* Two stacked rules → "X" via rotation when open */}
                <span
                  aria-hidden="true"
                  className="relative block h-[14px] w-[18px]"
                >
                  <span
                    className="absolute left-0 right-0 h-px bg-current transition-transform duration-200"
                    style={{
                      top: "3px",
                      transform: mobileOpen
                        ? "translateY(4px) rotate(45deg)"
                        : "none",
                    }}
                  />
                  <span
                    className="absolute left-0 right-0 h-px bg-current transition-transform duration-200"
                    style={{
                      bottom: "3px",
                      transform: mobileOpen
                        ? "translateY(-4px) rotate(-45deg)"
                        : "none",
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile nav sheet — full-screen overlay with backdrop. */}
      <div
        id="mobile-nav-sheet"
        aria-hidden={!mobileOpen}
        inert={!mobileOpen}
        className="md:hidden fixed inset-0 z-40"
        style={{
          pointerEvents: mobileOpen ? "auto" : "none",
        }}
      >
        {/* Backdrop */}
        <div
          aria-hidden="true"
          onClick={() => setMobileOpen(false)}
          className="absolute inset-0 bg-bg/96 backdrop-blur-md transition-opacity duration-300"
          style={{ opacity: mobileOpen ? 1 : 0 }}
        />

        {/* Panel content */}
        <div
          className="absolute inset-0 flex flex-col transition-[transform,opacity] duration-300"
          style={{
            paddingTop: "calc(env(safe-area-inset-top) + 88px)",
            paddingBottom: "env(safe-area-inset-bottom)",
            transform: mobileOpen ? "translateY(0)" : "translateY(-12px)",
            opacity: mobileOpen ? 1 : 0,
          }}
        >
          <nav
            aria-label="Mobile primary"
            className="flex flex-col px-6 gap-1"
          >
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center justify-between py-4 text-[28px] font-display border-b border-line/60 transition-colors ${
                    active ? "text-forest" : "text-ink hover:text-forest"
                  }`}
                  style={{ minHeight: 56 }}
                >
                  <span>{item.label}</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-[12px] tracking-[0.2em] text-ink-muted"
                  >
                    →
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto flex items-center justify-between px-6 pb-8 pt-10 gap-4">
            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink hover:text-forest transition-colors border-b border-current pb-px"
              >
                {site.email}
              </a>
            ) : (
              <span className="font-mono text-[12px] uppercase tracking-[0.18em] text-ink-muted">
                {site.tagline}
              </span>
            )}
            <span className="inline-block">
              <AvailableStamp size={48} />
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
