/**
 * Home page content. Anything marked TODO is intentionally empty until
 * the user provides real data. Components render an empty / skeleton
 * state when arrays are empty. NEVER invent values for these fields.
 */

import type { ReactNode } from "react";

export type Stat = {
  num: number;
  label: string;
  /** Accent dot color. Forest+Gold palette only. */
  dotColor?: "forest" | "gold";
  /** Display suffix on the number (e.g. "%", "d"). */
  suffix?: string;
};

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

// TODO_STATS: user fills with real numbers. Empty array → StatStrip renders nothing.
export const stats: Stat[] = [];

export const mission = {
  // Generic, truthful framing. The emphasis word renders as gold-gradient text.
  body:
    "Boutique by design. We take a small number of projects each quarter and build each one as if it were our own.",
  emphasis: "small number",
};

// Featured work shown in the home Selected Work carousel.
// Real projects only — never invent client names.
// Black Diamond Pavers is the first shipped project; future entries land
// here as they go live.
//
// TEST_CAROUSEL_ENTRIES: the four entries below the Black Diamond one are
// public test sites used to exercise the 3D carousel mechanic with > 1
// item. They are NOT real client work and must be removed before any
// public launch. Each is marked with `// TEST: REMOVE BEFORE LAUNCH`.
export const featuredWork: FeaturedWork[] = [
  {
    slug: "black-diamond",
    client: "Black Diamond Pavers",
    title: "Premium hardscaping site, end-to-end",
    liveUrl: "https://vantageconnections-blackdiamond.vercel.app/",
    tags: ["Marketing site", "Service"],
  },
  // TEST: REMOVE BEFORE LAUNCH — verified iframe-allowed via curl headers.
  // Iana / Vercel / Next.js / Clerk / Resend all set X-Frame-Options DENY
  // and were swapped out. The four below allow embedding (no X-Frame-Options,
  // no restrictive frame-ancestors).
  {
    slug: "test-tailwind",
    client: "Tailwind CSS",
    title: "Test entry — design-quality docs site",
    liveUrl: "https://tailwindcss.com",
    tags: ["TEST"],
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
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-shadcn",
    client: "shadcn/ui",
    title: "Test entry — design-quality docs site",
    liveUrl: "https://ui.shadcn.com",
    tags: ["TEST"],
  },
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-supabase",
    client: "Supabase",
    title: "Test entry — design-quality landing site",
    liveUrl: "https://supabase.com",
    tags: ["TEST"],
  },
  // TEST: REMOVE BEFORE LAUNCH — modern real estate brokerage
  {
    slug: "test-compass",
    client: "Compass",
    title: "Test entry — modern real estate brokerage",
    liveUrl: "https://www.compass.com",
    tags: ["TEST"],
  },
  // TEST: REMOVE BEFORE LAUNCH — interior design firm (editorial-grade)
  {
    slug: "test-studio-mcgee",
    client: "Studio McGee",
    title: "Test entry — interior design firm",
    liveUrl: "https://studio-mcgee.com",
    tags: ["TEST"],
  },
  // Real client — PredictBase v2 (v2.predictbase.app). Sits at index 7
  // while v1 sits at index 2 → ~150° apart on the 30°-per-item ring,
  // so the two PredictBase cards are visibly spread, not adjacent.
  {
    slug: "predictbase-v2",
    client: "PredictBase",
    title: "Live site (v2)",
    liveUrl: "https://v2.predictbase.app",
    tags: [],
  },
  // TEST: REMOVE BEFORE LAUNCH — modern booking SaaS
  {
    slug: "test-cal",
    client: "Cal.com",
    title: "Test entry — modern booking SaaS",
    liveUrl: "https://cal.com",
    tags: ["TEST"],
  },
  // TEST: REMOVE BEFORE LAUNCH — premium hardware product site
  {
    slug: "test-daylight",
    client: "Daylight Computer",
    title: "Test entry — premium hardware product",
    liveUrl: "https://daylight.computer",
    tags: ["TEST"],
  },
  // TEST: REMOVE BEFORE LAUNCH — boutique interior design firm
  {
    slug: "test-amber-interior",
    client: "Amber Interior Design",
    title: "Test entry — boutique interior design firm",
    liveUrl: "https://amberinteriordesign.com",
    tags: ["TEST"],
  },
  // TEST: REMOVE BEFORE LAUNCH — enterprise SaaS dashboard
  {
    slug: "test-retool",
    client: "Retool",
    title: "Test entry — enterprise SaaS dashboard",
    liveUrl: "https://retool.com",
    tags: ["TEST"],
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
  stats: Stat[];
  mission: typeof mission;
  featuredWork: FeaturedWork[];
  phases: Phase[];
  pricingTiers: PricingTier[];
  closing: typeof closing;
};

export const home: HomeContent = {
  hero,
  stats,
  mission,
  featuredWork,
  phases,
  pricingTiers,
  closing,
};

// Suppress unused type warning for ReactNode if a future field needs it.
export type _RN = ReactNode;
