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
  FAQSchema,
} from "@/components/seo/StructuredData";
import { FaqItem } from "@/components/ui/FaqItem";
import { locations, locationBySlug } from "@/lib/content/locations";

const SITE_URL = "https://vantageconnections.com";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return locations.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const location = locationBySlug(slug);
  if (!location) return {};
  return {
    title: location.metaTitle,
    description: location.metaDescription,
    alternates: { canonical: `/locations/${location.slug}` },
  };
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;
  const location = locationBySlug(slug);
  if (!location) notFound();

  const titleWords = location.title.split(/\s+/);
  const STEP_MS = 200;

  const crumbs = [
    { name: "Home", url: SITE_URL },
    { name: "Locations", url: `${SITE_URL}/locations/${location.slug}` },
    {
      name: `${location.city}, ${location.region}`,
      url: `${SITE_URL}/locations/${location.slug}`,
    },
  ];

  return (
    <>
      <ScrollProgress />
      <Header />
      <FAQSchema items={location.faqs} />
      <BreadcrumbSchema items={crumbs} />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Hero */}
        <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-16 max-w-4xl">
          <span
            className="hero-word block mb-6"
            style={{ animationDelay: "0ms" }}
          >
            <Eyebrow color="forest">{location.eyebrow}</Eyebrow>
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

          <p
            className="hero-word mt-7 max-w-[680px] text-[18px] md:text-[19px] leading-[1.55] text-ink"
            style={{
              animationDelay: `${(titleWords.length + 1) * STEP_MS}ms`,
            }}
          >
            {location.directAnswer}
          </p>
        </section>

        <AuroraHairline />

        {/* Intro */}
        <section className="py-16 md:py-20 max-w-3xl">
          <Reveal>
            <p className="text-ink text-[17px] md:text-[18px] leading-[1.75]">
              {location.intro}
            </p>
          </Reveal>
        </section>

        <AuroraHairline />

        {/* Why here */}
        <section className="py-16 md:py-20">
          <Reveal className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <div className="flex flex-col gap-3">
                <Eyebrow color="forest">WHY HERE</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Why <ColorWord>Irvine</ColorWord>.
                </h2>
              </div>
            </div>
            <div className="lg:col-span-8">
              <p className="text-ink text-[17px] md:text-[18px] leading-[1.75] max-w-prose">
                {location.whyHere}
              </p>
            </div>
          </Reveal>
        </section>

        <AuroraHairline />

        {/* Industries served */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">INDUSTRIES SERVED</Eyebrow>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal
                stagger
                staggerStep={50}
                as="ul"
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {location.industries.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-3 py-3 border-b border-line"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest mt-1 w-6 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink text-[15px] md:text-[16px] leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <AuroraHairline />

        {/* Neighborhoods */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">NEIGHBORHOODS</Eyebrow>
                <p className="text-ink-muted text-[14px] leading-relaxed max-w-xs">
                  Clients we work with across Irvine and the wider Orange
                  County area.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal
                stagger
                staggerStep={50}
                as="ul"
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >
                {location.neighborhoods.map((item, i) => (
                  <li
                    key={i}
                    className="text-ink text-[15px] md:text-[16px] leading-relaxed py-2 border-b border-line"
                  >
                    {item}
                  </li>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        <AuroraHairline />

        {/* Services offered */}
        <section className="py-16 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">SERVICES OFFERED</Eyebrow>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <Reveal stagger staggerStep={50} as="ul" className="flex flex-col">
                {location.servicesOffered.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-4 py-4 border-b border-line last:border-b-0"
                  >
                    <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-forest mt-1 w-8 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-ink text-[16px] leading-relaxed">
                      {item}
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
                    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
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
                {location.faqs.map((item, i) => (
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
              Working in <ColorWord>{location.city}</ColorWord>?
            </h2>
            <p className="text-ink-muted text-[16px] leading-relaxed max-w-xl">
              We&apos;re local, in-person reachable, and already working in
              your market. Tell us about the project — a short call usually
              gets us to a written quote within forty-eight hours.
            </p>
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
      </main>

      <Footer />
    </>
  );
}
