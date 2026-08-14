"use client";

import type { ReactNode } from "react";
import { openWaitlist } from "@/components/site/WaitlistDialog";

/**
 * Dossier-styled triggers for the offer letter (FORM VC-002).
 * `solid` = the red action button, `link` = the dashed-underline text link.
 */
export function OfferButton({
  children,
  variant = "solid",
  className = "",
}: {
  children: ReactNode;
  variant?: "solid" | "link" | "ink";
  className?: string;
}) {
  const base =
    variant === "solid"
      ? "rounded-sm bg-dred px-6 py-3.5 font-plex text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-dpaper transition-colors hover:bg-dred-deep"
      : variant === "ink"
        ? "rounded-sm bg-dink px-6 py-3.5 font-plex text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-dpaper transition-colors hover:bg-dred"
        : "font-plex text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-dred underline decoration-dashed decoration-1 underline-offset-4 transition-colors hover:text-dred-deep";

  return (
    <button
      type="button"
      onClick={() => openWaitlist()}
      className={`${base} ${className}`}
    >
      {children}
    </button>
  );
}
