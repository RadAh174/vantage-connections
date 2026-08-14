"use client";

import { useEffect, useRef, useState } from "react";

type StampProps = {
  text: string;
  /** CSS rotation, e.g. "-6deg" */
  rot?: string;
  /** ms before the slam lands once in view */
  delay?: number;
  className?: string;
};

/**
 * A rubber stamp that slams onto the page when it scrolls into view.
 * Visuals live in globals.css (.stamp / .stamp-slam).
 */
export function Stamp({ text, rot = "-6deg", delay = 0, className = "" }: StampProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [slammed, setSlammed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setSlammed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSlammed(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span
      ref={ref}
      data-slammed={slammed}
      className={`stamp stamp-slam ${className}`}
      style={{
        ["--stamp-rot" as string]: rot,
        animationDelay: `${delay}ms`,
      }}
    >
      {text}
    </span>
  );
}
