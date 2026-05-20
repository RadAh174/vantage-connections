import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import {
  BreadcrumbSchema,
  JsonLd,
} from "@/components/seo/StructuredData";
import { insights, insightBySlug } from "@/lib/content/insights";
import { site } from "@/lib/content/site";

const SITE_URL = "https://vantageconnections.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return insights.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const insight = insightBySlug(slug);
  if (!insight) return {};
  return {
    title: insight.metaTitle,
    description: insight.metaDescription,
    alternates: { canonical: `/insights/${insight.slug}` },
    openGraph: {
      type: "article",
      title: insight.metaTitle,
      description: insight.metaDescription,
      publishedTime: insight.publishedAt,
    },
  };
}

export default async function InsightPage({ params }: Props) {
  const { slug } = await params;
  const insight = insightBySlug(slug);
  if (!insight) notFound();

  // BlogPosting schema for rich results + LLM citation.
  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: insight.title,
    description: insight.metaDescription,
    datePublished: insight.publishedAt,
    dateModified: insight.publishedAt,
    author: {
      "@type": "Organization",
      name: site.brand,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: site.brand,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/insights/${insight.slug}`,
    },
  };

  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Insights", url: `${SITE_URL}/insights` },
    { name: insight.title, url: `${SITE_URL}/insights/${insight.slug}` },
  ];

  const titleWords = insight.title.split(/\s+/);
  const STEP_MS = 180;

  // Other insights for the "keep reading" rail.
  const others = insights
    .filter((i) => i.slug !== insight.slug)
    .slice(0, 3);

  return (
    <>
      <ScrollProgress />
      <Header />
      <JsonLd data={blogPostingSchema} />
      <BreadcrumbSchema items={crumbs} />

      <article className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Hero */}
        <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-12 max-w-4xl">
          <span
            className="hero-word block mb-6"
            style={{ animationDelay: "0ms" }}
          >
            <Eyebrow color="forest">{insight.eyebrow}</Eyebrow>
          </span>

          <h1
            className="font-display text-headline"
            style={{
              fontSize: "clamp(2.25rem, 4.6vw, 3.75rem)",
              fontWeight: 500,
              lineHeight: 1.12,
              letterSpacing: "-0.015em",
            }}
          >
            {titleWords.map((word, i) => (
              <span
                key={`hw-${i}`}
                className="hero-word"
                style={{ animationDelay: `${(i + 1) * STEP_MS}ms` }}
              >
                {word}{" "}
              </span>
            ))}
          </h1>

          <p
            className="hero-word mt-7 font-mono text-[12px] uppercase tracking-[0.16em] text-ink-muted"
            style={{
              animationDelay: `${(titleWords.length + 1) * STEP_MS}ms`,
            }}
          >
            {new Date(insight.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            · {insight.readingMinutes} min read
          </p>
        </section>

        <AuroraHairline />

        {/* Body — block renderer */}
        <section className="py-12 md:py-16 max-w-[720px]">
          {insight.blocks.map((block, i) => {
            switch (block.type) {
              case "h2":
                return (
                  <Reveal key={i}>
                    <h2
                      className="font-display text-ink mt-14 mb-5"
                      style={{
                        fontSize: "clamp(1.6rem, 3vw, 2.25rem)",
                        fontWeight: 600,
                        lineHeight: 1.15,
                        letterSpacing: "-0.012em",
                      }}
                    >
                      {block.text}
                    </h2>
                  </Reveal>
                );
              case "h3":
                return (
                  <Reveal key={i}>
                    <h3
                      className="font-display italic text-ink mt-10 mb-3"
                      style={{
                        fontSize: "clamp(1.25rem, 2.2vw, 1.5rem)",
                        fontWeight: 500,
                        lineHeight: 1.2,
                      }}
                    >
                      {block.text}
                    </h3>
                  </Reveal>
                );
              case "p":
                return (
                  <Reveal key={i}>
                    <p className="text-ink text-[17px] md:text-[18px] leading-[1.75] mb-5">
                      {block.text}
                    </p>
                  </Reveal>
                );
              case "quote":
                return (
                  <Reveal key={i}>
                    <figure className="my-10 pl-6 border-l-2 border-forest/40 max-w-prose">
                      <blockquote
                        className="font-display italic text-ink text-[20px] md:text-[22px] leading-[1.35]"
                        style={{ fontWeight: 500 }}
                      >
                        &ldquo;{block.text}&rdquo;
                      </blockquote>
                      <figcaption className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted mt-3">
                        — {block.href ? (
                          <a
                            href={block.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-forest transition-colors"
                          >
                            {block.by}
                          </a>
                        ) : (
                          block.by
                        )}
                      </figcaption>
                    </figure>
                  </Reveal>
                );
              case "stat":
                return (
                  <Reveal key={i}>
                    <aside className="my-10 rounded-2xl border border-line bg-surface p-6 md:p-7 flex flex-col gap-2 max-w-prose">
                      <span
                        className="font-display text-ink"
                        style={{
                          fontSize: "clamp(2.25rem, 4vw, 3.25rem)",
                          fontWeight: 600,
                          lineHeight: 1.05,
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {block.figure}
                      </span>
                      <p className="text-ink text-[15px] md:text-[16px] leading-relaxed">
                        {block.label}
                      </p>
                      {block.source && (
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted mt-1">
                          {block.sourceHref ? (
                            <a
                              href={block.sourceHref}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-forest transition-colors"
                            >
                              {block.source} →
                            </a>
                          ) : (
                            block.source
                          )}
                        </span>
                      )}
                    </aside>
                  </Reveal>
                );
              case "list": {
                const ListTag = block.ordered ? "ol" : "ul";
                return (
                  <Reveal key={i}>
                    <ListTag
                      className={`my-6 pl-6 space-y-2 text-ink text-[17px] md:text-[18px] leading-[1.7] ${
                        block.ordered ? "list-decimal" : "list-disc"
                      }`}
                    >
                      {block.items.map((item, j) => (
                        <li key={j}>{item}</li>
                      ))}
                    </ListTag>
                  </Reveal>
                );
              }
              default:
                return null;
            }
          })}
        </section>

        <AuroraHairline />

        {/* Keep reading */}
        {others.length > 0 && (
          <section className="py-16 md:py-20">
            <Reveal className="flex flex-col gap-3 max-w-2xl mb-8">
              <Eyebrow color="forest">KEEP READING</Eyebrow>
              <h2
                className="font-display"
                style={{
                  fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                }}
              >
                More from the <ColorWord>studio</ColorWord>.
              </h2>
            </Reveal>
            <Reveal
              stagger
              staggerStep={80}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
            >
              {others.map((other) => (
                <Link
                  key={other.slug}
                  href={`/insights/${other.slug}`}
                  className="mobile-tap-scale group block rounded-2xl border border-line bg-surface p-6 hover:border-forest/40 transition-all"
                >
                  <Eyebrow color="forest">{other.eyebrow}</Eyebrow>
                  <h3
                    className="font-display text-[19px] md:text-[20px] mt-3 text-ink group-hover:text-forest transition-colors"
                    style={{ fontWeight: 500, lineHeight: 1.25 }}
                  >
                    {other.title}
                  </h3>
                  <p className="text-ink-muted text-[13px] mt-2 leading-relaxed">
                    {other.excerpt.slice(0, 140)}…
                  </p>
                </Link>
              ))}
            </Reveal>
          </section>
        )}

        {/* CTA */}
        <section className="py-16 md:py-24">
          <AuroraHairline />
          <Reveal stagger staggerStep={140} className="pt-12 md:pt-16 flex flex-col gap-6 md:gap-7 items-start">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 5vw, 4.25rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              Have a project in <ColorWord>mind</ColorWord>?
            </h2>
            <Reveal stagger className="flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                Start a conversation
              </Button>
              <Button href="/services" variant="ghost">
                See services →
              </Button>
            </Reveal>
          </Reveal>
        </section>
      </article>

      <Footer />
    </>
  );
}
