/**
 * Pricing page content. Single source of truth — anything user-facing
 * about pricing reads from here.
 *
 * Vantage Connections runs a managed-monthly model: design + build +
 * host + ongoing care under one fee. Each tier includes premium support.
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
  /**
   * Visual accent — drives the card's ring/border style. All three tiers
   * carry a visible ring so the row reads as a deliberate set rather
   * than "one highlighted card and two empty boxes".
   *
   *   - "forest"  → subtle forest-tinted hairline (entry tier)
   *   - "gold"    → bright gold ring (recommended tier)
   *   - "premium" → gold ring + soft outer glow (elite tier)
   */
  accent?: "forest" | "gold" | "premium";
  /** Featured tier — drives the primary-variant CTA button on the card. */
  highlighted?: boolean;
};

export type PricingFAQ = {
  q: string;
  a: string;
};

export const pricingTiers: PricingTier[] = [
  {
    name: "Basic",
    tagline: "A clean, luxury portfolio site to share with clients.",
    range: "Contact for pricing",
    bestFor:
      "Solo professionals, realtors, consultants, and personal brands who need a credible presence — not a storefront.",
    included: [
      "Bespoke design",
      "Up to 5 pages",
      "Hosting & SSL",
      "On-page SEO foundations",
      "Mobile-first responsive",
      "Quarterly content edits",
      "Standard support",
    ],
    ctaLabel: "Get a quote",
    ctaHref: "/contact",
    accent: "forest",
  },
  {
    name: "Growth",
    tagline: "For businesses scaling up and bringing product to clients.",
    range: "Contact for pricing",
    bestFor:
      "SMBs ready to sell, list inventory, capture leads, and grow — with a site that keeps up.",
    included: [
      "Everything in Basic",
      "Up to 15 pages",
      "Ecommerce or booking module",
      "Lead-capture & CRM wiring",
      "Analytics & conversion tracking",
      "Monthly content edits",
      "Quarterly performance review",
      "Premium support",
    ],
    ctaLabel: "Get a quote",
    ctaHref: "/contact",
    accent: "gold",
    highlighted: true,
  },
  {
    name: "Premium",
    tagline: "Large, technical websites with dedicated dev team.",
    range: "Contact for pricing",
    bestFor:
      "Established businesses running complex backends, integrations, or content operations that need real engineering capacity.",
    included: [
      "Everything in Growth",
      "Unlimited pages",
      "Custom backend & integrations",
      "Dedicated dev team",
      "Advanced features & A/B testing",
      "Continuous deployment",
      "Marketing & SEO management",
      "Priority response SLAs",
      "Quarterly strategy sessions",
      "Premium support",
    ],
    ctaLabel: "Talk to us",
    ctaHref: "/contact",
    accent: "premium",
  },
];

export const faqs: PricingFAQ[] = [
  {
    q: "Why monthly, not a one-time build?",
    a: "Websites aren't furniture — they need ongoing care, updates, and iteration to keep performing. The monthly model covers design, build, hosting, and continuous improvement so you're never paying twice for the same thing.",
  },
  {
    q: "What's included in every tier?",
    a: "Bespoke design (no templates), hosting on Vercel's global edge network, SSL, on-page SEO foundations, mobile-first responsive build, and premium support. The higher tiers add scope, content cadence, and engineering capacity.",
  },
  {
    q: "How long until my site launches?",
    a: "Standard ship cadence is four weeks from kickoff to launch on Basic and Growth. Premium projects typically take six to ten weeks depending on backend scope. Every project has a written ship date before we start.",
  },
  {
    q: "Do I own the site?",
    a: "Yes. You own the design, the content, and the domain. The codebase is licensed for your use throughout the engagement and transferable on request if you ever decide to move on.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. There's no annual contract. You can pause or end the engagement with thirty days' notice. Your site stays up; we hand over the keys.",
  },
  {
    q: "Can I switch tiers later?",
    a: "Yes. Sites grow. Move up to Growth or Premium when your business does — we'll re-scope the engagement and migrate the work without a rebuild.",
  },
  {
    q: "Where are you based, and do you work with clients outside California?",
    a: "Headquartered in Irvine, California. We serve clients across Newport Beach, Los Angeles, Austin, Miami, and Orlando, and work remotely with brands nationwide.",
  },
  {
    q: "Do you write the content too?",
    a: "We help shape it. Each tier includes copy direction and editing; full ground-up copywriting can be added as a scoped extra when the brand voice isn't yet established.",
  },
];

export type PricingContent = {
  pricingTiers: PricingTier[];
  faqs: PricingFAQ[];
};

export const pricing: PricingContent = {
  pricingTiers,
  faqs,
};
