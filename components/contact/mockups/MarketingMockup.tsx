import type { MockupProps } from "./types";

/**
 * Marketing site mockup — calm split hero with a featured-work card on
 * the right and a thin "what we do" strip at the bottom.
 *
 * Generic structural copy only — no invented testimonials, claims, or
 * specific case-study names. The right card is purely visual: a
 * gradient placeholder rectangle (no fake imagery) under a small
 * "Featured" label.
 */
export function MarketingMockup({ companyName }: MockupProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Top nav */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="block h-1.5 w-1.5 rounded-full bg-forest"
          />
          <span className="font-display text-[12px] font-semibold text-ink truncate max-w-[160px]">
            {companyName}
          </span>
        </div>
        <nav className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </nav>
      </div>

      {/* Hero split */}
      <div className="grid flex-1 grid-cols-5 gap-3 p-5">
        {/* Left ~60% (3/5) */}
        <div className="col-span-3 flex flex-col justify-center gap-2">
          <div
            className="font-display leading-[1.05] text-ink"
            style={{
              fontWeight: 600,
              fontSize: "clamp(0.95rem, 1.7vw, 1.35rem)",
            }}
          >
            Better business with{" "}
            <span
              className="color-word color-word--has-fallback italic"
              style={{ backgroundImage: "var(--gold-grad)" }}
            >
              {companyName}
            </span>
            .
          </div>
          <p className="text-[10px] text-ink-muted leading-snug max-w-[28ch]">
            Built to introduce the work and invite the next step.
          </p>
          <div className="mt-1.5 flex items-center gap-2.5">
            <span
              className="rounded px-2.5 py-1 text-[9.5px] text-[#0E0E10]"
              style={{ backgroundImage: "var(--gold-grad)", fontWeight: 500 }}
            >
              Get started
            </span>
            <span className="text-[9.5px] text-forest">Learn more →</span>
          </div>
        </div>

        {/* Right ~40% (2/5) — featured work card. Visual-led: small
            label, big gradient placeholder, mono caption, no fake
            client names. */}
        <div className="col-span-2 flex flex-col gap-1.5 rounded bg-surface-calm border border-line p-2.5 overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.2em] text-forest">
              Featured
            </span>
            <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-ink-muted">
              View →
            </span>
          </div>
          {/* Project image placeholder — soft warm gradient + a single
              gold hairline at the bottom for that signature accent. */}
          <div
            className="relative flex-1 rounded overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(224,180,66,0.18) 0%, rgba(26,77,51,0.10) 60%, rgba(14,14,16,0.05) 100%)",
            }}
          >
            <div
              aria-hidden="true"
              className="absolute inset-x-0 bottom-0 h-px"
              style={{ backgroundImage: "var(--gold-grad)", opacity: 0.7 }}
            />
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ink truncate">
              Recent work
            </span>
            <span className="font-mono text-[7.5px] text-ink-muted">
              Case study
            </span>
          </div>
        </div>
      </div>

      {/* Bottom strip — generic services any studio offers. Structural
          copy, not invented client names. */}
      <div className="grid grid-cols-3 gap-2 border-t border-line bg-surface-calm px-5 py-2.5">
        {[
          { num: "01", label: "Strategy" },
          { num: "02", label: "Design" },
          { num: "03", label: "Build" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-1.5">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-forest">
              {s.num}
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.14em] text-ink truncate">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MarketingMockup;
