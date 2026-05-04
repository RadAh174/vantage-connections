import Link from "next/link";

type Props = {
  /** Compact form: V·C with aurora-gradient dot. */
  compact?: boolean;
  /** Render as a link to "/". Default true. */
  asLink?: boolean;
  className?: string;
};

export function Wordmark({ compact = false, asLink = true, className = "" }: Props) {
  const inner = compact ? (
    <span className="inline-flex items-baseline gap-1 leading-none">
      <span className="font-display italic" style={{ fontWeight: 500, fontSize: "1.1rem" }}>
        V
      </span>
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
      <span
        className="font-display italic"
        style={{ fontWeight: 500, fontSize: "1.1rem" }}
      >
        Vantage
      </span>
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
