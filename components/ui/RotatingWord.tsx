"use client";

import { useEffect, useRef, useState } from "react";
import { ColorWord } from "./ColorWord";

type Props = {
  words: readonly string[];
  /** ms between rotations. Default 4000. */
  interval?: number;
  className?: string;
};

/**
 * Vertically slides through a word list. Pauses while the cursor is over it.
 * Each rendered word is gradient-clipped via ColorWord (gold gradient).
 */
export function RotatingWord({ words, interval = 4000, className = "" }: Props) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<"in" | "out">("in");
  const pausedRef = useRef(false);
  const idxRef = useRef(0);

  useEffect(() => {
    idxRef.current = idx;
  }, [idx]);

  useEffect(() => {
    if (words.length <= 1) return;
    let timeoutOut: ReturnType<typeof setTimeout> | null = null;
    let intervalId: ReturnType<typeof setInterval> | null = null;

    // Slower switch — 420ms for the out-to-in transition (was 280) so
    // the slide reads as deliberate rather than snappy.
    intervalId = setInterval(() => {
      if (pausedRef.current) return;
      setPhase("out");
      timeoutOut = setTimeout(() => {
        setIdx((p) => (p + 1) % words.length);
        setPhase("in");
      }, 420);
    }, interval);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (timeoutOut) clearTimeout(timeoutOut);
    };
  }, [words, interval]);

  const current = words[idx] ?? "";

  return (
    <span
      className={`relative inline-block align-baseline ${className}`}
      style={{
        minWidth: `${Math.max(...words.map((w) => w.length)) * 0.55}em`,
        // Left-align the rotating word inside its reserved width so the
        // content "anchors" on the left edge instead of centering within
        // the slot. Otherwise text-align inherits from the headline
        // (which is centered) and short words like "view" jiggle.
        textAlign: "left",
      }}
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <span
        key={`${idx}-${phase}`}
        className="inline-block"
        style={{
          // 420ms keeps the slide visible long enough to read the
          // transition; matches the timeout above.
          animation: `word-slide-${phase} 420ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
        }}
      >
        <ColorWord italic>{current}</ColorWord>
      </span>
    </span>
  );
}

export default RotatingWord;
