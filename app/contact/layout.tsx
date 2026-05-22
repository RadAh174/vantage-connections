import type { ReactNode } from "react";

/**
 * Server-component layout wrapper for /contact. The page itself is a
 * client component (form state + live mockup viewport), so metadata
 * has to live here in a sibling server layout — `metadata` exports are
 * only honored on server components.
 */
export const metadata = {
  title: "Contact",
  description:
    "Start a conversation with Vantage Connections. Tell us about your project — we usually reply within 24 hours with a tailored quote.",
  alternates: { canonical: "/contact" },
};

export default function ContactLayout({ children }: { children: ReactNode }) {
  return children;
}
