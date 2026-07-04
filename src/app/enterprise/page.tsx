import type { Metadata } from "next";
import Image from "next/image";
import { Check, ShieldCheck } from "lucide-react";
import { EnterpriseNav } from "@/components/site/EnterpriseNav";
import { Footer } from "@/components/site/Footer";
import { DemoDialog } from "@/components/site/DemoDialog";
import { DemoButton } from "@/components/ui/DemoButton";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ScrollVideo } from "@/components/ui/ScrollVideo";
import { TrustStrip } from "@/components/sections/TrustStrip";
import { EnterprisePortfolio } from "@/components/sections/enterprise/EnterprisePortfolio";
import { EnterpriseFaq } from "@/components/sections/enterprise/EnterpriseFaq";
import { enterprise } from "@/lib/content";
import { SITE_URL, siteConfig } from "@/lib/site";

const PAGE_URL = `${SITE_URL}/enterprise`;
const PAGE_TITLE = "Vantage Connections for Enterprise · Brand-safe AI store operations at scale";
const PAGE_DESC =
  "Vantage Connections for Enterprise: the autonomous AI operator for high-volume Shopify brands, multi-store portfolios and agencies. Brand-safe by design, approval-gated, with a dedicated team and priority throughput. Book a demo.";

export const metadata: Metadata = {
  title: "Enterprise",
  description: PAGE_DESC,
  alternates: { canonical: "/enterprise" },
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    url: PAGE_URL,
    siteName: siteConfig.name,
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: PAGE_TITLE,
    description: PAGE_DESC,
  },
};

const ORG_ID = `${SITE_URL}/#organization`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORG_ID,
      name: siteConfig.name,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.svg` },
    },
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}/#webpage`,
      url: PAGE_URL,
      name: PAGE_TITLE,
      description: PAGE_DESC,
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": ORG_ID },
      inLanguage: "en-US",
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${PAGE_URL}/#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Vantage Connections", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Enterprise", item: PAGE_URL },
      ],
    },
    {
      "@type": "Service",
      "@id": `${PAGE_URL}/#service`,
      name: "Vantage Connections for Enterprise",
      serviceType: "AI ecommerce operations for high-volume Shopify brands",
      url: PAGE_URL,
      description:
        "An autonomous AI operator for high-volume Shopify brands, multi-store portfolios and agencies — brand-safe by design, approval-gated, with a dedicated team, priority throughput and custom integrations.",
      provider: { "@id": ORG_ID },
      areaServed: "Worldwide",
      audience: {
        "@type": "Audience",
        audienceType:
          "Shopify Plus brands, multi-store and multi-brand portfolios, and ecommerce agencies",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${PAGE_URL}/#faq`,
      mainEntity: enterprise.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const featureDims: Record<string, { w: number; h: number }> = {
  control: { w: 1600, h: 1195 },
  scale: { w: 1600, h: 1195 },
  team: { w: 1300, h: 1741 },
};

export default function EnterprisePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <EnterpriseNav />

      <main>
        {/* ── HERO — cinematic framed video, mirroring the homepage hero ── */}
        <section
          id="top"
          className="band-immersive grain relative overflow-hidden pb-24 pt-28 text-paper md:pb-28 md:pt-36"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[680px] w-[1100px] -translate-x-1/2 rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 32%, rgba(244,234,222,0.14), rgba(244,234,222,0) 70%)",
            }}
          />

          <div className="container-page relative z-10">
            <div className="mx-auto max-w-4xl text-center">
              <div className="mb-7">
                <span className="kicker text-accent-soft">
                  {enterprise.hero.kicker}
                </span>
              </div>

              <h1 className="font-display text-balance text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-paper sm:text-6xl md:text-7xl">
                {enterprise.hero.headlineLead}
                <br className="hidden sm:block" />{" "}
                <span className="relative whitespace-nowrap italic text-accent-soft">
                  {enterprise.hero.headlineEmph}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 300 12"
                    preserveAspectRatio="none"
                    className="absolute -bottom-2 left-0 h-3 w-full text-accent-soft"
                  >
                    <path
                      d="M2 8 C 80 2, 220 2, 298 7"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>

              <p className="mx-auto mt-8 max-w-2xl text-pretty text-[1.075rem] leading-relaxed text-paper/75 md:text-[1.15rem]">
                {enterprise.hero.sub}
              </p>

              <div className="mt-10 flex flex-col items-center gap-4">
                <DemoButton size="lg" withArrow>
                  {enterprise.hero.cta}
                </DemoButton>
                <p className="font-mono text-[0.66rem] uppercase tracking-[0.16em] text-paper/55">
                  {enterprise.hero.note}
                </p>
              </div>
            </div>

            {/* Cinematic framed video */}
            <div className="relative mx-auto mt-16 max-w-6xl md:mt-20">
              <div className="relative rounded-2xl border border-paper/15 bg-paper-raised p-2 shadow-lift md:p-3">
                <CornerTicks />
                <div className="relative overflow-hidden rounded-xl">
                  <ScrollVideo
                    src="/media/ent-hero.mp4"
                    poster="/media/ent-hero-poster.webp"
                    mode="scrub"
                    className="aspect-[16/9] w-full"
                  />
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    style={{
                      boxShadow: "inset 0 0 120px 8px rgba(var(--c-shade-rgb),0.12)",
                    }}
                  />
                </div>
              </div>

              {/* hero credibility points under the frame */}
              <ul className="mx-auto mt-10 flex max-w-3xl flex-col flex-wrap items-center justify-center gap-x-8 gap-y-2.5 sm:flex-row">
                {enterprise.hero.points.map((p) => (
                  <li
                    key={p}
                    className="flex items-center gap-2 text-[0.9rem] text-paper/80"
                  >
                    <Check className="h-3.5 w-3.5 shrink-0 text-success" strokeWidth={3} />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent to-paper"
          />
        </section>

        {/* ── PROOF — reuse the homepage trust strip ── */}
        <TrustStrip />

        {/* ── STAKES — homepage "problem" treatment ── */}
        <section className="relative py-24 md:py-32">
          <div className="container-page">
            <SectionHeading
              kicker={enterprise.stakes.kicker}
              title={enterprise.stakes.title}
              body={enterprise.stakes.body}
            />
            <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
              {enterprise.stakes.items.map((s, i) => (
                <Reveal
                  key={s.title}
                  delay={i * 90}
                  className="group relative bg-paper-raised p-7 transition-colors duration-300 hover:bg-paper-edge"
                >
                  <span className="font-mono text-[0.7rem] tracking-widest text-ink-muted">
                    0{i + 1}
                  </span>
                  <h3 className="font-display mt-4 text-xl font-medium text-ink">
                    {s.title}
                  </h3>
                  <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">
                    {s.desc}
                  </p>
                  <div
                    aria-hidden="true"
                    className="mt-6 h-px w-full origin-left bg-gradient-to-r from-accent/60 to-transparent"
                    style={{ transform: `scaleX(${1 - i * 0.22})` }}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PORTFOLIO — one brain → every store diagram ── */}
        <EnterprisePortfolio />

        {/* ── FEATURE ROWS — alternating luxury imagery, homepage treatment ── */}
        <section id="control" className="scroll-mt-24 py-24 md:py-32">
          <div className="container-page">
            <Reveal className="mb-16 max-w-2xl md:mb-24">
              <span className="kicker text-accent-deep">What you get</span>
              <h2 className="font-display mt-4 text-balance text-3xl font-medium leading-[1.06] tracking-[-0.018em] text-ink sm:text-4xl md:text-[2.9rem]">
                Everything in Growth — built for scale.
              </h2>
            </Reveal>

            <div className="space-y-28 md:space-y-40">
              {enterprise.features.map((row, i) => {
                const reversed = i % 2 === 1;
                const d = featureDims[row.id] ?? { w: 1600, h: 1195 };
                return (
                  <div
                    key={row.id}
                    id={row.id}
                    className="grid scroll-mt-24 items-center gap-10 lg:grid-cols-12 lg:gap-6"
                  >
                    <Reveal
                      className={`lg:col-span-5 ${
                        reversed ? "lg:order-2 lg:col-start-8" : "lg:col-start-1"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <span className="font-display text-[2.5rem] font-semibold leading-none text-accent/30">
                          0{i + 1}
                        </span>
                        <span className="kicker text-accent-deep">{row.kicker}</span>
                      </div>
                      <h3 className="font-display mt-6 text-balance text-[1.9rem] font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-4xl md:text-[2.6rem]">
                        {row.title}
                      </h3>
                      <p className="mt-5 max-w-md text-pretty text-[1.05rem] leading-relaxed text-ink-soft">
                        {row.body}
                      </p>
                      <ul className="mt-7 flex flex-wrap gap-2.5">
                        {row.bullets.map((b) => (
                          <li
                            key={b}
                            className="rounded-full border border-line bg-paper-raised px-3.5 py-1.5 text-[0.82rem] text-ink"
                          >
                            {b}
                          </li>
                        ))}
                      </ul>
                    </Reveal>

                    <Reveal
                      delay={120}
                      className={`relative lg:col-span-6 ${
                        reversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"
                      }`}
                    >
                      <div
                        aria-hidden="true"
                        className={`pointer-events-none absolute -z-0 h-3/4 w-3/4 rounded-full opacity-50 blur-3xl ${
                          reversed ? "-left-10 bottom-0" : "-right-10 top-0"
                        }`}
                        style={{
                          background:
                            "radial-gradient(circle, rgba(var(--c-accent-rgb),0.25), transparent 70%)",
                        }}
                      />
                      <figure className="relative overflow-hidden rounded-[1.5rem] border border-line shadow-lift">
                        <Image
                          src={row.image}
                          alt={row.imageAlt}
                          width={d.w}
                          height={d.h}
                          sizes="(min-width: 1024px) 50vw, 92vw"
                          className="h-full w-full object-cover"
                          quality={80}
                        />
                      </figure>
                    </Reveal>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECURITY — editorial commitments, not icon cards ── */}
        <section id="security" className="scroll-mt-24 bg-paper-sunken py-24 md:py-32">
          <div className="container-page">
            <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
              <SectionHeading
                kicker={enterprise.security.kicker}
                title={enterprise.security.title}
                body={enterprise.security.body}
                align="left"
              />
              <div>
                <Reveal className="divide-y divide-line overflow-hidden rounded-2xl border border-line bg-paper-raised shadow-soft">
                  {enterprise.security.principles.map((p) => (
                    <div key={p.title} className="flex gap-4 p-6">
                      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent-deep">
                        <ShieldCheck className="h-4 w-4" strokeWidth={2} />
                      </span>
                      <div>
                        <h3 className="font-display text-[1.05rem] font-medium text-ink">
                          {p.title}
                        </h3>
                        <p className="mt-1.5 text-[0.92rem] leading-relaxed text-ink-soft">
                          {p.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </Reveal>
                <Reveal delay={120}>
                  <p className="mt-5 text-pretty text-[0.92rem] leading-relaxed text-ink-muted">
                    {enterprise.security.roadmap}
                  </p>
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <EnterpriseFaq />

        {/* ── DEMO CTA — homepage final-CTA treatment ── */}
        <section
          id="demo"
          className="band-soft grain relative scroll-mt-24 overflow-hidden py-28 text-ink md:py-36"
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(var(--c-accent-rgb),0.26), rgba(var(--c-accent-rgb),0) 70%)",
            }}
          />
          <div className="container-page relative z-10">
            <div className="mx-auto max-w-3xl text-center">
              <Reveal>
                <span className="kicker text-accent-deep">
                  {enterprise.demo.kicker}
                </span>
              </Reveal>
              <Reveal delay={80}>
                <h2 className="font-display mt-5 text-balance text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-ink sm:text-6xl md:text-[4.25rem]">
                  {enterprise.demo.title}
                </h2>
              </Reveal>
              <Reveal delay={150}>
                <p className="mx-auto mt-7 max-w-xl text-pretty text-[1.1rem] leading-relaxed text-ink-soft">
                  {enterprise.demo.body}
                </p>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <DemoButton size="lg" withArrow>
                    {enterprise.demo.cta}
                  </DemoButton>
                  <a
                    href="/#pricing"
                    className="rounded-full border border-line-strong px-7 py-4 text-[1rem] font-medium text-ink transition-all duration-200 hover:bg-paper-raised"
                  >
                    See standard plans
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <DemoDialog />
    </>
  );
}

function CornerTicks() {
  const common = "absolute h-3.5 w-3.5 border-accent-soft/80 transition-opacity";
  return (
    <>
      <span className={`${common} left-1 top-1 border-l border-t`} />
      <span className={`${common} right-1 top-1 border-r border-t`} />
      <span className={`${common} bottom-1 left-1 border-b border-l`} />
      <span className={`${common} bottom-1 right-1 border-b border-r`} />
    </>
  );
}
