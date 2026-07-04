type WordmarkProps = {
  className?: string;
  /** "paper" renders the light (on-dark) treatment */
  tone?: "ink" | "paper";
};

/**
 * Vantage Connections wordmark — both words in the Fraunces italic display
 * face. "Vantage" carries the ink (or paper on dark), "Connections" is gold:
 * bright gold over dark surfaces, deeper bronze-gold on light ones so it
 * stays legible. No dot (the dot lives only in the favicon).
 */
export function Wordmark({ className = "", tone = "ink" }: WordmarkProps) {
  return (
    <span
      className={`font-display inline-flex items-baseline gap-[0.4em] italic leading-none ${
        tone === "paper" ? "text-paper" : "text-ink"
      } ${className}`}
      style={{ fontWeight: 500, fontSize: "1.1rem" }}
    >
      <span aria-hidden="true">Vantage</span>
      <span
        aria-hidden="true"
        className={tone === "paper" ? "text-accent-soft" : "text-signal"}
      >
        Connections
      </span>
      <span className="sr-only">Vantage Connections</span>
    </span>
  );
}
