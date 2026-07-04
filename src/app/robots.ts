import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// AI answer-engine + training crawlers we explicitly welcome (GEO): being
// indexable by these is what lets ChatGPT, Perplexity, Claude, Gemini and
// Google AI Overviews surface and cite Otto. Listing them by name documents
// intent and survives any future tightening of the global "*" rule.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI training
  "OAI-SearchBot", // ChatGPT search index
  "ChatGPT-User", // ChatGPT live browsing
  "ClaudeBot", // Anthropic
  "Claude-User",
  "anthropic-ai",
  "PerplexityBot", // Perplexity index
  "Perplexity-User",
  "Google-Extended", // Gemini / AI Overviews training
  "Applebot-Extended", // Apple Intelligence
  "CCBot", // Common Crawl (feeds many models)
  "Amazonbot",
  "cohere-ai",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
      // Full allow for AI engines — including the API stays off-limits.
      {
        userAgent: AI_CRAWLERS,
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
