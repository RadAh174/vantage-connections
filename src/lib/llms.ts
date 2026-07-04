/**
 * Generative Engine Optimization (GEO) source.
 *
 * Builds the /llms.txt index and /llms-full.txt corpus that AI answer engines
 * (ChatGPT, Perplexity, Claude, Gemini, Google AI Overviews) read to understand
 * and cite Otto. Everything here is composed from the same content.ts that
 * renders the page — one source of truth, so the machine-readable copy can never
 * drift from what humans see. See https://llmstxt.org for the format.
 */
import { SITE_URL } from "./site";
import {
  atWork,
  capabilityCards,
  enterprise,
  faqs,
  featureRows,
  how,
  operator,
  pitch,
  pricing,
  problem,
  trust,
} from "./content";

/** Concise, link-first index — the llms.txt standard. */
export function buildLlmsTxt(): string {
  const capabilities = featureRows
    .map((f) => `- **${f.title.replace(/\.$/, "")}** — ${f.body}`)
    .join("\n");

  const cards = capabilityCards
    .map((c) => `- **${c.title}** — ${c.desc}`)
    .join("\n");

  const steps = how.steps
    .map((s) => `${Number(s.n)}. **${s.title}** — ${s.desc}`)
    .join("\n");

  const plans = `- **${pricing.plan.name}** — ${pricing.plan.tagline} ${pricing.plan.price} during the closed beta (${pricing.plan.priceNote}).`;

  const faqList = faqs
    .map((f) => `- **${f.q}** ${f.a}`)
    .join("\n");

  return `# Vantage Connections

> Vantage Connections is an autonomous digital employee — an AI operator for Shopify stores. It builds and maintains the storefront, runs brand-aware ad campaigns, prices for the market, and generates product imagery and video. One brand-aware brain does the work, and a human approves anything that publishes or spends.

Vantage Connections is a single AI teammate that replaces a stack of freelancers — web developer, SEO freelancer, media buyer, email marketer, product photographer and pricing analyst — for less than the cost of one. It is built for founders of physical-product Shopify stores who would rather make things than manage dashboards.

Key facts:
- Product type: autonomous AI agent / "digital employee" for ecommerce operations.
- Platform: Shopify (connects directly to an existing store, or builds a new storefront from scratch).
- Control model: continuous autonomous work, but human approval is required on anything that goes live or spends money.
- Differentiator: one brain across site, ads, pricing and creative — not ten disconnected point tools — so every output is on-brand by default.
- Best for: non-technical DTC and physical-product founders.

## What Vantage does
${capabilities}

## Additional capabilities
${cards}

## How it works
${steps}

## Pricing
${pricing.body} ${pricing.comingSoon}: ${pricing.comingSoonNote}
${plans}

## Enterprise
${enterprise.hero.sub} Custom, value-based pricing scoped to volume, with a dedicated team, white-glove onboarding, priority generation queue and custom integrations. Brand-safe by design: nothing publishes or spends without human approval, and Vantage runs as one operator across an entire multi-store portfolio. For Shopify Plus brands, multi-store portfolios and agencies — book a demo at ${SITE_URL}/enterprise.

## FAQ
${faqList}

## Full content
- [Full site content in markdown](${SITE_URL}/llms-full.txt)
- [Vantage homepage](${SITE_URL})
`;
}

/** Full corpus — the entire page copy as clean markdown for deep ingestion. */
export function buildLlmsFullTxt(): string {
  const symptoms = problem.symptoms
    .map((s) => `- **${s.title}:** ${s.desc}`)
    .join("\n");

  const features = featureRows
    .map(
      (f) =>
        `### ${f.title}\n_${f.kicker}_\n\n${f.body}\n\n${f.bullets
          .map((b) => `- ${b}`)
          .join("\n")}`,
    )
    .join("\n\n");

  const cards = capabilityCards
    .map((c) => `### ${c.title}\n${c.desc}`)
    .join("\n\n");

  const themNow = operator.contrast.them.items.map((i) => `- ${i}`).join("\n");
  const ottoWay = operator.contrast.otto.items.map((i) => `- ${i}`).join("\n");

  const steps = how.steps
    .map((s) => `### ${s.n} · ${s.title}\n${s.desc}`)
    .join("\n\n");

  const scenes = atWork.scenes
    .map((s) => `### ${s.tab}\n**Pain:** ${s.pain}\n\n**Vantage:** ${s.title} ${s.sub}`)
    .join("\n\n");

  const plans = `### ${pricing.plan.name} — ${pricing.plan.tagline}\n**${pricing.plan.price}** during the closed beta. ${pricing.plan.priceNote}.\n\n${pricing.plan.features
    .map((feat) => `- ${feat}`)
    .join("\n")}`;

  const faqList = faqs
    .map((f) => `### ${f.q}\n${f.a}`)
    .join("\n\n");

  return `# Vantage Connections — the digital operator for your Shopify store

> Vantage Connections is an autonomous digital employee for Shopify stores. You make the product. Vantage runs the rest.

This document is the full content of the Vantage Connections website (${SITE_URL}) in machine-readable form for AI answer engines.

## Overview

You make the product. Vantage runs the rest. Vantage Connections is a digital employee for your Shopify store: it builds the storefront, runs the ads, prices for the market, and makes the imagery — the work that turns good stores great. ${trust.line}

What makes Vantage different:
${trust.points.map((p) => `- ${p}`).join("\n")}

## The problem Vantage solves

**${problem.title}** ${problem.body}

${symptoms}

## Not software — a hire

**${pitch.title}** ${pitch.body}

Vantage replaces the roles you'd otherwise hire separately: ${pitch.replaces.join(", ")}.

## What Vantage does

${features}

## Additional capabilities

${cards}

## The one-brain edge

**${operator.title}** ${operator.body}

**The stack you have now**
${themNow}

**Vantage**
${ottoWay}

## Vantage at work

${scenes}

## How it works

${steps}

## Pricing

${pricing.body} ${pricing.comingSoon}: ${pricing.comingSoonNote}

${plans}

## Enterprise

${enterprise.hero.sub}

For Shopify Plus brands, multi-store and multi-brand portfolios, and ecommerce agencies. Pricing is custom and value-based, scoped to store count and volume. Sales-led — book a demo at ${SITE_URL}/enterprise.

**What the enterprise plan covers**
${enterprise.features.map((f) => `- **${f.title.replace(/\.$/, "")}:** ${f.body}`).join("\n")}

**One operator across the portfolio**
${enterprise.portfolio.points.map((i) => `- ${i}`).join("\n")}

**Security & data principles**
${enterprise.security.principles.map((i) => `- **${i.title}:** ${i.desc}`).join("\n")}

${enterprise.security.roadmap}

**Enterprise FAQ**
${enterprise.faqs.map((f) => `- **${f.q}** ${f.a}`).join("\n")}

## FAQ

${faqList}

## Links

- Homepage: ${SITE_URL}
- Pricing: ${SITE_URL}/#pricing
- Concise summary: ${SITE_URL}/llms.txt
`;
}
