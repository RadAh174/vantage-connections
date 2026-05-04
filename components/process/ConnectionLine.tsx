"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Curve direction. */
  direction?: "left-to-right" | "right-to-left";
  /** Stroke color CSS variable token. Defaults to var(--color-line). */
  strokeColor?: string;
};

/**
 * Vertical SVG curve that connects one phase section to the next.
 * Stroke-dasharray animates with scroll progress over the line's
 * own bounding box.
 */
export function ConnectionLine({
  direction = "left-to-right",
  strokeColor,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    let pending = false;

    function update() {
      pending = false;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress: 0 when bottom of line is at bottom of viewport,
      //           1 when top of line is at top of viewport.
      const total = r.height + vh;
      const traveled = vh - r.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      setProgress(p);
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Path: gentle S-curve from top to bottom of a 100x180 viewbox.
  const d =
    direction === "left-to-right"
      ? "M 20 0 C 20 60, 80 120, 80 180"
      : "M 80 0 C 80 60, 20 120, 20 180";

  // Approximate path length so dashoffset is meaningful.
  const len = 200;
  const offset = len * (1 - progress);

  return (
    <div
      ref={wrapRef}
      aria-hidden="true"
      className="relative mx-auto my-8 h-[180px] w-full max-w-[100px] pointer-events-none"
    >
      <svg
        viewBox="0 0 100 180"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        <path
          d={d}
          fill="none"
          stroke={strokeColor ?? "var(--color-line)"}
          strokeWidth={1.25}
          strokeLinecap="round"
        />
        <path
          d={d}
          fill="none"
          stroke="var(--color-forest)"
          strokeOpacity={0.55}
          strokeWidth={1.25}
          strokeLinecap="round"
          strokeDasharray={len}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 60ms linear" }}
        />
      </svg>
    </div>
  );
}

export default ConnectionLine;
