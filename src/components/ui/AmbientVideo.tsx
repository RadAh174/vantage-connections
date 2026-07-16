"use client";

import { useEffect, useRef, useState } from "react";

type AmbientVideoProps = {
  src: string;
  /** lighter encode served to small screens (≤767px) */
  lowSrc?: string;
  poster?: string;
  className?: string;
  /**
   * once: plays through a single time when it enters view, then holds the
   *       final frame.
   * loop: muted ambient loop while in view.
   */
  mode?: "once" | "loop";
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Ambient marketing video.
 * - the source is only attached once the element nears the viewport, small
 *   screens get lowSrc, and Save-Data / 2G connections keep the poster only.
 * Falls back to a static poster frame when reduced motion is requested.
 */
export function AmbientVideo({
  src,
  lowSrc,
  poster,
  className = "",
  mode = "once",
}: AmbientVideoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [attachedSrc, setAttachedSrc] = useState<string | null>(null);

  // Attach the source lazily: nothing downloads until the element is within
  // ~1.5 viewports, and constrained connections never download it at all.
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const conn = (navigator as { connection?: NetworkInformation }).connection;
    if (conn?.saveData || /(^|-)2g$/.test(conn?.effectiveType ?? "")) return;

    const chosen =
      lowSrc && window.matchMedia("(max-width: 767px)").matches ? lowSrc : src;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setAttachedSrc(chosen);
          io.disconnect();
        }
      },
      { rootMargin: "150% 0px" },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [src, lowSrc]);

  useEffect(() => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video || !attachedSrc) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      // Show a single representative frame, no motion.
      video.removeAttribute("autoplay");
      video.pause();
      try {
        video.currentTime = 0.1;
      } catch {
        /* metadata may not be ready; poster covers it */
      }
      return;
    }

    video.muted = true;
    video.loop = mode === "loop";
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            if (mode === "loop" || !video.ended) {
              void video.play().catch(() => {});
            }
          } else video.pause();
        }
      },
      { threshold: 0.15 },
    );
    io.observe(wrap);
    return () => io.disconnect();
  }, [mode, attachedSrc]);

  return (
    <div ref={wrapRef} className={className}>
      <video
        ref={videoRef}
        src={attachedSrc ?? undefined}
        poster={poster}
        muted
        playsInline
        preload={attachedSrc ? "auto" : "none"}
        loop={mode === "loop"}
        className="h-full w-full object-cover"
        aria-hidden="true"
      />
    </div>
  );
}
