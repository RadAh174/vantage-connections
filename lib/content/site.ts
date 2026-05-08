/**
 * Site-wide content. Single source of truth for brand strings.
 *
 * Anything marked TODO is intentionally empty — the user fills these in
 * with real data. NEVER invent values for these fields.
 */

export type NavItem = { label: string; href: string };
export type SocialLink = { label: string; href: string; handle?: string };

export const site = {
  brand: "Vantage Connections",
  brandShort: "V·C",
  tagline: "Websites that put your business in view.",
  description:
    "We design and build modern websites for businesses ready to be seen — calm, confident, built to convert.",

  city: "California" as string,

  email: "info@vantageconnections.com" as string,

  // TODO: replace empty string with the real Cal.com / Calendly link once finalized.
  schedulingUrl: "" as string,

  availability: {
    // Surface copy for the Available Stamp + closing CTA.
    label: "AVAILABLE FOR MAY 2026 · BOOKING NOW",
    bookingNote: "Currently booking projects for May 2026",
  },

  nav: [
    { label: "Work", href: "/work" },
    { label: "Process", href: "/process" },
    // { label: "Pricing", href: "/pricing" },
    // { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ] satisfies NavItem[],

  // TODO: fill with real handles / URLs. Render gracefully when empty.
  socials: [] as SocialLink[],
} as const;
