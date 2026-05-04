import type { ElementType, ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Default: gold gradient (var(--gold-grad)). Override with full CSS gradient. */
  gradient?: string;
  italic?: boolean;
  as?: ElementType;
  className?: string;
};

const DEFAULT_GRADIENT = "var(--gold-grad)";

/**
 * Gradient text wrapper. Used for the italic accent word in every heading.
 *
 * Renders an inline element with `background-clip: text` and a transparent
 * fill so the gradient shows through the glyphs. A solid `color` fallback is
 * applied so border-bottom: 1px solid currentColor on a parent <a> still
 * renders meaningfully (since gradient-clipped text has no currentColor).
 */
export function ColorWord({
  children,
  gradient = DEFAULT_GRADIENT,
  italic = true,
  as,
  className = "",
}: Props) {
  const Tag = (as ?? "span") as ElementType;
  return (
    <Tag
      className={`color-word color-word--has-fallback ${
        italic ? "italic" : ""
      } ${className}`}
      style={{ backgroundImage: gradient }}
    >
      {children}
    </Tag>
  );
}

export default ColorWord;
