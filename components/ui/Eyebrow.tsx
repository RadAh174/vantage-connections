import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /**
   * Accent color. Defaults to "forest".
   * Legacy Aurora names ("plum" | "periwinkle" | "electric") and the
   * prior palette name "mint" are still accepted for back-compat — they
   * all resolve to forest now. "coral" is preserved for the form-error
   * case and uses a terracotta hex that doesn't read as a happy forest.
   */
  color?:
    | "forest"
    | "gold"
    | "ink-muted"
    | "mint"
    | "plum"
    | "periwinkle"
    | "electric"
    | "coral";
  className?: string;
};

const COLOR_MAP: Record<NonNullable<Props["color"]>, string> = {
  forest: "text-forest",
  gold: "text-gold",
  "ink-muted": "text-ink-muted",
  // Prior palette name → forest (one migration cycle of safety)
  mint: "text-forest",
  // Aurora legacy names → forest (back-compat for existing pages)
  plum: "text-forest",
  periwinkle: "text-forest",
  electric: "text-forest",
  // Error / warning state. Hardcoded terracotta — coral is no longer a
  // theme token but we still need a non-forest signal for invalid fields.
  coral: "text-[#C04A2D]",
};

/**
 * Tiny uppercase eyebrow label.
 * 0.18em tracking, 11px, mono.
 */
export function Eyebrow({
  children,
  color = "forest",
  className = "",
}: Props) {
  return (
    <span
      className={`font-mono uppercase ${COLOR_MAP[color]} ${className}`}
      style={{
        fontSize: "0.6875rem",
        letterSpacing: "0.18em",
        lineHeight: 1.2,
      }}
    >
      {children}
    </span>
  );
}

export default Eyebrow;
