"use client";

import { useEffect, useRef, useState } from "react";

type ScrollVideoProps = {
  src: string;
  /** lighter encode served to small screens (≤767px) */
  lowSrc?: string;
  poster?: string;
  className?: string;
  /**
   * scrub: video time is driven by the element's progress through the viewport.
   * loop: video autoplays on a muted loop while in view.
   */
  mode?: "scrub" | "loop";
  /** how much of the scroll travel maps to the clip (0.2–1). lower = faster scrub */
  scrubRange?: number;
  /**
   * id of a taller ancestor that drives the scrub (pinned/scrollytelling mode):
   * progress = how far that element has been scrolled through. Falls back to
   * the element-through-viewport mapping when the track has no meaningful
   * extra travel (e.g. mobile, where the section isn't pinned).
   */
  trackId?: string;
};

type NetworkInformation = {
  saveData?: boolean;
  effectiveType?: string;
};

/**
 * Premium scroll-driven video.
 * - scrub mode maps scroll position to currentTime (Apple-style).
 * - loop mode plays a muted ambient loop while visible.
 * - the source is only attached once the element nears the viewport, small
 *   screens get lowSrc, and Save-Data / 2G connections keep the poster only.
 * Falls back to a static poster frame when reduced motion is requested.
 */
export function ScrollVideo({
  src,
  lowSrc,
  poster,
  className = "",
  mode = "scrub",
  scrubRange = 0.85,
  trackId,
}: ScrollVideoProps) {
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

    // Scrubbing seeks the stream on every scroll frame — cheap on desktop,
    // visibly choppy on phones. Small screens get a smooth ambient loop.
    const effMode =
      mode === "scrub" && window.matchMedia("(max-width: 767px)").matches
        ? "loop"
        : mode;

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

    if (effMode === "loop") {
      // Degraded scrub (mobile) plays the clip once and holds the final
      // frame; only an explicit mode="loop" keeps cycling.
      const once = mode === "scrub";
      video.muted = true;
      video.loop = !once;
      const io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              if (!video.ended) void video.play().catch(() => {});
            } else video.pause();
          }
        },
        { threshold: 0.15 },
      );
      io.observe(wrap);
      return () => io.disconnect();
    }

    // --- scrub mode ---
    let duration = 0;
    let raf = 0;
    let targetTime = 0;
    let current = 0;
    let visible = false;

    const onMeta = () => {
      duration = video.duration || 0;
    };
    if (video.readyState >= 1) onMeta();
    video.addEventListener("loadedmetadata", onMeta);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
        if (visible && !raf) raf = requestAnimationFrame(tick);
      },
      { threshold: 0 },
    );
    io.observe(wrap);

    const track = trackId ? document.getElementById(trackId) : null;

    const computeProgress = () => {
      const vh = window.innerHeight;
      if (track) {
        // Pinned mode: progress through the tall track section.
        const r = track.getBoundingClientRect();
        const travel = r.height - vh;
        // Only meaningful when the track actually has extra travel (pinned
        // on desktop). Otherwise fall through to the viewport mapping.
        if (travel > vh * 0.5) {
          return Math.min(1, Math.max(0, -r.top / travel));
        }
      }
      const rect = wrap.getBoundingClientRect();
      // progress 0 when the element's top hits the bottom of the viewport,
      // 1 when its bottom passes a point near the top.
      const total = rect.height + vh;
      const travelled = vh - rect.top;
      const raw = travelled / total;
      return Math.min(1, Math.max(0, raw));
    };

    // Never seek past what has actually downloaded: on a slow connection a
    // seek into an unbuffered range paints black until data arrives, whereas
    // holding at the buffered edge keeps a real frame on screen.
    const bufferedCeiling = () => {
      const buf = video.buffered;
      if (!buf.length) return 0;
      return buf.end(buf.length - 1) - 0.1;
    };

    const tick = () => {
      if (!duration) {
        duration = video.duration || 0;
      }
      if (duration) {
        const p = computeProgress();
        // center the active scrub window so the clip plays across mid-scroll
        const eased = Math.min(1, Math.max(0, (p - (1 - scrubRange) / 2) / scrubRange));
        targetTime = eased * (duration - 0.05);
        // smooth toward target to avoid hard seeks
        current += (targetTime - current) * 0.18;
        if (Math.abs(targetTime - current) < 0.004) current = targetTime;
        const seekTo = Math.min(current, Math.max(0, bufferedCeiling()));
        if (Math.abs(video.currentTime - seekTo) > 0.01) {
          try {
            video.currentTime = seekTo;
          } catch {
            /* seek not ready */
          }
        }
      }
      if (visible) {
        raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    return () => {
      io.disconnect();
      video.removeEventListener("loadedmetadata", onMeta);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mode, scrubRange, trackId, attachedSrc]);

  return (
    <div ref={wrapRef} className={className}>
      <video
        ref={videoRef}
        src={attachedSrc ?? undefined}
        poster={poster}
        muted
        playsInline
        preload={attachedSrc ? "auto" : "none"}
        autoPlay={mode === "loop"}
        loop={mode === "loop"}
        className="h-full w-full object-cover"
        aria-hidden="true"
      />
    </div>
  );
}
