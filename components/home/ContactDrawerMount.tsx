"use client";

import { useRef, type ReactNode } from "react";
import { ContactDrawer } from "@/components/home/ContactDrawer";

/**
 * Pin-and-scrub mount for the ContactDrawer.
 *
 * Wraps the closing CTA section as `children`. Renders a 200vh outer
 * container with an inner sticky-top-0 100vh viewport. The children
 * (closing section) are anchored to the inner viewport's bottom, so:
 *
 *   1. As the user scrolls, the inner sticky enters from below in
 *      normal flow — the closing section comes into view from the
 *      bottom edge of the viewport.
 *   2. When the inner sticky's top reaches the viewport top, the
 *      closing section is now positioned exactly at viewport bottom.
 *      Sticky pinning kicks in.
 *   3. For the next 100vh of scroll (the pin runway), the closing
 *      section stays pinned at viewport bottom while the drawer rises
 *      up over it. The drawer is 85vw wide with rounded top corners,
 *      so the closing section remains visible as a frame around it.
 *   4. After the runway, the inner sticky unpins and scrolls out.
 *
 * The drawer reads the outer runway via `zoneRef` and computes its
 * openness against the pin runway (zoneHeight - viewport), so 0%
 * happens exactly when pinning begins and 100% at the end of the
 * runway.
 */

type Props = {
  children: ReactNode;
};

export function ContactDrawerMount({ children }: Props) {
  const runwayRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <div
        ref={runwayRef}
        className="relative"
        // dvh keeps the pin runway honest as iOS Safari's URL bar
        // collapses — vh would over-allocate by the URL-bar height
        // and drift the openness math off by ~12% on iOS.
        style={{ height: "300dvh" }}
      >
        <div
          className="sticky top-0 w-full"
          style={{ height: "100dvh" }}
        >
          <div className="absolute inset-x-0 bottom-0">{children}</div>
        </div>
      </div>

      <ContactDrawer zoneRef={runwayRef} />
    </>
  );
}

export default ContactDrawerMount;
