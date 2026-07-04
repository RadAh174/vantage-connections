type WordmarkProps = {
  className?: string;
  /** "paper" renders the light (on-dark) treatment */
  tone?: "ink" | "paper";
};

/**
 * Vantage Connections wordmark — one word, both halves in the Fraunces italic
 * display face: "Vantage" in deep forest (paper on dark), "Connections" in
 * gold — bright gold over dark surfaces, deeper bronze-gold on light ones so
 * it stays legible. No dot (the dot lives only in the favicon).
 */
export function Wordmark({ className = "", tone = "ink" }: WordmarkProps) {
  return (
    <span
      className={`font-display inline-flex items-baseline italic leading-none ${
        tone === "paper" ? "text-paper" : "text-accent-deep"
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
