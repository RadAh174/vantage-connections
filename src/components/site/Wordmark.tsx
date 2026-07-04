type WordmarkProps = {
  className?: string;
  /** color of the accent operator dot */
  tone?: "ink" | "paper";
};

/**
 * Vantage Connections wordmark: "VANTAGE" and "CONNECTIONS" in the tracked
 * didone caps, split by a gold "operator dot" — the always-on signal of a
 * working operator, and the brand's green-gold accent in miniature.
 */
export function Wordmark({ className = "", tone = "ink" }: WordmarkProps) {
  return (
    <span
      className={`font-wordmark inline-flex items-center gap-[0.3em] text-[1.02rem] uppercase leading-none tracking-[0.26em] ${
        tone === "paper" ? "text-paper" : "text-ink"
      } ${className}`}
    >
      <span aria-hidden="true">Vantage</span>
      <span
        aria-hidden="true"
        className="inline-block h-[0.24em] w-[0.24em] rounded-full bg-accent-soft"
      />
      <span
        aria-hidden="true"
        className="text-[0.8em] tracking-[0.2em] opacity-75"
      >
        Connections
      </span>
      <span className="sr-only">Vantage Connections</span>
    </span>
  );
}
