/**
 * Blog content. Anything marked TODO is intentionally empty until the user
 * provides real essays. NEVER invent posts, authors, dates, or excerpts.
 */

export type BlogTag =
  | "Craft"
  | "Process"
  | "Performance"
  | "Type"
  | "Notes";

/**
 * BlogPost.body holds the post's prose. v1 takes a plain string (treat as
 * paragraphs separated by blank lines). When the team is ready for richer
 * formatting, swap to a structured ReactNode or MDX import.
 */
export type BlogPost = {
  slug: string;
  title: string;
  /** Excerpt shown on the index card and in metadata description. */
  excerpt: string;
  /** ISO date string e.g. "2026-05-14". */
  date: string;
  /** Estimated read time, in minutes. */
  readMinutes: number;
  tag: BlogTag;
  /** Plain prose body. Paragraphs separated by blank lines. */
  body: string;
};

/**
 * Tag filter chips. These are tag categories the blog is open to —
 * stated scope, not invented posts. Safe to ship.
 */
export const tags: BlogTag[] = [
  "Craft",
  "Process",
  "Performance",
  "Type",
  "Notes",
];

/**
 * TODO_BLOG_POSTS: user fills with real published essays.
 * Empty array → blog index renders an honest empty state, [slug] route 404s.
 *
 * Each post must have a real author (when implemented) and real prose.
 * NEVER invent dummy posts, lorem excerpts, or fake author names.
 */
export const posts: BlogPost[] = [];

export type BlogContent = {
  tags: BlogTag[];
  posts: BlogPost[];
};

export const blog: BlogContent = {
  tags,
  posts,
};
