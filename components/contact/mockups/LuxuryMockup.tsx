import type { MockupProps } from "./types";

/**
 * Luxury / atelier mockup — editorial, gold throughout.
 *
 * Almost all text is templated around `companyName` or generic
 * structural labels (Collections / Atelier / Reserve). Specific
 * claims (founding year, location) sit as em-dashes — no fabrication.
 * Gold gradient is the ONLY accent color so it reads distinctly from
 * the forest-themed SaaS style at a glance.
 */
export function LuxuryMockup({ companyName }: MockupProps) {
  const initial = companyName.trim().charAt(0).toUpperCase() || "—";

  return (
    <div className="flex h-full flex-col">
      {/* Refined top bar — small mark on the left, sparse nav on right.
          The bar itself has only a hairline border to feel airy. */}
      <div className="flex items-center justify-between px-6 py-3">
        <span
          className="inline-flex h-5 w-5 items-center justify-center rounded-full font-display italic text-[10px]"
          style={{
            backgroundImage: "var(--gold-grad)",
            color: "#0E0E10",
            fontWeight: 600,
          }}
        >
          {initial}
        </span>
        <nav className="flex items-center gap-5 font-mono text-[8.5px] uppercase tracking-[0.28em] text-ink-muted">
          <span>Collections</span>
          <span>Atelier</span>
          <span>Reserve</span>
        </nav>
      </div>

      {/* Hairline gold rule under the nav — the signature accent. */}
      <div
        aria-hidden="true"
        className="h-px w-full opacity-50"
        style={{ backgroundImage: "var(--gold-grad)" }}
      />

      {/* Centered editorial wordmark with generous breathing room.
          Sparse by design — wordmark + a hairline + a single CTA. */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-8 text-center">
        <span className="font-mono text-[8px] uppercase tracking-[0.36em] text-ink-muted">
          Maison
        </span>

        <h2
          className="font-display italic leading-[0.95] color-word color-word--has-fallback"
          style={{
            fontWeight: 500,
            fontSize: "clamp(1.6rem, 4.4vw, 2.9rem)",
            letterSpacing: "-0.018em",
            backgroundImage: "var(--gold-grad)",
          }}
        >
          {companyName}
        </h2>

        {/* Short hairline beneath the wordmark — visual punctuation. */}
        <span
          aria-hidden="true"
          className="block h-px w-12 opacity-70"
          style={{ backgroundImage: "var(--gold-grad)" }}
        />

        {/* Reserve CTA — the only call to action on the page. */}
        <span
          className="mt-3 inline-block rounded-full px-4 py-1.5 font-mono text-[9px] uppercase tracking-[0.22em]"
          style={{
            backgroundImage: "var(--gold-grad)",
            color: "#0E0E10",
            fontWeight: 600,
          }}
        >
          Reserve →
        </span>
      </div>

      {/* Footer: a single italic line, sparse. */}
      <div className="flex items-center justify-center px-6 py-3 font-mono text-[7.5px] uppercase tracking-[0.32em] text-ink-muted">
        <span>By appointment</span>
      </div>
    </div>
  );
}

export default LuxuryMockup;
