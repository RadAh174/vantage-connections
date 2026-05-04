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

const BASE =
  "inline-flex items-center gap-2 rounded-full px-3 py-1 " +
  "text-[12px] font-medium tracking-[-0.005em] " +
  "border border-line bg-surface text-ink " +
  "transition-colors duration-200";

const INTERACTIVE =
  "cursor-pointer hover:border-forest/40 hover:text-forest focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const ACTIVE = "border-forest text-forest bg-forest/5";

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

  const cls = `${BASE} ${active ? ACTIVE : ""} ${className}`;

  if ("as" in props && props.as === "button") {
    const { as: _as, dotColor: _d, active: _a, className: _c, children: _ch, ...rest } =
      props as ButtonProps;
    void _as; void _d; void _a; void _c; void _ch;
    return (
      <button
        type="button"
        className={`${cls} ${INTERACTIVE}`}
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
