/**
 * Home page content. Anything marked TODO is intentionally empty until
 * the user provides real data. Components render an empty / skeleton
 * state when arrays are empty. NEVER invent values for these fields.
 */

import type { ReactNode } from "react";

export type FeaturedWork = {
  slug: string;
  client: string;
  title: string;
  liveUrl: string;
  tags: string[];
};

export type PricingTier = {
  name: string;
  /** Range or "$X+", honest scope. */
  range: string;
  features: string[];
  highlighted?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
};

export type Phase = {
  number: string;
  name: string;
  blurb: string;
};

export const hero = {
  eyebrowLead: "FREELANCE WEB STUDIO",
  // City is TODO in site.ts; the eyebrow component composes the rest.
  rotatingWords: ["view", "focus", "motion", "hand"] as const,
  ctas: {
    primary: { label: "See our work", href: "/work" },
    secondary: { label: "Read our process", href: "/process" },
  },
  scrollCue: "scroll to see what we build",
};

export const mission = {
  // Generic, truthful framing. The emphasis word renders as gold-gradient text.
  body:
    "Boutique by design. We take a small number of projects each quarter and build each one as if it were our own.",
  emphasis: "small number",
};

// Featured work shown in the home Selected Work carousel.
// Real shipped projects only — public reference / inspiration sites
// were removed pre-launch so visitors don't read third-party brands
// (Tailwind, Cal.com, Studio McGee, etc.) as Vantage's own client work.
// Never invent client names.
export const featuredWork: FeaturedWork[] = [
  {
    slug: "black-diamond",
    client: "Black Diamond Pavers",
    title: "Premium hardscaping site, end-to-end",
    liveUrl: "https://vantageconnections-blackdiamond.vercel.app/",
    tags: ["Marketing site", "Service"],
  },
  // Real client — industrial automation services, Mission Viejo CA.
  {
    slug: "pioneer-engineer",
    client: "Pioneer Engineer",
    title: "Industrial automation services",
    liveUrl: "https://pioneer-engineer.vercel.app/",
    tags: ["Marketing site", "Service"],
  },
  // Real client — PredictBase v1 (predictbase.app). Spread to opposite
  // side of the ring from the v2 entry below.
  {
    slug: "predictbase",
    client: "PredictBase",
    title: "Live site",
    liveUrl: "https://predictbase.app",
    tags: [],
  },
  // Real client — PredictBase v2 (v2.predictbase.app).
  {
    slug: "predictbase-v2",
    client: "PredictBase",
    title: "Live site (v2)",
    liveUrl: "https://v2.predictbase.app",
    tags: [],
  },
];

// Real, generic — phases of the process do not need real client data.
export const phases: Phase[] = [
  { number: "01", name: "Discovery", blurb: "Goals, scope, and shape." },
  { number: "02", name: "Design", blurb: "Direction, system, and craft." },
  { number: "03", name: "Build", blurb: "Production code, performance-first." },
  { number: "04", name: "Launch", blurb: "Ship, measure, hand over." },
];

// TODO_PRICING_TIERS: user fills with real tiers. Empty array → fallback line.
export const pricingTiers: PricingTier[] = [];

export const closing = {
  // The italic accent word renders gradient via <ColorWord>.
  headline: "Have a project in mind? Let's",
  accent: "talk",
  trailing: ".",
};

export type HomeContent = {
  hero: typeof hero;
  mission: typeof mission;
  featuredWork: FeaturedWork[];
  phases: Phase[];
  pricingTiers: PricingTier[];
  closing: typeof closing;
};

export const home: HomeContent = {
  hero,
  mission,
  featuredWork,
  phases,
  pricingTiers,
  closing,
};

// Suppress unused type warning for ReactNode if a future field needs it.
export type _RN = ReactNode;
