import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/sections/Hero";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { OttoAtWork } from "@/components/sections/OttoAtWork";
import { Positioning } from "@/components/sections/Positioning";
import { CapabilityCards } from "@/components/sections/CapabilityCards";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { capabilityCards, faqs, featureRows, pricing } from "@/lib/content";
import { SITE_URL, siteConfig } from "@/lib/site";

// Real capability list (no invented features) for SoftwareApplication.featureList.
const featureList = [
  ...featureRows.map((f) => f.title.replace(/\.$/, "")),
  ...capabilityCards.map((c) => c.title),
];

// Single free-during-beta offer for the SoftwareApplication schema.
const offers = [
  {
    "@type": "Offer",
    name: pricing.plan.name,
    price: "0",
    priceCurrency: "USD",
    priceValidUntil: pricing.offerDeadline,
    availability: "https://schema.org/InStock",
    category: "subscription",
    url: `${SITE_URL}/#pricing`,
  },
];

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      url: SITE_URL,
      description: siteConfig.ogDescription,
      slogan: siteConfig.tagline,
      areaServed: "Worldwide",
      knowsAbout: [
        "Shopify",
        "ecommerce automation",
        "AI agents",
        "search engine optimization",
        "generative engine optimization",
        "ecommerce advertising",
        "product photography",
        "dynamic pricing",
        "direct-to-consumer brands",
      ],
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon.svg`,
      },
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: siteConfig.name,
      url: SITE_URL,
      description: siteConfig.description,
      inLanguage: "en-US",
      publisher: { "@id": ORG_ID },
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: siteConfig.name,
      url: SITE_URL,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "AI agent for Shopify store operations",
      operatingSystem: "Web",
      description: siteConfig.description,
      image: `${SITE_URL}/opengraph-image`,
      featureList,
      audience: {
        "@type": "Audience",
        audienceType:
          "Shopify store owners and direct-to-consumer founders of physical-product brands",
      },
      publisher: { "@id": ORG_ID },
      offers,
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      {/* Conversion core (hero -> proof -> ask), then depth for the
          not-yet-convinced. The footer band is the final ask. */}
      <main>
        <Hero />
        <TrustStrip />
        <OttoAtWork />
        <Pricing />
        <Positioning />
        <CapabilityCards />
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
