"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { FeaturedWork } from "@/lib/content/home";
import { WorkModal } from "@/components/home/WorkModal";

/**
 * Selected Work carousel.
 *
 * Layout strategy depends on how many real projects we have shipped — we
 * never spin a lone card (looks like a bug); we never invent extras to fill
 * a ring (forbidden by content rules).
 *
 *   1 item    → centered single card, auto-rotation off, honest tagline
 *               below ("First of more, shipping through 2026").
 *   2 items   → static side-by-side with a gentle ±10° rotateY tilt for
 *               subtle dimensionality, no auto-rotation.
 *   3+ items  → full 3D rotating ring:
 *                 outer .scene  → perspective + preserve-3d
 *                 inner .ring   → rotateY(angle), updated each RAF tick
 *                 each card     → rotateY(itemAngle) translateZ(radius)
 *                                 where itemAngle = (360 / count) * index
 *               Cards face outward so the front faces the viewer when that
 *               card swings to the front of the ring.
 *
 * Auto-rotation: ~60s per revolution via requestAnimationFrame mutating an
 * angle ref + writing transform inline (NOT setState — keeps re-renders to
 * zero on the hot path). Pauses on pointer-enter / drag, resumes 2s after
 * interaction ends. Honors prefers-reduced-motion: reduce.
 *
 * Drag: pointer events (covers mouse + touch + pen). deltaX → degrees via
 * `degreesPerPixel = 0.4`. Velocity sample taken in pointermove and decayed
 * over ~800ms after release for a soft inertial settle.
 *
 * Click vs drag: a pointer that moves <6px before release counts as a click
 * and opens the modal; anything more is treated as a drag and suppressed.
 */

type Props = {
  items: FeaturedWork[];
};

const RADIUS = 1200; // 3D ring radius — large enough that side items at
                      // ±60° (sin60 × 1200 ≈ 1039 horizontal) start
                      // off-screen on widescreen viewports, so cards
                      // visibly rotate IN from beyond the screen edge.
const ITEM_ANGLE_DEG = 30; // 12 items × 30° = 360° → complete ring at the
                            // tightest comfortable spacing for R=1200
                            // (chord ≈ 621px ≈ 45px gap from card width 576).
const AUTO_ROTATION_PERIOD_MS = 240_000; // 4 min per revolution — half-speed drift
const DEGREES_PER_PIXEL = 0.06; // drag rotation — even slower so the user feels each card "settle" rather than fly past.
const DEGREES_PER_WHEEL_PX = 0.1; // sideways wheel/trackpad → rotation. Much slower per-tick to match drag.
const RESUME_DELAY_MS = 0; // resume auto-rotate the moment the cursor leaves
// Hover-pause removed — carousel keeps drifting even with cursor over it.
const INERTIA_DECAY_MS = 800;
const CLICK_MOVEMENT_THRESHOLD_PX = 14;
const PERSPECTIVE_PX = 4500; // bumped to compensate for larger radius —
                              // keeps the front card from ballooning at
                              // R=1200 (front scale ≈ 4500/3300 ≈ 1.36×).

export function WorkCarousel({ items }: Props) {
  const count = items.length;
  const [selected, setSelected] = useState<{
    item: FeaturedWork;
    rect: DOMRect;
  } | null>(null);

  // Empty case (defensive — page already gates with an empty state).
  if (count === 0) return null;

  // The slug of the card currently "lifted" out of the carousel into the
  // modal. The matching card hides (opacity → 0) over the same 350ms
  // window the modal uses to FLIP open/closed, so the card's slot
  // visually empties as the modal grows out of it and visually re-fills
  // as the modal shrinks back in. Removes the jump-cut at unmount.
  const liftedSlug = selected?.item.slug ?? null;

  const handleOpen = (item: FeaturedWork, rect: DOMRect) =>
    setSelected({ item, rect });
  const handleClose = () => setSelected(null);

  return (
    <div className="flex flex-col gap-6">
      {/* Mobile: scroll-snap rail. CSS-only visibility so the 3D ring
          below is never even momentarily laid out on phones — its
          `translateZ(1200)` cards can briefly project a wide bounding
          box during hydration before a JS-driven `isMobile` flip
          unmounts them, leaving the page visibly wider than viewport. */}
      <div className="md:hidden">
        <MobileRail
          items={items}
          onOpen={handleOpen}
          liftedSlug={liftedSlug}
          paused={selected !== null}
        />
      </div>

      {/* Desktop: 1 / 2 / 3+ branches. */}
      <div className="hidden md:block">
        {count === 1 && (
          <SingleCard
            item={items[0]}
            onOpen={handleOpen}
            isLifted={items[0].slug === liftedSlug}
          />
        )}

        {count === 2 && (
          <PairLayout
            items={items}
            onOpen={handleOpen}
            liftedSlug={liftedSlug}
          />
        )}

        {count >= 3 && (
          <RingCarousel
            items={items}
            onOpen={handleOpen}
            paused={selected !== null}
            liftedSlug={liftedSlug}
          />
        )}
      </div>

      <WorkModal
        project={selected?.item ?? null}
        originRect={selected?.rect ?? null}
        onClose={handleClose}
      />
    </div>
  );
}

/* ---------------- Mobile rail ----------------
   Native horizontal scroll-snap. Cards are 80vw with snap-center, so
   the previous/next cards peek at the edges and a single-finger swipe
   advances by exactly one card. Uses `touch-action: pan-x` so vertical
   page scroll still wins on diagonal swipes.

   Auto-advances every AUTO_ADVANCE_MS to give the rail motion (the
   desktop ring's "spin" equivalent for mobile). Pauses on touch +
   resumes a few seconds after the user lifts their finger; pauses
   permanently if the work modal opens. Uses `scrollTo({ behavior:
   "smooth" })` so native snap takes over after each step. */

const AUTO_ADVANCE_MS = 3000;
const RESUME_AFTER_TOUCH_MS = 3500;

function MobileRail({
  items,
  onOpen,
  liftedSlug = null,
  paused = false,
}: {
  items: FeaturedWork[];
  onOpen: (item: FeaturedWork, rect: DOMRect) => void;
  liftedSlug?: string | null;
  /** External pause signal — true when the work modal is open. */
  paused?: boolean;
}) {
  const railRef = useRef<HTMLDivElement>(null);
  const userPausedRef = useRef(false);
  const resumeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // Infinite/circular wrap: items are rendered twice in the rail
    // (see the JSX below). Auto-advance always scrolls forward one
    // card. After the smooth scroll settles, if we've crossed the
    // halfway mark of the rail's scrollWidth (= the boundary between
    // copy A and copy B), we instantly teleport scrollLeft back by
    // the halfway distance — landing on the *same* card visually
    // (because copy B == copy A) but in copy A's range. The user
    // sees a continuous, never-ending loop with no jarring snap-back
    // to the start.
    const tick = () => {
      if (paused || userPausedRef.current) return;
      const firstChild = rail.firstElementChild as HTMLElement | null;
      if (!firstChild) return;
      const cardWidth = firstChild.offsetWidth;
      const gapPx =
        parseFloat(getComputedStyle(rail).columnGap || "0") || 16;
      const step = cardWidth + gapPx;

      rail.scrollBy({ left: step, behavior: "smooth" });

      // After the smooth scroll completes, check if we've crossed the
      // halfway boundary and silently rewind into copy A.
      window.setTimeout(() => {
        const halfway = rail.scrollWidth / 2;
        if (rail.scrollLeft >= halfway) {
          rail.scrollLeft = rail.scrollLeft - halfway;
        }
      }, 600);
    };

    const id = window.setInterval(tick, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  // Touch handlers — pause auto-advance while finger is down, resume
  // a few seconds after lift so the user's manual swipe isn't fought
  // by a pending auto-advance.
  const onTouchStart = () => {
    userPausedRef.current = true;
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  };
  const onTouchEnd = () => {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      userPausedRef.current = false;
      resumeTimerRef.current = null;
    }, RESUME_AFTER_TOUCH_MS);
  };

  // Manual-swipe infinite wrap. When the user drags far past the
  // halfway boundary (into copy B), or backwards past zero (into
  // copy A from copy B reversed), silently teleport to the matching
  // position in the opposite copy. Debounced — only fires once the
  // user's scroll settles, so we don't fight an in-progress drag.
  const wrapTimerRef = useRef<number | null>(null);
  const onScroll = () => {
    if (wrapTimerRef.current !== null) {
      window.clearTimeout(wrapTimerRef.current);
    }
    wrapTimerRef.current = window.setTimeout(() => {
      const rail = railRef.current;
      if (!rail) return;
      const halfway = rail.scrollWidth / 2;
      if (rail.scrollLeft >= halfway) {
        rail.scrollLeft = rail.scrollLeft - halfway;
      } else if (rail.scrollLeft < 4) {
        // Near the very start — jump to the equivalent in copy B so
        // the user can keep swiping right-to-left forever too.
        rail.scrollLeft = halfway;
      }
    }, 200);
  };

  return (
    <div
      ref={railRef}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
      onScroll={onScroll}
      role="region"
      aria-label="Selected work — swipe to explore"
      className="relative -mx-6 overflow-x-auto flex gap-4 pb-3 touch-pan-x"
      style={{
        scrollSnapType: "x mandatory",
        scrollbarWidth: "none",
        msOverflowStyle: "none",
        WebkitOverflowScrolling: "touch",
        // Snap-center formula: padding-inline = (clientWidth - cardWidth)/2.
        // With cards at 80vw inside a 100vw rail (the rail breaks out via
        // -mx-6 to span the full viewport), the formula = (100vw-80vw)/2 =
        // 10vw exactly. The previous `calc(10vw + 6px)` was off by 6px,
        // which made auto-advance and manual swipe both stop with the
        // snapped card half a card-width off-center.
        paddingInline: "10vw",
      }}
    >
      {/* Items rendered TWICE so the rail can wrap continuously.
          Auto-advance + manual swipe both teleport scrollLeft back by
          half (= one full set's width) once the boundary is crossed,
          so the rail behaves as an infinite circular carousel without
          a visible snap-back. The duplicate keys are suffixed `:a`
          and `:b` to keep React's reconciliation happy. */}
      {[...items, ...items].map((item, idx) => (
        <div
          key={`${item.slug}:${idx < items.length ? "a" : "b"}`}
          className="shrink-0"
          style={{
            width: "80vw",
            maxWidth: 380,
            scrollSnapAlign: "center",
          }}
        >
          <WorkCard
            item={item}
            onOpen={onOpen}
            isLifted={item.slug === liftedSlug}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- 1-item layout ---------------- */

function SingleCard({
  item,
  onOpen,
  isLifted = false,
}: {
  item: FeaturedWork;
  onOpen: (item: FeaturedWork, rect: DOMRect) => void;
  isLifted?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-5 py-8">
      <div className="w-full max-w-[420px]">
        <WorkCard item={item} onOpen={onOpen} isLifted={isLifted} />
      </div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted text-center">
        First of more, shipping through 2026
      </p>
    </div>
  );
}

/* ---------------- 2-item layout ---------------- */

function PairLayout({
  items,
  onOpen,
  liftedSlug = null,
}: {
  items: FeaturedWork[];
  onOpen: (item: FeaturedWork, rect: DOMRect) => void;
  liftedSlug?: string | null;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-8 py-8"
      style={{ perspective: "1500px" }}
    >
      {items.map((item, i) => (
        <div
          key={item.slug}
          className="w-full max-w-[380px]"
          style={{
            transform: `rotateY(${i === 0 ? -10 : 10}deg)`,
            transformStyle: "preserve-3d",
          }}
        >
          <WorkCard
            item={item}
            onOpen={onOpen}
            isLifted={item.slug === liftedSlug}
          />
        </div>
      ))}
    </div>
  );
}

/* ---------------- 3+ item ring ---------------- */

function RingCarousel({
  items,
  onOpen,
  paused = false,
  liftedSlug = null,
}: {
  items: FeaturedWork[];
  onOpen: (item: FeaturedWork, rect: DOMRect) => void;
  /** External pause signal — true when the work modal is open over the
   *  carousel. Stops auto-rotation so the spinning isn't visible behind
   *  the open dialog. */
  paused?: boolean;
  /** Slug of the card currently expanded into the modal. That card fades
   *  to opacity 0 over 350ms (matching the modal FLIP duration) so the
   *  carousel slot empties as the modal grows out of it. */
  liftedSlug?: string | null;
}) {
  const sceneRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  // Mutable state lives in refs so RAF can read/write without React rerenders.
  const angleRef = useRef(0);
  const angularVelocityRef = useRef(0); // degrees per frame, used during inertia
  const isInteractingRef = useRef(false);
  const isPausedRef = useRef(false);
  const externalPausedRef = useRef(false); // mirrors `paused` prop for RAF closure
  const resumeTimerRef = useRef<number | null>(null);
  const inertiaUntilRef = useRef(0); // performance.now() timestamp
  const lastFrameRef = useRef<number>(0);
  const reducedMotionRef = useRef(false);

  // Mirror the prop into a ref so the long-lived RAF tick reads the
  // current value without needing to re-create the loop on every change.
  useEffect(() => {
    externalPausedRef.current = paused;
  }, [paused]);

  const count = items.length;
  // Use a fixed angle per item (smaller than 360/count) so cards cluster
  // tightly on the visible front arc instead of spreading evenly across
  // the whole 360°. The cluster is centered on angle 0 by offsetting each
  // card by `(count-1)*ITEM_ANGLE_DEG/2`. The empty arc rotates around
  // the back over the 2-minute auto-rotation cycle.
  const itemAngle = ITEM_ANGLE_DEG;
  const angleOffset = ((count - 1) * itemAngle) / 2;

  // Apply transform from current angle.
  const applyTransform = useCallback(() => {
    const ring = ringRef.current;
    if (ring) {
      ring.style.transform = `rotateY(${angleRef.current}deg)`;
    }
  }, []);

  useEffect(() => {
    const reducedMotionMQ = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    reducedMotionRef.current = reducedMotionMQ.matches;
    const onMQChange = () => {
      reducedMotionRef.current = reducedMotionMQ.matches;
    };
    reducedMotionMQ.addEventListener("change", onMQChange);

    let rafId = 0;

    function tick(now: number) {
      const last = lastFrameRef.current || now;
      const dt = now - last;
      lastFrameRef.current = now;

      const reduced = reducedMotionRef.current;
      const interacting = isInteractingRef.current;
      const paused = isPausedRef.current;
      const externallyPaused = externalPausedRef.current;

      // Inertial decay (after release with velocity). Skip if external
      // pause is on so the modal isn't backed by drift motion.
      if (!interacting && !externallyPaused && now < inertiaUntilRef.current) {
        const remaining = inertiaUntilRef.current - now;
        const lifeFraction = Math.max(0, remaining / INERTIA_DECAY_MS);
        angleRef.current += angularVelocityRef.current * lifeFraction;
      } else if (!interacting && !paused && !externallyPaused && !reduced) {
        // Auto-rotation: degrees per ms = 360 / period.
        angleRef.current += (360 / AUTO_ROTATION_PERIOD_MS) * dt;
      }

      applyTransform();
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      reducedMotionMQ.removeEventListener("change", onMQChange);
      if (resumeTimerRef.current !== null) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, [applyTransform]);

  // Sideways wheel / trackpad → rotation. React's onWheel is passive by
  // default which forbids preventDefault; attach a non-passive listener
  // via ref + native addEventListener so we can stop the page from also
  // scrolling sideways when the user clearly meant to spin the carousel.
  // Vertical scroll is left alone so the page still scrolls normally.
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const onWheel = (e: WheelEvent) => {
      // Only intercept when the dominant axis is horizontal.
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      e.preventDefault();
      // Inverted vs deltaX: scrolling right brings the NEXT card forward
      // (page-scroll mental model — right means "advance"), not the
      // previous one.
      //
      // Auto-rotation is NOT paused during wheel input — the wheel just
      // adds to angleRef in addition to the per-frame drift. So the
      // carousel keeps spinning while the user nudges it with the
      // trackpad. Drag is the only gesture that pauses the drift; that
      // logic still lives in onPointerDown below.
      angleRef.current -= e.deltaX * DEGREES_PER_WHEEL_PX;
    };

    scene.addEventListener("wheel", onWheel, { passive: false });
    return () => scene.removeEventListener("wheel", onWheel);
  }, []);

  /* ---------------- Resume helper ----------------
     Hover-pause was deliberately removed — the carousel keeps drifting
     even when the cursor is over it (per user preference). The
     `isPausedRef` flag is now only flipped by active interaction
     (drag, wheel) and by the modal-open prop, both of which release
     it via `scheduleResume()` below. */

  function scheduleResume() {
    if (resumeTimerRef.current !== null) {
      window.clearTimeout(resumeTimerRef.current);
    }
    resumeTimerRef.current = window.setTimeout(() => {
      isPausedRef.current = false;
      resumeTimerRef.current = null;
    }, RESUME_DELAY_MS);
  }

  /* ---------------- Drag ---------------- */

  // Pointer drag state (kept in refs to avoid rerenders).
  const dragStartXRef = useRef(0);
  const dragStartAngleRef = useRef(0);
  const lastMoveXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const totalMovementRef = useRef(0);
  const pointerIdRef = useRef<number | null>(null);
  const hasCapturedRef = useRef(false);
  // Card the pointer landed on at pointerdown — used to fire the modal
  // open from pointerup directly. We don't rely on the button's onClick
  // because the scene's pointer capture (started only after drag passes
  // the threshold) can swallow synthetic click events depending on the
  // browser. Pointer-driven opening is deterministic across all paths.
  const candidateCardRef = useRef<{
    slug: string;
    rect: DOMRect;
  } | null>(null);

  const onPointerDown = (e: React.PointerEvent) => {
    pointerIdRef.current = e.pointerId;
    isInteractingRef.current = true;
    isPausedRef.current = true;
    inertiaUntilRef.current = 0; // cancel any in-flight inertia
    angularVelocityRef.current = 0;
    dragStartXRef.current = e.clientX;
    dragStartAngleRef.current = angleRef.current;
    lastMoveXRef.current = e.clientX;
    lastMoveTimeRef.current = performance.now();
    totalMovementRef.current = 0;
    hasCapturedRef.current = false;

    // Record which card was pressed so pointerup can open it directly if
    // the gesture turns out to be a click (no significant movement).
    const targetEl = e.target as Element;
    const cardEl = targetEl.closest("[data-card-slug]") as HTMLElement | null;
    if (cardEl) {
      const slug = cardEl.dataset.cardSlug ?? "";
      candidateCardRef.current = {
        slug,
        rect: cardEl.getBoundingClientRect(),
      };
    } else {
      candidateCardRef.current = null;
    }

    // Note: we deliberately do NOT call setPointerCapture here. Capture
    // would re-route the synthetic click event away from the button
    // inside the card, breaking click-to-open. Capture is set lazily in
    // onPointerMove, only once movement crosses the drag threshold.
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    if (!isInteractingRef.current) return;

    const deltaX = e.clientX - dragStartXRef.current;
    totalMovementRef.current = Math.max(
      totalMovementRef.current,
      Math.abs(deltaX),
    );

    // Once the user has moved past the click/drag threshold, treat as a
    // drag — capture the pointer so the gesture can extend outside the
    // scene element, and start translating the ring.
    if (
      !hasCapturedRef.current &&
      totalMovementRef.current > CLICK_MOVEMENT_THRESHOLD_PX
    ) {
      try {
        (e.currentTarget as Element).setPointerCapture(e.pointerId);
        hasCapturedRef.current = true;
      } catch {
        // setPointerCapture can throw if the pointer is already gone.
      }
    }

    if (hasCapturedRef.current) {
      angleRef.current =
        dragStartAngleRef.current + deltaX * DEGREES_PER_PIXEL;

      const now = performance.now();
      const dx = e.clientX - lastMoveXRef.current;
      const dt = Math.max(1, now - lastMoveTimeRef.current);
      angularVelocityRef.current = (dx * DEGREES_PER_PIXEL * 16.67) / dt;
      lastMoveXRef.current = e.clientX;
      lastMoveTimeRef.current = now;
    }
  };

  const endInteraction = () => {
    if (pointerIdRef.current === null) return;

    // If the gesture stayed under the drag threshold AND we have a
    // candidate card, fire the open directly. Pointer-driven open
    // bypasses any click-event issues caused by capture timing.
    const wasClick =
      totalMovementRef.current <= CLICK_MOVEMENT_THRESHOLD_PX &&
      candidateCardRef.current !== null;

    if (wasClick && candidateCardRef.current) {
      const { slug, rect } = candidateCardRef.current;
      const item = items.find((i) => i.slug === slug);
      if (item) onOpen(item, rect);
    }

    candidateCardRef.current = null;
    pointerIdRef.current = null;
    isInteractingRef.current = false;
    hasCapturedRef.current = false;

    // Inertia: amplify the per-frame velocity over the decay window
    // (only if it was an actual drag, not a click).
    if (!wasClick && Math.abs(angularVelocityRef.current) > 0.05) {
      angularVelocityRef.current *= 6;
      inertiaUntilRef.current = performance.now() + INERTIA_DECAY_MS;
    } else {
      angularVelocityRef.current = 0;
    }

    scheduleResume();
  };

  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    endInteraction();
  };

  const onPointerCancel = (e: React.PointerEvent) => {
    if (pointerIdRef.current !== e.pointerId) return;
    candidateCardRef.current = null; // cancelled, never fire open
    endInteraction();
  };

  // Kept for keyboard accessibility — focus a card via tab and press
  // enter, the button's onClick fires this directly. Pointer paths use
  // the candidate-card-ref flow above instead.
  const handleCardOpen = (item: FeaturedWork, rect: DOMRect) => {
    if (totalMovementRef.current > CLICK_MOVEMENT_THRESHOLD_PX) return;
    onOpen(item, rect);
  };

  return (
    <div
      ref={sceneRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      // No `data-lenis-prevent` here. The carousel's own wheel handler
      // only preventDefaults on HORIZONTAL wheel (deltaX dominant); pure
      // vertical wheel passes through. Letting Lenis also process the
      // event means vertical scroll over the carousel feels the same
      // weighted-smooth as the rest of the page (no glitch at the edge
      // where Lenis hands off to native scroll).
      className="relative w-full select-none touch-pan-y"
      style={{
        height: 700, // taller scene to fit the larger radius cleanly
        perspective: `${PERSPECTIVE_PX}px`,
        cursor: "grab",
      }}
    >
      <div
        ref={ringRef}
        className="absolute left-1/2 top-1/2"
        style={{
          // Cards 20% bigger per request: 480x300 → 576x360 (kept 16:10).
          width: 576,
          height: 360,
          marginLeft: -288,
          marginTop: -180,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
      >
        {items.map((item, i) => (
          <div
            key={item.slug}
            className="absolute inset-0"
            style={{
              transform: `rotateY(${itemAngle * i - angleOffset}deg) translateZ(${RADIUS}px)`,
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <WorkCard
              item={item}
              onOpen={handleCardOpen}
              isLifted={item.slug === liftedSlug}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Card ---------------- */

function WorkCard({
  item,
  onOpen,
  isLifted = false,
}: {
  item: FeaturedWork;
  onOpen: (item: FeaturedWork, rect: DOMRect) => void;
  /** When true, the card visually empties (opacity → 0 over 350ms) so
   *  the carousel slot disappears as the modal grows out of it.
   *  Mirrors the modal's FLIP timing to give a clean cross-fade handoff
   *  on both open and close. */
  isLifted?: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  // Awwwards-style static screenshot via WordPress mShots — much lighter
  // than embedding 12 simultaneous live iframes (page weight + extension
  // triggers). The modal still uses a live iframe for the expanded
  // interactive view; the carousel just needs a faithful preview image.
  // mShots lazily generates + caches; first visit may show a placeholder
  // for ~1 frame while the screenshot is being captured.
  // mShots `w`/`h` are output dimensions, not capture viewport. Pass
  // `vpw`/`vph` explicitly so the page is always rendered at desktop
  // width before screenshotting — otherwise mShots' default viewport
  // can serve a site's mobile breakpoint and produce a phone-shaped
  // thumbnail (Black Diamond did this on bare `w`/`h`).
  const screenshotUrl = `https://s.wordpress.com/mshots/v1/${encodeURIComponent(
    item.liveUrl,
  )}?w=1440&h=900&vpw=1440&vph=900`;

  const handleClick = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    onOpen(item, rect);
  };

  // Card is JUST the preview — no browser-chrome header, no label footer.
  // Outer wrapper holds the gold gradient "border": gradient bg + 1.5px
  // padding makes a thin gradient ring once the inner panel paints over
  // the rest. Inner panel holds the iframe + click overlay.
  //
  // Opacity is applied to the INNER panel only (not the outer wrapper)
  // when isLifted, so the gold border ring stays visible at the card
  // position even as the modal grows out of it. Acts as a "ghost slot"
  // — frame stays put, content is what flies in/out.
  return (
    <div
      ref={cardRef}
      data-card-slug={item.slug}
      className="relative aspect-[16/10] w-full shadow-[0_30px_60px_-30px_rgba(26,26,26,0.25),_0_2px_8px_rgba(26,26,26,0.06)]"
      style={{
        // Stronger border gradient — wider stop range (#8B6914 dark gold
        // → #FFE49A pale champagne) gives more contrast than the standard
        // --gold-grad. Combined with thicker padding (3px), the gold ring
        // reads as a deliberate frame, not a hairline.
        backgroundImage: "linear-gradient(135deg, #FFE49A 0%, #D4A12A 60%, #8B6914 100%)",
        padding: "3px",
        borderRadius: "24px",
      }}
    >
      <div
        className="relative h-full w-full overflow-hidden bg-surface-calm"
        style={{
          borderRadius: "21px", // outer 24px - 3px padding = inner radius
          opacity: isLifted ? 0 : 1,
          // Match modal FLIP duration + curve so the slot empties as the
          // modal grows and re-fills as the modal collapses. Pointer
          // events also drop while lifted so phantom hover/clicks can't
          // fire on the invisible content.
          transition: "opacity 350ms cubic-bezier(0.2, 0.8, 0.2, 1)",
          pointerEvents: isLifted ? "none" : undefined,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotUrl}
          alt={`${item.client} — preview`}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="absolute inset-0 block h-full w-full object-cover object-top select-none"
          draggable={false}
        />

        <button
          type="button"
          onClick={handleClick}
          aria-label={`Open ${item.client} preview`}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        />
      </div>
    </div>
  );
}

export default WorkCarousel;
