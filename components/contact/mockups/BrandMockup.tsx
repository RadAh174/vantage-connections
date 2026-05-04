import type { MockupProps } from "./types";

/**
 * Brand / Portfolio mockup — gallery-like, lots of breathing room.
 *
 * Subtitle is "—— Studio" (long em-dashes as a placeholder for whatever
 * descriptor the real brand would put there). Bottom nav items are
 * generic structural labels (Index / Info / Contact) — not invented.
 */
export function BrandMockup({ companyName }: MockupProps) {
  return (
    <div className="flex h-full flex-col items-center justify-between p-5">
      {/* Spacer top */}
      <div aria-hidden="true" />

      {/* Wordmark + subtitle */}
      <div className="flex flex-col items-center gap-1.5 text-center">
        <h2
          className="font-display text-headline italic leading-[0.95] tracking-[-0.02em]"
          style={{
            fontWeight: 600,
            fontSize: "clamp(1.6rem, 4vw, 2.6rem)",
          }}
        >
          {companyName}
        </h2>
        <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-ink-muted">
          —— Studio
        </span>
      </div>

      {/* Landscape image placeholder (16:10) */}
      <div
        className="w-full rounded bg-surface-calm border border-line"
        style={{ aspectRatio: "16 / 10", maxHeight: "38%" }}
      />

      {/* Bottom nav */}
      <nav className="flex items-center gap-6 font-mono text-[8.5px] uppercase tracking-[0.22em] text-ink-muted">
        <span>Index</span>
        <span>Info</span>
        <span>Contact</span>
      </nav>
    </div>
  );
}

export default BrandMockup;
