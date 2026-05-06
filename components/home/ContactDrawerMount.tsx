"use client";

import { useRef } from "react";
import { ContactDrawer } from "@/components/home/ContactDrawer";

/**
 * Client-side mount point for the ContactDrawer + its scroll zone.
 *
 * Renders two things:
 *   1. A 120vh sentinel `<div>` that creates the scroll runway the
 *      drawer reads. Its document-coord top + height define when the
 *      drawer starts opening (rawT=0 at zone top, rawT=1 at zone end).
 *      102vh of that is the scrub region (0–0.85 normalized) and the
 *      remaining 18vh is the snap-dwell region.
 *   2. The drawer itself, fixed-positioned, reading scrollY against
 *      that sentinel via a ref.
 *
 * The two are co-rendered here so the zone ref never has to cross the
 * client/server boundary — we keep app/page.tsx as a server component.
 *
 * The sentinel renders inline where this component is dropped (so it
 * adds 120vh of page height after the closing CTA). The drawer is
 * fixed-positioned, so its position in the JSX tree doesn't matter
 * for layout — only for stacking / portal-style rendering. We render
 * it inside this same wrapper for simplicity; z-index 40 keeps it
 * below the header (z-50) and above page content.
 */
export function ContactDrawerMount() {
  const zoneRef = useRef<HTMLDivElement>(null);

  return (
    <>
      {/* Scroll-runway sentinel — 120vh of empty page below the closing
          CTA. Drawer height scrubs from 0 → 100vh across the first 85%
          (102vh) and dwells at 100vh for the last 15% (18vh) so the
          fully-open form has a moment to "settle" before the user
          either keeps scrolling (no further visual change) or scrolls
          back up to dismiss. */}
      <div
        ref={zoneRef}
        aria-hidden="true"
        className="h-[120vh] w-full"
      />

      <ContactDrawer zoneRef={zoneRef} />
    </>
  );
}

export default ContactDrawerMount;
