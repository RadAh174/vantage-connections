import type { MockupProps } from "./types";

/**
 * Portfolio mockup — designer/photographer gallery index.
 *
 * Six tile grid (3 cols × 2 rows). Each tile is a placeholder
 * rectangle (warm/cool gradient alternating) with a small caption
 * pairing a numbered slot and a generic creative discipline. No
 * invented project names, no specific years.
 *
 * Sparse, ink-led with one forest dot for the active nav state —
 * neutral between SaaS-green and Luxury-gold so this style reads as
 * its own register.
 */
export function PortfolioMockup({ companyName }: MockupProps) {
  const tiles = [
    { num: "01", label: "Identity", tone: "warm" },
    { num: "02", label: "Editorial", tone: "cool" },
    { num: "03", label: "Web", tone: "warm" },
    { num: "04", label: "Print", tone: "cool" },
    { num: "05", label: "Type", tone: "warm" },
    { num: "06", label: "Motion", tone: "cool" },
  ] as const;

  return (
    <div className="flex h-full flex-col">
      {/* Top nav */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span
          className="font-display italic text-[13px] text-ink truncate max-w-[50%]"
          style={{ fontWeight: 500 }}
        >
          {companyName}
        </span>
        <nav className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="block h-1 w-1 rounded-full bg-forest"
            />
            <span className="text-ink">Index</span>
          </span>
          <span>Info</span>
          <span>Contact</span>
        </nav>
      </div>

      {/* Page header */}
      <div className="flex items-baseline justify-between px-5 pt-3 pb-2">
        <h2
          className="font-display text-[12.5px] text-ink"
          style={{ fontWeight: 500 }}
        >
          Selected work
        </h2>
        <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-ink-muted">
          Index
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-3 gap-2 px-5 pb-3 flex-1">
        {tiles.map((tile) => (
          <div key={tile.num} className="flex flex-col gap-1">
            <div
              className="flex-1 rounded border border-line"
              style={{
                background:
                  tile.tone === "warm"
                    ? "linear-gradient(135deg, rgba(224,180,66,0.10) 0%, rgba(224,180,66,0.02) 100%)"
                    : "linear-gradient(135deg, rgba(26,77,51,0.08) 0%, rgba(26,77,51,0.02) 100%)",
              }}
            />
            <div className="flex items-baseline justify-between gap-1">
              <span className="font-mono text-[7.5px] uppercase tracking-[0.16em] text-ink truncate">
                {tile.num} · {tile.label}
              </span>
              <span className="font-mono text-[7.5px] text-ink-muted">
                Case
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-line px-5 py-2 font-mono text-[7.5px] uppercase tracking-[0.16em] text-ink-muted">
        <span>Index · 01 / 06</span>
        <span>Next →</span>
      </div>
    </div>
  );
}

export default PortfolioMockup;
