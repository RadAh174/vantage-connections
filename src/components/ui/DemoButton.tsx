"use client";

import { ArrowRight } from "lucide-react";
import { openDemo } from "@/components/site/DemoDialog";

/**
 * "Book a demo" trigger — opens the enterprise demo dialog. Always the single
 * terracotta action (btn-primary); no other CTA on the enterprise page.
 */
export function DemoButton({
  children,
  withArrow = false,
  size = "md",
  className = "",
}: {
  children: React.ReactNode;
  withArrow?: boolean;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing =
    size === "lg" ? "px-7 py-4 text-[1rem]" : "px-6 py-3.5 text-[0.95rem]";
  return (
    <button
      type="button"
      onClick={() => openDemo()}
      className={`btn-primary group inline-flex items-center justify-center gap-2 rounded-full font-medium leading-none transition-all duration-200 ease-out cursor-pointer select-none active:scale-[0.985] ${sizing} ${className}`}
    >
      {children}
      {withArrow && (
        <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      )}
    </button>
  );
}
