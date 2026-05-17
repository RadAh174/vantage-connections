/**
 * About page content. Anything marked TODO is intentionally empty until
 * the user provides real data. NEVER invent bios, missions, values, or
 * client names.
 */

export type Value = {
  title: string;
  body: string;
};

export type Client = {
  name: string;
  /** Optional href when populated. */
  href?: string;
};

export type Tool = {
  name: string;
  /** Optional href to the tool's homepage. */
  href?: string;
};

/**
 * Bio. TODO: replace with the real bio once finalized. Empty string →
 * the about page renders an evergreen "focused studio, work introduces
 * us" placeholder. NEVER invent a bio. NEVER write a stand-in.
 */
export const bio = "" as string;

/**
 * Mission. TODO: replace with the real mission statement.
 * Empty string → mission section renders honest empty state.
 * NEVER invent a mission.
 */
export const mission = "" as string;

/**
 * Values. TODO: user fills with real values.
 * Empty array → values section renders honest empty state.
 */
export const values: Value[] = [];

/**
 * Tools we use. These are the studio's stated tech stack — safe to ship
 * as text labels (no logos yet, just typeset names with hover treatment).
 */
export const tools: Tool[] = [
  { name: "Next.js", href: "https://nextjs.org" },
  { name: "Tailwind CSS", href: "https://tailwindcss.com" },
  { name: "Sanity", href: "https://sanity.io" },
  { name: "Vercel", href: "https://vercel.com" },
  { name: "Resend", href: "https://resend.com" },
];

/**
 * Selected clients marquee. TODO: user fills with real client names.
 * Empty array → marquee section is hidden entirely (do not render fakes).
 */
export const clients: Client[] = [];

export type AboutContent = {
  bio: string;
  mission: string;
  values: Value[];
  tools: Tool[];
  clients: Client[];
};

export const about: AboutContent = {
  bio,
  mission,
  values,
  tools,
  clients,
};
