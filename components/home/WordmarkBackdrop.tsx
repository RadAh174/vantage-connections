"use client";

import { useDrawerProgress } from "@/components/home/ContactDrawerMount";

/**
 * Editorial wordmark that sits behind the rising contact drawer.
 *
 * Visibility is tied to drawer-mount scroll progress:
 *   - progress < APPEAR_AT          → opacity 0 (hidden)
 *   - APPEAR_AT → APPEAR_AT+FADE    → opacity 0 → 1 (fade in)
 *   - progress > APPEAR_AT+FADE     → opacity 1 (visible)
 * Without this, the wordmark was visible across the entire pin
 * runway, reading as "forever turned on" even during scroll
 * regions where the drawer wasn't yet meaningfully rising.
 *
 * Visual effects:
 *   1. Aurora halo — soft gold radial glow behind the text,
 *      breathing via CSS keyframes (opacity + scale).
 *   2. Shimmer with pause — `.vantage-shimmer` uses a two-layer
 *      background: a solid `#FFE49A` base + a narrow `transparent →
 *      #FFF4C2 → transparent` highlight band. The band sweeps
 *      left-to-right across the text in the first 40% of the cycle,
 *      then parks fully off-canvas for the remaining 60% — a real
 *      visible pause where only the solid gold base shows.
 *
 * `aria-hidden` because the wordmark is decorative — the brand name
 * is already in the page <title>, header wordmark, and footer.
 */

// Activation point for the gold FILL only. The outlined layer is
// always visible — so the wordmark reads as "outlined from the
// start, then fills with gold" rather than "appearing from nothing."
//
// Negative APPEAR_AT is meaningful now that ContactDrawerMount
// exposes UNCLAMPED progress (can go below 0 before pin-start).
// With APPEAR_AT = -0.6 and FADE = 0.24, the fade begins while
// the wordmark is still scrolling into view from below — fully
// gold by the time the runway pins.
const APPEAR_AT = -0.6;
const FADE = 0.24;

export function WordmarkBackdrop() {
  const progress = useDrawerProgress();
  const opacity = Math.max(
    0,
    Math.min(1, (progress - APPEAR_AT) / FADE),
  );

  return (
    <div
      aria-hidden="true"
      className="relative mx-auto max-w-[1600px] px-6 md:px-10 pb-[19rem] flex flex-col items-center text-center select-none"
      style={{
        // CSS variable mirrors the Vantage font-size clamp so the
        // Connections subline below can compensate for Vantage's
        // padding-bottom via calc() — `em` units would resolve
        // against Connections' own (much smaller) font-size and
        // wouldn't cancel out.
        ["--vantage-fz" as string]: "clamp(7rem, 18vw, 16rem)",
      }}
    >
      {/* Aurora halo — soft gold radial glow behind the wordmark.
          Pulses opacity + scale via the keyframes defined in
          globals.css. Pointer-events disabled so it never blocks. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: "min(120vw, 1800px)",
          height: "min(70vh, 700px)",
          background:
            "radial-gradient(ellipse at center, rgba(255, 200, 80, 0.28) 0%, rgba(255, 200, 80, 0.12) 30%, transparent 65%)",
          filter: "blur(60px)",
          animation: "vantage-aurora-pulse 4.5s ease-in-out infinite",
        }}
      />

      {/* Vantage — two layered renders. Outline is always visible;
          the gold shimmer fill fades in on scroll. */}
      <div className="relative grid">
        {/* Outlined layer (always visible base) — thin gold stroke
            so the wordmark reads as outlined even before the gold
            fill activates. */}
        <span
          className="font-display row-start-1 col-start-1"
          style={{
            fontSize: "var(--vantage-fz)",
            fontWeight: 500,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            fontStyle: "italic",
            display: "inline-block",
            paddingTop: "0.05em",
            paddingRight: "0.18em",
            paddingBottom: "0.22em",
            paddingLeft: "0.05em",
            WebkitTextStroke: "1.5px rgba(212, 161, 42, 0.75)",
            color: "transparent",
          }}
        >
          Vantage
        </span>

        {/* Shimmer fill layer — opacity tied to scroll progress so
            the gold "loads in" at the activation point on top of
            the outlined base. */}
        <span
          className="font-display vantage-shimmer row-start-1 col-start-1"
          style={{
            fontSize: "var(--vantage-fz)",
            fontWeight: 500,
            lineHeight: 0.88,
            letterSpacing: "-0.04em",
            fontStyle: "italic",
            // inline-block + padding extends the element's box past
            // the glyph ink so `background-clip: text` has gradient
            // to clip in those regions:
            //   - paddingBottom 0.22em: italic `g` descender
            //   - paddingRight 0.18em:  italic `e` rightward overhang
            //   - paddingLeft 0.05em:   left-side glyph overhang
            //   - paddingTop 0.05em:    ascender clearance
            display: "inline-block",
            paddingTop: "0.05em",
            paddingRight: "0.18em",
            paddingBottom: "0.22em",
            paddingLeft: "0.05em",
            opacity,
            transition: "opacity 80ms linear",
          }}
        >
          Vantage
        </span>
      </div>

      <span
        className="font-mono uppercase text-ink-muted relative"
        style={{
          fontSize: "clamp(0.9rem, 1.4vw, 1.25rem)",
          letterSpacing: "0.32em",
          // Pull up by Vantage's padding-bottom + top so this lands
          // at the original gap from Vantage's BASELINE rather than
          // from its expanded padding-box bottom. 0.27 = top (0.05) +
          // bottom (0.22). `em` in calc here resolves to Vantage's
          // font-size via --vantage-fz, NOT Connections' own
          // (much smaller) font-size.
          marginTop: "calc(1rem - var(--vantage-fz) * 0.27)",
        }}
      >
        Connections
      </span>
    </div>
  );
}

export default WordmarkBackdrop;
