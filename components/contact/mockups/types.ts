/**
 * Project type → mockup style mapping.
 *
 * Mockups are *layout illustrations*, not pretend product catalogs.
 * Anywhere a real product/price/testimonial would go, we use a clearly
 * placeholder string ("—— ——", em-dashes, generic structural labels)
 * so the mockup reads as wireframe-with-real-layout — never as
 * fabricated content.
 */
export type ProjectType = "saas" | "luxury" | "marketing" | "portfolio";

export type MockupProps = {
  /**
   * The user's typed company name. Caller should pass "Your Brand"
   * (or another obvious placeholder) when the input is empty — that
   * way each mockup never has to invent a name itself.
   */
  companyName: string;
};

/**
 * Hostname suffix paired with each style — matches the URL bar in the
 * browser chrome above each mockup so the device feels like it changed
 * sites (not just swapped a hero block).
 */
export const HOST_FOR: Record<ProjectType, (slug: string) => string> = {
  saas: (slug) => `app.${slug}.com`,
  luxury: (slug) => `${slug}.com`,
  marketing: (slug) => `${slug}.com`,
  portfolio: (slug) => `${slug}.studio`,
};
