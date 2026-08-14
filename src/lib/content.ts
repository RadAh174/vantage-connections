/**
 * Vantage — landing page content.
 * Single source of truth for copy. All text is real marketing copy
 * written for this product; nothing here is placeholder data.
 *
 * The homepage is THE DOSSIER — Vantage Connections' employment
 * application for the job of running your store. Sections follow the
 * anatomy of a hiring packet.
 */

export const nav = {
  links: [
    { label: "Qualifications", href: "#qualifications" },
    { label: "The role", href: "#role" },
    { label: "Compensation", href: "#compensation" },
    { label: "Interview", href: "#interview" },
  ],
  // shortLabel: compact variant for the mobile header pill
  cta: { label: "Draft an offer", shortLabel: "Draft offer", href: "#compensation" },
};

export const masthead = {
  formNo: "FORM VC-001 · EMPLOYMENT APPLICATION",
  formSub: "OPEN TO ALL SHOPIFY STORES · NO RECRUITER REQUIRED",
  headline: "HIRE THE OPERATOR.",
  intro:
    "One applicant for the four jobs your store never has time for. It builds the storefront, runs the ads, prices to the market, and makes the imagery — then waits for your signature before any of it goes live.",
  fields: [
    { label: "APPLICANT", value: "Vantage Connections" },
    { label: "POSITION SOUGHT", value: "Operator of your Shopify store" },
    { label: "AVAILABILITY", value: "Immediate · 24/7" },
    { label: "SALARY EXPECTATION", value: "$0 during probation" },
  ],
  checks: [
    "Connects directly to your Shopify store",
    "Nothing ships or spends without your signature",
    "Learns your brand once, works on it forever",
  ],
  stamp: "AVAILABLE IMMEDIATELY",
  primary: { label: "Review the qualifications", href: "#qualifications" },
  secondary: { label: "Skip to the offer", href: "#compensation" },
};

export const objective = {
  label: "CANDIDATE’S OBJECTIVE",
  text: "To take over the work that turns a good store into a great one — the site, the ads, the prices, the pictures — and to bring you the decision, never the chore.",
  markerNote: "strong candidate — see exhibits ↓",
};

export const competencies = {
  label: "SECTION 01 · QUALIFICATIONS",
  title: "Four crafts. One candidate.",
  note: "Evidence attached as Exhibits A–D. Representative of the work, produced on demand.",
  items: [
    {
      n: "01",
      skill: "Storefront management",
      desc: "Builds a fast, on-brand storefront and keeps it that way. Search and AI-engine optimization on a loop; content refreshed before it can go stale.",
      exhibit: "EXHIBIT A",
      exhibitNote: "The same listing, before and after.",
      image: "/media/pillar-storefront.webp",
      alt: "The same candle product photo before and after a rebuild: dim and dusty on the left, glowing and crisp under warm light on the right.",
    },
    {
      n: "02",
      skill: "Campaign production",
      desc: "Writes, art-directs and runs your ads, emails and UGC. Everything drafted on your brand, everything queued for your approval before a dollar moves.",
      exhibit: "EXHIBIT B",
      exhibitNote: "One product, a season of ad creative.",
      image: "/media/pillar-marketing.webp",
      alt: "An overhead flat-lay of printed ad photographs of one amber serum bottle in a dozen styles, the real bottle standing among them.",
    },
    {
      n: "03",
      skill: "Market watch & pricing",
      desc: "Reads demand across your category, flags what is rising while there is still room to win, and keeps prices and promos moving with the market instead of months behind it.",
      exhibit: "EXHIBIT C",
      exhibitNote: "A wave, caught early.",
      image: "/media/pillar-trends.webp",
      alt: "A ceramic tumbler on a plinth with a rising line of light behind it like a growth chart, echo copies receding into the background.",
    },
    {
      n: "04",
      skill: "Product imagery & film",
      desc: "Studio-grade product photos and video, generated and edited on demand. New angle, clean background, seasonal set — no photographer on retainer.",
      exhibit: "EXHIBIT D",
      exhibitNote: "The reel.",
      video: "/media/studio-loop.mp4",
      poster: "/media/studio-loop-poster.webp",
      alt: "A slow cinematic loop of an amber serum bottle under a sweeping beam of warm light.",
    },
  ],
};

export const roles = {
  label: "SECTION 02 · THE ROLE",
  title: "Six positions. Consolidated into one.",
  body: "Every point tool starts from zero — the same assets re-uploaded, the same product re-explained, work that doesn’t match. This candidate is one brain across all six functions, so the work comes out consistent by default.",
  replaced: [
    "Web developer",
    "SEO freelancer",
    "Media buyer",
    "Email marketer",
    "Product photographer",
    "Pricing analyst",
  ],
  currentStack: {
    title: "THE STACK YOU HAVE NOW",
    items: [
      "A site builder that doesn’t know your ads",
      "An ad tool that doesn’t know your catalog",
      "A photo app that doesn’t know your brand",
      "Five logins, five bills, zero memory",
    ],
  },
  oneOperator: {
    title: "THE CANDIDATE",
    items: [
      "One brain across site, ads, pricing and creative",
      "Learns your brand once, applies it everywhere",
      "Every output consistent by default",
      "One teammate, always in context",
    ],
  },
};

export const supervision = {
  label: "SECTION 03 · TERMS OF SUPERVISION",
  title: "Works unattended. Never unchecked.",
  body: "The candidate plans, drafts and produces on its own — and brings you decisions, not chores. Anything that touches your live store or spends money waits for a human signature. That is not a setting; it is the employment contract.",
  stamp: "APPROVAL REQUIRED",
  points: [
    "You approve anything that publishes or spends",
    "Every change is drafted first, shipped second",
    "Least-privilege access — revoke any time",
  ],
};

export const compensation = {
  label: "SECTION 04 · COMPENSATION",
  title: "Salary expectation: nothing, for now.",
  body: "Vantage Connections is in closed beta. Founding stores get the full operator free while we build it with them — no card, no tiers, no catch. Pricing lands at public launch; founding stores keep their access.",
  planName: "Founding access",
  salary: "$0",
  salaryNote: "during probation (the closed beta)",
  benefitsTitle: "BENEFITS PACKAGE — INCLUDED",
  benefits: [
    "Storefront build, upkeep and always-on SEO",
    "Brand-aware ads, UGC and email creative",
    "Product image and video generation",
    "Market-aware pricing and promos",
    "Automated customer communications",
    "Competitor analysis and recommendations",
    "Full supervision — you approve what ships",
  ],
  cta: "Draft the offer letter",
  stamp: "NO CARD REQUIRED",
  fine: "Public launch coming soon · Founding stores keep their access",
  // Used only for JSON-LD priceValidUntil — never shown in the UI.
  offerDeadline: "2026-10-03",
};

export const interview = {
  label: "SECTION 05 · THE INTERVIEW",
  title: "First-round questions.",
  note: "Everything a founder asks before making the hire.",
  qs: [
    {
      q: "Does it actually work on its own, or am I managing it?",
      a: "It works on its own and brings you decisions, not chores — it plans, drafts and produces continuously. But anything that touches your live store or spends money waits for your approval. You keep the authority without doing the labor.",
    },
    {
      q: "Will the creative look like generic AI content?",
      a: "No — that is the point of one brain. It learns your brand once and applies it across your site, listings, ads and imagery, so the output stays consistent instead of stitched together from disconnected tools.",
    },
    {
      q: "Do I need to be technical?",
      a: "Not at all. It is built for founders who make physical products, not software. If you can run a Shopify store, you can put it to work.",
    },
    {
      q: "Does it work with my existing store?",
      a: "Yes. Connect your current Shopify store and it improves what you have — SEO, content, pricing, imagery. It can also build you a new storefront from scratch if you want a clean start.",
    },
    {
      q: "What happens to my ad spend?",
      a: "Campaigns are designed and run through a dedicated AI marketing engine. You set the budget and approve the creative and targeting before anything launches.",
    },
  ],
};

export const offer = {
  label: "FINAL SECTION · THE DECISION",
  title: "Extend the offer.",
  body: "The candidate can start this afternoon. Connect your store, review the plan it drafts, and approve the first queue of work by morning.",
  cta: "Draft the offer letter",
  note: "Free during the closed beta",
};

export const waitlist = {
  formNo: "FORM VC-002 · OFFER OF EMPLOYMENT",
  title: "The offer letter.",
  subtitle:
    "Leave your email and we’ll reach out with founding access for your store — the full operator, free while we’re in beta.",
  perks: [
    "A storefront built and kept on-brand",
    "Always-on SEO and content upkeep",
    "Brand-aware ads, UGC and email",
    "Market-aware pricing and promos",
    "Product imagery and video on demand",
    "Competitor analysis and recommendations",
    "You approve anything that publishes or spends",
  ],
  cta: "Extend the offer",
  fine: "No card required · free during beta",
  // Honest social proof: a floor ("50+"), never a fabricated exact count.
  socialProof: "Join 50+ founders reserving early access.",
  successStamp: "HIRED",
  successTitle: "Offer extended.",
  successBody:
    "Your spot is reserved. We’ll reach out with founding access for your store soon.",
};

export const dossierFooter = {
  references: "References available upon request.",
  tagline:
    "Vantage Connections — the digital operator for Shopify stores. One hire that builds, markets, prices and ships, so you can stay on the product.",
  formNo: "FORM VC-001 · FILED 2026",
};

export const trust = {
  line: "For founders who’d rather make things than manage dashboards.",
  points: [
    "Connects directly to your Shopify store",
    "Human approval on everything that goes live",
    "Learns your brand once, applies it everywhere",
  ],
};

// ── /enterprise — the sales-led page for high-volume brands & portfolios. ──
// Same product, premium framing: brand-safety, control, scale and ROI, with a
// "Book a demo" CTA instead of self-serve checkout. All copy is true-today:
// the security section speaks to principles + roadmap, never named standards
// or certifications Vantage doesn't yet hold.
export const enterprise = {
  nav: {
    links: [
      { label: "Portfolio", href: "#portfolio" },
      { label: "What you get", href: "#control" },
      { label: "Security", href: "#security" },
    ],
    cta: "Book a demo",
  },
  hero: {
    kicker: "Vantage Connections for Enterprise",
    headlineLead: "Brand-safe AI operations,",
    headlineEmph: "at the scale you run.",
    sub: "Vantage Connections is the autonomous operator for high-volume Shopify brands, multi-store portfolios and agencies. It builds, markets, prices and produces across every store you run — with the guardrails, control and support a brand your size demands.",
    cta: "Book a demo",
    note: "For Shopify Plus brands, multi-store portfolios and agencies.",
    points: [
      "Nothing publishes or spends without approval",
      "One brand-aware operator across every store",
      "Dedicated team, onboarding and priority queue",
    ],
  },
  stakes: {
    kicker: "What scale really costs",
    title: "At your volume, quiet decay gets expensive.",
    body: "The same slow leaks that nag a small store compound into real money across a full catalog and a portfolio of brands. Vantage Connections closes them on every storefront, continuously.",
    items: [
      {
        title: "Site rot at scale",
        desc: "Thousands of pages drifting out of search at once — organic traffic you never see leave.",
      },
      {
        title: "Ad drift × every brand",
        desc: "Spend running on tired creative across every account, burning more budget the more you run.",
      },
      {
        title: "Frozen pricing",
        desc: "Margins eroding across the whole catalog while no one watches the market store by store.",
      },
      {
        title: "Stale shelves everywhere",
        desc: "Reshoots and refreshes that never scale to the SKU count you actually carry.",
      },
    ],
  },
  portfolio: {
    kicker: "One operator, every store",
    title: "One brain across your whole portfolio.",
    body: "Point tools start from zero on every store. Vantage Connections is one operator that learns each brand once and applies it everywhere — so a ten-store portfolio stays as consistent and on-brand as a single flagship, without ten times the management.",
    nodes: [
      { label: "Flagship store", desc: "Built & maintained" },
      { label: "Second brand", desc: "On the same brain" },
      { label: "Third brand", desc: "Consistent by default" },
      { label: "New launch", desc: "Live in days" },
    ],
    caption: "One operator in. Every store on brand.",
    points: [
      "Consistent brand voice and look across every storefront",
      "One operator for many stores, brands and regions",
      "New stores onboarded into the same brain, not from scratch",
      "Portfolio-wide reporting, not ten disconnected dashboards",
    ],
  },
  // Image-led feature rows — same alternating treatment as the homepage, with
  // enterprise-targeted generated imagery. Bullets fold in the control, scale
  // and partnership story.
  features: [
    {
      id: "control",
      kicker: "Control",
      title: "Nothing goes live without your word.",
      body: "Vantage Connections works continuously and brings you decisions, not chores. Anything that touches a live store or spends money waits for a human — the bigger the brand, the more that matters, so it’s built in, not bolted on.",
      bullets: [
        "Approval-gated publishing & spend",
        "Roles & permissions per store",
        "Least-privilege, scoped access",
        "A tracked record of what shipped",
      ],
      image: "/media/ent-control-3.webp",
      imageAlt:
        "A solid brass wax-seal stamp beside a freshly pressed deep-forest wax seal on heavy bone paper, lit in warm brass and forest-green light.",
    },
    {
      id: "scale",
      kicker: "Throughput",
      title: "Production that keeps pace with your catalog.",
      body: "High-volume stores starve point tools. Vantage Connections runs a priority pipeline across your whole catalog — creative, imagery, video, pricing and SEO produced at the rate your calendar actually demands.",
      bullets: [
        "Priority generation queue",
        "Volume creative & video",
        "Market-aware pricing across the catalog",
        "Always-on SEO across every page",
      ],
      image: "/media/ent-scale-3.webp",
      imageAlt:
        "An ordered overhead grid of identical amber serum bottles on warm travertine — volume and consistency in one frame.",
    },
    {
      id: "team",
      kicker: "Partnership",
      title: "A team that owns your outcomes.",
      body: "Enterprise isn’t a shared queue. A named operator and CSM learn your brands, onboard your stores hands-on, and meet you on the numbers — what Vantage Connections shipped and what it moved.",
      bullets: [
        "Dedicated operator & CSM",
        "White-glove onboarding & migration",
        "Custom integrations to your stack",
        "Regular ROI business reviews",
      ],
      image: "/media/ent-team-2.webp",
      imageAlt:
        "A polished brass concierge bell on folded ivory linen atop travertine, lit like a luxury still-life.",
    },
  ],
  security: {
    kicker: "Security & data",
    title: "Your store, your data, handled with care.",
    body: "Vantage Connections only works because you trust it with the keys to your store. We treat that access the way a brand your size has to.",
    principles: [
      {
        title: "Least-privilege by default",
        desc: "Vantage requests only the scopes it needs for the work you approve, and you can revoke access at any time.",
      },
      {
        title: "Your brand model is yours",
        desc: "What Vantage learns about your brand works for you. We don’t sell your data or train a public model on it.",
      },
      {
        title: "Approvals on anything live",
        desc: "The same human-in-the-loop control that protects your storefront protects your data and spend.",
      },
      {
        title: "Data used to run your store",
        desc: "We use your store’s data to operate your store — not for anything you didn’t hire Vantage to do.",
      },
    ],
    roadmap:
      "As we grow with enterprise brands, we’re investing in formal security controls, independent reviews and the documentation your team expects. Your demo is the place to walk through exactly what you need.",
  },
  faqs: [
    {
      q: "How is enterprise priced?",
      a: "Custom and value-based, scoped to your store count and volume. You get everything in Growth plus a dedicated team, priority throughput and hands-on support. Book a demo and we’ll scope it together.",
    },
    {
      q: "Can Vantage Connections run more than one store?",
      a: "Yes. Vantage Connections is built to operate a portfolio. One operator learns each brand and runs every storefront, so multi-store and multi-brand stay consistent without multiplying your management.",
    },
    {
      q: "How do you keep AI from publishing off-brand work?",
      a: "Two ways. Vantage Connections learns your brand once and applies it everywhere, and nothing it produces goes live or spends without a human approval. Brand safety is the default, not a setting.",
    },
    {
      q: "What does onboarding look like?",
      a: "White-glove. A dedicated team connects your stores, migrates what matters and gets Vantage Connections working across your portfolio, so you see output fast instead of running a long setup yourself.",
    },
  ],
  demo: {
    kicker: "Book a demo",
    title: "See Vantage Connections run your operation.",
    body: "Walk through Vantage Connections on your own stores. We’ll scope your volume, show the controls and map the ROI before you commit to anything.",
    cta: "Book a demo",
  },
  // The "Book a demo" lead form (modal). Captured to Loops, tagged enterprise.
  form: {
    title: "Book a demo",
    subtitle:
      "Tell us about your operation and we’ll reach out to set up a walkthrough on your stores.",
    cta: "Request demo",
    note: "We’ll only use this to set up your demo. No spam.",
    successTitle: "Request received.",
    successBody:
      "Thanks — our team will reach out shortly to set up a walkthrough on your stores.",
    volumeOptions: [
      "$0–$1M / year",
      "$1M–$10M / year",
      "$10M–$50M / year",
      "$50M+ / year",
    ],
  },
} as const;

export const footer = {
  tagline:
    "The digital operator for Shopify stores. One hire that builds, markets, prices and ships, so you can stay on the product.",
  columns: [
    {
      title: "Product",
      links: [
        { label: "Qualifications", href: "#qualifications" },
        { label: "The role", href: "#role" },
        { label: "Compensation", href: "#compensation" },
        { label: "Interview", href: "#interview" },
        { label: "Enterprise", href: "/enterprise" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#" },
        { label: "Careers", href: "#" },
        { label: "Contact", href: "#" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#" },
        { label: "Terms", href: "#" },
      ],
    },
  ],
};
