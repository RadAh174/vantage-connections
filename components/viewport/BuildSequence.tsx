"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Viewport, type ViewportState } from "./Viewport";

const SEQUENCE: ViewportState[] = ["wireframe", "typography", "color", "polished"];

type Props = {
  /** Loop autonomously instead of being driven by scroll. */
  autoLoop?: boolean;
  /** Loop interval in ms. Default 8000 (Work page). */
  loopInterval?: number;
  url?: string;
  content?: ReactNode;
  className?: string;
};

/**
 * Wraps Viewport and progresses through build states.
 * - Default (autoLoop=false): driven by scroll progress over the parent area.
 * - Work-page (autoLoop=true): cycles every `loopInterval` ms.
 */
export function BuildSequence({
  autoLoop = false,
  loopInterval = 8000,
  url = "",
  content,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ViewportState>(
    autoLoop ? "wireframe" : "wireframe",
  );

  // Auto loop mode
  useEffect(() => {
    if (!autoLoop) return;
    let i = 0;
    setState(SEQUENCE[0]);
    const id = setInterval(() => {
      i = (i + 1) % SEQUENCE.length;
      setState(SEQUENCE[i]);
    }, loopInterval);
    return () => clearInterval(id);
  }, [autoLoop, loopInterval]);

  // Scroll-driven mode
  useEffect(() => {
    if (autoLoop) return;
    const el = wrapRef.current;
    if (!el) return;

    let raf = 0;
    let pending = false;

    function update() {
      pending = false;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progress: 0 when element top is at bottom of viewport,
      // 1 when element bottom hits top of viewport.
      const total = r.height + vh;
      const traveled = vh - r.top;
      const p = Math.max(0, Math.min(1, traveled / total));
      // Map 0..1 → state index. Expand "polished" to last 30%.
      let idx = 0;
      if (p > 0.18) idx = 1;
      if (p > 0.4) idx = 2;
      if (p > 0.62) idx = 3;
      setState(SEQUENCE[idx]);
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
  }, [autoLoop]);

  return (
    <div ref={wrapRef} className={className}>
      <Viewport state={state} url={url} content={content} />
    </div>
  );
}

export default BuildSequence;
