"use client";

import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactNode,
} from "react";

/**
 * Chip dot color. Forest/gold are the only real choices in the
 * Forest+Gold palette; the prior name "mint" and legacy Aurora names
 * ("plum" | "periwinkle" | "electric" | "coral") are kept for
 * back-compat and resolve to forest.
 */
type DotColor =
  | "forest"
  | "gold"
  | "mint"
  | "plum"
  | "periwinkle"
  | "electric"
  | "coral";

const DOT_BG: Record<DotColor, string> = {
  forest: "bg-forest",
  gold: "bg-gold",
  // Prior palette name → forest
  mint: "bg-forest",
  // Legacy Aurora names → forest
  plum: "bg-forest",
  periwinkle: "bg-forest",
  electric: "bg-forest",
  coral: "bg-forest",
};

type CommonProps = {
  children: ReactNode;
  /** Optional accent dot prefix. */
  dotColor?: DotColor;
  className?: string;
  active?: boolean;
};

type SpanProps = CommonProps &
  HTMLAttributes<HTMLSpanElement> & { as?: "span" };

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { as: "button" };

type Props = SpanProps | ButtonProps;

// Structural classes only — no color utilities — so the BASE never
// fights ACTIVE/INACTIVE in the cascade. Tailwind orders classes by
// generation, not by className-string order, so a `bg-surface` in BASE
// can silently override `bg-forest` in ACTIVE if both are present.
const BASE =
  "inline-flex items-center gap-2 rounded-full px-3 py-1 " +
  "text-[12px] font-medium tracking-[-0.005em] border " +
  "transition-colors duration-200";

// Mutually-exclusive color sets — only ONE is ever in the className,
// so they can't conflict with each other.
const INACTIVE = "border-line bg-surface text-ink";
// Active = forest border + forest text + a subtle gold → forest
// diagonal gradient fill. Two stops, light enough that the forest
// text reads cleanly across the surface.
const ACTIVE =
  "border-forest text-forest bg-gradient-to-br from-gold/12 to-forest/15";

const INTERACTIVE_FOCUS =
  "cursor-pointer focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

// Hover styles split by state. Active hover slightly intensifies the
// gradient stops; inactive hover lifts the border + text toward forest.
const INACTIVE_HOVER = "hover:border-forest/40 hover:text-forest";
const ACTIVE_HOVER =
  "hover:from-gold/18 hover:to-forest/22 hover:border-forest hover:text-forest";

export function Chip(props: Props) {
  const {
    children,
    dotColor,
    className = "",
    active = false,
  } = props;

  const dot = dotColor ? (
    <span
      aria-hidden="true"
      className={`inline-block h-1.5 w-1.5 rounded-full ${DOT_BG[dotColor]}`}
    />
  ) : null;

  const cls = `${BASE} ${active ? ACTIVE : INACTIVE} ${className}`;

  if ("as" in props && props.as === "button") {
    const { as: _as, dotColor: _d, active: _a, className: _c, children: _ch, ...rest } =
      props as ButtonProps;
    void _as; void _d; void _a; void _c; void _ch;
    const hover = active ? ACTIVE_HOVER : INACTIVE_HOVER;
    return (
      <button
        type="button"
        className={`${cls} ${hover} ${INTERACTIVE_FOCUS}`}
        aria-pressed={active}
        {...rest}
      >
        {dot}
        {children}
      </button>
    );
  }

  const { dotColor: _d, active: _a, className: _c, children: _ch, ...rest } =
    props as SpanProps;
  void _d; void _a; void _c; void _ch;
  return (
    <span className={cls} {...rest}>
      {dot}
      {children}
    </span>
  );
}

export default Chip;
