/**
 * Project type → mockup style mapping.
 *
 * Mockups are *layout illustrations*, not pretend product catalogs.
 * Anywhere a real product/price/testimonial would go, we use a clearly
 * placeholder string ("Item 01", "$ — — .—", em-dashes) so the mockup
 * reads as wireframe-with-real-layout — never as fabricated content.
 */
export type ProjectType = "marketing" | "ecommerce" | "saas" | "brand";

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
  marketing: (slug) => `${slug}.com`,
  ecommerce: (slug) => `shop.${slug}.com`,
  saas: (slug) => `app.${slug}.com`,
  brand: (slug) => `${slug}.studio`,
};
