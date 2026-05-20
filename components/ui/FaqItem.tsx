"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  q: string;
  a: string;
};

/**
 * Animated FAQ row. Replaces the native <details>/<summary> pattern with
 * a JS-controlled disclosure so the expand/collapse can transition the
 * height (the `<details>` element has no built-in height animation on
 * browsers without `interpolate-size: allow-keywords`).
 *
 * Visual rhythm:
 *   - "+" rotates 45° (becomes "×") over 300ms when open
 *   - Answer panel expands its max-height from 0 to content height over
 *     380ms with a smooth ease-out curve
 *   - Opacity fades in over 280ms once height starts opening — softens
 *     the snap of the text appearing
 *
 * Height is measured via a ResizeObserver on the inner content so the
 * panel adapts to copy changes, font loads, and viewport reflows
 * (responsive font sizes, etc.) without a hard-coded ceiling.
 *
 * Render contract: this component does NOT include its own <li> — the
 * caller wraps it in the right list semantic (usually `<Reveal as="li">`
 * to keep the cascading entrance animation working).
 */
export function FaqItem({ q, a }: Props) {
  const [open, setOpen] = useState(false);
  const measureRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const el = measureRef.current;
    if (!el) return;
    const update = () => setContentHeight(el.scrollHeight);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [a]);

  return (
    <div className="py-5 md:py-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mobile-tap-scale w-full flex items-start justify-between gap-4 md:gap-6 cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg rounded"
      >
        <span
          className="font-display text-[17px] md:text-[20px] text-ink leading-snug min-w-0"
          style={{ fontWeight: 500 }}
        >
          {q}
        </span>
        <span
          aria-hidden="true"
          className="font-mono text-ink-muted text-[16px] shrink-0 mt-1"
          style={{
            transform: open ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 300ms cubic-bezier(0.22, 1, 0.36, 1)",
            display: "inline-block",
          }}
        >
          +
        </span>
      </button>
      <div
        aria-hidden={!open}
        style={{
          maxHeight: open ? `${contentHeight}px` : "0px",
          opacity: open ? 1 : 0,
          transition:
            "max-height 380ms cubic-bezier(0.22, 1, 0.36, 1), opacity 280ms ease-out",
          overflow: "hidden",
        }}
      >
        <div ref={measureRef}>
          <p className="mt-3 text-ink-muted text-[15px] md:text-[16px] leading-relaxed max-w-[640px]">
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default FaqItem;
