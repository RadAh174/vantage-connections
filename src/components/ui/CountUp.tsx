"use client";

import { useEffect, useRef, useState } from "react";

function format(n: number, decimals: number) {
  return n.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function CountUp({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  duration = 1600,
  className,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const done = useRef(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduce) {
      setN(value);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || done.current) return;
        done.current = true;
        let start = 0;
        const step = (t: number) => {
          if (!start) start = t;
          const p = Math.min(1, (t - start) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
          setN(value * eased);
          if (p < 1) requestAnimationFrame(step);
          else setN(value);
        };
        requestAnimationFrame(step);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {format(n, decimals)}
      {suffix}
    </span>
  );
}
