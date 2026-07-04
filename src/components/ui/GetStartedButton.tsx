"use client";

import { ArrowRight } from "lucide-react";
import { openWaitlist } from "@/components/site/WaitlistDialog";

type Variant = "primary" | "onDark" | "outlineDark";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium leading-none transition-all duration-200 ease-out cursor-pointer select-none active:scale-[0.985]";

const variants: Record<Variant, string> = {
  primary: "btn-primary",
  onDark: "bg-paper text-shade hover:bg-accent-soft",
  outlineDark: "border border-paper/25 text-paper hover:bg-paper/10",
};

export function GetStartedButton({
  children,
  plan,
  billing,
  variant = "primary",
  withArrow = false,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  plan?: string;
  billing?: "monthly" | "annual";
  variant?: Variant;
  withArrow?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing = size === "lg" ? "px-7 py-4 text-[1rem]" : "px-6 py-3.5 text-[0.95rem]";
  return (
    <button
      type="button"
      onClick={() => openWaitlist(plan, billing)}
      className={`${base} ${variants[variant]} ${sizing} ${className}`}
    >
      {children}
      {withArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
