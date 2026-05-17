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
 * All entries are real client work. brief / approach / results stay
 * as empty strings with TODO markers until the user supplies copy.
 * Empty strings render as visible blank paragraphs in the case-study
 * route — that is intentional and surfaces the gap rather than
 * masking it with filler.
 */
// The work-page renders projects in chapter groups (see
// app/work/page.tsx CHAPTERS) — each chapter looks projects up by
// slug, so the order of this array no longer matters for layout.
// Real shipped client projects only:
//   - Black Diamond Pavers
//   - PredictBase (v1, v2)
//   - Pacific Family Dental
//   - Jenny Smith
//   - Patriot Plumbing
//   - Pioneer Engineer
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
];

export type WorkContent = {
  filters: WorkFilter[];
  featuredProjects: FeaturedProject[];
};

export const work: WorkContent = {
  filters,
  featuredProjects,
};
