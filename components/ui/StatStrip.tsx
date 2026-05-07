"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Dot color. Forest/gold in the new palette; the prior name "mint" and
 * legacy Aurora names accepted and silently resolved to forest for
 * back-compat with existing content modules.
 */
type DotColor =
  | "forest"
  | "gold"
  | "mint"
  | "plum"
  | "periwinkle"
  | "electric"
  | "coral";

const DOT_BG: Record<DotColor, string> = {
  forest: "bg-forest",
  gold: "bg-gold",
  // Prior palette name → forest
  mint: "bg-forest",
  // Legacy → forest
  plum: "bg-forest",
  periwinkle: "bg-forest",
  electric: "bg-forest",
  coral: "bg-forest",
};

export type StatItem = {
  num: number;
  label: string;
  dotColor?: DotColor;
  /** Display suffix on the number, e.g. "%", "d". */
  suffix?: string;
  /** Citation for industry-stat usage, e.g. "Google" or "Stanford". */
  source?: string;
};

type Props = {
  items: StatItem[];
  className?: string;
};

function easeOutQuart(t: number) {
  return 1 - Math.pow(1 - t, 4);
}

function CountUp({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const playedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const start = () => {
      if (playedRef.current) return;
      playedRef.current = true;
      const duration = 700;
      const startTs = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - startTs) / duration);
        setVal(Math.round(easeOutQuart(t) * to));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => cancelAnimationFrame(raf);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            start();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return (
    <span ref={ref}>
      {val}
      {suffix}
    </span>
  );
}

/**
 * Stat strip. Gold-gradient numbers in Fraunces, mono labels.
 * Renders nothing if `items` is empty (honest empty state — no fake stats).
 */
export function StatStrip({ items, className = "" }: Props) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`grid w-full gap-x-10 gap-y-8 ${
        items.length >= 4
          ? "grid-cols-2 md:grid-cols-4"
          : `grid-cols-1 md:grid-cols-${items.length}`
      } ${className}`}
    >
      {items.map((s, i) => (
        <div key={`${s.label}-${i}`} className="flex flex-col gap-2">
          <div className="flex items-baseline gap-2">
            {s.dotColor && (
              <span
                aria-hidden="true"
                className={`mb-2 inline-block h-2 w-2 rounded-full ${DOT_BG[s.dotColor]}`}
              />
            )}
            <span
              className="color-word color-word--has-fallback font-display"
              style={{
                fontWeight: 600,
                fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                lineHeight: 1.05,
                backgroundImage: "var(--gold-grad)",
              }}
            >
              <CountUp to={s.num} suffix={s.suffix} />
            </span>
          </div>
          <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
            {s.label}
          </span>
          {s.source && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted/60">
              source · {s.source}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatStrip;
