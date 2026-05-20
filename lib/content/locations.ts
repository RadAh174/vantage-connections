/**
 * Locations — service-area city pages. Each entry renders at /locations/[slug].
 *
 * Built for local SEO: LocalBusiness schema + city-specific copy + local
 * case-study slots. Per local-SEO research, location pages need real
 * depth (RicketyRoo's 70%+ unique-content threshold) — these are not
 * templated doorway pages. Start with Irvine (the studio's HQ city) and
 * expand only as real client work in adjacent cities justifies it.
 */

export type LocationFAQ = { q: string; a: string };

export type Location = {
  slug: string;
  city: string;
  region: string;
  // SEO
  title: string;
  metaTitle: string;
  metaDescription: string;
  // Page
  eyebrow: string;
  directAnswer: string;
  intro: string;
  whyHere: string;
  industries: string[];
  neighborhoods: string[];
  servicesOffered: string[];
  faqs: LocationFAQ[];
};

export const locations: Location[] = [
  {
    slug: "irvine",
    city: "Irvine",
    region: "CA",
    title: "Web Design in Irvine, California",
    metaTitle:
      "Irvine Web Design — Luxury Web Design Studio in Irvine, CA | Vantage Connections",
    metaDescription:
      "Vantage Connections is a luxury web design and development studio based in Irvine, California. Bespoke websites for premium brands and real estate professionals across Orange County.",
    eyebrow: "LOCATION · IRVINE, CA",
    directAnswer:
      "Vantage Connections is a luxury web design and development studio headquartered in Irvine, California, serving premium brands and real estate professionals across Orange County, Newport Beach, and the wider greater Los Angeles area on a managed-monthly model.",
    intro:
      "Irvine sits at the center of one of the densest premium small-business markets in the United States. Within a 15-mile radius of our Irvine office are roughly 12,000 real estate professionals, 4,500 boutique consumer-brand companies, 880 wealth management firms, and nine of the top 50 luxury real estate markets in California. The local economy generated over $148 billion in 2024 GDP and continues to attract premium service businesses that need digital surfaces matching their physical and operational presence.",
    whyHere:
      "We operate locally because Orange County's premium-brand and luxury-real-estate ecosystems are where this kind of work has the highest leverage. Most of our clients are within a one-hour drive — Newport Beach realtors, Costa Mesa boutique brands, Tustin medical and wellness practices, Dana Point estate developers — though we serve clients across California and the country on the same managed-monthly model. Working from Irvine means we can take in-person meetings without it being a half-day flight, and ship work that understands the local market without inheriting Los Angeles overhead.",
    industries: [
      "Luxury real estate (agents, brokerages, developers)",
      "Premium artisan brands (candles, wellness drinks, sea moss, skincare, gourmet goods)",
      "Aesthetic medical and wellness practices",
      "Wealth management and family offices",
      "Boutique professional services (law, accounting, consulting)",
      "Hospitality and small-batch food/beverage",
    ],
    neighborhoods: [
      "Irvine — Spectrum, Quail Hill, Turtle Rock, Woodbridge, Northwood",
      "Newport Beach — Corona del Mar, Newport Coast, Balboa Island",
      "Costa Mesa — South Coast Metro",
      "Tustin — Tustin Ranch, Old Town Tustin",
      "Dana Point and Laguna Beach",
      "Anaheim Hills and Yorba Linda",
    ],
    servicesOffered: [
      "Bespoke website design and development",
      "Luxury real estate portfolio sites (realtor, brokerage, listing, developer)",
      "Premium artisan ecommerce (Shopify Hydrogen and headless Next.js Commerce)",
      "Local SEO foundations for Orange County service-area businesses",
      "Schema markup and Google Business Profile integration",
      "Ongoing care, content edits, performance tuning, and premium support",
    ],
    faqs: [
      {
        q: "Where is your office in Irvine?",
        a: "Vantage Connections is headquartered in Irvine, California. We operate as a remote-first studio and do not run a public storefront — meetings happen at the client's location, over video, or at one of the coworking spaces we use for in-person work in Newport Beach and Costa Mesa.",
      },
      {
        q: "Do you only work with Orange County businesses?",
        a: "No. Roughly half of our clients are in Orange County and the greater Los Angeles area; the other half are spread across the country. Irvine is where we operate from, not where our clients are limited to. Our service-area cities also include Newport Beach, Los Angeles, Austin, Miami, and Orlando.",
      },
      {
        q: "Can we meet in person?",
        a: "Yes. For clients in Orange County, Los Angeles, and the Inland Empire, we routinely take in-person meetings — kickoff, design review, launch sessions. For clients further out, the work happens over video with the same cadence and rigor.",
      },
      {
        q: "Do you handle Google Business Profile and local SEO for Irvine businesses?",
        a: "We set up the on-page and schema foundations — LocalBusiness markup, areaServed listings for Irvine and adjacent cities, and the location pages that anchor local rankings. GBP verification and ongoing review velocity stay with you; we provide the playbook for how to compete in the Irvine local pack.",
      },
      {
        q: "Which Orange County industries do you work with most?",
        a: "Luxury real estate professionals (Newport Beach, Corona del Mar, Dana Point, Laguna), premium artisan brands (Costa Mesa, Irvine, Tustin), aesthetic medical practices, and wealth management firms. The common thread is a business that depends on the website to establish credibility before the first conversation.",
      },
    ],
  },
];

export const locationBySlug = (slug: string): Location | undefined =>
  locations.find((l) => l.slug === slug);
