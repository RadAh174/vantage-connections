/**
 * Pricing page content. Anything marked TODO is intentionally empty until
 * the user provides real numbers. NEVER invent prices, ranges, or features
 * that aren't actually offered.
 */

export type PricingTier = {
  name: string;
  /** Short tagline under the name. */
  tagline: string;
  /** Range or "$X+" — keep honest scope. */
  range: string;
  /** Who this tier is for, 1 short sentence. */
  bestFor: string;
  /** What the tier includes. Mono labels with check icons in UI. */
  included: string[];
  /** Optional list of explicit exclusions. */
  notIncluded?: string[];
  ctaLabel: string;
  ctaHref?: string;
  /** Featured tier renders with a gold-gradient ring (Forest+Gold palette). */
  highlighted?: boolean;
};

export type PricingFAQ = {
  q: string;
  a: string;
};

/**
 * TODO_PRICING_TIERS: user fills with the real Starter / Standard / Bespoke
 * configurations. Tier names ARE real (the studio offers these three);
 * the numbers are not yet finalized.
 *
 * Empty array → pricing page renders an honest fallback message with a
 * contact CTA. NEVER ship invented numbers.
 */
export const pricingTiers: PricingTier[] = [];

/**
 * TODO_PRICING_FAQS: user fills with real FAQ content.
 * Empty array → FAQ section renders an honest "FAQ coming with launch" line.
 */
export const faqs: PricingFAQ[] = [];

export type PricingContent = {
  pricingTiers: PricingTier[];
  faqs: PricingFAQ[];
};

export const pricing: PricingContent = {
  pricingTiers,
  faqs,
};
