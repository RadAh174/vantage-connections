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
  FAQSchema,
  BreadcrumbSchema,
} from "@/components/seo/StructuredData";
import { FaqItem } from "@/components/ui/FaqItem";
import { services, servicesBySlug } from "@/lib/content/services";

const SITE_URL = "https://vantageconnections.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = servicesBySlug(slug);
  if (!service) return {};
  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: `/services/${service.slug}` },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = servicesBySlug(slug);
  if (!service) notFound();

  const titleWords = service.title.split(/\s+/);
  const STEP_MS = 220;

  const related = service.relatedSlugs
    .map((s) => servicesBySlug(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));

  // Breadcrumb: Home → Services → (parent if exists) → current
  const crumbs: { name: string; url: string }[] = [
    { name: "Home", url: SITE_URL },
    { name: "Services", url: `${SITE_URL}/services` },
  ];
  if (service.parentSlug) {
    const parent = servicesBySlug(service.parentSlug);
    if (parent) {
      crumbs.push({
        name: parent.title,
        url: `${SITE_URL}/services/${parent.slug}`,
      });
    }
  }
  crumbs.push({
    name: service.title,
    url: `${SITE_URL}/services/${service.slug}`,
  });

  return (
    <>
      <ScrollProgress />
      <Header />
      <FAQSchema items={service.faqs} />
      <BreadcrumbSchema items={crumbs} />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Hero — eyebrow + per-word cascade title + GEO direct answer */}
        <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-16 max-w-4xl">
          <span
            className="hero-word block mb-6"
            style={{ animationDelay: "0ms" }}
          >
            <Eyebrow color="forest">{service.eyebrow}</Eyebrow>
          </span>

          <h1
            className="font-display text-headline"
            style={{
              fontSize: "clamp(2.5rem, 5.2vw, 4.5rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.018em",
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

          {/* Princeton GEO lever: direct one-sentence answer up top */}
          <p
            className="hero-word mt-7 max-w-[680px] text-[18px] md:text-[19px] leading-[1.55] text-ink"
            style={{
              animationDelay: `${(titleWords.length + 1) * STEP_MS}ms`,
            }}
          >
            {service.directAnswer}
          </p>
        </section>

        <AuroraHairline />

        {/* Intro */}
        <section className="py-16 md:py-20 max-w-3xl">
          <Reveal>
            <p className="text-ink text-[17px] md:text-[18px] leading-[1.75]">
              {service.intro}
            </p>
          </Reveal>
        </section>

        <AuroraHairline />

        {/* What's included */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">WHAT&apos;S INCLUDED</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2rem, 3.6vw, 3rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Scope, <ColorWord>specified</ColorWord>.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal stagger staggerStep={50} as="ul" className="flex flex-col">
                {service.includes.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 py-4 border-b border-line last:border-b-0"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest mt-1 w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink text-[16px] md:text-[17px] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <AuroraHairline />

        {/* Who this is for */}
        <section className="py-16 md:py-20">
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-3">
                <Eyebrow color="forest">WHO THIS IS FOR</Eyebrow>
              </div>
            </div>
            <div className="lg:col-span-8">
              <p
                className="font-display italic text-ink leading-[1.2] max-w-[640px]"
                style={{
                  fontSize: "clamp(1.5rem, 2.4vw, 2rem)",
                  fontWeight: 500,
                  letterSpacing: "-0.012em",
                }}
              >
                {service.whoFor}
              </p>
            </div>
          </Reveal>
        </section>

        <AuroraHairline />

        {/* Outcomes — Princeton GEO lever: named statistics with cited sources */}
        <section className="py-16 md:py-20">
          <Reveal className="flex flex-col gap-3 max-w-2xl mb-10">
            <Eyebrow color="forest">OUTCOMES</Eyebrow>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(2rem, 3.6vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              What success <ColorWord>looks like</ColorWord>.
            </h2>
          </Reveal>
          <Reveal
            stagger
            staggerStep={80}
            className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
          >
            {service.outcomes.map((stat, i) => (
              <article
                key={i}
                className="rounded-2xl border border-line bg-surface p-6 md:p-7 flex flex-col gap-3 h-full"
              >
                <span
                  className="font-display text-ink"
                  style={{
                    fontSize: "clamp(2.5rem, 4.2vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {stat.figure}
                </span>
                <p className="text-ink text-[15px] leading-relaxed">
                  {stat.label}
                </p>
                {stat.source && (
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted mt-2">
                    {stat.sourceHref ? (
                      <a
                        href={stat.sourceHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-forest transition-colors"
                      >
                        {stat.source} →
                      </a>
                    ) : (
                      stat.source
                    )}
                  </span>
                )}
              </article>
            ))}
          </Reveal>
        </section>

        <AuroraHairline />

        {/* Process */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">PROCESS</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2rem, 3.6vw, 3rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  How we <ColorWord>work</ColorWord> on this.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal stagger staggerStep={60} as="ol" className="flex flex-col">
                {service.process.map((step, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-5 py-5 border-b border-line last:border-b-0"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest mt-1 w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink text-[16px] md:text-[17px] leading-relaxed">
                      {step}
                    </span>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <AuroraHairline />

        {/* FAQs */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">FAQ</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2rem, 3.6vw, 3rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Common <ColorWord>questions</ColorWord>.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <ul className="flex flex-col">
                {service.faqs.map((item, i) => (
                  <Reveal
                    key={item.q}
                    delay={i * 60}
                    as="li"
                    className="border-b border-line last:border-b-0"
                  >
                    <FaqItem q={item.q} a={item.a} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Related services */}
        {related.length > 0 && (
          <>
            <AuroraHairline />
            <section className="py-16 md:py-20">
              <Reveal className="flex flex-col gap-3 max-w-2xl mb-8">
                <Eyebrow color="forest">RELATED</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Keep <ColorWord>reading</ColorWord>.
                </h2>
              </Reveal>
              <Reveal
                stagger
                staggerStep={80}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5"
              >
                {related.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/services/${r.slug}`}
                    className="mobile-tap-scale group block rounded-2xl border border-line bg-surface p-6 hover:border-forest/40 hover:shadow-[0_8px_30px_-15px_rgba(212,158,15,0.35)] transition-all"
                  >
                    <Eyebrow color="forest">{r.eyebrow}</Eyebrow>
                    <h3
                      className="font-display text-[20px] md:text-[22px] mt-3 text-ink group-hover:text-forest transition-colors"
                      style={{ fontWeight: 500 }}
                    >
                      {r.title}
                    </h3>
                    <span className="font-mono text-[12px] text-ink-muted mt-3 inline-block group-hover:text-forest transition-colors">
                      Read →
                    </span>
                  </Link>
                ))}
              </Reveal>
            </section>
          </>
        )}

        {/* Closing CTA */}
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
              Ready to <ColorWord>start</ColorWord>?
            </h2>
            <Reveal stagger className="flex flex-wrap items-center gap-4">
              <Button href="/contact" variant="primary" size="lg">
                Start a project
              </Button>
              <Button href="/pricing" variant="ghost">
                See pricing →
              </Button>
            </Reveal>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
