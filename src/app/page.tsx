import { DossierNav } from "@/components/dossier/DossierNav";
import { Masthead } from "@/components/dossier/Masthead";
import { Objective } from "@/components/dossier/Objective";
import { Competencies } from "@/components/dossier/Competencies";
import { Roles } from "@/components/dossier/Roles";
import { Supervision } from "@/components/dossier/Supervision";
import { Compensation } from "@/components/dossier/Compensation";
import { Interview } from "@/components/dossier/Interview";
import { Offer } from "@/components/dossier/Offer";
import { DossierFooter } from "@/components/dossier/DossierFooter";
import { compensation, competencies, interview } from "@/lib/content";
import { SITE_URL, siteConfig } from "@/lib/site";

// Real capability list (no invented features) for SoftwareApplication.featureList.
const featureList = competencies.items.map((f) => f.skill);

// Single free-during-beta offer for the SoftwareApplication schema.
const offers = [
  {
    "@type": "Offer",
    name: compensation.planName,
    price: "0",
    priceCurrency: "USD",
    priceValidUntil: compensation.offerDeadline,
    availability: "https://schema.org/InStock",
    category: "subscription",
    url: `${SITE_URL}/#compensation`,
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
      mainEntity: interview.qs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

/** A perforated tear-line between the pages of the dossier. */
function Perforation() {
  return (
    <div aria-hidden="true" className="px-5 sm:px-8 md:px-14">
      <div className="perf-rule" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="dossier-desk min-h-screen font-archivo text-dink">
        <DossierNav />
        <main className="mx-auto max-w-[76rem] px-3 pb-16 pt-5 sm:px-6 md:pt-8">
          {/* the sheet */}
          <div className="dossier-sheet relative">
            {/* binder holes (desktop) */}
            <div
              aria-hidden="true"
              className="punch-holes absolute bottom-4 left-2.5 top-4 hidden w-5 md:block"
            />
            {/* content — padded clear of the holes on desktop */}
            <div className="md:pl-6">
              <Masthead />
              <Perforation />
              <Objective />
              <Perforation />
              <Competencies />
              <Perforation />
              <Roles />
              <Perforation />
              <Supervision />
              <Perforation />
              <Compensation />
              <Perforation />
              <Interview />
              <Perforation />
              <Offer />
              <DossierFooter />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
