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
 * Real shipped projects only — never invent prose, quotes, or metrics.
 *
 * Black Diamond Pavers is live; brief / approach / results stay empty
 * strings with TODO markers below until the user supplies copy. Empty
 * strings render as visible blank paragraphs in the case-study route — that
 * is intentional and surfaces the gap rather than masking it with filler.
 */
export const featuredProjects: FeaturedProject[] = [
  {
    slug: "black-diamond",
    client: "Black Diamond Pavers",
    title: "Premium hardscaping site, end-to-end",
    tagline: undefined,
    tags: ["Marketing site", "Service"],
    category: "Service",
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
];

export type WorkContent = {
  filters: WorkFilter[];
  featuredProjects: FeaturedProject[];
};

export const work: WorkContent = {
  filters,
  featuredProjects,
};
