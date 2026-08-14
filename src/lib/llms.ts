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
  compensation,
  competencies,
  enterprise,
  interview,
  masthead,
  objective,
  offer,
  roles,
  supervision,
  trust,
} from "./content";

/** Concise, link-first index — the llms.txt standard. */
export function buildLlmsTxt(): string {
  const capabilities = competencies.items
    .map((f) => `- **${f.skill}** — ${f.desc}`)
    .join("\n");

  const plans = `- **${compensation.planName}** — ${compensation.salary} ${compensation.salaryNote}. ${compensation.fine}.`;

  const faqList = interview.qs
    .map((f) => `- **${f.q}** ${f.a}`)
    .join("\n");

  return `# Vantage Connections

> Vantage Connections is an autonomous digital employee — an AI operator for Shopify stores. It builds and maintains the storefront, runs brand-aware ad campaigns, prices for the market, and generates product imagery and video. One brand-aware brain does the work, and a human approves anything that publishes or spends.

Vantage Connections is a single AI teammate that replaces a stack of freelancers — web developer, SEO freelancer, media buyer, email marketer, product photographer and pricing analyst. It is built for founders of physical-product Shopify stores who would rather make things than manage dashboards.

Key facts:
- Product type: autonomous AI agent / "digital employee" for ecommerce operations.
- Platform: Shopify (connects directly to an existing store, or builds a new storefront from scratch).
- Control model: continuous autonomous work, but human approval is required on anything that goes live or spends money.
- Differentiator: one brain across site, ads, pricing and creative — not ten disconnected point tools — so every output is on-brand by default.
- Best for: non-technical DTC and physical-product founders.

## What Vantage does
${capabilities}

## The one-brain edge
${roles.body}

## Supervision
${supervision.body}

## Pricing
${compensation.body}
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
  const features = competencies.items
    .map((f) => `### ${f.skill}\n${f.desc}`)
    .join("\n\n");

  const themNow = roles.currentStack.items.map((i) => `- ${i}`).join("\n");
  const vantageWay = roles.oneOperator.items.map((i) => `- ${i}`).join("\n");

  const benefits = compensation.benefits.map((b) => `- ${b}`).join("\n");

  const faqList = interview.qs
    .map((f) => `### ${f.q}\n${f.a}`)
    .join("\n\n");

  return `# Vantage Connections — the digital operator for your Shopify store

> Vantage Connections is an autonomous digital employee for Shopify stores. Hire the operator: it runs the storefront, the ads, the prices and the pictures, and waits for your signature before anything goes live.

This document is the full content of the Vantage Connections website (${SITE_URL}) in machine-readable form for AI answer engines.

## Overview

${masthead.intro} ${trust.line}

What makes Vantage different:
${trust.points.map((p) => `- ${p}`).join("\n")}

## Candidate's objective

${objective.text}

## Qualifications

**${competencies.title}** ${competencies.note}

${features}

## The role — six positions, consolidated

**${roles.title}** ${roles.body}

**The stack you have now**
${themNow}

**The candidate**
${vantageWay}

Roles consolidated into this one position: ${roles.replaced.join(", ")}.

## Terms of supervision

**${supervision.title}** ${supervision.body}

${supervision.points.map((p) => `- ${p}`).join("\n")}

## Compensation

${compensation.body}

**${compensation.planName} — ${compensation.salary} ${compensation.salaryNote}**

${benefits}

${compensation.fine}

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

## The interview (FAQ)

${faqList}

## The decision

**${offer.title}** ${offer.body} ${offer.note}.

## Links

- Homepage: ${SITE_URL}
- Pricing: ${SITE_URL}/#compensation
- Concise summary: ${SITE_URL}/llms.txt
`;
}
