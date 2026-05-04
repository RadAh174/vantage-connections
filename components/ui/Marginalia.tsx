"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  position?: "right" | "left";
  /** Pixel proximity to mouse for hover-fade activation. */
  proximity?: number;
  className?: string;
};

/**
 * Small JetBrains Mono note, 60% opacity by default.
 * Fades to 100% when the cursor is within `proximity` px (default 200).
 */
export function Marginalia({
  children,
  position = "right",
  proximity = 200,
  className = "",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pending = false;
    let lastX = 0;
    let lastY = 0;

    function measure() {
      pending = false;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = lastX - cx;
      const dy = lastY - cy;
      const dist = Math.hypot(dx, dy);
      setNear(dist <= proximity);
    }

    function onMove(e: MouseEvent) {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!pending) {
        pending = true;
        raf = requestAnimationFrame(measure);
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [proximity]);

  return (
    <aside
      ref={ref}
      className={`marginalia font-mono text-[11px] text-ink-muted ${
        position === "right" ? "text-left" : "text-right"
      } ${near ? "is-near" : ""} ${className}`}
      aria-hidden="true"
    >
      {children}
    </aside>
  );
}

export default Marginalia;
