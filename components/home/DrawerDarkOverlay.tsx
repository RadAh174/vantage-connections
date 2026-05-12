"use client";

import { useDrawerProgress } from "@/components/home/ContactDrawerMount";

/**
 * Fixed dark overlay that fades in proportionally as the drawer
 * opens. Sits at `z-30` — below the drawer (z-40) and header
 * (z-50), above the rest of the page content + wordmark backdrop.
 * Effect: the page bg gradually darkens as the drawer rises, so
 * the drawer reads as bright foreground against a dimming backdrop
 * and the final snap state feels focal and committed.
 *
 * Fade timing: spans progress `-1 → 1` (twice the previous range).
 * Starts before the pin runway begins (negative progress is exposed
 * by ContactDrawerMount via unclamped tracking) and completes at
 * snap. Max opacity 0.45 — slightly lighter than the prior 0.55 so
 * page content stays legible behind the open drawer.
 */
const APPEAR_AT = -1;
const FADE_RANGE = 2;
const MAX_OPACITY = 0.5;

export function DrawerDarkOverlay() {
  const progress = useDrawerProgress();
  const opacity =
    Math.max(0, Math.min(1, (progress - APPEAR_AT) / FADE_RANGE)) *
    MAX_OPACITY;
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-30 bg-black"
      style={{
        opacity,
        transition: "opacity 80ms linear",
      }}
    />
  );
}

export default DrawerDarkOverlay;
