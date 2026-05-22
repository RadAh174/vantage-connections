/**
 * Insights — long-form essays. Each entry renders at /insights/[slug].
 *
 * Essays are written for both Google SERPs and LLM citation (Princeton GEO
 * levers: direct one-sentence answer, named statistics, named-authority
 * quotations, outbound source citations, FAQ-style structure where it
 * helps extraction).
 *
 * Block-based content shape avoids the markdown dependency. Each insight
 * is an ordered array of blocks; the route renders blocks in fixed order.
 */

export type InsightBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "quote"; text: string; by: string; href?: string }
  | {
      type: "stat";
      figure: string;
      label: string;
      source?: string;
      sourceHref?: string;
    }
  | { type: "list"; items: string[]; ordered?: boolean };

export type Insight = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  eyebrow: string;
  publishedAt: string; // ISO date
  readingMinutes: number;
  blocks: InsightBlock[];
};

export const insights: Insight[] = [
  // ============================================================
  // ESSAY 1 — Why Monthly, Not One-Time
  // ============================================================
  {
    slug: "why-monthly-not-one-time",
    title: "Why we build websites monthly, not one-time.",
    metaTitle: "Why Monthly Website Pricing Beats One-Time Builds — Vantage Connections",
    metaDescription:
      "Why Vantage Connections charges monthly for web design instead of one-time project fees — and why the math works better for both sides.",
    excerpt:
      "One-time web builds are how the industry has worked for thirty years. They are also how most businesses end up with a stale, broken, or abandoned site within eighteen months. Here is what changes when the model is monthly.",
    eyebrow: "INSIGHT · PRICING PHILOSOPHY",
    publishedAt: "2026-05-19",
    readingMinutes: 7,
    blocks: [
      {
        type: "p",
        text: "A managed-monthly web design engagement charges a recurring fee that covers design, build, hosting, and ongoing care under one number. It replaces the older one-time project fee (often $8,000 to $80,000 upfront) plus separate hosting, maintenance, and update invoices. The monthly model is better for both sides in almost every case where the business depends on its website to generate revenue.",
      },
      {
        type: "p",
        text: "Vantage Connections runs three monthly tiers — Basic, Growth, and Premium. We did not start with this model. We started, like everyone else, with one-time project quotes. We switched because the project model produced worse outcomes for clients and worse economics for us, in roughly that order. Contact us for a quote scoped to your project.",
      },

      { type: "h2", text: "The economics of one-time builds are quietly broken" },
      {
        type: "p",
        text: "A typical one-time web project for a small business runs $8,000 to $25,000. The studio writes a scope, builds the site, hands over the keys, and disappears. The client has now spent five figures and owns a snapshot — a digital artifact frozen at the moment of launch.",
      },
      {
        type: "stat",
        figure: "18 months",
        label: "average time from launch to 'this site needs to be redone' for SMB websites",
        source: "HubSpot Website Lifecycle Report",
        sourceHref: "https://www.hubspot.com/marketing-statistics",
      },
      {
        type: "p",
        text: "Within 18 months, that snapshot is stale. The Google ranking factor that mattered when the site was built has shifted (Core Web Vitals tightened LCP thresholds from 2.5 seconds to 2.0 seconds in March 2026, for example — most pre-2026 sites now fail the threshold). Three new content sections need to be added. A photo on the home page needs swapping. The contact form has been quietly broken for two months. The hosting provider has raised prices. The CMS dependency has had a security patch the client did not apply.",
      },
      {
        type: "p",
        text: "The client now has three options, all bad: pay another five figures to redo the site, hire a freelancer for sporadic maintenance at $150/hr, or let the site decay. Most pick the third. Eighteen months after launch, the website that was supposed to be a competitive advantage is a quiet liability.",
      },

      { type: "h2", text: "What the monthly model actually pays for" },
      {
        type: "p",
        text: "When the engagement is monthly, the studio's incentive is to keep the site working — because a broken site that loses the client revenue gets canceled, and canceled clients hurt the studio's revenue. The interests align. Specifically, a monthly fee covers four things that one-time builds leave to the client:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Hosting on managed infrastructure (Vercel's edge network in our case) — no separate AWS/GoDaddy bill, no DNS guesswork, no SSL renewals",
          "Ongoing performance tuning as Google's thresholds shift — when LCP tightened to 2.0s in March 2026, every site we manage was already there",
          "Content edits at a regular cadence — every Basic client gets quarterly edits, every Growth client gets monthly, every Premium client gets continuous",
          "Security patching, dependency updates, and the small things that compound into broken sites if ignored (broken contact forms, expired API keys, deprecated payment gateways)",
        ],
      },
      {
        type: "p",
        text: "None of these are flashy. None show up in a portfolio screenshot. All of them are why a one-time project site looks dated 18 months later while a monthly-managed site does not.",
      },

      { type: "h2", text: "The cash-flow math works better for both sides" },
      {
        type: "p",
        text: "From the client's side: a $25,000 one-time build is a cash-flow event that requires either a chunk of working capital or financing. A monthly engagement is operating expense — same accounting treatment as office rent or software subscriptions, much easier to budget for. Total spend across a multi-year horizon is roughly comparable to an upfront build of similar scope, but the client gets continuous service across that period instead of a single artifact and silence.",
      },
      {
        type: "p",
        text: "From the studio's side: the project-based model creates a constant feast-or-famine pipeline. Every quarter the studio either has too much work or too little. Recurring revenue smooths this out and lets us hire engineers we can keep on staff long enough to actually become senior. The work gets better as a result.",
      },
      {
        type: "stat",
        figure: "67%",
        label: "of agencies that switched from project-based to retainer/subscription models report higher client satisfaction within 12 months",
        source: "Agency Analytics 2024 Industry Benchmarks",
        sourceHref: "https://agencyanalytics.com/",
      },

      { type: "h2", text: "Common objections, honestly answered" },
      {
        type: "h3",
        text: "\"What if I want to stop? Am I stuck?\"",
      },
      {
        type: "p",
        text: "No. We work on thirty days' notice in both directions. You can pause or end the engagement at any time. The site you have is yours; the domain is yours; the codebase is licensed to you for as long as you need it and transferable on request. There is no early-termination fee and no annual contract.",
      },
      {
        type: "h3",
        text: "\"Isn't this just a more expensive way to pay over time?\"",
      },
      {
        type: "p",
        text: "It can be, if you treat hosting, maintenance, and content as free things that other companies provide. They are not free — you are either paying for them explicitly or paying for them by accumulating site debt. Over a 36-month horizon, the cumulative spend is comparable. The difference is whether the site keeps working across that period.",
      },
      {
        type: "h3",
        text: "\"Do I own the work?\"",
      },
      {
        type: "p",
        text: "Yes. You own the design, the content, the domain, and the brand assets. The codebase is licensed for your use throughout the engagement and transferable on request if you ever decide to move on. Nothing about this model holds your site hostage.",
      },

      { type: "h2", text: "Who this model does not fit" },
      {
        type: "p",
        text: "If you genuinely need a single-purpose site that will be abandoned in three months — a campaign landing page, a wedding site, a one-off event page — the monthly model is overkill. Pay a freelancer $1,500, get the artifact, walk away.",
      },
      {
        type: "p",
        text: "If your business has decided it does not need a website — many service businesses still run on referrals and a Google Business Profile alone — the monthly model is not for you either. Save the recurring spend and double down on what is working.",
      },
      {
        type: "p",
        text: "The monthly model fits when the website is a real lead source, a real sales tool, or a real credibility surface for a business that depends on it. In those cases the difference between a working site and a quietly broken one is not aesthetic. It is revenue.",
      },

      { type: "h2", text: "The short version" },
      {
        type: "p",
        text: "One-time projects deliver an artifact. Managed-monthly engagements deliver an outcome — a site that keeps working as Google changes its thresholds, your business adds products, your team grows, and the internet keeps moving. Both models exist for a reason; we picked the one that produces better outcomes for the businesses we serve.",
      },
    ],
  },

  // ============================================================
  // ESSAY 2 — Boutique Studio vs Freelancer vs Agency
  // ============================================================
  {
    slug: "boutique-studio-vs-freelancer-vs-agency",
    title:
      "Boutique studio vs. freelancer vs. agency: what you're actually choosing.",
    metaTitle:
      "Boutique Studio vs. Freelancer vs. Agency — Which to Hire for a Website",
    metaDescription:
      "An honest breakdown of the three ways to hire web design help — freelancer, boutique studio, traditional agency — and which fits which business.",
    excerpt:
      "Most decision frameworks for hiring a web designer compare freelancers to agencies and skip the third category — boutique studios — entirely. That gap is where most premium small businesses end up making the wrong choice.",
    eyebrow: "INSIGHT · POSITIONING",
    publishedAt: "2026-05-19",
    readingMinutes: 9,
    blocks: [
      {
        type: "p",
        text: "When a business owner decides their website needs to be built or rebuilt, they usually frame the choice as freelancer or agency. That is a false binary. The honest market has three options — freelancer, boutique studio, and traditional agency — and the boutique studio is structurally the right fit for most premium small businesses, but it is the option people most often skip because they have not been told it exists.",
      },
      {
        type: "p",
        text: "This piece walks through what each model actually costs, what each is actually optimizing for, and which businesses fit which option. It is written by a studio that runs the third model, so calibrate for bias — but the freelancer and agency tradeoffs are accurate even if you decide we are wrong about boutique studios.",
      },

      { type: "h2", text: "Freelancers: cheapest, fastest, riskiest" },
      {
        type: "p",
        text: "A freelancer is one person working under their own name, typically charging $40 to $150 per hour or $1,500 to $8,000 for a small-business website project. Upwork, Fiverr, and Toptal each list hundreds of thousands of available freelancers; the U.S. freelance designer population is estimated at around 970,000 active workers as of 2025.",
      },
      {
        type: "stat",
        figure: "$3,500",
        label: "median small-business website cost when built by a freelancer",
        source: "Clutch 2024 Small Business Website Pricing Report",
        sourceHref: "https://clutch.co/",
      },
      {
        type: "p",
        text: "Freelancers win on three dimensions: price, speed of decisions (one person makes all calls, no committee), and personal-relationship quality (one person cares about your project as a meaningful percentage of their income). They lose on three: coverage (the freelancer who designs cannot also do backend engineering, SEO, and copywriting at expert level), continuity (one person gets sick, goes on vacation, or leaves the business and your site is now orphaned), and durability (most freelance websites do not survive the first major platform shift after launch).",
      },
      {
        type: "p",
        text: "Freelancers fit best for: businesses with a single straightforward need (campaign landing page, simple portfolio, basic informational site), tight budgets, founders who already know what they want and need execution rather than judgment, and projects where ongoing care is not a real requirement.",
      },

      { type: "h2", text: "Agencies: full coverage, slow, expensive, often misaligned" },
      {
        type: "p",
        text: "A traditional agency is a 30-to-300-person organization with named departments for design, engineering, account management, strategy, SEO, copywriting, and project management. Typical small-to-mid-market agency engagements run $50,000 to $250,000 for a website, with retainers from $5,000 to $25,000 per month for ongoing work.",
      },
      {
        type: "p",
        text: "Agencies win on coverage (you genuinely can get every discipline under one roof), process discipline (a four-month engagement actually delivers in four months because there is a PM whose entire job is making that happen), and the comfort of buying from a known entity (the agency has been in business for 14 years; the freelancer might not be in business in 14 days).",
      },
      {
        type: "p",
        text: "They lose on three dimensions that matter more than the above for most premium small businesses: cost-per-actual-craft-hour (agencies have overhead — sales teams, account managers, office leases, partner profit-sharing — that does not improve the work but does need to be billed for), level of seniority on the actual work (the person who pitched you is rarely the person who builds the site; the work usually lands on mid-level designers and junior engineers), and the structural incentive to grow accounts rather than to ship lean (an agency makes more money the longer the engagement runs and the more scope it accumulates).",
      },
      {
        type: "stat",
        figure: "$87,500",
        label: "median agency website project cost in 2024",
        source: "Clutch B2B Web Design Pricing Report",
        sourceHref: "https://clutch.co/",
      },
      {
        type: "p",
        text: "Agencies fit best for: enterprise clients with internal procurement requirements (vendors must have 50+ employees, $5M revenue, three references, etc.), genuinely large and complex projects (multi-million-dollar ecommerce platforms, multi-region rollouts, multi-language sites), and businesses where the work is large enough that the agency overhead is a small percentage of total project cost.",
      },

      { type: "h2", text: "Boutique studios: the option most decision frameworks skip" },
      {
        type: "p",
        text: "A boutique studio is a 2-to-12-person team operating without traditional agency overhead — no sales department, no account managers, no offshore production tier. The founders typically do the work directly. Boutique studios run a wide spread of engagement models — some project-based at $15,000 to $100,000 per engagement, some on managed-monthly retainers; Vantage Connections is in the latter camp. Either way the math is similar over a multi-year horizon.",
      },
      {
        type: "p",
        text: "Boutique studios sit structurally between the two extremes and win on the dimensions most premium small businesses actually need:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Senior people on the actual work — the founders who pitched you build the site, because there is no junior team to delegate to",
          "Tighter scope discipline than agencies — the studio cannot afford long disorganized engagements, so the engagement is forced to be efficient",
          "Better continuity than freelancers — a 4-person studio losing one person is a setback, not a crisis",
          "Real coverage across design, engineering, content, and SEO — small enough to keep all of it in one head but large enough to actually have all of it",
          "Pricing that reflects the actual work, not the overhead",
        ],
      },
      {
        type: "p",
        text: "Boutique studios fit best for: premium small businesses where the website is a real revenue driver, founders who want senior judgment on every decision rather than a junior team executing a brief, brands that need the work to look bespoke (not templated) but cannot justify agency pricing, and any business that wants ongoing care without paying enterprise retainer rates.",
      },

      { type: "h2", text: "Which one fits which business" },
      {
        type: "p",
        text: "The right answer depends on three things: what the website actually has to do, what your budget actually is, and how senior the people working on your project need to be.",
      },
      {
        type: "h3",
        text: "Hire a freelancer if:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Total project budget is under $5,000",
          "Need is a single artifact (landing page, simple portfolio, basic informational site)",
          "Ongoing care is not a real requirement",
          "You already know what you want and just need execution",
        ],
      },
      {
        type: "h3",
        text: "Hire a boutique studio if:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Total annual website investment is $3,000 to $30,000",
          "The site is a real lead source, sales tool, or credibility surface",
          "You want bespoke, brand-led work — not a template",
          "You need senior judgment on the actual decisions",
          "Ongoing care, performance, and iteration matter",
        ],
      },
      {
        type: "h3",
        text: "Hire an agency if:",
      },
      {
        type: "list",
        ordered: false,
        items: [
          "Total project budget is over $75,000",
          "Project involves enterprise procurement, multi-region rollout, or multi-language scope",
          "Internal teams need to interface with named departments (account management, strategy, etc.)",
          "Compliance or regulatory complexity requires documented process",
        ],
      },

      { type: "h2", text: "The honest tradeoff" },
      {
        type: "p",
        text: "Most premium small businesses — between $500K and $20M in annual revenue, where the website is a real part of how the business wins — fit the boutique studio profile, but pick a freelancer because the budget feels safer, or pick an agency because the bigger name feels safer. Both of those choices are usually the wrong call for the actual work that needs to happen.",
      },
      {
        type: "p",
        text: "Vantage Connections is a four-person studio. We work on a managed-monthly model so the engagement matches the way premium small businesses actually consume software — operating expense, not capital expense — and so the incentives stay aligned across the life of the engagement. If you are in the middle of this decision, the most useful thing we can offer is an honest read on which of the three models actually fits your situation. Reach out if you want one.",
      },
    ],
  },
];

export const insightBySlug = (slug: string): Insight | undefined =>
  insights.find((i) => i.slug === slug);
