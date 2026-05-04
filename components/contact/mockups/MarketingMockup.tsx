import type { MockupProps } from "./types";

/**
 * Marketing site mockup — calm split hero.
 *
 * Generic content only:
 *   - Nav: Work / About / Contact (truthful nav for any site)
 *   - Hero copy is templated around the user's company name only;
 *     no invented services, claims, or stats.
 */
export function MarketingMockup({ companyName }: MockupProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Top nav */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-display text-[12px] font-semibold text-ink truncate max-w-[40%]">
          {companyName}
        </span>
        <nav className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          <span>Work</span>
          <span>About</span>
          <span>Contact</span>
        </nav>
      </div>

      {/* Hero split */}
      <div className="grid flex-1 grid-cols-5 gap-4 p-5">
        {/* Left ~60% (3/5) */}
        <div className="col-span-3 flex flex-col justify-center gap-2.5">
          <div
            className="font-display leading-[1.05] text-ink"
            style={{
              fontWeight: 600,
              fontSize: "clamp(0.95rem, 1.7vw, 1.35rem)",
            }}
          >
            Welcome to{" "}
            <span
              className="color-word color-word--has-fallback italic"
              style={{ backgroundImage: "var(--gold-grad)" }}
            >
              {companyName}
            </span>
            .
          </div>
          <p className="text-[10.5px] text-ink-muted leading-snug max-w-[28ch]">
            A clear, calm homepage — built to introduce the work and invite
            the next step.
          </p>
          <div className="mt-1.5 flex items-center gap-3">
            <span
              className="rounded px-2.5 py-1 text-[10px] text-[#0E0E10]"
              style={{ backgroundImage: "var(--gold-grad)" }}
            >
              Get started
            </span>
            <span className="text-[10px] text-forest">Learn more →</span>
          </div>
        </div>

        {/* Right ~40% (2/5) image placeholder */}
        <div className="col-span-2 relative rounded bg-surface-calm border border-line overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-px"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--color-forest), #E0B442, var(--color-forest))",
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default MarketingMockup;
