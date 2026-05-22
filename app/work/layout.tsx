import type { ReactNode } from "react";

/**
 * Server-component layout wrapper for /work. The page itself is a
 * client component (state for the modal/filter UI), so metadata has to
 * live here in a sibling server layout — `metadata` exports are only
 * honored on server components.
 */
export const metadata = {
  title: "Work",
  description:
    "Selected work from Vantage Connections — marketing surfaces and product surfaces, real shipped projects and curated reference sites.",
  alternates: { canonical: "/work" },
};

export default function WorkLayout({ children }: { children: ReactNode }) {
  return children;
}
