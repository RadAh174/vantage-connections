/**
 * Work page content. Anything marked TODO is intentionally empty until
 * the user provides real data. Components render an empty / honest
 * empty state when arrays are empty. NEVER invent values for these fields.
 */

export type WorkCategory =
  | "Service"
  | "E-commerce"
  | "SaaS"
  | "Agency"
  | "Editorial";

export type WorkFilter = "All" | WorkCategory;

export type ProjectMetadata = {
  client: string;
  year: string;
  role: string;
  scope: string;
  services: string[];
  liveUrl?: string;
};

export type ProjectPullQuote = {
  text: string;
  byline: string;
};

export type FeaturedProject = {
  slug: string;
  client: string;
  title: string;
  /** Short tagline shown beside the card title (1 line). */
  tagline?: string;
  /** Filter tags. Free-form chips shown on the index card. */
  tags: string[];
  /** Used to filter on the index page. */
  category: WorkCategory;
  /**
   * Drives gallery card width. `true` → full-row card (col-span-12).
   * `false` / undefined → standard card placed in the asymmetric
   * [7,5][5,7][6,6] pattern.
   */
  featured?: boolean;
  /** Sticky-sidebar metadata on the case study page. */
  metadata: ProjectMetadata;
  /** Body sections — keep generic shape so writer can fill prose. */
  brief: string;
  approach: string;
  results: string;
  /** Optional client pull quote. NEVER invent. */
  pullQuote?: ProjectPullQuote;
};

/**
 * Filter chips shown on the Work index. These are categories the studio
 * is open to — they are the studio's stated scope, not invented client work.
 * Safe to ship.
 */
export const filters: WorkFilter[] = [
  "All",
  "Service",
  "E-commerce",
  "SaaS",
  "Agency",
  "Editorial",
];

/**
 * Featured projects — 15 real shipped Vantage client engagements plus
 * 4 design-quality reference sites (tagged ["TEST"]) that fill the
 * Chapter 02 "Product surfaces" slots until Vantage's own SaaS / product
 * surfaces are publishable as case studies.
 *
 * Order matters — the home carousel takes the first 12 entries (after
 * filtering Patriot Plumbing, which has Vercel deployment protection
 * that breaks the iframe modal). Real projects are intentionally
 * front-loaded so the carousel is 100% real Vantage work.
 *
 * Real shipped Vantage client projects (15):
 *   - Black Diamond Pavers
 *   - Homes in Santa Barbara
 *   - PredictBase (v1 + v2)
 *   - Milk Bar
 *   - Jenny Smith
 *   - Patriot Plumbing (excluded from carousel)
 *   - Pioneer Engineer
 *   - TORSX
 *   - Cynthia Lopez
 *   - John Igean
 *   - Barbara Van Dyke
 *   - Studio 790
 *   - Pepe Calderin Design
 *   - Jessica Nelson Design
 *
 * Reference sites — tagged ["TEST"] — fill Chapter 02 slots until
 * Vantage's own product-surface work can replace them:
 *   - shadcn/ui, Supabase, Cal.com, Retool
 */
export const featuredProjects: FeaturedProject[] = [
  // Real client — Vantage flagship.
  {
    slug: "black-diamond",
    client: "Black Diamond Pavers",
    title: "Premium hardscaping site, end-to-end",
    tagline: undefined,
    tags: ["Marketing site", "Service"],
    category: "Service",
    featured: true,
    metadata: {
      client: "Black Diamond Pavers",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://vantageconnections-blackdiamond.vercel.app/",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — luxury Santa Barbara real estate brand. BIG anchor of
  // Chapter 01 in the works gallery.
  {
    slug: "homes-in-santa-barbara",
    client: "Homes in Santa Barbara",
    title: "Luxury Santa Barbara real-estate brand",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "Homes in Santa Barbara",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://homesinsantabarbara.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — forecasting product, v1.
  {
    slug: "predictbase",
    client: "PredictBase",
    title: "Forecasting product, v1",
    tagline: undefined,
    tags: ["Product surface", "SaaS"],
    category: "SaaS",
    metadata: {
      client: "PredictBase",
      year: "2025",
      role: "",
      scope: "",
      services: ["Product surface"],
      liveUrl: "https://predictbase.app",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — Milk Bar, DTC bakery & dessert brand. E-commerce slot
  // in Chapter 01.
  {
    slug: "milkbarstore",
    client: "Milk Bar",
    title: "DTC bakery & dessert brand",
    tagline: undefined,
    tags: ["E-commerce", "Marketing site"],
    category: "E-commerce",
    metadata: {
      client: "Milk Bar",
      year: "2026",
      role: "",
      scope: "",
      services: ["E-commerce"],
      liveUrl: "https://milkbarstore.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client.
  {
    slug: "jenny-smith",
    client: "Jenny Smith",
    title: "Personal brand site",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "Jenny Smith",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://jenny-smith.vercel.app/",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — excluded from the home carousel because the
  // `.vercel.app` preview has deployment protection that breaks the
  // iframe modal. Kept in work.ts so the case study page still resolves;
  // home.ts filters this slug out before slicing for the carousel.
  {
    slug: "patriot-plumbing",
    client: "Patriot Plumbing",
    title: "Trade-business marketing site",
    tagline: undefined,
    tags: ["Marketing site", "Service"],
    category: "Service",
    metadata: {
      client: "Patriot Plumbing",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://patriot-plumbing.vercel.app/",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — industrial automation services, Mission Viejo CA.
  {
    slug: "pioneer-engineer",
    client: "Pioneer Engineer",
    title: "Industrial automation services",
    tagline: undefined,
    tags: ["Marketing site", "Service"],
    category: "Service",
    metadata: {
      client: "Pioneer Engineer",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://pioneer-engineer.vercel.app/",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — TORSX real-estate brand. WIDE slot in Chapter 01's
  // 2×2 luxury real-estate grid.
  {
    slug: "torsx",
    client: "TORSX",
    title: "Real-estate brand",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "TORSX",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://torsx.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — Cynthia Lopez personal brand.
  {
    slug: "cynthia-lopez",
    client: "Cynthia Lopez",
    title: "Personal brand site",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "Cynthia Lopez",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://cynthialopez.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — forecasting product, v2.
  {
    slug: "predictbase-v2",
    client: "PredictBase",
    title: "Forecasting product, v2",
    tagline: undefined,
    tags: ["Product surface", "SaaS"],
    category: "SaaS",
    metadata: {
      client: "PredictBase",
      year: "2026",
      role: "",
      scope: "",
      services: ["Product surface"],
      liveUrl: "https://v2.predictbase.app",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — John Igean personal brand.
  {
    slug: "john-igean",
    client: "John Igean",
    title: "Personal brand site",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "John Igean",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://johnigean.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — Barbara Van Dyke personal brand.
  {
    slug: "barbara-vandyke",
    client: "Barbara Van Dyke",
    title: "Personal brand site",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "Barbara Van Dyke",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://barbaravandyke.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — Studio 790 design studio.
  {
    slug: "studio-790",
    client: "Studio 790",
    title: "Design studio portfolio",
    tagline: undefined,
    tags: ["Agency", "Marketing site"],
    category: "Agency",
    metadata: {
      client: "Studio 790",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://studio790.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — Pepe Calderin Design, interior designer portfolio.
  {
    slug: "pepe-calderin-design",
    client: "Pepe Calderin Design",
    title: "Interior designer portfolio",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "Pepe Calderin Design",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://pepecalderindesign.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // Real client — Jessica Nelson Design, interior designer portfolio.
  {
    slug: "jessica-nelson-design",
    client: "Jessica Nelson Design",
    title: "Interior designer portfolio",
    tagline: undefined,
    tags: ["Marketing site", "Editorial"],
    category: "Editorial",
    metadata: {
      client: "Jessica Nelson Design",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://jessicanelsondesign.com",
    },
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // TEST: design-quality reference site — fills a Chapter 02 SaaS slot.
  {
    slug: "shadcn",
    client: "shadcn/ui",
    title: "Component library + docs",
    tagline: undefined,
    tags: ["TEST"],
    category: "SaaS",
    metadata: {
      client: "shadcn/ui",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://ui.shadcn.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: design-quality reference site — fills a Chapter 02 SaaS slot.
  {
    slug: "supabase",
    client: "Supabase",
    title: "Modern marketing site",
    tagline: undefined,
    tags: ["TEST"],
    category: "SaaS",
    metadata: {
      client: "Supabase",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://supabase.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: design-quality reference site — fills a Chapter 02 SaaS slot.
  {
    slug: "cal",
    client: "Cal.com",
    title: "Modern booking SaaS",
    tagline: undefined,
    tags: ["TEST"],
    category: "SaaS",
    metadata: {
      client: "Cal.com",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://cal.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: design-quality reference site — fills a Chapter 02 SaaS slot.
  {
    slug: "retool",
    client: "Retool",
    title: "Enterprise SaaS dashboard",
    tagline: undefined,
    tags: ["TEST"],
    category: "SaaS",
    metadata: {
      client: "Retool",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://retool.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
];

export type WorkContent = {
  filters: WorkFilter[];
  featuredProjects: FeaturedProject[];
};

export const work: WorkContent = {
  filters,
  featuredProjects,
};
