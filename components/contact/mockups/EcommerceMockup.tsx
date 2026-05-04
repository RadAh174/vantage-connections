import type { MockupProps } from "./types";

/**
 * E-commerce mockup — header + 3-column product grid.
 *
 * NO invented products / prices. Labels are "Item 01/02/03" so they
 * read as placeholders, and prices are all em-dashes. The point is the
 * *layout*, never to fabricate a product line for a stranger.
 */
export function EcommerceMockup({ companyName }: MockupProps) {
  return (
    <div className="flex h-full flex-col">
      {/* Top header */}
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="font-display text-[12px] font-semibold text-ink truncate max-w-[30%]">
          {companyName}
        </span>
        <nav className="flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
          <span>Shop</span>
          <span>About</span>
          <span>Journal</span>
        </nav>
        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink">
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="9" cy="21" r="1" />
            <circle cx="20" cy="21" r="1" />
            <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
          </svg>
          <span>(0)</span>
        </div>
      </div>

      {/* 3-column product grid */}
      <div className="grid flex-1 grid-cols-3 gap-3 p-5">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-col gap-1.5">
            <div className="aspect-square rounded bg-surface-calm border border-line" />
            <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-ink-muted">
              Item 0{n}
            </div>
            <div className="font-mono text-[9px] text-ink">$ — — .—</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EcommerceMockup;
