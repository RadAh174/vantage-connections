"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { FeaturedWork } from "@/lib/content/home";

/**
 * Fullscreen modal that frames a project's live site in a scrollable iframe.
 *
 * Open / close uses a FLIP-style transition implemented in pure CSS:
 *   1. On mount the panel is positioned with absolute coords + transform
 *      (translate + scale) computed from the originating card's
 *      bounding rect, so it visually starts AT the card.
 *   2. On the next frame we drop the transform — CSS transitions the panel
 *      to its natural fullscreen position (90vw × 90vh, centered) over
 *      350ms with the studio's standard cubic-bezier(0.2, 0.8, 0.2, 1).
 *   3. On close we read the rect again (in case the page scrolled), apply
 *      the matching transform, wait for the transition to finish, then
 *      unmount.
 *
 * No Framer Motion — CSS transitions are sufficient and free of weight.
 *
 * Iframe inside the modal renders at full size (no scale), so native
 * scrolling works inside the embedded site.
 *
 * Body scroll is locked while open; ESC + backdrop-click + close button all
 * trigger close. Focus moves to the close button on open.
 *
 * The whole dialog is **portaled to document.body**. Without this, any
 * ancestor with `transform`, `perspective`, `filter`, or `will-change:
 * transform` turns `position: fixed` into "fixed within that ancestor"
 * instead of the viewport. The carousel lives inside `<Reveal>`, which
 * leaves a lingering `transform: translateY(0)` after its keyframe runs
 * (`animation-fill-mode: forwards`) — that single line breaks centering,
 * backdrop coverage, and click-outside detection. Portaling escapes it.
 */

type Props = {
  project: FeaturedWork | null;
  /** Bounding rect of the originating card, captured at click time. */
  originRect: DOMRect | null;
  onClose: () => void;
};

const TRANSITION_MS = 350;

export function WorkModal({ project, originRect, onClose }: Props) {
  // We mount the modal node only when there's a project, and keep it
  // mounted through the closing transition by tracking a separate state.
  const [mountedProject, setMountedProject] = useState<FeaturedWork | null>(
    null,
  );
  const [phase, setPhase] = useState<"opening" | "open" | "closing">("opening");

  // Snapshot the origin rect — we use the same rect on close even if the
  // user scrolled, because the originating card may have moved. Re-reading
  // the live card rect would require passing a ref; the captured-rect
  // approximation is plenty good for the FLIP feel.
  const originRectRef = useRef<DOMRect | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // Open phase: project becomes non-null.
  useEffect(() => {
    if (project && originRect) {
      originRectRef.current = originRect;
      setMountedProject(project);
      setPhase("opening");
    }
  }, [project, originRect]);

  // Run the FLIP open transition once mounted.
  useEffect(() => {
    if (!mountedProject || phase !== "opening") return;
    const panel = panelRef.current;
    if (!panel) return;

    const origin = originRectRef.current;
    if (origin) {
      const finalRect = panel.getBoundingClientRect();
      const dx = origin.left + origin.width / 2 - (finalRect.left + finalRect.width / 2);
      const dy = origin.top + origin.height / 2 - (finalRect.top + finalRect.height / 2);
      const sx = origin.width / finalRect.width;
      const sy = origin.height / finalRect.height;

      // Set initial (collapsed) state without transition.
      panel.style.transition = "none";
      panel.style.transformOrigin = "center center";
      panel.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      panel.style.opacity = "0.6";

      // Force reflow, then on next frame apply target state with transition.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      panel.offsetHeight;

      requestAnimationFrame(() => {
        panel.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
        panel.style.transform = "translate(0, 0) scale(1, 1)";
        panel.style.opacity = "1";
      });
    }

    const onEnd = () => {
      setPhase("open");
      panel.removeEventListener("transitionend", onEnd);
    };
    panel.addEventListener("transitionend", onEnd);

    // Fallback timer in case transitionend fires for the wrong property
    // or doesn't fire (browser quirks).
    const fallback = window.setTimeout(onEnd, TRANSITION_MS + 50);

    return () => {
      panel.removeEventListener("transitionend", onEnd);
      window.clearTimeout(fallback);
    };
  }, [mountedProject, phase]);

  // Project becomes null → start close transition.
  useEffect(() => {
    if (!mountedProject) return;
    if (project) return; // still open
    const panel = panelRef.current;
    if (!panel) {
      setMountedProject(null);
      return;
    }

    const origin = originRectRef.current;
    setPhase("closing");

    if (origin) {
      const finalRect = panel.getBoundingClientRect();
      const dx = origin.left + origin.width / 2 - (finalRect.left + finalRect.width / 2);
      const dy = origin.top + origin.height / 2 - (finalRect.top + finalRect.height / 2);
      const sx = origin.width / finalRect.width;
      const sy = origin.height / finalRect.height;

      panel.style.transition = `transform ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1), opacity ${TRANSITION_MS}ms cubic-bezier(0.2, 0.8, 0.2, 1)`;
      panel.style.transform = `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`;
      // Close → 0 (was 0.4). Card fades back in over the same 350ms
      // window, so the modal goes fully transparent right as the card
      // hits opacity 1. No visible hand-off jump-cut.
      panel.style.opacity = "0";
    }

    const timeout = window.setTimeout(() => {
      setMountedProject(null);
    }, TRANSITION_MS);

    return () => window.clearTimeout(timeout);
  }, [project, mountedProject]);

  // Background scroll lock while modal mounted.
  // Sets `overflow: hidden` on BOTH <html> and <body> — modern browsers
  // use <html> as the scrolling element, so locking only body sometimes
  // leaves vertical scrolling enabled. Also pads the body by the
  // disappearing scrollbar width so content doesn't reflow horizontally
  // when the scrollbar vanishes.
  useEffect(() => {
    if (!mountedProject) return;
    const html = document.documentElement;
    const body = document.body;
    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevPadding = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - html.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevPadding;
    };
  }, [mountedProject]);

  // Focus close button on open + ESC key support.
  useEffect(() => {
    if (!mountedProject) return;

    closeBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mountedProject, onClose]);

  if (!mountedProject) return null;

  let hostname = "";
  try {
    hostname = new URL(mountedProject.liveUrl).hostname;
  } catch {
    hostname = mountedProject.liveUrl;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const dialog = (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${mountedProject.client} — live site preview`}
      onMouseDown={handleBackdropClick}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center work-modal-backdrop"
      style={{
        background: "rgba(14, 14, 16, 0.6)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
      }}
    >
      <div
        ref={panelRef}
        className="relative flex flex-col shadow-[0_60px_120px_-40px_rgba(0,0,0,0.5)]"
        style={{
          width: "90vw",
          height: "90vh",
          // Same stronger gradient + 3px padding as the carousel cards
          // so the modal looks like the card grew open with the same
          // frame — high-contrast dark→light gold band, deliberate width.
          backgroundImage: "linear-gradient(135deg, #FFE49A 0%, #D4A12A 60%, #8B6914 100%)",
          padding: "3px",
          borderRadius: "24px",
        }}
        // Block both mousedown AND click from bubbling so backdrop close
        // only fires for clicks that are actually outside the panel.
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="relative flex h-full w-full flex-col overflow-hidden bg-surface"
          style={{ borderRadius: "21px" }}
        >
        {/* Top bar — mac dots removed per request */}
        <div className="flex items-center gap-3 border-b border-line bg-surface-calm px-4 py-3">
          <div className="flex flex-1 flex-col min-w-0">
            <span className="font-display text-[14px] text-ink leading-tight truncate">
              {mountedProject.title}
            </span>
            <span className="font-mono text-[10.5px] text-ink-muted truncate">
              {hostname}
            </span>
          </div>
          <a
            href={mountedProject.liveUrl}
            target="_blank"
            rel="noreferrer noopener"
            className="text-forest text-[12px] hidden sm:inline-flex items-center gap-1 border-b border-current pb-0.5 mr-2"
          >
            Open in new tab →
          </a>
          <button
            ref={closeBtnRef}
            type="button"
            onClick={onClose}
            aria-label="Close work preview"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-line bg-surface text-ink transition-colors hover:bg-forest/10 hover:border-forest/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

          {/* Iframe — full size, scrollable */}
          <iframe
            src={mountedProject.liveUrl}
            title={`${mountedProject.client} — live site`}
            className="block flex-1 w-full border-0 bg-surface-calm"
            referrerPolicy="no-referrer"
            sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
          />
        </div>
      </div>
    </div>
  );

  // Portal to document.body so the dialog escapes any ancestor with
  // `transform` / `perspective` / `filter` (the carousel's <Reveal>
  // wrapper leaves a transform behind, which would otherwise turn
  // `position: fixed` into "fixed within Reveal" and break centering,
  // backdrop coverage, and click-outside detection).
  if (typeof document === "undefined") return null;
  return createPortal(dialog, document.body);
}

export default WorkModal;
