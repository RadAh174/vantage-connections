import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "onDark";

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  withArrow?: boolean;
  className?: string;
};

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full text-[0.95rem] font-medium leading-none transition-all duration-200 ease-out focus-visible:outline-2 cursor-pointer select-none px-6 py-3.5";

const variants: Record<Variant, string> = {
  // Primary action — gradient fill in dusk, solid accent elsewhere
  primary:
    "btn-primary hover:shadow-[0_12px_30px_-12px_rgba(var(--c-shade-rgb),0.45)] active:scale-[0.985]",
  // Outline on surface
  secondary:
    "border border-line-strong bg-paper-raised/60 text-ink hover:border-ink hover:bg-paper-raised active:scale-[0.985]",
  ghost:
    "text-ink hover:text-accent-deep underline-offset-4 hover:underline px-2 py-1",
  // Light pill for dark sections
  onDark:
    "bg-paper text-shade hover:bg-accent-soft active:scale-[0.985] shadow-[0_12px_30px_-12px_rgba(0,0,0,0.6)]",
};

export function Button({
  href,
  children,
  variant = "primary",
  withArrow = false,
  className = "",
}: ButtonProps) {
  return (
    <a href={href} className={`${base} ${variants[variant]} ${className}`}>
      {children}
      {withArrow && (
        <ArrowRight
          className="h-4 w-4 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
          strokeWidth={2}
        />
      )}
    </a>
  );
}
