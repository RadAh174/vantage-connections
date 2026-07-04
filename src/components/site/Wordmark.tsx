type WordmarkProps = {
  className?: string;
  /** "paper" renders the light (on-dark) treatment */
  tone?: "ink" | "paper";
};

/**
 * Vantage Connections wordmark — carried over from the original agency site:
 * "Vantage" in Fraunces italic beside small tracked uppercase "CONNECTIONS"
 * in the sans face. No dot (the dot lives only in the favicon).
 */
export function Wordmark({ className = "", tone = "ink" }: WordmarkProps) {
  return (
    <span
      className={`inline-flex items-baseline gap-2 leading-none ${
        tone === "paper" ? "text-paper" : "text-ink"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className="font-display italic"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        Vantage
      </span>
      <span
        aria-hidden="true"
        className={`font-sans uppercase ${
          tone === "paper" ? "text-paper/70" : "text-ink-muted"
        }`}
        style={{ fontWeight: 600, fontSize: "0.7rem", letterSpacing: "0.16em" }}
      >
        Connections
      </span>
      <span className="sr-only">Vantage Connections</span>
    </span>
  );
}
