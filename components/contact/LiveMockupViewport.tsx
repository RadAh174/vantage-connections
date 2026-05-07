"use client";

import { useEffect, useRef, useState } from "react";

import { MarketingMockup } from "./mockups/MarketingMockup";
import { LuxuryMockup } from "./mockups/LuxuryMockup";
import { SaasMockup } from "./mockups/SaasMockup";
import { PortfolioMockup } from "./mockups/PortfolioMockup";
import { HOST_FOR, type ProjectType } from "./mockups/types";

type Props = {
  /** Live company name from the form. */
  companyName: string;
  /**
   * Project type from the form's chip selection. When this changes the
   * viewport plays a "drop expanding from center" transition into the
   * new mockup style. Defaults to "marketing" (calmest first read).
   */
  projectType?: ProjectType;
  /** Reserved for future "submitted" polish state — currently unused. */
  submitted?: boolean;
  className?: string;
};

const ANIM_MS = 900;

const MOCKUPS: Record<ProjectType, (p: { companyName: string }) => React.ReactElement> = {
  marketing: MarketingMockup,
  luxury: LuxuryMockup,
  saas: SaasMockup,
  portfolio: PortfolioMockup,
};

/**
 * Contact-page viewport. Browser chrome (3 dots + URL bar) wraps a
 * preview area that holds up to two stacked mockup layers:
 *
 *   - The committed "currentStyle" sits underneath at full opacity.
 *   - When projectType changes, "nextStyle" mounts on top, animates
 *     in with a circle clip-path expanding from the center (700ms),
 *     then we swap currentStyle <- nextStyle and unmount the top layer.
 *
 * If the user clicks a third style mid-transition, we cancel the
 * pending timer and start fresh — so the new layer always wins,
 * without ever orphaning a half-revealed mockup.
 */
export function LiveMockupViewport({
  companyName,
  projectType = "marketing",
  submitted: _submitted = false,
  className = "",
}: Props) {
  // Trimmed company name — empty input falls back to a clearly-placeholder
  // string. Never invent a brand-sounding name.
  const trimmed = companyName.trim();
  const display = trimmed.length > 0 ? trimmed : "Your Brand";
  const slug = (trimmed.length > 0 ? trimmed : "yourbrand")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");

  // Tilt rig (mirrors components/viewport/Viewport.tsx).
  //   baseTilt: the rotateY center the active mouse-tracking range
  //             pivots around. clampedX * 4 swings ±4° from this.
  //   restTilt: where the mockup settles when the mouse is outside
  //             the tracking radius. Pulled further negative than
  //             baseTilt so the rest pose reads as "leaning slightly
  //             to the right" (negative rotateY brings the right edge
  //             closer to the viewer).
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const baseTilt = -2;
  const restTilt = 1;
  const targetRef = useRef({ x: restTilt, y: 0 });
  const currentRef = useRef({ x: restTilt, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    function loop() {
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * 0.08;
      cur.y += (tgt.y - cur.y) * 0.08;
      if (inner) {
        inner.style.transform = `perspective(1200px) rotateX(${cur.y.toFixed(
          2
        )}deg) rotateY(${cur.x.toFixed(2)}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    function onMove(e: MouseEvent) {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dxPx = e.clientX - cx;
      const dyPx = e.clientY - cy;

      // Tracking zone: a circle slightly larger than the mockup
      // (distance-to-corner + a small buffer). Outside this zone the
      // tilt eases back to neutral — keeps the mockup from reacting to
      // mouse movement across the rest of the page.
      const cornerDist = Math.sqrt(
        (r.width / 2) * (r.width / 2) + (r.height / 2) * (r.height / 2),
      );
      // 15% smaller tracking circle than the natural corner-distance +
      // 120px buffer — keeps the mockup from reacting to mouse motion
      // outside its immediate vicinity.
      const trackRadius = (cornerDist + 120) * 0.85;
      const distance = Math.sqrt(dxPx * dxPx + dyPx * dyPx);
      if (distance > trackRadius) {
        targetRef.current.x = restTilt;
        targetRef.current.y = 0;
        return;
      }

      const dx = dxPx / (r.width / 2);
      const dy = dyPx / (r.height / 2);
      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));
      targetRef.current.x = baseTilt + clampedX * 4;
      targetRef.current.y = -clampedY * 3;
    }

    function onLeave() {
      targetRef.current.x = restTilt;
      targetRef.current.y = 0;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Two-layer state machine
  const [currentStyle, setCurrentStyle] = useState<ProjectType>(projectType);
  const [nextStyle, setNextStyle] = useState<ProjectType | null>(null);
  const timerRef = useRef<number | null>(null);
  // Imperative WAAPI animation handle on the next layer. Driving the
  // reveal through Web Animations API rather than CSS keyframes avoids
  // a known browser quirk where clip-path animations break/snap inside
  // a `transform-style: preserve-3d` ancestor (the tilt rig). WAAPI
  // composes its own animation timeline that survives the 3D context.
  const nextLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectType === currentStyle && nextStyle === null) return;
    if (projectType === currentStyle && nextStyle !== null) {
      // User toggled back to current mid-animation → cancel the in-flight
      // reveal. The current layer stays put.
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      timerRef.current = null;
      setNextStyle(null);
      return;
    }

    // New target style. If a previous animation is still in flight,
    // commit it instantly so the new one starts from a clean state —
    // prevents stacking three layers or orphaning a half-revealed one.
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
      if (nextStyle !== null) {
        setCurrentStyle(nextStyle);
      }
    }
    setNextStyle(projectType);

    timerRef.current = window.setTimeout(() => {
      setCurrentStyle(projectType);
      setNextStyle(null);
      timerRef.current = null;
    }, ANIM_MS);
    // currentStyle/nextStyle intentionally omitted — we only react to
    // *external* projectType changes, not our own internal commits.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectType]);

  // Run the spread-from-center animation imperatively whenever a new
  // layer mounts. We use a JS-driven rAF loop that interpolates a
  // `mask-image: radial-gradient` instead of CSS `clip-path` keyframes:
  //
  //   - clip-path keyframes silently fail when an ancestor has
  //     `transform-style: preserve-3d` (the tilt rig wrapping this
  //     viewport) — we observed the new layer painting at full reveal
  //     from frame 1 in that case.
  //   - mask-image works inside 3D contexts. Driving it via rAF +
  //     inline-style updates avoids the WAAPI/CSS gradient-string
  //     interpolation gap (gradients don't animate by default).
  //
  // The radial gradient transitions from opaque (mockup visible) at
  // <r% to transparent (mockup hidden) just past r%. r grows from 0%
  // to 150% with easeOutCubic — 150% so the circle covers the
  // rectangle's corners.
  useEffect(() => {
    if (!nextStyle) return;
    const el = nextLayerRef.current;
    if (!el) return;
    let raf = 0;
    const start = performance.now();
    const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
    const setMask = (r: number) => {
      const grad = `radial-gradient(circle at 50% 50%, black ${Math.max(0, r - 1)}%, transparent ${r}%)`;
      el.style.maskImage = grad;
      // Safari still needs the prefixed form
      (el.style as CSSStyleDeclaration & { webkitMaskImage?: string }).webkitMaskImage = grad;
    };
    // Layer stays at opacity 1 throughout — the mask alone drives the
    // reveal. An opacity ramp would let the old mockup show through
    // the inside of the growing disk, reading as a fade rather than a
    // clean wipe.
    el.style.opacity = "1";
    setMask(0);
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ANIM_MS);
      const eased = easeOutCubic(t);
      setMask(eased * 150);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [nextStyle, currentStyle]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    };
  }, []);

  // URL bar pulses to the incoming hostname while the drop is in
  // progress, so the device "navigates" to the new section visibly.
  const visibleStyle = nextStyle ?? currentStyle;
  const url = HOST_FOR[visibleStyle](slug);

  const CurrentMockup = MOCKUPS[currentStyle];
  const NextMockup = nextStyle ? MOCKUPS[nextStyle] : null;

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${className}`}
      style={{ perspective: 1200 }}
    >
      <div
        ref={innerRef}
        className="relative w-full overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(26,26,26,0.25),_0_2px_8px_rgba(26,26,26,0.06)] transition-shadow"
        style={{
          transform: `perspective(1200px) rotateY(${restTilt}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Browser chrome — matches components/viewport/Viewport.tsx */}
        <div className="flex items-center gap-2 border-b border-line bg-surface-calm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-line" />
            <span className="block h-2.5 w-2.5 rounded-full bg-line" />
            <span className="block h-2.5 w-2.5 rounded-full bg-line" />
          </div>
          <div className="ml-3 flex-1 truncate rounded-md bg-bg px-3 py-1 font-mono text-[10.5px] text-ink-muted">
            {url}
          </div>
        </div>

        {/* Preview area — stacked mockup layers */}
        <div className="relative aspect-[4/3] w-full">
          {/* Old / committed layer. Solid surface bg so the mockup's
              transparent gaps don't show through to the page bg. */}
          <div
            className="absolute inset-0 bg-surface"
            aria-hidden={nextStyle !== null}
          >
            <CurrentMockup companyName={display} />
          </div>

          {/* New layer dropping in. Mask-image starts as a tiny
              gradient pinhole so the first paint is essentially
              invisible; the rAF loop in useEffect grows it.
              `bg-surface` makes the entire layer opaque inside the
              mask — without it, the spreading disk reveals the new
              mockup's content but the gaps between its elements show
              through to the OLD mockup beneath. */}
          {NextMockup && (
            <div
              ref={nextLayerRef}
              key={`${nextStyle}-${currentStyle}`}
              className="absolute inset-0 bg-surface"
              style={{
                willChange: "mask-image",
                maskImage:
                  "radial-gradient(circle at 50% 50%, black 0%, transparent 0%)",
                WebkitMaskImage:
                  "radial-gradient(circle at 50% 50%, black 0%, transparent 0%)",
              }}
            >
              <NextMockup companyName={display} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveMockupViewport;
