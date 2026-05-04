"use client";

import { useEffect, useState } from "react";

/**
 * Document-attached atmospheric background.
 *
 * Renders organic blob shapes positioned in the upper portion of the page
 * (around the hero). Each blob is an absolutely-positioned `<div>` with a
 * solid rgba fill + an asymmetric `border-radius` (so the shape is not a
 * circle) + slight rotation + heavy `filter: blur()` to soften the edges.
 *
 * The wrapper uses `position: absolute; inset: 0` so it stretches to the
 * full body height (body has `position: relative`) and scrolls with the
 * document — as the user scrolls down, the blobs move up out of view, which
 * is the requested "attached to the page, not the viewport" behavior.
 *
 * No mix-blend-mode (low-alpha screen on near-black is invisible). No drift,
 * no parallax — fully static positioning. Reduced-motion safe by default.
 *
 * Theme is read from `<html class="light|dark">` via MutationObserver so the
 * glow alphas flip on toggle.
 */
export function AtmosphericBackground() {
  // Default to "dark" before mount so SSR + first paint match the most
  // common case (system pref on this site is dark). After hydration we
  // sync to the actual html class.
  const [mode, setMode] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const html = document.documentElement;

    const read = () => {
      if (html.classList.contains("light")) setMode("light");
      else if (html.classList.contains("dark")) setMode("dark");
    };

    read();

    const mo = new MutationObserver(read);
    mo.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, []);

// Per-mode opacities. Dark: visible accents but not pervasive.
  // Hero blobs are stronger; deeper clusters are subtle accents.
  // Light: barely-there warm tint everywhere.
  const op = mode === "dark"
    ? { hero: 0.28, accent: 0.16 }
    : { hero: 0.10, accent: 0.06 };

  // Raw RGB triplets — held constant across themes; only alpha flips per mode.
  const GOLD = "224, 180, 66";
  const FOREST = "26, 77, 51";

  // Glow definitions. Hero cluster lives in the first viewport. Smaller
  // accent clusters sit deeper in the document at irregular intervals so
  // the page rhythm alternates between dark sections and atmospheric
  // sections — instead of a single hero glow followed by pure dark.
  // Sizes are deliberately small (≤ 35vw) so each blob reads as an
  // accent, not a flood. Asymmetric border-radius + rotation = organic.
  const blobs: Array<{
    top: string;
    left?: string;
    right?: string;
    width: string;
    height: string;
    color: string;
    alpha: number;
    radius: string;
    blur: string;
    rotate: string;
    /** Optional mask-image (e.g. linear-gradient) for tapering one end of
        the shape into transparency. Use this instead of clip-path for a
        soft pointed tip — clip-path produces hard polygon edges that
        ignore the blur because filter is applied before clipping. */
    maskImage?: string;
  }> = [
    // Hero streaks — narrow + tall + heavily rotated. Asymmetric
    // border-radius weights one end of each shape so it tapers like a
    // beam / triangle. Heavy blur eats the edges so it reads as a streak
    // of light, not a stretched pill. Stretched longer + reaching further
    // into the center of the page so the streaks bleed across, not just
    // hug the edges.
    // Hero streaks — narrow + tall + rotated near 45° so the long axis
    // reads as a diagonal beam cutting into the center of the page.
    // Asymmetric border-radius weights one end. Heavy blur softens edges.
    { top: "-28vh", left: "-2vw", width: "20vw", height: "100vh",
      color: GOLD, alpha: op.hero,
      radius: "80% 20% 70% 30% / 65% 35% 60% 40%",
      blur: "85px", rotate: "-68deg" },
    { top: "8vh", left: "-16vw", width: "28vw", height: "120vh",
      color: FOREST, alpha: op.hero * 0.85,
      radius: "50% 50% 35% 65% / 50% 50% 45% 55%",
      blur: "100px", rotate: "62deg",
      // Fades the top half of the rectangle to transparent so the rotated
      // "tip" tapers smoothly to nothing — soft pointed end, no hard cut.
      maskImage: "linear-gradient(to top, black 30%, transparent 95%)" },
    { top: "20vh", right: "-2vw", width: "18vw", height: "95vh",
      color: GOLD, alpha: op.hero * 0.78,
      radius: "75% 25% 55% 45% / 60% 40% 50% 50%",
      blur: "80px", rotate: "-72deg" },

    // Accent streak around 240vh (after hero, mid horizontal scroll area)
    { top: "230vh", right: "-5vw", width: "16vw", height: "78vh",
      color: GOLD, alpha: op.accent,
      radius: "70% 30% 55% 45% / 60% 40% 55% 45%",
      blur: "75px", rotate: "40deg" },

    // Accent cluster around 420vh (post horizontal scroll, around teaser/CTA area)
    { top: "408vh", left: "-8vw", width: "18vw", height: "82vh",
      color: FOREST, alpha: op.accent,
      radius: "35% 65% 50% 50% / 45% 55% 50% 50%",
      blur: "85px", rotate: "-46deg" },
    { top: "462vh", right: "-6vw", width: "14vw", height: "70vh",
      color: GOLD, alpha: op.accent * 0.85,
      radius: "65% 35% 55% 45% / 55% 45% 50% 50%",
      blur: "70px", rotate: "44deg" },

    // Accent near footer (~620vh — only visible if doc is that long; harmless if not)
    { top: "608vh", left: "4vw", width: "16vw", height: "70vh",
      color: GOLD, alpha: op.accent * 0.7,
      radius: "60% 40% 50% 50% / 50% 50% 50% 50%",
      blur: "78px", rotate: "38deg" },
  ];

  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 -z-10 pointer-events-none overflow-hidden"
      style={{
        // This wrapper IS the page background. Body is transparent so
        // this paints through. inset:0 + body { position: relative }
        // stretches it to body height (= document height) so it scrolls
        // with content.
        backgroundColor: "var(--color-bg)",
        isolation: "isolate",
      }}
    >
      {blobs.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            top: b.top,
            left: b.left,
            right: b.right,
            width: b.width,
            height: b.height,
            backgroundColor: `rgba(${b.color}, ${b.alpha})`,
            borderRadius: b.radius,
            maskImage: b.maskImage,
            WebkitMaskImage: b.maskImage,
            filter: `blur(${b.blur})`,
            transform: `rotate(${b.rotate})`,
          }}
        />
      ))}
    </div>
  );
}

export default AtmosphericBackground;
