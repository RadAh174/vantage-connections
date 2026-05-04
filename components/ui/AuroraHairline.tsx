import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  /** Animate the gradient drift (default: true). */
  animate?: boolean;
};

/**
 * 1px gradient hairline used as section dividers, footer top border,
 * and under-nav rule. The gradient is defined in `app/globals.css`
 * under `.aurora-hairline`.
 *
 * Note: the "Aurora" name is preserved for back-compat but the palette
 * is now forest+gold (the 5-color Aurora was retired). Drift animation
 * unchanged (10s loop).
 */
export function AuroraHairline({
  animate = true,
  className = "",
  ...rest
}: Props) {
  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={`aurora-hairline h-px w-full ${
        animate ? "aurora-hairline-animate" : ""
      } ${className}`}
      {...rest}
    />
  );
}

export default AuroraHairline;
