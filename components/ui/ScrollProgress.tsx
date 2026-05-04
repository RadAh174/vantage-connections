"use client";

import { useEffect, useRef } from "react";

/**
 * 1px hairline at the very top of the viewport. Aurora gradient.
 * scaleX driven by scroll position.
 */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let pending = false;

    function update() {
      pending = false;
      const doc = document.documentElement;
      const max = (doc.scrollHeight - doc.clientHeight) || 1;
      const p = Math.max(0, Math.min(1, window.scrollY / max));
      if (el) el.style.transform = `scaleX(${p})`;
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

  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-px">
      <div
        ref={ref}
        className="aurora-hairline aurora-hairline-animate h-full origin-left"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

export default ScrollProgress;
