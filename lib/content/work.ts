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
 * Real shipped projects + carousel test entries.
 *
 * Black Diamond Pavers and PredictBase (v1, v2) are real client work
 * — brief / approach / results stay empty strings with TODO markers
 * until the user supplies copy. Empty strings render as visible blank
 * paragraphs in the case-study route — that is intentional and surfaces
 * the gap rather than masking it with filler.
 *
 * TEST_GALLERY_ENTRIES: every entry tagged "TEST" below is a public
 * design-quality reference site mirrored from the home carousel — they
 * exercise the asymmetric grid layout and are NOT real Vantage client
 * work. Each is marked `// TEST: REMOVE BEFORE LAUNCH`. Strip them
 * before any public push.
 */
// The work-page renders projects in chapter groups (see
// app/work/page.tsx CHAPTERS) — each chapter looks projects up by
// slug, so the order of this array no longer matters for layout.
// Real shipped client projects:
//   - Black Diamond Pavers
//   - PredictBase (v1, v2)
//   - Pacific Family Dental
//   - Jenny Smith
//   - Patriot Plumbing
//   - Pioneer Engineer
// Test entries (`slug: "test-..."`, `tags: ["TEST"]`) are public
// reference sites mirrored from the home carousel — strip them
// before any public push.
export const featuredProjects: FeaturedProject[] = [
  // Real client.
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
      // TODO_BLACKDIAMOND_META: user to confirm year / role / scope.
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://vantageconnections-blackdiamond.vercel.app/",
    },
    // TODO_BLACKDIAMOND_COPY: user to supply brief / approach / results prose.
    brief: "",
    approach: "",
    results: "",
    pullQuote: undefined,
  },
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-shadcn",
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
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-supabase",
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
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-compass",
    client: "Compass",
    title: "Modern real-estate brokerage",
    tagline: undefined,
    tags: ["TEST"],
    category: "Service",
    metadata: {
      client: "Compass",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://www.compass.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-studio-mcgee",
    client: "Studio McGee",
    title: "Interior-design portfolio",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Studio McGee",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://studio-mcgee.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // Real client.
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
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-cal",
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
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-daylight",
    client: "Daylight Computer",
    title: "Premium hardware product",
    tagline: undefined,
    tags: ["TEST"],
    category: "E-commerce",
    metadata: {
      client: "Daylight Computer",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://daylight.computer",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-amber-interior",
    client: "Amber Interior Design",
    title: "Boutique interior-design firm",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Amber Interior Design",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://amberinteriordesign.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // Real client.
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
  // TEST: REMOVE BEFORE LAUNCH
  {
    slug: "test-retool",
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
  // Real client.
  {
    slug: "pacific-family-dental",
    client: "Pacific Family Dental",
    title: "Family-practice dental site",
    tagline: undefined,
    tags: ["Marketing site", "Service"],
    category: "Service",
    metadata: {
      client: "Pacific Family Dental",
      year: "2026",
      role: "",
      scope: "",
      services: ["Marketing site"],
      liveUrl: "https://pacific-family-dental.vercel.app/",
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
    tags: ["Marketing site", "Service"],
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
  // Real client.
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
  // TEST: REMOVE BEFORE LAUNCH — Austin luxury real estate
  // (Kuper Sotheby's, $1B+ sales). Replaces the earlier juliette-hohnen
  // entry as the BIG anchor in chapter 1.
  {
    slug: "test-kumara-wilcoxon",
    client: "Kumara Wilcoxon",
    title: "Austin luxury real-estate brand",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Kumara Wilcoxon",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://kumarawilcoxon.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: REMOVE BEFORE LAUNCH — LA luxury real estate
  // (Christie's International, #1 luxury agent in LA).
  {
    slug: "test-aaron-kirman",
    client: "Aaron Kirman",
    title: "LA luxury real-estate brand",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Aaron Kirman",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://aaronkirman.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: REMOVE BEFORE LAUNCH — Aspen luxury real estate
  // (Douglas Elliman, $5B+ team sales).
  {
    slug: "test-saslove-warwick",
    client: "Saslove & Warwick",
    title: "Aspen luxury real-estate brand",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Saslove & Warwick",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://saslovewarwick.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: REMOVE BEFORE LAUNCH — Napa/Sonoma wine-country luxury
  // (Sotheby's International, $3B+ sales).
  {
    slug: "test-ginger-martin",
    client: "Ginger Martin + Co",
    title: "Napa Valley luxury real-estate brand",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Ginger Martin + Co",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://gingermartin.com",
    },
    brief: "",
    approach: "",
    results: "",
  },
  // TEST: REMOVE BEFORE LAUNCH — NYC/LA/Miami luxury real estate
  // (Douglas Elliman, $10B+ in last decade).
  {
    slug: "test-eklund-gomes",
    client: "Eklund | Gomes",
    title: "NYC luxury real-estate brand",
    tagline: undefined,
    tags: ["TEST"],
    category: "Editorial",
    metadata: {
      client: "Eklund | Gomes",
      year: "2025",
      role: "",
      scope: "",
      services: [],
      liveUrl: "https://eklundgomes.com",
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
