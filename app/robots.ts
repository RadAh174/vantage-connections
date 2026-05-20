import type { MetadataRoute } from "next";

/**
 * Split AI-crawler policy:
 *   - BLOCK training-only bots (we don't want our code/content used to train models)
 *   - ALLOW search/retrieval bots (we want to be cited inside ChatGPT, Claude, Perplexity, etc.)
 *
 * Sources: Anthropic, OpenAI, Google, and Perplexity bot docs (2025–2026).
 * Foundation set: GPTBot / ClaudeBot / Google-Extended / CCBot / Bytespider = training.
 * Retrieval set: OAI-SearchBot / ChatGPT-User / Claude-SearchBot / Claude-User /
 * PerplexityBot / Perplexity-User = live citation traffic.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Default — all search engines welcome on every public path.
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/", "/admin/"],
      },

      // Training crawlers — blocked. We don't want our source/content
      // ingested into model training corpora without consent.
      { userAgent: "GPTBot", disallow: "/" },
      { userAgent: "ClaudeBot", disallow: "/" },
      { userAgent: "Google-Extended", disallow: "/" },
      { userAgent: "CCBot", disallow: "/" },
      { userAgent: "anthropic-ai", disallow: "/" },
      { userAgent: "Bytespider", disallow: "/" },
      { userAgent: "Diffbot", disallow: "/" },
      { userAgent: "FacebookBot", disallow: "/" },
      { userAgent: "Meta-ExternalAgent", disallow: "/" },
      { userAgent: "Omgilibot", disallow: "/" },
      { userAgent: "Omgili", disallow: "/" },
      { userAgent: "cohere-ai", disallow: "/" },
      { userAgent: "Applebot-Extended", disallow: "/" },

      // Live retrieval / citation crawlers — explicitly allowed. These
      // fetch pages in real time to answer user queries with citations.
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-CloudVertexBot", allow: "/" },
    ],
    sitemap: "https://vantageconnections.com/sitemap.xml",
    host: "https://vantageconnections.com",
  };
}
