"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ContactDrawer } from "@/components/home/ContactDrawer";

/**
 * Pin-and-scrub mount for the ContactDrawer.
 *
 * Wraps the children (typically the editorial wordmark backdrop) and
 * renders the sliding drawer. The children sit vertically centered in
 * the viewport while the drawer rises over them.
 *
 * Drawer slide / dwell / snap phases all derive from runway progress
 * (scrollY relative to the runway zone). Progress is exposed via
 * `DrawerProgressContext` so child components (e.g. the wordmark) can
 * scroll-tie their own animations without duplicating the math.
 */

const DrawerProgressContext = createContext<number>(0);

export function useDrawerProgress() {
  return useContext(DrawerProgressContext);
}

type Props = {
  children: ReactNode;
};

export function ContactDrawerMount({ children }: Props) {
  const runwayRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const zone = runwayRef.current;
    if (!zone) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = zone.getBoundingClientRect();
      const zoneTop = rect.top + window.scrollY;
      const zoneHeight = zone.offsetHeight || 1;
      const viewport = window.innerHeight;
      const runway = Math.max(1, zoneHeight - viewport);
      // Unclamped — progress goes negative before the pin starts
      // and >1 after the runway ends. ContactDrawer computes its
      // own clamped progress internally (does not consume this
      // context), so this only affects WordmarkBackdrop / future
      // consumers that opt into "wider-than-pin" progress tracking.
      const rawT = (window.scrollY - zoneTop) / runway;
      setProgress((prev) =>
        Math.abs(prev - rawT) < 0.001 ? prev : rawT,
      );
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <DrawerProgressContext.Provider value={progress}>
      <div
        ref={runwayRef}
        className="relative"
        // Outer = sticky height (100dvh) + slide distance (50dvh).
        // dvh keeps the math honest as iOS Safari's URL bar collapses.
        style={{ height: "150dvh" }}
      >
        <div
          className="sticky top-0 w-full"
          style={{ height: "100dvh" }}
        >
          {/* Children (editorial wordmark backdrop) anchor near the
              bottom of the viewport so they sit just above the
              rising drawer and get progressively covered as it
              snaps up. items-end + pb on the child keeps the
              wordmark slightly higher than the very bottom edge. */}
          <div className="absolute inset-0 flex items-end justify-center">
            {children}
          </div>
        </div>
      </div>

      <ContactDrawer zoneRef={runwayRef} />
    </DrawerProgressContext.Provider>
  );
}

export default ContactDrawerMount;
