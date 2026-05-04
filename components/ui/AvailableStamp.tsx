import Link from "next/link";

type Props = {
  className?: string;
  /** Accepted for back-compat with the previous circular-stamp API.
   *  Ignored — the pill button sizes itself to its content. */
  size?: number;
};

/**
 * "BUILD NOW" pill — the contact CTA in the top-right of the header.
 *
 * Replaces the previous rotating circular stamp. Pill-shaped (fully
 * rounded), text reads "BUILD NOW" with "NOW" rendered in the gold
 * gradient (background-clip: text). The border is the gold gradient
 * with a slow horizontal shimmer animation that reads as a sweeping
 * highlight along the ring.
 *
 * Click → /contact.
 */
export function AvailableStamp({ className = "" }: Props) {
  return (
    <Link
      href="/contact"
      aria-label="Build now — go to contact page"
      // Outer wrapper holds the gradient "border" with shimmer:
      //   - 5-stop gold gradient (dark → mid → bright → mid → dark)
      //   - background-size 220% so the gradient extends past the
      //     element bounds → `shimmer-sweep` animation slides it across,
      //     producing a traveling highlight along the border.
      //   - 1.5px padding + an inner panel painted with bg-bg leaves a
      //     thin gradient ring visible.
      // build-now-pill class adds the hover lift (scale 1.04) — pairs
      // with build-now-inner which swaps to a light-gold → near-black
      // gradient on hover for a much stronger CTA pull.
      className={`build-now-pill shimmer-border group inline-flex items-stretch ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(115deg, #8B6914 0%, #D4A12A 30%, #FFE49A 50%, #D4A12A 70%, #8B6914 100%)",
        backgroundSize: "220% 100%",
        padding: "1.5px",
        borderRadius: "999px",
      }}
    >
      <span
        className="build-now-inner inline-flex items-center px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-ink"
        style={{ borderRadius: "999px" }}
      >
        BUILD{" "}
        <span
          className="shimmer-text ml-1.5"
          style={{ fontWeight: 600 }}
        >
          NOW
        </span>
      </span>
    </Link>
  );
}

export default AvailableStamp;
