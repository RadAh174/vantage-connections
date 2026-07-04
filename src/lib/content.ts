/**
 * Vantage — landing page content.
 * Single source of truth for copy. All text is real marketing copy
 * written for this product; nothing here is placeholder data.
 */

export const nav = {
  links: [
    { label: "What Vantage does", href: "#capabilities" },
    { label: "The one-brain edge", href: "#operator" },
    { label: "How it works", href: "#how" },
    { label: "Pricing", href: "#pricing" },
  ],
  cta: { label: "Join the waitlist", href: "#pricing" },
};

export const hero = {
  kicker: "Your store’s digital operator",
  headlineLead: "You make the product.",
  headlineEmph: "Vantage runs the rest.",
  sub: "A digital employee for your Shopify store. It builds the storefront, runs the ads, prices for the market, and makes the imagery. The work that turns good stores great.",
  primary: { label: "Join the waitlist", href: "#pricing" },
  secondary: { label: "See what it handles", href: "#capabilities" },
};

export const trust = {
  line: "For founders who’d rather make things than manage dashboards.",
  points: [
    "Connects directly to your Shopify store",
    "Human approval on everything that goes live",
    "Learns your brand once, applies it everywhere",
  ],
};

export const problem = {
  kicker: "The slow leak",
  title: "Your store doesn’t fail loudly. It rots quietly.",
  body: "No one neglects a store on purpose. It happens in small omissions. SEO drifts, copy goes stale, ads run on old logic, prices lag, photos age. Each is minor. Together they decide whether you compound or flatline.",
  symptoms: [
    {
      title: "Site rot",
      desc: "Metadata, content and structure decay until search quietly stops sending traffic.",
    },
    {
      title: "Ad drift",
      desc: "Campaigns keep spending on creative that stopped working weeks ago.",
    },
    {
      title: "Frozen pricing",
      desc: "Margins erode and promos misfire while nobody watches the market.",
    },
    {
      title: "Stale shelves",
      desc: "The same six photos, season after season, while rivals refresh.",
    },
  ],
};

export const pitch = {
  kicker: "Not software. A hire.",
  title: "The first digital employee for your store.",
  body: "Not another tab in your toolbar. It’s the operator you put in charge of the work that never reaches the top of your list. The web developer, SEO freelancer, media buyer and photographer you’d hire with more budget, in one teammate that knows your brand and never logs off.",
  replaces: [
    "Web developer",
    "SEO freelancer",
    "Media buyer",
    "Email marketer",
    "Product photographer",
    "Pricing analyst",
  ],
};

// Alternating big feature rows — each pairs with a generated image.
export const featureRows = [
  {
    id: "storefront",
    kicker: "Foundation",
    title: "A storefront that maintains itself.",
    body: "Vantage builds a fast, on-brand storefront, then keeps it alive. SEO and GEO, fresh content and technical hygiene on a loop. It gains ground every week instead of slipping down the page.",
    bullets: [
      "Conversion-minded storefront build",
      "Always-on SEO & generative-engine optimization",
      "Content refreshes that prevent decay",
    ],
    image: "/media/feature-storefront.webp",
    imageAlt:
      "A single elegant ceramic vase with dried botanicals on a sunlit travertine pedestal in warm bone and brass tones.",
  },
  {
    id: "creative",
    kicker: "Acquisition",
    title: "Ads from a brain that knows your brand.",
    body: "The same Vantage that builds your site writes and art-directs your ads. Creative, UGC and email, then runs the campaigns. No agency template. No AI slop. Nothing spends until you approve it.",
    bullets: [
      "Creative, UGC & email built on your brand",
      "Automated ad pipelines, human-approved",
      "Works for existing products and new launches",
    ],
    image: "/media/feature-creative.webp",
    imageAlt:
      "A dramatic luxury advertising shot of an amber serum bottle on a brass pedestal with a ribbon of serum arcing mid-splash.",
  },
  {
    id: "studio",
    kicker: "Merchandising",
    title: "Product imagery, made on demand.",
    body: "New angle, clean background, seasonal set, a PDP video. Vantage produces and edits product imagery that looks studio-shot and on-brand. Fresh shelves, no photographer on retainer.",
    bullets: [
      "Studio-grade product images & video",
      "On-brand edits, backgrounds and sets",
      "Refreshed catalogs every season",
    ],
    image: "/media/feature-product.webp",
    imageAlt:
      "An artisan candle in an amber glass vessel with a live flame, styled with raw materials on warm ivory linen.",
  },
];

// Smaller capability cards (icon-led, no image).
export const capabilityCards = [
  {
    icon: "TrendingUp",
    title: "Market-aware pricing",
    desc: "Pricing and promo moves that track demand and competitors, so margins stay with the market, not months behind it.",
  },
  {
    icon: "Sparkles",
    title: "New-product radar",
    desc: "Vantage watches your category and surfaces the next products worth adding, with the demand signal to back it.",
  },
  {
    icon: "LayoutGrid",
    title: "Catalog optimization",
    desc: "Automated merchandising that puts the right products in front of the right shoppers.",
  },
  {
    icon: "Wallet",
    title: "Financial hygiene",
    desc: "Backend tooling that watches cash flow and flags what’s quietly eating your margin.",
  },
];

export const operator = {
  kicker: "The one-brain edge",
  title: "One operator. Not ten disconnected tools.",
  body: "Every point tool starts from zero. Same assets re-uploaded, same product re-explained, work that doesn’t match. Vantage is one brain. The model that builds your site lists your products, writes your ads and makes your creative. Consistent, because it comes from one place that knows you.",
  contrast: {
    them: {
      label: "The stack you have now",
      items: [
        "A site builder that doesn’t know your ads",
        "An ad tool that doesn’t know your catalog",
        "A photo app that doesn’t know your brand",
        "Five logins, five bills, zero memory",
      ],
    },
    otto: {
      label: "Vantage",
      items: [
        "One brain across site, ads, pricing & creative",
        "Learns your brand once, applies it everywhere",
        "Every output consistent by default",
        "One teammate, always in context",
      ],
    },
  },
};

export const how = {
  kicker: "How it works",
  title: "Hired in an afternoon. Working by morning.",
  steps: [
    {
      n: "01",
      title: "Connect your Shopify",
      desc: "Link your store in a few clicks. Vantage reads your catalog, traffic and history to learn where you stand.",
    },
    {
      n: "02",
      title: "Vantage learns your brand",
      desc: "It studies your voice, your look and your products, then drafts a plan: what to fix, build and launch first.",
    },
    {
      n: "03",
      title: "You approve, Vantage ships",
      desc: "Nothing goes live without your sign-off. Approve the queue and Vantage executes, then moves to the next thing.",
    },
  ],
};

export const pricing = {
  kicker: "Pricing",
  title: "Free while we’re in beta.",
  body: "Vantage is in closed beta. Founding stores get the full operator at no cost while we build it with them — no card, no tiers, no catch.",
  // Small badge above the plan.
  offerBadge: "Free during beta",
  // Replaces the old countdown — a plain "coming soon" note, no ticking clock.
  comingSoon: "Public launch coming soon",
  comingSoonNote:
    "Pricing lands when we leave beta. Founding stores keep their access.",
  // Used only for JSON-LD priceValidUntil — never shown in the UI.
  offerDeadline: "2026-10-03",
  // The single, everything-included plan.
  plan: {
    name: "Founding access",
    tagline: "The whole operator, free while we build it with you.",
    price: "Free",
    priceNote: "No card required · everything included · human-approved",
    cta: "Join the waitlist",
    features: [
      "Storefront build, upkeep & always-on SEO",
      "Brand-aware ads, UGC & email creative",
      "Product image & video generation",
      "Market-aware pricing & promos",
      "Automated customer communications",
      "Competitor analysis & recommendations",
      "You approve anything that publishes or spends",
    ],
  },
};

export const faqs = [
  {
    q: "Is Vantage actually autonomous, or do I babysit it?",
    a: "Vantage works on its own and brings you decisions, not chores. It plans, drafts and produces continuously. But anything that touches your live store or spends money waits for approval. You stay in control without doing the labor.",
  },
  {
    q: "Will the creative look like generic AI content?",
    a: "No. That’s the point. Vantage learns your brand once and applies it across your site, listings, ads and imagery. One brain that knows your product, so the output stays consistent instead of stitched together from disconnected tools.",
  },
  {
    q: "Do I need to be technical?",
    a: "Not at all. Vantage is built for founders who make physical products, not software. If you can run a Shopify store, you can put Vantage to work.",
  },
  {
    q: "Does it work with my existing store?",
    a: "Yes. Connect your current Shopify store and Vantage improves what you have: SEO, content, pricing and imagery. It can also build a new storefront from scratch if you want a clean start.",
  },
  {
    q: "What about my ad spend?",
    a: "Vantage designs and runs the campaigns through a dedicated AI marketing engine. You set the budget and approve the creative and targeting before anything launches.",
  },
];

// "Vantage at work" — pinned scroll section; each beat leads with the pain,
// then the service Vantage delivers. Big, free-form, no fake UI chrome.
export const atWork = {
  kicker: "Vantage at work",
  heading: "The whole back office. Handled.",
  scenes: [
    {
      id: "storefront",
      tab: "Storefront",
      pain: "Your site is quietly going stale.",
      title: "Vantage builds and maintains your store.",
      sub: "A fast, on-brand storefront, kept sharp with continuous upkeep so it never rots.",
    },
    {
      id: "ads",
      tab: "Marketing",
      pain: "You have no time to make ads.",
      title: "Vantage writes, shoots and runs them.",
      sub: "Brand-aware creative, UGC and email, produced and queued for your approval.",
    },
    {
      id: "trends",
      tab: "Trends",
      pain: "By the time you spot it, you’re buying the peak.",
      title: "Vantage catches the wave before the crowd.",
      sub: "It reads demand across your category and flags what’s rising while there’s still room to win. Launch early instead of buying the peak.",
    },
    {
      id: "studio",
      tab: "Studio",
      pain: "Reshoots cost a fortune.",
      title: "Vantage makes your product imagery.",
      sub: "Studio-grade images and video, generated and edited on demand, matched to your brand.",
    },
  ],
};

export const finalCta = {
  kicker: "Give your store an operator",
  title: "Stop managing the logistics. Start outgrowing them.",
  body: "Put Vantage in charge of the work that takes a store from good to great. Get back to the part only you can do.",
  primary: { label: "Get started" },
  secondary: { label: "See plans", href: "#pricing" },
};

export const waitlist = {
  kicker: "Founding access",
  title: "Join the beta and get Vantage free.",
  subtitle:
    "Vantage is onboarding its first group of stores. Reserve your spot to get the full operator free while we’re in beta.",
  perks: [
    "A storefront built and kept on-brand",
    "Always-on SEO and content upkeep",
    "Brand-aware ads, UGC and email",
    "Market-aware pricing and promos",
    "Product imagery and video on demand",
    "Competitor analysis and recommendations",
    "You approve anything that publishes or spends",
  ],
  offerLabel: "Free beta",
  offerLine: "The full operator, free while we’re in beta — no card required.",
  // Honest social proof: a floor ("50+"), never a fabricated exact count.
  socialProof: "Join 50+ founders reserving early access.",
  formTitle: "Reserve your spot",
  formSubtitle:
    "We’re in closed beta. Leave your email and we’ll reach out with your founding access.",
  cta: "Join the waitlist",
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
    kicker: "Vantage for Enterprise",
    headlineLead: "Brand-safe AI operations,",
    headlineEmph: "at the scale you run.",
    sub: "Vantage is the autonomous operator for high-volume Shopify brands, multi-store portfolios and agencies. It builds, markets, prices and produces across every store you run — with the guardrails, control and support a brand your size demands.",
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
    body: "The same slow leaks that nag a small store compound into real money across a full catalog and a portfolio of brands. Vantage closes them on every storefront, continuously.",
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
    body: "Point tools start from zero on every store. Vantage is one operator that learns each brand once and applies it everywhere — so a ten-store portfolio stays as consistent and on-brand as a single flagship, without ten times the management.",
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
      body: "Vantage works continuously and brings you decisions, not chores. Anything that touches a live store or spends money waits for a human — the bigger the brand, the more that matters, so it’s built in, not bolted on.",
      bullets: [
        "Approval-gated publishing & spend",
        "Roles & permissions per store",
        "Least-privilege, scoped access",
        "A tracked record of what shipped",
      ],
      image: "/media/ent-control.webp",
      imageAlt:
        "A solid brass wax-seal stamp beside a freshly pressed deep-forest wax seal on heavy bone paper, lit in warm brass and forest-green light.",
    },
    {
      id: "scale",
      kicker: "Throughput",
      title: "Production that keeps pace with your catalog.",
      body: "High-volume stores starve point tools. Vantage runs a priority pipeline across your whole catalog — creative, imagery, video, pricing and SEO produced at the rate your calendar actually demands.",
      bullets: [
        "Priority generation queue",
        "Volume creative & video",
        "Market-aware pricing across the catalog",
        "Always-on SEO across every page",
      ],
      image: "/media/ent-scale.webp",
      imageAlt:
        "An ordered overhead grid of identical amber serum bottles on warm travertine — volume and consistency in one frame.",
    },
    {
      id: "team",
      kicker: "Partnership",
      title: "A team that owns your outcomes.",
      body: "Enterprise isn’t a shared queue. A named operator and CSM learn your brands, onboard your stores hands-on, and meet you on the numbers — what Vantage shipped and what it moved.",
      bullets: [
        "Dedicated operator & CSM",
        "White-glove onboarding & migration",
        "Custom integrations to your stack",
        "Regular ROI business reviews",
      ],
      image: "/media/ent-team.webp",
      imageAlt:
        "A polished brass concierge bell on folded ivory linen atop travertine, lit like a luxury still-life.",
    },
  ],
  security: {
    kicker: "Security & data",
    title: "Your store, your data, handled with care.",
    body: "Vantage only works because you trust it with the keys to your store. We treat that access the way a brand your size has to.",
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
      q: "Can Vantage run more than one store?",
      a: "Yes. Vantage is built to operate a portfolio. One operator learns each brand and runs every storefront, so multi-store and multi-brand stay consistent without multiplying your management.",
    },
    {
      q: "How do you keep AI from publishing off-brand work?",
      a: "Two ways. Vantage learns your brand once and applies it everywhere, and nothing it produces goes live or spends without a human approval. Brand safety is the default, not a setting.",
    },
    {
      q: "What does onboarding look like?",
      a: "White-glove. A dedicated team connects your stores, migrates what matters and gets Vantage working across your portfolio, so you see output fast instead of running a long setup yourself.",
    },
  ],
  demo: {
    kicker: "Book a demo",
    title: "See Vantage run your operation.",
    body: "Walk through Vantage on your own stores. We’ll scope your volume, show the controls and map the ROI before you commit to anything.",
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
        { label: "What Vantage does", href: "#capabilities" },
        { label: "The one-brain edge", href: "#operator" },
        { label: "How it works", href: "#how" },
        { label: "Pricing", href: "#pricing" },
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
