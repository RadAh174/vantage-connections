import Link from "next/link";

type Props = {
  /** Compact form: V·C with aurora-gradient dot. */
  compact?: boolean;
  /** Render as a link to "/". Default true. */
  asLink?: boolean;
  className?: string;
};

/**
 * Brand wordmark. The "Vantage" italic portion (full name or just the
 * V in compact form) is rendered as a base ink layer with a gold
 * gradient layer stacked on top via grid same-cell. The gold layer's
 * opacity is tied to `--vantage-fill`, a CSS variable set by the home
 * page's <WordmarkBackdrop /> as it fills with gold. On pages without
 * the backdrop, the variable is unset → the gold layer falls back to
 * opacity 0 and the wordmark reads as its normal ink color.
 */

const VANTAGE_FZ = "1.1rem";
const VANTAGE_WEIGHT = 500;

function VantageItalic({ text }: { text: string }) {
  return (
    <span className="relative inline-grid">
      <span
        className="font-display italic row-start-1 col-start-1"
        style={{ fontWeight: VANTAGE_WEIGHT, fontSize: VANTAGE_FZ }}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className="font-display italic row-start-1 col-start-1"
        style={{
          fontWeight: VANTAGE_WEIGHT,
          fontSize: VANTAGE_FZ,
          backgroundImage: "var(--gold-grad)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          opacity: "var(--vantage-fill, 0)",
        }}
      >
        {text}
      </span>
    </span>
  );
}

export function Wordmark({ compact = false, asLink = true, className = "" }: Props) {
  const inner = compact ? (
    <span className="inline-flex items-baseline gap-1 leading-none">
      <VantageItalic text="V" />
      <span
        aria-hidden="true"
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundImage: "var(--gold-grad)" }}
      />
      <span
        className="font-sans uppercase"
        style={{ fontWeight: 600, fontSize: "0.8rem", letterSpacing: "0.08em" }}
      >
        C
      </span>
    </span>
  ) : (
    <span className="inline-flex items-baseline gap-2 leading-none">
      <VantageItalic text="Vantage" />
      <span
        className="font-sans uppercase text-ink-muted"
        style={{
          fontWeight: 600,
          fontSize: "0.7rem",
          letterSpacing: "0.16em",
        }}
      >
        Connections
      </span>
    </span>
  );

  if (!asLink) {
    return (
      <span className={`inline-block text-ink ${className}`} aria-label="Vantage Connections">
        {inner}
      </span>
    );
  }
  return (
    <Link
      href="/"
      aria-label="Vantage Connections — home"
      className={`inline-block text-ink hover:opacity-80 transition-opacity ${className}`}
    >
      {inner}
    </Link>
  );
}

export default Wordmark;
