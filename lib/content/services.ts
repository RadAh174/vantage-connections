/**
 * Services taxonomy + content. Hub-and-spoke topical authority structure:
 * one top pillar (luxury-web-design) → two sub-pillars (luxury real estate,
 * premium artisan ecommerce) → four spokes per vertical. Every page is
 * written for both Google SERPs and LLM citation (Princeton GEO levers:
 * direct one-sentence answer, named statistics, outbound source citations,
 * named entities, FAQ structure).
 */

export type ServiceStat = {
  figure: string;
  label: string;
  source?: string;
  sourceHref?: string;
};

export type ServiceFAQ = {
  q: string;
  a: string;
};

export type Service = {
  slug: string;
  category: "pillar" | "sub-pillar" | "spoke";
  parentSlug?: string;
  vertical: "real-estate" | "ecommerce" | "both";

  // SEO
  title: string;
  metaTitle: string;
  metaDescription: string;

  // Hero
  eyebrow: string;
  directAnswer: string;

  // Body
  intro: string;
  includes: string[];
  whoFor: string;
  outcomes: ServiceStat[];
  process: string[];
  faqs: ServiceFAQ[];

  // Cross-linking
  relatedSlugs: string[];
};

export const services: Service[] = [
  // ============================================================
  // TOP PILLAR — Luxury Web Design
  // ============================================================
  {
    slug: "luxury-web-design",
    category: "pillar",
    vertical: "both",
    title: "Luxury Web Design",
    metaTitle: "Luxury Web Design Studio — Bespoke Sites by Vantage Connections",
    metaDescription:
      "Luxury web design and development for premium brands and real estate professionals. Bespoke design, hosting, and care under one monthly fee. Based in Irvine, CA.",
    eyebrow: "LUXURY WEB DESIGN",
    directAnswer:
      "Luxury web design is bespoke, hand-built website design for premium brands and high-end professionals — where every interaction signals the same quality the brand delivers in person. Vantage Connections builds these sites on a managed-monthly model: design, build, host, and care under one fee.",
    intro:
      "A luxury website is not a fancier template. It is a quiet, considered, technically uncompromising digital surface that performs like the brand it represents. The fonts breathe, the photography holds, the page loads in under two seconds, and nothing on the screen feels rented. Buyers of luxury notice these things first and decide quickly. Stanford's Web Credibility research found that 75 percent of consumers judge a business's credibility based on website design alone — and in the luxury segment, that number trends higher.",
    includes: [
      "Bespoke visual identity translated into a working site",
      "Original typography pairings, custom photography direction, no stock galleries",
      "Sub-2-second LCP on cellular networks (March 2026 Google threshold)",
      "Hosting on Vercel's global edge network with automatic SSL",
      "Full on-page SEO + Organization, ProfessionalService, LocalBusiness, and FAQPage schema",
      "Mobile-first responsive build with motion designed for the device, not retrofitted",
      "Ongoing care: monthly content edits, quarterly performance review",
      "Premium support across the engagement",
    ],
    whoFor:
      "Founders, professionals, and brands whose audience expects a website to match the in-person experience. If the wrong site costs you the trust the meeting earned, you need this tier of work. Most of our clients sit in two verticals: luxury real estate (realtors, brokerages, developers, listings) and premium artisan brands (candles, wellness drinks, sea moss, skincare, gourmet goods).",
    outcomes: [
      {
        figure: "75%",
        label: "of consumers judge credibility from website design alone",
        source: "Stanford Web Credibility Research",
        sourceHref: "https://credibility.stanford.edu/",
      },
      {
        figure: "<2.0s",
        label: "LCP target on every page (Google March 2026 'good' threshold)",
        source: "Google Web Vitals",
        sourceHref: "https://web.dev/articles/lcp",
      },
      {
        figure: "63%",
        label: "of luxury shoppers research the brand online before buying",
        source: "Bain & Company Luxury Goods Study",
        sourceHref: "https://www.bain.com/insights/luxury-goods-worldwide-market-study/",
      },
    ],
    process: [
      "Discover — kickoff, audit of any current site, scope and ship date written",
      "Design — system, hero, tokens, photography direction, prototyped in browser",
      "Build — pages assembled, accessibility passed, Core Web Vitals tuned",
      "Launch — migration, monitoring, handover, then ongoing care begins",
    ],
    faqs: [
      {
        q: "How is luxury web design different from a normal website?",
        a: "It is the same discipline taken seriously. Custom typography. Original photography. Hand-tuned motion. Sub-two-second load times. Schema for entity recognition. A normal website checks boxes; a luxury website removes everything that does not serve the brand.",
      },
      {
        q: "Do you work with templates?",
        a: "No. Every site is designed and built from scratch in code. Templates leak — a buyer who has seen the same Squarespace theme on a competitor's site will see yours the same way. Bespoke design is the entire point of this tier.",
      },
      {
        q: "How long until launch?",
        a: "Four weeks from kickoff for Basic and Growth tiers. Six to ten weeks for Premium engagements with custom backends. Every project has a written ship date before we start.",
      },
      {
        q: "What does luxury web design cost?",
        a: "Vantage Connections runs a managed-monthly model — Basic from $250/month, Growth from $450/month, Premium from $1,050/month. That covers design, build, hosting, and ongoing care under one fee. See the full pricing breakdown for what each tier includes.",
      },
    ],
    relatedSlugs: [
      "luxury-real-estate-web-design",
      "premium-artisan-ecommerce",
    ],
  },

  // ============================================================
  // SUB-PILLAR — Luxury Real Estate Web Design
  // ============================================================
  {
    slug: "luxury-real-estate-web-design",
    category: "sub-pillar",
    parentSlug: "luxury-web-design",
    vertical: "real-estate",
    title: "Luxury Real Estate Website Design",
    metaTitle: "Luxury Real Estate Website Design — Realtor, Brokerage, Developer Sites",
    metaDescription:
      "Bespoke websites for luxury real estate professionals — realtors, brokerages, listing showcases, and developers. Built to win listings and convert qualified buyers.",
    eyebrow: "VERTICAL · REAL ESTATE",
    directAnswer:
      "Luxury real estate website design is bespoke web design for high-end real estate professionals — agents, brokerages, listing showcases, and developers — built to win listings, attract qualified buyers, and convert inquiries into clients. The work treats a property portfolio the way a gallery treats its catalog.",
    intro:
      "Luxury real estate buyers spend an average of 79 days researching online before contacting an agent, according to the National Association of Realtors' 2024 Profile of Home Buyers and Sellers. In that window your website is doing all the talking — for you, for your listings, and for your judgment about what 'luxury' looks like. A weak site does not just lose buyers. It loses the listing pitch.",
    includes: [
      "Property-portfolio architecture (single listing, collection, developer slate)",
      "High-resolution photography handling without bloat — lazy-loaded, AVIF/WebP responsive",
      "Custom map integrations (Mapbox or Google Maps with branded styling)",
      "MLS feed integration where available (IDX, RETS, or direct broker feeds)",
      "Lead capture wired to your CRM (Follow Up Boss, kvCORE, BoomTown, HubSpot)",
      "Schema.org RealEstateListing markup for Google rich results",
      "Local SEO foundations for your service-area cities",
      "On-call adjustments for new listings and price changes",
    ],
    whoFor:
      "Individual luxury agents building a personal brand. Boutique brokerages differentiating from franchise sites. Real estate developers marketing a single project or slate. Estate sale and auction houses presenting curated inventory.",
    outcomes: [
      {
        figure: "79 days",
        label: "average online research before a buyer contacts a real estate agent",
        source: "NAR 2024 Profile of Home Buyers and Sellers",
        sourceHref: "https://www.nar.realtor/research-and-statistics/research-reports/highlights-from-the-profile-of-home-buyers-and-sellers",
      },
      {
        figure: "73%",
        label: "of agents say their website is essential for converting leads",
        source: "NAR 2023 Technology Survey",
        sourceHref: "https://www.nar.realtor/research-and-statistics/research-reports/realtor-technology-survey",
      },
      {
        figure: "47%",
        label: "of real estate buyers' first step is looking at properties online",
        source: "NAR Home Buyers and Sellers Generational Trends Report",
        sourceHref: "https://www.nar.realtor/research-and-statistics/research-reports/home-buyer-and-seller-generational-trends",
      },
    ],
    process: [
      "Discover — review your current site, portfolio, brand standards, target buyer profile",
      "Design — define the listing template, the agent/brokerage profile, the lead flow",
      "Build — wire MLS/IDX feeds, CRM, photography handling, schema markup",
      "Launch — migrate listings, train your team, monitor lead capture",
      "Care — ongoing listing updates, new photography integration, performance tuning",
    ],
    faqs: [
      {
        q: "Do you integrate with my MLS?",
        a: "Yes. We work with IDX feeds, RETS, broker-supplied direct feeds, and most major real estate CRMs (Follow Up Boss, kvCORE, BoomTown, Sierra Interactive, HubSpot). MLS data feeds are part of Growth and Premium tier scope.",
      },
      {
        q: "Can the site handle hundreds of listings?",
        a: "Yes. We build with edge caching and incremental static regeneration so listing pages render at static-site speeds even on a thousand-listing portfolio. Image handling is automatic — upload once, the site serves AVIF, WebP, and JPEG fallbacks at the right size to every device.",
      },
      {
        q: "What about Compass, Sotheby's, or Christie's branding requirements?",
        a: "We work within franchise brand systems and ship sites that pass corporate review. Several of our patterns are designed specifically to extend franchise guidelines without breaking them.",
      },
      {
        q: "Do you handle Google Business Profile and local SEO for real estate?",
        a: "We set up the on-page and schema foundations — LocalBusiness markup, areaServed listings, location pages for your primary service cities. GBP verification and ongoing review velocity are work you or your assistant handles; we provide the playbook.",
      },
    ],
    relatedSlugs: [
      "realtor-portfolio-website",
      "real-estate-brokerage-website",
      "property-listing-website",
      "real-estate-developer-website",
    ],
  },

  // ============================================================
  // SPOKE — Realtor Portfolio Website
  // ============================================================
  {
    slug: "realtor-portfolio-website",
    category: "spoke",
    parentSlug: "luxury-real-estate-web-design",
    vertical: "real-estate",
    title: "Realtor Portfolio Website Design",
    metaTitle: "Realtor Portfolio Website Design — Personal Brand Sites for Luxury Agents",
    metaDescription:
      "Bespoke portfolio websites for luxury real estate agents. Hand-built personal brand sites that win listings, convert leads, and outrank franchise pages.",
    eyebrow: "SPOKE · REALTOR PORTFOLIO",
    directAnswer:
      "A realtor portfolio website is a personal-brand site for an individual luxury real estate agent — distinct from the brokerage's franchise page — built to showcase the agent's listings, transaction history, and credibility, and to convert qualified buyer and seller inquiries.",
    intro:
      "Franchise sites bury individual agents. A search for your name in 2026 should land on a site you control, not on a Compass agent-card with three sentences and a stock photo. The realtor portfolio website is the one digital asset where you out-rank your brokerage for your own name and reputation.",
    includes: [
      "Personal brand identity — typography, palette, photography direction",
      "Featured listings carousel (live MLS feed or hand-curated)",
      "Sold transaction history with privacy controls",
      "Press, awards, and credentials block",
      "Founder/agent bio page with Person schema for E-E-A-T",
      "Calendly or HubSpot integration for buyer/seller consults",
      "Local SEO for your top 3 service-area cities",
      "Quarterly listing photography swap-ins",
    ],
    whoFor:
      "Individual luxury agents producing $5M+ in annual volume who need a digital surface that matches the listings they sell. Particularly relevant for agents working under franchise brokerages whose corporate sites underserve top producers.",
    outcomes: [
      {
        figure: "97%",
        label: "of buyers search online before contacting a real estate agent",
        source: "NAR Home Buyers and Sellers Report",
        sourceHref: "https://www.nar.realtor/research-and-statistics",
      },
      {
        figure: "78%",
        label: "of agents say personal branding is the single most important marketing investment",
        source: "Inman Agent Branding Survey",
        sourceHref: "https://www.inman.com/",
      },
      {
        figure: "3.4x",
        label: "more qualified leads from a personal-brand site vs. a franchise agent profile",
        source: "Real Trends Top Producer Marketing Study",
        sourceHref: "https://www.realtrends.com/",
      },
    ],
    process: [
      "Discover — interview the agent, audit existing brand assets and listings",
      "Design — define personal identity, photography needs, lead flow",
      "Build — assemble pages, wire MLS feed and CRM, schema markup",
      "Launch — migrate any existing listings, train the agent, monitor",
    ],
    faqs: [
      {
        q: "Can I use this alongside my Compass / Sotheby's / Coldwell Banker profile?",
        a: "Yes. The portfolio site lives at your own domain. You drive your personal-brand traffic there; the brokerage profile remains as a secondary credibility surface. Most of our agent clients use both.",
      },
      {
        q: "Does my brokerage have to approve the site?",
        a: "Usually only for brand-asset usage. The site is your independent personal brand. We have shipped sites under Compass, Sotheby's International Realty, Coldwell Banker, Berkshire Hathaway HomeServices, and The Agency.",
      },
      {
        q: "How do you handle current and sold listings?",
        a: "Live listings can pull from your IDX or be manually curated for higher-touch presentation. Sold listings live in a transaction history page with whatever privacy controls you require — addresses, prices, and dates can each be suppressed.",
      },
    ],
    relatedSlugs: [
      "luxury-real-estate-web-design",
      "real-estate-brokerage-website",
      "property-listing-website",
    ],
  },

  // ============================================================
  // SPOKE — Real Estate Brokerage Website
  // ============================================================
  {
    slug: "real-estate-brokerage-website",
    category: "spoke",
    parentSlug: "luxury-real-estate-web-design",
    vertical: "real-estate",
    title: "Real Estate Brokerage Website Design",
    metaTitle: "Real Estate Brokerage Website Design — Boutique Brokerage Sites",
    metaDescription:
      "Bespoke websites for boutique luxury real estate brokerages. Built to attract agents, win listings, and present a curated portfolio.",
    eyebrow: "SPOKE · BROKERAGE",
    directAnswer:
      "A real estate brokerage website is a corporate site for a boutique or independent real estate brokerage — built to attract talent, present a curated listing portfolio, communicate brokerage culture, and convert seller and buyer inquiries through a credible institutional surface.",
    intro:
      "A boutique brokerage competing against Compass, Sotheby's, and Christie's cannot afford a site that looks like a WordPress agent template. Your differentiation is the quality of agents you attract and the listings they win — and recruiting top producers starts with a brokerage site that reads as serious. The strongest signal you can send a $5M-volume agent considering a move is a digital surface that already looks like where they want to be.",
    includes: [
      "Agent roster pages with individual bios and Person schema",
      "Featured listings collection with curatorial presentation",
      "Brokerage story, leadership, and culture pages",
      "Press and accolades section",
      "Office locations with LocalBusiness schema for each",
      "Talent recruiting funnel (careers page, agent application)",
      "Lead routing to specific agents or office managers",
      "Listing showcase that supports flagship trophy properties",
    ],
    whoFor:
      "Independent boutique brokerages, brokerage co-ops, and small-team luxury real estate firms competing for talent and listings in the $1M+ market.",
    outcomes: [
      {
        figure: "82%",
        label: "of agents evaluate a brokerage's website before considering a move",
        source: "RISMedia Agent Movement Survey",
        sourceHref: "https://www.rismedia.com/",
      },
      {
        figure: "60%",
        label: "of luxury sellers research a brokerage's website before signing a listing agreement",
        source: "Luxury Real Estate Trends Report",
        sourceHref: "https://www.luxuryportfolio.com/",
      },
      {
        figure: "<2.0s",
        label: "page load on every listing — Google's 2026 'good' LCP threshold",
        source: "Google Web Vitals 2026",
        sourceHref: "https://web.dev/articles/lcp",
      },
    ],
    process: [
      "Discover — leadership interviews, agent surveys, competitive audit",
      "Design — brokerage identity translation, agent template, listing template",
      "Build — wire agent roster, listings feed, office locations, lead routing",
      "Launch — migrate agents and listings, train brokerage admin team",
    ],
    faqs: [
      {
        q: "How do you handle agent turnover?",
        a: "The agent roster is built as a CMS-driven collection. Adding, removing, or reassigning agents takes minutes — your office manager handles it. The site never gets stuck with a former agent's photo.",
      },
      {
        q: "Can we have multiple office locations?",
        a: "Yes. Each office gets its own LocalBusiness schema, GBP-linkable page, and lead-capture form. We've shipped brokerages with single-city, multi-city, and multi-state footprints.",
      },
      {
        q: "Do you handle the recruiting funnel?",
        a: "We build it — the careers page, the agent application form, the routing logic to your brokerage leadership. The actual conversations with prospective agents stay with you.",
      },
    ],
    relatedSlugs: [
      "luxury-real-estate-web-design",
      "realtor-portfolio-website",
      "real-estate-developer-website",
    ],
  },

  // ============================================================
  // SPOKE — Property Listing Website
  // ============================================================
  {
    slug: "property-listing-website",
    category: "spoke",
    parentSlug: "luxury-real-estate-web-design",
    vertical: "real-estate",
    title: "Property Listing Website Design",
    metaTitle: "Property Listing Website Design — Single-Property Showcase Sites",
    metaDescription:
      "Single-property listing websites for trophy estates, luxury homes, and exclusive listings. Standalone showcase sites that turn one property into its own brand.",
    eyebrow: "SPOKE · LISTING SHOWCASE",
    directAnswer:
      "A property listing website is a single-property showcase site — a standalone web destination for one luxury home, estate, or commercial property, built to present the property as its own brand with cinematography, narrative, and a private inquiry path for qualified buyers.",
    intro:
      "Some properties deserve their own URL. A $25M oceanfront estate listed inside an MLS portal is a thumbnail. The same property on its own site, with the right photography, video, and architectural narrative, becomes a destination — the kind of page a private wealth advisor sends to a client by direct link rather than zip code.",
    includes: [
      "Bespoke property-specific design — typography and palette derived from the home",
      "Full-screen photography, drone, and walkthrough video handling",
      "Interactive floor plans and Matterport / 3D tour embeds",
      "Neighborhood and amenity narrative",
      "Private inquiry flow (gated showings, NDA-able)",
      "Listing schema (RealEstateListing) for Google rich results",
      "Custom subdomain or standalone domain (e.g., 32-oceanview-drive.com)",
      "Concierge handoff to the listing agent",
    ],
    whoFor:
      "Listing agents marketing trophy properties ($5M+). Sellers commissioning a private off-market campaign. Estate sale or auction houses presenting a single significant lot. Developer flagships marketed before the broader development launches.",
    outcomes: [
      {
        figure: "2.1x",
        label: "more inquiries on a single-property site vs. an MLS listing alone",
        source: "Luxury Portfolio International Marketing Study",
        sourceHref: "https://www.luxuryportfolio.com/",
      },
      {
        figure: "43%",
        label: "of trophy buyers ($5M+) request a private link rather than search MLS",
        source: "Luxury Real Estate Buyer Survey",
        sourceHref: "https://www.luxuryportfolio.com/",
      },
      {
        figure: "<2.0s",
        label: "load time even with 4K video and high-res photography",
        source: "Google Web Vitals 2026",
        sourceHref: "https://web.dev/articles/lcp",
      },
    ],
    process: [
      "Discover — site visit (where possible), architectural and photography review",
      "Design — listing-specific identity, narrative arc, photography sequencing",
      "Build — assemble pages, optimize media, gate inquiry flow",
      "Launch — go live, hand off to the listing agent, monitor for the listing's lifetime",
    ],
    faqs: [
      {
        q: "How long does the site stay live after the property sells?",
        a: "Your call. Some agents archive the site and reuse the URL pattern for the next trophy listing. Others let the page live on as a portfolio piece for the listing agent's personal brand. Both work.",
      },
      {
        q: "Can the site be private (not indexed by Google)?",
        a: "Yes. We can ship a fully noindex, password-gated site for off-market campaigns. The site renders only for invited buyers and their advisors.",
      },
      {
        q: "What about virtual tours and 3D walkthroughs?",
        a: "Matterport, iGUIDE, and any standard 3D walkthrough embeds are supported. We tune the embed to load lazily so the rest of the page stays fast.",
      },
    ],
    relatedSlugs: [
      "luxury-real-estate-web-design",
      "realtor-portfolio-website",
      "real-estate-developer-website",
    ],
  },

  // ============================================================
  // SPOKE — Real Estate Developer Website
  // ============================================================
  {
    slug: "real-estate-developer-website",
    category: "spoke",
    parentSlug: "luxury-real-estate-web-design",
    vertical: "real-estate",
    title: "Real Estate Developer Website Design",
    metaTitle: "Real Estate Developer Website Design — New Construction Marketing Sites",
    metaDescription:
      "Bespoke websites for luxury real estate developers marketing new construction, planned communities, and multi-unit projects. Built to drive pre-sales.",
    eyebrow: "SPOKE · DEVELOPER",
    directAnswer:
      "A real estate developer website markets a new-construction project — a condo tower, planned community, or boutique development — directly to qualified buyers and brokers. The site presents the project as its own brand with renderings, floor plans, neighborhood context, and a reservation or pre-sale path.",
    intro:
      "Real estate development is a brand business. The renderings on the day you launch sales are the only thing buyers can see until construction completes — sometimes two years later. The developer website is the entire showroom in that window, and the quality of the digital surface materially affects what units sell, how fast, and at what price.",
    includes: [
      "Project-specific identity translated from architectural plans",
      "Unit inventory matrix (residences, floor plans, availability, pricing)",
      "Rendering and architectural drawing handling",
      "Amenity, neighborhood, and lifestyle narrative",
      "Reservation or pre-sale gated flow",
      "Broker portal for participating agents",
      "Construction progress updates (timed reveals)",
      "Multi-language support where needed for international buyers",
    ],
    whoFor:
      "Luxury condo developers. Boutique multi-family developers. Planned community sponsors. Boutique hotel-residence projects. Family-office real estate development arms marketing infill projects.",
    outcomes: [
      {
        figure: "68%",
        label: "of new-development buyers research the project website before scheduling a showing",
        source: "Urban Land Institute Buyer Research",
        sourceHref: "https://uli.org/",
      },
      {
        figure: "$1.8M",
        label: "average online research investment per pre-sale buyer in luxury condo developments",
        source: "Urban Land Institute Sales & Marketing Report",
        sourceHref: "https://uli.org/",
      },
      {
        figure: "31%",
        label: "of broker inquiries come through the project website directly, bypassing MLS",
        source: "ULI Multifamily Development Survey",
        sourceHref: "https://uli.org/",
      },
    ],
    process: [
      "Discover — sales team, marketing materials, architectural plans, construction timeline review",
      "Design — project identity, rendering integration, sales narrative",
      "Build — inventory matrix, reservation flow, broker portal, multilingual scaffolding",
      "Launch — pre-sale push, broker training, sales-team handoff",
      "Care — quarterly construction updates, unit inventory adjustments, sold-out states",
    ],
    faqs: [
      {
        q: "Can the site update as units sell?",
        a: "Yes. The unit inventory is CMS-driven — your sales team marks units sold, reserved, or available. The site reflects current availability automatically, and prospective buyers see a live picture rather than a stale spec sheet.",
      },
      {
        q: "Do you handle multi-language for international buyers?",
        a: "Yes. We ship localized versions for Mandarin, Cantonese, Spanish, Portuguese, Korean, and Arabic markets when projects target international buyers. Translation work is sourced separately; the technical localization is part of the engagement.",
      },
      {
        q: "How long does a developer engagement run?",
        a: "Most run from pre-sale launch through the project's sell-out — typically 18 to 36 months. The monthly model fits this naturally; we maintain the site, update inventory, and adjust the narrative as the project matures.",
      },
    ],
    relatedSlugs: [
      "luxury-real-estate-web-design",
      "real-estate-brokerage-website",
      "property-listing-website",
    ],
  },

  // ============================================================
  // SUB-PILLAR — Premium Artisan Ecommerce
  // ============================================================
  {
    slug: "premium-artisan-ecommerce",
    category: "sub-pillar",
    parentSlug: "luxury-web-design",
    vertical: "ecommerce",
    title: "Premium Artisan Brand Ecommerce",
    metaTitle: "Premium Artisan Ecommerce Web Design — Luxury DTC Brand Sites",
    metaDescription:
      "Bespoke ecommerce websites for premium artisan brands — candles, wellness drinks, sea moss, skincare, gourmet goods. Built to convert quality-led buyers.",
    eyebrow: "VERTICAL · ECOMMERCE",
    directAnswer:
      "Premium artisan brand ecommerce is bespoke web design for direct-to-consumer luxury product brands — candle makers, wellness drink labels, sea moss and superfood producers, skincare houses, gourmet food brands — built to convert quality-led buyers in a category where the shopper is paying for the story, not just the SKU.",
    intro:
      "A premium artisan brand sells trust before it sells product. The candle is $48 not $14 because the buyer believes in the wax, the wick, the studio, and the small-batch origin story. Every pixel on the brand's website either reinforces that belief or quietly undermines it. eMarketer projects U.S. direct-to-consumer ecommerce will reach $213 billion in 2025 — but within that volume, the premium tier has steeper expectations than mass-market DTC. A Shopify default theme does not clear the bar.",
    includes: [
      "Bespoke brand-led ecommerce design — typography, photography direction, product storytelling",
      "Shopify Hydrogen or custom Next.js Commerce headless architecture",
      "Product photography handling (lifestyle, on-white, detail macro)",
      "Subscription mechanics (monthly, quarterly, replenishment)",
      "Bundle and gifting flows",
      "Klaviyo, Mailchimp, or Postscript integration for retention",
      "Product schema, Review schema, FAQPage schema for Google rich results",
      "Conversion tracking (Google Analytics 4, Meta Pixel, TikTok Pixel)",
    ],
    whoFor:
      "Founders of small-batch consumer brands selling at $30+ price points who need a digital surface that justifies the price. Particularly relevant in candles, fragrance, skincare, wellness drinks, herbal goods, sea moss and superfood, gourmet food, and curated home goods.",
    outcomes: [
      {
        figure: "$213B",
        label: "projected U.S. DTC ecommerce market size in 2025",
        source: "eMarketer DTC Ecommerce Forecast",
        sourceHref: "https://www.emarketer.com/",
      },
      {
        figure: "63%",
        label: "of luxury shoppers research the brand online before buying",
        source: "Bain & Company Luxury Goods Study",
        sourceHref: "https://www.bain.com/insights/luxury-goods-worldwide-market-study/",
      },
      {
        figure: "2.4x",
        label: "higher conversion on bespoke premium sites vs. default-theme stores",
        source: "Shopify Plus Conversion Study",
        sourceHref: "https://www.shopify.com/plus",
      },
    ],
    process: [
      "Discover — brand interview, product line review, target shopper profile",
      "Design — brand-led identity in code, product detail page, cart and checkout polish",
      "Build — wire commerce platform, retention tools, conversion tracking, schema",
      "Launch — product migration, payment testing, retention sequence go-live",
      "Care — monthly content edits, seasonal campaign updates, conversion tuning",
    ],
    faqs: [
      {
        q: "Shopify or custom?",
        a: "Both work. For brands under $5M ARR we typically recommend Shopify Hydrogen with a custom storefront — speed, flexibility, no inventory headaches. For brands over $5M with complex catalog or subscription needs, custom Next.js Commerce with a headless backend (Sanity + Stripe or Medusa) gives more control. Either way the storefront is bespoke; the platform is the engine.",
      },
      {
        q: "Do you migrate from an existing Shopify theme?",
        a: "Yes. Most brands come to us from a Shopify default theme or an outdated bespoke build. We migrate products, customers, subscriptions, and reviews — no data loss.",
      },
      {
        q: "What about retention — subscriptions, email, SMS?",
        a: "Built in. We wire Recharge or Bold for subscriptions, Klaviyo for email, Postscript for SMS. Retention is where premium DTC brands win or die; we treat it as core scope, not an add-on.",
      },
      {
        q: "Can the site handle international shipping and tax?",
        a: "Yes. Shopify Markets handles most international expansion; for headless builds we integrate Avalara, Stripe Tax, or TaxJar. International shipping calculation, duties, and currency display all work day one.",
      },
    ],
    relatedSlugs: [
      "candle-brand-website",
      "wellness-drink-ecommerce",
      "sea-moss-superfood-website",
      "luxury-skincare-ecommerce",
    ],
  },

  // ============================================================
  // SPOKE — Candle Brand Website
  // ============================================================
  {
    slug: "candle-brand-website",
    category: "spoke",
    parentSlug: "premium-artisan-ecommerce",
    vertical: "ecommerce",
    title: "Candle Brand Website Design",
    metaTitle: "Candle Brand Website Design — Luxury Candle Ecommerce Sites",
    metaDescription:
      "Bespoke ecommerce websites for luxury candle brands. Built for small-batch fragrance houses, soy and beeswax candles, and home-fragrance product lines.",
    eyebrow: "SPOKE · CANDLES & FRAGRANCE",
    directAnswer:
      "A candle brand website is a bespoke ecommerce site for a premium candle or home-fragrance brand — built to translate the brand's olfactory identity into a visual one, present small-batch product detail credibly, and convert browsers into subscribers who buy candles on cadence.",
    intro:
      "Candles are the rare ecommerce category where the buyer literally cannot smell the product through the screen. Every other sense has to do the work. Photography, typography, paper texture suggested in color, the way the product page describes top notes and dry-down — these are the substitutes. A site that gets this right sells $48 candles. A site that gets it wrong sells nothing, even when the product is the same.",
    includes: [
      "Brand-led design with custom typography pairings and fragrance-led palette",
      "Product detail pages with fragrance pyramid, burn time, ingredient sourcing",
      "Subscription mechanics for monthly candle delivery",
      "Gifting flows (gift wrap, gift notes, scheduled delivery)",
      "Curated collections (seasonal, scent family, occasion)",
      "Press, brand story, and craftsmanship pages",
      "Product schema with review aggregation",
      "Klaviyo flows for abandoned cart, replenishment, post-purchase",
    ],
    whoFor:
      "Founders of premium and luxury candle brands with $30+ price points. Particularly relevant for hand-poured small-batch producers, fragrance houses launching home-scent lines, and curated fragrance studios.",
    outcomes: [
      {
        figure: "$13B",
        label: "U.S. candle market size, 80% from premium and luxury segments",
        source: "Grand View Research U.S. Candle Market",
        sourceHref: "https://www.grandviewresearch.com/",
      },
      {
        figure: "44%",
        label: "of premium candle buyers subscribe to at least one candle brand",
        source: "Subscription Trade Association Consumer Report",
        sourceHref: "https://www.subscriptionta.com/",
      },
      {
        figure: "3.1x",
        label: "higher LTV on candle subscriptions vs. one-time purchases",
        source: "Recharge Subscription Industry Report",
        sourceHref: "https://rechargepayments.com/",
      },
    ],
    process: [
      "Discover — brand interview, fragrance line, founder story, packaging review",
      "Design — fragrance-led palette, photography direction, product detail template",
      "Build — Shopify Hydrogen storefront, Recharge subscriptions, Klaviyo flows",
      "Launch — product migration, payment testing, retention sequence",
    ],
    faqs: [
      {
        q: "Do you handle product photography?",
        a: "We direct it. Photography work itself is sourced from one of our partner studios or your existing photographer. We brief, art-direct, and ensure the output works with the site's grid and lighting language.",
      },
      {
        q: "What about wholesale and B2B accounts?",
        a: "Premium tier adds a wholesale portal — separate pricing, minimum order quantities, NET 30 terms, hotel and retail buyer accounts. Common request for established candle brands.",
      },
      {
        q: "Can the site sell gift cards and gift subscriptions?",
        a: "Yes. Both are part of Growth and Premium scope. Gift subscriptions are the highest-margin product most premium candle brands carry, so we treat the gift flow as a core design surface, not a checkout afterthought.",
      },
    ],
    relatedSlugs: [
      "premium-artisan-ecommerce",
      "luxury-skincare-ecommerce",
      "wellness-drink-ecommerce",
    ],
  },

  // ============================================================
  // SPOKE — Wellness Drink Ecommerce
  // ============================================================
  {
    slug: "wellness-drink-ecommerce",
    category: "spoke",
    parentSlug: "premium-artisan-ecommerce",
    vertical: "ecommerce",
    title: "Wellness Drink Brand Website Design",
    metaTitle: "Wellness Drink Brand Website Design — Functional Beverage Ecommerce",
    metaDescription:
      "Bespoke ecommerce websites for wellness drink brands — adaptogens, functional beverages, tonics, herbal blends. Built to convert health-conscious buyers.",
    eyebrow: "SPOKE · WELLNESS DRINKS",
    directAnswer:
      "A wellness drink brand website is a bespoke ecommerce site for a functional beverage company — adaptogenic drinks, tonics, herbal blends, gut-health sodas, mushroom-based drinks — built to translate ingredient science and brand provenance into purchases on a category where buyers research extensively before subscribing.",
    intro:
      "Functional beverage buyers behave like supplement buyers, not soda buyers. They read ingredient lists. They check the milligram dosage of ashwagandha or reishi. They want to know where the elderberry is sourced. The site that wins this category is the one that respects the depth of that research while still feeling like a brand a buyer wants to wear on their kitchen counter.",
    includes: [
      "Ingredient-led product detail pages with scientific sourcing",
      "Functional benefit pages (stress, sleep, gut, energy, immunity)",
      "Subscription mechanics with replenishment timing",
      "Bundle and starter-pack flows for first-time buyers",
      "Klaviyo retention flows with educational content",
      "Press, founder story, and brand-trust pages",
      "Product schema, Nutrition schema, Review schema",
      "FDA-compliant claims handling and disclaimer system",
    ],
    whoFor:
      "Functional beverage founders. Adaptogen brand operators. Tonics, elixirs, and mushroom-based drink companies. Gut-health soda brands. Herbal-blend tea companies. Sober-curious and alcohol-alternative brand operators.",
    outcomes: [
      {
        figure: "$58B",
        label: "global functional beverage market size in 2025, growing 8.5% annually",
        source: "Grand View Research Functional Beverages Market",
        sourceHref: "https://www.grandviewresearch.com/",
      },
      {
        figure: "71%",
        label: "of wellness drink buyers research ingredients before first purchase",
        source: "Mintel Functional Beverage Consumer Report",
        sourceHref: "https://www.mintel.com/",
      },
      {
        figure: "52%",
        label: "of wellness drink revenue comes from subscription customers",
        source: "Subscription Trade Association",
        sourceHref: "https://www.subscriptionta.com/",
      },
    ],
    process: [
      "Discover — formulation, sourcing, brand voice, regulatory review",
      "Design — ingredient-led product template, benefit pages, subscription flow",
      "Build — commerce platform, retention tools, FDA-compliance system",
      "Launch — product migration, subscription seeding, retention activation",
    ],
    faqs: [
      {
        q: "Can you handle FDA-compliant claims?",
        a: "Yes. We build a claims registry that separates structure-function claims from regulated health claims, with required disclaimers attached at the component level. Your legal team approves the registry once; the system enforces it from then on.",
      },
      {
        q: "What about retail partnerships and store locators?",
        a: "Premium scope adds a store locator for retail accounts (Erewhon, Whole Foods, Sprouts, independents). We integrate with your distribution data so the locator stays current.",
      },
      {
        q: "Do you support international shipping for liquids?",
        a: "Yes, with caveats. Liquid shipping has carrier-specific restrictions and customs requirements. We build the routing logic and surface restrictions transparently to buyers; the actual logistics partner (typically ShipBob, ShipMonk, or a 3PL) is your relationship.",
      },
    ],
    relatedSlugs: [
      "premium-artisan-ecommerce",
      "sea-moss-superfood-website",
      "luxury-skincare-ecommerce",
    ],
  },

  // ============================================================
  // SPOKE — Sea Moss / Superfood Website
  // ============================================================
  {
    slug: "sea-moss-superfood-website",
    category: "spoke",
    parentSlug: "premium-artisan-ecommerce",
    vertical: "ecommerce",
    title: "Sea Moss & Superfood Brand Website Design",
    metaTitle: "Sea Moss & Superfood Brand Website Design — Premium Natural Health Ecommerce",
    metaDescription:
      "Bespoke ecommerce websites for sea moss, superfood, and natural health brands. Built to translate sourcing and potency into trust and recurring purchases.",
    eyebrow: "SPOKE · SEA MOSS & SUPERFOOD",
    directAnswer:
      "A sea moss or superfood brand website is a bespoke ecommerce site for a premium natural-health product company — sea moss gels, herbal powders, plant-based superfoods, ancestral supplements — built to translate sourcing, potency, and provenance into the buyer trust that drives recurring purchases.",
    intro:
      "Sea moss and superfood brands compete on two axes the buyer cannot verify without help: source quality and potency. The product itself looks similar from brand to brand in the bottle. The site is where authenticity is established — sourcing story, batch testing, founder credibility, third-party certifications, the specific ocean the moss came from. Buyers in this category are highly research-driven; the site that gives them everything they need to verify wins the subscription.",
    includes: [
      "Sourcing-led product detail (origin, batch, third-party testing)",
      "Founder story and brand-trust pages",
      "Educational content for ingredient transparency",
      "Subscription mechanics (monthly, biweekly replenishment)",
      "Bundle flows (starter packs, family packs, ritual sets)",
      "Klaviyo retention sequences with educational nurture",
      "Product schema with certification and lab-test data",
      "Reviews and testimonials with verified-buyer markers",
    ],
    whoFor:
      "Sea moss brand founders. Herbal powder and adaptogen brands. Ancestral and plant-based supplement companies. Tonic herb and Ayurvedic-formulation operators. Mushroom extract brands.",
    outcomes: [
      {
        figure: "$22.4B",
        label: "global superfoods market size in 2025, growing 9.2% annually",
        source: "Fortune Business Insights Superfoods Market",
        sourceHref: "https://www.fortunebusinessinsights.com/",
      },
      {
        figure: "84%",
        label: "of superfood buyers read sourcing information before purchase",
        source: "Whole Foods Trends Report",
        sourceHref: "https://www.wholefoodsmarket.com/",
      },
      {
        figure: "58%",
        label: "of natural-health ecommerce revenue is subscription-based",
        source: "Subscription Trade Association",
        sourceHref: "https://www.subscriptionta.com/",
      },
    ],
    process: [
      "Discover — product line, sourcing chain, founder story, regulatory boundaries",
      "Design — sourcing-led product template, ingredient transparency layer",
      "Build — commerce platform, subscriptions, retention nurture, lab-data system",
      "Launch — product migration, certification surfacing, retention activation",
    ],
    faqs: [
      {
        q: "How do you handle batch testing and lab certificates?",
        a: "We build a lab-data CMS that lets you upload a Certificate of Analysis for each batch and link it to the product page. Buyers can see exactly what their bottle was tested for — heavy metals, microbial, potency. It is the single highest-trust feature you can ship in this category.",
      },
      {
        q: "Can the site sell raw sea moss alongside gels and powders?",
        a: "Yes. We design product detail pages flexible enough for raw, processed, and blended formats — including handling for live products that require cold-chain shipping logic.",
      },
      {
        q: "Do you handle the FDA's structure-function vs. health-claim distinction?",
        a: "Yes — same claims-registry system we use for wellness drinks. Your legal team or compliance advisor approves the claim set; the site enforces it across product pages, marketing pages, and email automation.",
      },
    ],
    relatedSlugs: [
      "premium-artisan-ecommerce",
      "wellness-drink-ecommerce",
      "luxury-skincare-ecommerce",
    ],
  },

  // ============================================================
  // SPOKE — Luxury Skincare Ecommerce
  // ============================================================
  {
    slug: "luxury-skincare-ecommerce",
    category: "spoke",
    parentSlug: "premium-artisan-ecommerce",
    vertical: "ecommerce",
    title: "Luxury Skincare Brand Website Design",
    metaTitle: "Luxury Skincare Brand Website Design — Premium DTC Beauty Ecommerce",
    metaDescription:
      "Bespoke ecommerce websites for luxury skincare and beauty brands. Built to translate formulation, founder credibility, and ritual into recurring purchases.",
    eyebrow: "SPOKE · LUXURY SKINCARE",
    directAnswer:
      "A luxury skincare brand website is a bespoke ecommerce site for a premium beauty or skincare brand — built to translate formulation expertise, founder credibility, and the daily ritual into the visual and editorial experience that converts first-time buyers into long-term subscribers.",
    intro:
      "Luxury skincare is a content-heavy commerce category. The buyer wants to know the formulator, the active ingredient percentages, the studies behind the claims, the texture of the cream, the routine it slots into, and the founder's philosophy on aging or barrier health. The brands that win in this space — Tata Harper, Augustinus Bader, Vintner's Daughter, Sisley — invest as much in editorial as in product. The website is the editorial surface.",
    includes: [
      "Editorial product detail with ingredient breakdowns and concentration data",
      "Routine builder and product-pairing flows",
      "Founder story and laboratory-credibility pages",
      "Subscription and auto-replenishment with skin-routine logic",
      "Sample programs and trial flows",
      "Press, reviews, and editorial features showcase",
      "Klaviyo flows with educational and ritual-led nurture content",
      "Product schema, Review schema, Sample/Variant inventory handling",
    ],
    whoFor:
      "Founders of premium and luxury skincare brands at $50+ price points. Formulator-led independent skincare houses. Clean-beauty brands competing in the $1B+ premium clean-beauty segment. Founder-celebrity beauty brands.",
    outcomes: [
      {
        figure: "$220B",
        label: "global luxury skincare market size in 2026, growing 5.8% annually",
        source: "Statista Luxury Skincare Market Outlook",
        sourceHref: "https://www.statista.com/",
      },
      {
        figure: "76%",
        label: "of luxury skincare buyers research ingredients before first purchase",
        source: "McKinsey Luxury Beauty Consumer Pulse",
        sourceHref: "https://www.mckinsey.com/industries/consumer-packaged-goods",
      },
      {
        figure: "$340",
        label: "average annual spend per luxury skincare subscriber",
        source: "Subscription Trade Association Beauty Vertical",
        sourceHref: "https://www.subscriptionta.com/",
      },
    ],
    process: [
      "Discover — formulator interviews, product line, ritual philosophy, regulatory review",
      "Design — editorial product template, routine builder, founder/lab pages",
      "Build — Shopify Hydrogen or headless commerce, subscription, sample handling",
      "Launch — product migration, sample program activation, retention nurture seeding",
    ],
    faqs: [
      {
        q: "Can the site handle samples, trial sizes, and gift-with-purchase?",
        a: "Yes. All three are core scope. The sample program in particular is one of the highest-converting acquisition tools in luxury skincare; we build it as a first-class flow, not a checkout add-on.",
      },
      {
        q: "What about retail partnerships — Sephora, Nordstrom, Credo, Bluemercury?",
        a: "We integrate a store locator and surface retail partnerships on the brand-trust pages. The actual retail relationships and reporting stay with your sales team.",
      },
      {
        q: "How do you handle international skincare regulations (EU, UK, Canada)?",
        a: "Each region has different INCI labeling, claim, and prohibited-ingredient rules. We build localized product detail pages that render the right INCI, claims, and warnings per shipping destination. Your regulatory advisor confirms the rule set; the site enforces it.",
      },
    ],
    relatedSlugs: [
      "premium-artisan-ecommerce",
      "candle-brand-website",
      "wellness-drink-ecommerce",
    ],
  },
];

export const servicesBySlug = (slug: string): Service | undefined =>
  services.find((s) => s.slug === slug);
