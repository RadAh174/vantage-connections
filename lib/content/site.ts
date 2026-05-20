/**
 * Site-wide content. Single source of truth for brand strings.
 *
 * Anything marked TODO is intentionally empty — the user fills these in
 * with real data. NEVER invent values for these fields.
 */

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string; handle?: string };
export type Founder = { name: string; role: string };
export type ServiceArea = { city: string; region: string };

export const site = {
  brand: "Vantage Connections",
  legalName: "Vantage Connections LLC",
  brandShort: "V·C",
  tagline: "Websites that put your business in view.",
  // description drives <meta>, OpenGraph, Twitter, and schema.org/description.
  // Keyword-targeted: vertical (luxury real estate + premium artisan brands),
  // location (Irvine, CA), and business model (managed-monthly).
  description:
    "Vantage Connections is a luxury web design and development studio in Irvine, California. We design, build, host, and maintain bespoke websites for luxury real estate professionals and premium artisan brands — design, build, hosting, and premium support under one managed-monthly fee.",

  city: "Irvine" as string,
  region: "CA" as string,
  country: "US" as string,

  email: "info@vantageconnections.com" as string,
  phone: "+1 (949) 966-9075" as string,
  phoneE164: "+19499669075" as string,

  // Google Analytics 4 Measurement ID. Public (client-side) — safe in source.
  // Empty string disables GA injection (e.g., for local dev / preview).
  gaMeasurementId: "G-BL38BTRQN2" as string,

  // TODO: replace empty string with the real Cal.com / Calendly link once finalized.
  schedulingUrl: "" as string,

  availability: {
    // Surface copy for the Available Stamp + closing CTA.
    label: "AVAILABLE FOR MAY 2026 · BOOKING NOW",
    bookingNote: "Currently booking projects for May 2026",
  },

  // Primary HQ + service areas. Used by LocalBusiness schema (areaServed),
  // Google Business Profile category, and the location pages.
  serviceAreas: [
    { city: "Irvine", region: "CA" },
    { city: "Newport Beach", region: "CA" },
    { city: "Los Angeles", region: "CA" },
    { city: "Austin", region: "TX" },
    { city: "Miami", region: "FL" },
    { city: "Orlando", region: "FL" },
  ] satisfies ServiceArea[],

  founders: [
    { name: "Radin Ahmadi", role: "Co-founder" },
    { name: "Adrin Ahmadi", role: "Co-founder" },
    { name: "Daeseo Lee", role: "Co-founder" },
    { name: "Arastoo Gol", role: "Co-founder" },
  ] satisfies Founder[],

  nav: [
    { label: "Work", href: "/work" },
    { label: "Services", href: "/services" },
    { label: "Process", href: "/process" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  // TODO: fill with real handles / URLs. Render gracefully when empty.
  socials: [] as SocialLink[],
} as const;
