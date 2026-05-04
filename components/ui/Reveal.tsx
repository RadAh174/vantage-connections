"use client";

import { useEffect, useRef, type ReactNode, type ElementType } from "react";

type Props = {
  children: ReactNode;
  as?: ElementType;
  /** Delay in ms before the reveal animation kicks in. */
  delay?: number;
  className?: string;
  /**
   * When true, this Reveal does NOT animate itself. Instead, each direct
   * child element is given the reveal class with a staggered animation-delay
   * (`stagger * step` ms) so the row cascades in. Useful for CTA rows,
   * footer link clusters, etc. Default `false` (single-element behavior).
   */
  stagger?: boolean;
  /** Step (in ms) between staggered children. Default 80ms. */
  staggerStep?: number;
};

/**
 * Wraps children in an element that animates in (12px translate up + opacity)
 * once it enters the viewport. Once-only per page load.
 *
 * `stagger` mode: instead of animating the wrapper, sequence direct children
 * with incremental `animation-delay` so a row of items cascades in.
 */
export function Reveal({
  children,
  as,
  delay = 0,
  className = "",
  stagger = false,
  staggerStep = 80,
}: Props) {
  const Tag = (as ?? "div") as ElementType;
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (stagger) {
      // Prep direct children: mark each as a staggered reveal target.
      const kids = Array.from(el.children) as HTMLElement[];
      kids.forEach((child, i) => {
        child.classList.add("reveal-on-scroll");
        child.style.animationDelay = `${delay + i * staggerStep}ms`;
      });

      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              kids.forEach((child) => child.classList.add("is-visible"));
              io.unobserve(e.target);
            }
          }
        },
        { rootMargin: "-10% 0px", threshold: 0.05 },
      );
      io.observe(el);
      return () => io.disconnect();
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const target = e.target as HTMLElement;
            if (delay > 0) target.style.animationDelay = `${delay}ms`;
            target.classList.add("is-visible");
            io.unobserve(target);
          }
        }
      },
      { rootMargin: "-10% 0px", threshold: 0.05 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [delay, stagger, staggerStep]);

  // In stagger mode the wrapper itself shouldn't fade — only its children do.
  const wrapperClass = stagger ? className : `reveal-on-scroll ${className}`;

  return (
    <Tag ref={ref} className={wrapperClass}>
      {children}
    </Tag>
  );
}

export default Reveal;
