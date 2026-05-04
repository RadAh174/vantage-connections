"use client";

import { useEffect, useState } from "react";

export type ChapterNavItem = {
  id: string;
  label: string;
  /** Short label for the rotated/compact form. */
  short?: string;
};

type Props = {
  items: ChapterNavItem[];
  /** Show after this fraction of page scroll (0–1). Default 0.4. */
  appearAt?: number;
};

/**
 * Sticky chapter nav. Appears after `appearAt` fraction of page scroll.
 * Highlights the current section, draws a tiny aurora-gradient progress
 * fill beneath the active item.
 *
 * Lives top-right on desktop (lg+); hides on mobile.
 */
export function ChapterNav({ items, appearAt = 0.4 }: Props) {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState<string>(items[0]?.id ?? "");
  const [progress, setProgress] = useState(0);

  // Page-scroll: visibility + active-item detection.
  useEffect(() => {
    let raf = 0;
    let pending = false;

    function update() {
      pending = false;
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop;
      const max = (doc.scrollHeight - window.innerHeight) || 1;
      const frac = scrollTop / max;
      setVisible(frac >= appearAt);

      // Find which section's top has crossed 35% from viewport top.
      const threshold = window.innerHeight * 0.35;
      let currentId = items[0]?.id ?? "";
      let currentIndex = 0;
      for (let i = 0; i < items.length; i++) {
        const el = document.getElementById(items[i].id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top - threshold <= 0) {
          currentId = items[i].id;
          currentIndex = i;
        }
      }
      setActiveId(currentId);

      // Local progress: distance scrolled within the active section.
      const activeEl = document.getElementById(currentId);
      const nextEl =
        currentIndex + 1 < items.length
          ? document.getElementById(items[currentIndex + 1].id)
          : null;
      if (activeEl) {
        const top = activeEl.getBoundingClientRect().top - threshold;
        const sectionHeight = nextEl
          ? nextEl.getBoundingClientRect().top -
            activeEl.getBoundingClientRect().top
          : activeEl.getBoundingClientRect().height;
        const local =
          sectionHeight > 0
            ? Math.max(0, Math.min(1, -top / sectionHeight))
            : 0;
        setProgress(local);
      } else {
        setProgress(0);
      }
    }

    function onScroll() {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [items, appearAt]);

  return (
    <nav
      aria-label="Chapter navigation"
      className={`hidden lg:block fixed right-6 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ${
        visible
          ? "opacity-100 translate-x-0"
          : "opacity-0 translate-x-3 pointer-events-none"
      }`}
    >
      <ol className="flex flex-col gap-2 rounded-xl border border-line bg-bg/85 backdrop-blur-md px-3 py-3 shadow-[0_8px_30px_-15px_rgba(26,26,26,0.2)]">
        {items.map((item) => {
          const isActive = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`group flex flex-col gap-1.5 px-2 py-1 rounded transition-colors ${
                  isActive
                    ? "text-forest"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                <span
                  className="font-mono text-[10px] uppercase tracking-[0.18em]"
                  style={{ lineHeight: 1.2 }}
                >
                  {item.short ?? item.label}
                </span>
                <span
                  aria-hidden="true"
                  className="block h-px w-16 bg-line relative overflow-hidden"
                >
                  <span
                    className="aurora-hairline absolute inset-y-0 left-0 transition-[width] duration-200"
                    style={{
                      width: isActive ? `${progress * 100}%` : "0%",
                    }}
                  />
                </span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default ChapterNav;
