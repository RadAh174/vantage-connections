import { site } from "@/lib/content/site";

const SITE_URL = "https://vantageconnections.com";

/**
 * Generic JSON-LD injector. Use for one-off schemas (BreadcrumbList,
 * BlogPosting, etc.). Renders a single <script type="application/ld+json">
 * tag with the provided data.
 *
 * Per Google + schema.org guidance: ship JSON-LD in <head> for the root
 * graph, and inline anywhere else for per-page schemas. Next.js App Router
 * allows <script> tags anywhere in the tree — they get hoisted at build.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe here — no untrusted input is included.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * Single @graph linking Organization, LocalBusiness, WebSite, and one
 * Person node per founder. @id cross-references keep this a connected
 * entity graph rather than 6 disjointed schemas — easier for Google's
 * Knowledge Graph and downstream LLMs to ingest as a single entity.
 *
 * Update via lib/content/site.ts (founders, serviceAreas, phone, email,
 * city). Never edit this component for content changes.
 */
export function OrganizationSchemaGraph() {
  const orgId = `${SITE_URL}#organization`;
  const placeId = `${SITE_URL}#localbusiness`;
  const siteId = `${SITE_URL}#website`;

  const founderNodes = site.founders.map((f) => ({
    "@type": "Person",
    "@id": `${SITE_URL}#person-${slugify(f.name)}`,
    name: f.name,
    jobTitle: f.role,
    worksFor: { "@id": orgId },
  }));

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      // Top-level Organization
      {
        "@type": "Organization",
        "@id": orgId,
        name: site.brand,
        legalName: site.legalName,
        url: SITE_URL,
        email: site.email,
        telephone: site.phone,
        description: site.description,
        slogan: site.tagline,
        founder: site.founders.map((f) => ({
          "@id": `${SITE_URL}#person-${slugify(f.name)}`,
        })),
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.country,
        },
        areaServed: site.serviceAreas.map((a) => ({
          "@type": "City",
          name: a.city,
          address: {
            "@type": "PostalAddress",
            addressLocality: a.city,
            addressRegion: a.region,
            addressCountry: site.country,
          },
        })),
        knowsAbout: [
          "Web design",
          "Web development",
          "Luxury real estate web design",
          "Real estate portfolio websites",
          "Premium ecommerce design",
          "Artisan brand websites",
          "Next.js development",
          "Tailwind CSS",
          "Sanity CMS",
          "Brand identity",
          "On-page SEO",
          "Generative engine optimization",
        ],
      },

      // LocalBusiness — separate node so Google reads it as a local entity
      {
        "@type": ["LocalBusiness", "ProfessionalService"],
        "@id": placeId,
        name: site.brand,
        url: SITE_URL,
        email: site.email,
        telephone: site.phone,
        image: `${SITE_URL}/og-default.png`,
        priceRange: "$$$",
        address: {
          "@type": "PostalAddress",
          addressLocality: site.city,
          addressRegion: site.region,
          addressCountry: site.country,
        },
        areaServed: site.serviceAreas.map((a) => `${a.city}, ${a.region}`),
        parentOrganization: { "@id": orgId },
      },

      // WebSite — enables sitelinks search box once Google validates it
      {
        "@type": "WebSite",
        "@id": siteId,
        url: SITE_URL,
        name: site.brand,
        description: site.description,
        publisher: { "@id": orgId },
        inLanguage: "en-US",
      },

      // One Person node per founder
      ...founderNodes,
    ],
  };

  return <JsonLd data={data} />;
}

/**
 * FAQ schema. Pass the pricing/about page's FAQ list and the schema is
 * generated automatically. Renders inline in the page that owns the FAQ.
 */
export function FAQSchema({ items }: { items: { q: string; a: string }[] }) {
  if (items.length === 0) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
  return <JsonLd data={data} />;
}

/**
 * BreadcrumbList. Pass an ordered array of { name, url } from root → current page.
 */
export function BreadcrumbSchema({
  items,
}: {
  items: { name: string; url: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
  return <JsonLd data={data} />;
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
