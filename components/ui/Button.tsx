"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

type CommonProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

type AsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type AsLink = CommonProps & {
  href: string;
  /** Open in new tab. */
  external?: boolean;
};

type Props = AsButton | AsLink;

const SIZE_MAP: Record<Size, string> = {
  sm: "px-3 py-1.5 text-[13px]",
  md: "px-4 py-2.5 text-[14px]",
  lg: "px-5 py-3 text-[15px]",
};

const BASE =
  "inline-flex items-center justify-center gap-2 rounded-[4px] " +
  "font-medium tracking-[-0.005em] " +
  "transition-transform duration-200 ease-[cubic-bezier(0.2,0.8,0.2,1)] " +
  "will-change-transform " +
  "hover:scale-[1.02] active:scale-[0.98] active:duration-100 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
  "focus-visible:ring-gold focus-visible:ring-offset-bg " +
  "disabled:opacity-60 disabled:pointer-events-none";

/**
 * Variant rules:
 *  - primary: gold gradient bg, dark ink text. The gradient is luminous
 *    in both light and dark mode, so dark text reads cleanly either way.
 *  - secondary: forest outline + forest text.
 *  - ghost: text-only with underline; hover lifts to forest.
 */
const VARIANTS: Record<Variant, string> = {
  primary: "text-[#0E0E10]",
  secondary:
    "bg-transparent text-forest border border-forest hover:bg-forest/5",
  ghost:
    "bg-transparent text-ink hover:text-forest px-1 underline decoration-current underline-offset-[6px] decoration-[1px]",
};

export function Button(props: Props) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
  } = props;

  const cls = `${BASE} ${VARIANTS[variant]} ${
    variant === "ghost" ? "" : SIZE_MAP[size]
  } ${className}`;

  // Primary variant gets the gold gradient as inline backgroundImage so the
  // CSS variable (which flips with theme) is honored at render time.
  const primaryStyle =
    variant === "primary"
      ? { backgroundImage: "var(--gold-grad)" }
      : undefined;

  if ("href" in props && props.href !== undefined) {
    const { href, external } = props;
    if (external || /^https?:\/\//.test(href)) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          className={cls}
          style={primaryStyle}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={cls} style={primaryStyle}>
        {children}
      </Link>
    );
  }

  const { ...buttonRest } = props as AsButton;
  // strip our custom keys
  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    ...native
  } = buttonRest;
  void _v; void _s; void _c; void _ch;

  return (
    <button className={cls} style={primaryStyle} {...native}>
      {children}
    </button>
  );
}

export default Button;
