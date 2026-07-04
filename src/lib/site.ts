/**
 * Single source of truth for site-wide SEO values. The URL resolves from an
 * env var so production (and the Vercel domain) can override the brand default
 * without touching code: set NEXT_PUBLIC_SITE_URL to the live origin.
 */
function resolveSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL;
  if (fromEnv) return fromEnv.replace(/\/+$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return "https://vantageconnections.com";
}

export const SITE_URL = resolveSiteUrl();

export const siteConfig = {
  name: "Vantage Connections",
  shortName: "Vantage",
  url: SITE_URL,
  title: "Vantage Connections · The digital operator for your Shopify store",
  titleTemplate: "%s · Vantage Connections",
  tagline: "Your store's digital operator",
  description:
    "Vantage Connections is an autonomous digital employee for Shopify stores. It builds and maintains your storefront, runs brand-aware ad campaigns, prices for the market, and generates product imagery, so you can focus on your product.",
  // Concise, shareable one-liner for social cards.
  ogDescription:
    "An autonomous digital employee for Shopify stores. You make the product. Vantage runs the rest.",
  locale: "en_US",
  // Brand palette (Vantage — green + gold) — used for theme-color, manifest and
  // generated images. `plum`/`accent`/`rose` are the 3 gradient stops (deep→mid→
  // light forest-green); `cta` is forest (primary actions); `sage` is the always-
  // on operator dot; `peach` here is the GOLD highlight/kicker; `cream` is ivory.
  colors: {
    paper: "#f1f4e8",
    ink: "#191c12",
    accent: "#2f6a43",
    cta: "#1a4d33",
    sage: "#3f9d6b",
    peach: "#e6c063",
    cream: "#f1f4e8",
    plum: "#10281b",
    rose: "#276b48",
  },
  // X/Twitter handle (update when the real account exists).
  twitterHandle: "@vantageconnections",
  keywords: [
    "Shopify automation",
    "AI ecommerce agent",
    "digital employee",
    "autonomous storefront",
    "ecommerce marketing automation",
    "Shopify SEO",
    "AI store manager",
    "Shopify AI agent",
    "ecommerce operations automation",
    "AI product photography",
    "automated ad campaigns",
    "Shopify SMB tools",
  ],
} as const;

export const OG_GRADIENT = `linear-gradient(135deg, ${siteConfig.colors.plum} 0%, ${siteConfig.colors.accent} 55%, ${siteConfig.colors.rose} 100%)`;
