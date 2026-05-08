"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Floating timeline card with a JS-driven hover bob.
 *
 * Why JS instead of `@keyframes` animation: when an animation is
 * removed (e.g. when `:hover` ends), the property reverts to its
 * non-animation value INSTANTLY in most browsers — `transition`
 * doesn't catch the revert because animations override transitions
 * on the same property. The card visibly snaps back to the rest
 * position.
 *
 * The fix: drive the bob by setting `transform` inline from a RAF
 * loop while hovered. On mouse-leave, cancel the RAF and clear the
 * inline transform — CSS `transition: transform` on the element then
 * smoothly lerps from the last bob value back to identity over
 * RETURN_MS. No animation property involved, no snap.
 *
 * `prefers-reduced-motion: reduce` skips the bob entirely.
 */

type Props = {
  num: string;
  phase: string;
  milestone: string;
  tasks: string[];
  /** Tailwind classes applied for the staggered top offset (lg+). */
  staggerClass?: string;
};

const BOB_PERIOD_MS = 3000;     // one full up/down cycle
const BOB_AMPLITUDE = 5;        // peak-to-trough = 2 × amplitude
const BOB_MIDPOINT = -7;        // pixels above rest position
const RETURN_MS = 700;          // smooth glide back to translateY(0)

export function TimelineCard({
  num,
  phase,
  milestone,
  tasks,
  staggerClass = "",
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Honor reduced-motion: never bob.
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!hovered || reduced) {
      // Clear inline transform; CSS `transition` carries it back to 0.
      el.style.transform = "";
      return;
    }

    let raf = 0;
    let start = 0;
    const tick = (now: number) => {
      if (!start) start = now;
      const t = ((now - start) % BOB_PERIOD_MS) / BOB_PERIOD_MS;
      // Sine wave around midpoint: y = midpoint - amplitude * sin(2πt)
      const y =
        BOB_MIDPOINT - Math.sin(t * 2 * Math.PI) * BOB_AMPLITUDE;
      el.style.transform = `translateY(${y}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hovered]);

  return (
    <article
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative flex flex-col gap-5 rounded-2xl border border-line/60 bg-surface-calm p-6 md:p-7 lg:p-8 will-change-transform ${staggerClass}`}
      style={{
        // Gold drop-shadow positioned below the card. The negative
        // spread (-25px) is bigger than the blur (25px), so the
        // shadow's horizontal extent is contained within the card's
        // width and only shows below — no halo on the sides.
        boxShadow:
          "0 32px 25px -25px rgba(212,158,15,0.55), 0 6px 14px -10px rgba(0,0,0,0.18)",
        // Transition only when NOT hovered — during hover the JS
        // RAF writes new transforms each frame and we don't want the
        // transition to interpolate between them (would damp the bob).
        transition: hovered
          ? undefined
          : `transform ${RETURN_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`,
      }}
    >
      {/* Gold-gradient top accent */}
      <span
        aria-hidden="true"
        className="absolute top-0 left-6 right-6 h-px"
        style={{
          backgroundImage:
            "linear-gradient(90deg, transparent 0%, #D4A12A 25%, #FFE49A 50%, #D4A12A 75%, transparent 100%)",
        }}
      />

      {/* Week kicker */}
      <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink-muted">
        Week {num}
      </span>

      {/* Phase name */}
      <h3
        className="font-display text-ink leading-tight"
        style={{
          fontSize: "clamp(1.5rem, 2vw, 1.75rem)",
          fontWeight: 500,
          letterSpacing: "-0.012em",
        }}
      >
        {phase}
      </h3>

      {/* Task list */}
      <ul className="flex flex-col gap-2 text-[14px] leading-[1.45] text-ink-muted">
        {tasks.map((task) => (
          <li key={task} className="flex items-baseline gap-2.5">
            <span
              aria-hidden="true"
              className="inline-block h-px w-3 bg-ink-muted/40 shrink-0 translate-y-[-3px]"
            />
            <span>{task}</span>
          </li>
        ))}
      </ul>

      {/* Milestone bar */}
      <div className="mt-auto pt-5 flex items-center gap-2.5 border-t border-line/60">
        <span
          aria-hidden="true"
          className="block h-1.5 w-1.5 rounded-full bg-forest shrink-0"
        />
        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-forest">
          {milestone}
        </span>
      </div>
    </article>
  );
}

export default TimelineCard;
