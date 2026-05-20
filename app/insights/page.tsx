import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { insights } from "@/lib/content/insights";

export const metadata = {
  title: "Insights",
  description:
    "Essays on how we build websites, why we charge monthly, and how to choose between freelancers, studios, and agencies. Honest writing from a working studio.",
  alternates: { canonical: "/insights" },
};

const HERO_LINE_1 = ["Honest"];
const HERO_LINE_2 = ["writing."];
const HERO_STEP_MS = 240;

export default function InsightsHubPage() {
  const sorted = [...insights].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt)
  );
  const totalHeroWords = HERO_LINE_1.length + HERO_LINE_2.length;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* Hero */}
        <section className="relative min-h-[55dvh] flex flex-col justify-center pt-20 md:pt-28 pb-16 max-w-4xl">
          <span
            className="hero-word block mb-6"
            style={{ animationDelay: "0ms" }}
          >
            <Eyebrow color="forest">INSIGHTS · FROM THE STUDIO</Eyebrow>
          </span>

          <h1
            className="font-display text-headline"
            style={{
              fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.018em",
            }}
          >
            <span className="block">
              {HERO_LINE_1.map((word, i) => (
                <span
                  key={`l1-${i}`}
                  className="hero-word"
                  style={{ animationDelay: `${(i + 1) * HERO_STEP_MS}ms` }}
                >
                  <ColorWord>{word}</ColorWord>{" "}
                </span>
              ))}
            </span>
            <span className="block">
              {HERO_LINE_2.map((word, i) => (
                <span
                  key={`l2-${i}`}
                  className="hero-word"
                  style={{
                    animationDelay: `${
                      (HERO_LINE_1.length + i + 1) * HERO_STEP_MS
                    }ms`,
                  }}
                >
                  {word}{" "}
                </span>
              ))}
            </span>
          </h1>

          <p
            className="hero-word mt-7 max-w-[560px] text-[18px] leading-[1.55] text-ink-muted"
            style={{
              animationDelay: `${(totalHeroWords + 1) * HERO_STEP_MS}ms`,
            }}
          >
            Essays on how we build, why we charge monthly, and what to look
            for when hiring help. No filler. No vendor talking points.
          </p>
        </section>

        <AuroraHairline />

        {/* Essay list */}
        <section className="py-16 md:py-20">
          <ul className="flex flex-col">
            {sorted.map((insight, i) => (
              <Reveal key={insight.slug} delay={i * 80}>
                <li className="border-b border-line last:border-b-0">
                  <Link
                    href={`/insights/${insight.slug}`}
                    className="mobile-tap-scale group block py-8 md:py-10 hover:bg-surface/50 transition-colors -mx-6 px-6 md:-mx-10 md:px-10 rounded"
                  >
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-10">
                      <div className="lg:col-span-3 flex flex-col gap-2">
                        <Eyebrow color="forest">{insight.eyebrow}</Eyebrow>
                        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                          {new Date(insight.publishedAt).toLocaleDateString(
                            "en-US",
                            { year: "numeric", month: "short", day: "numeric" }
                          )}{" "}
                          · {insight.readingMinutes} min read
                        </span>
                      </div>
                      <div className="lg:col-span-9 flex flex-col gap-3">
                        <h2
                          className="font-display text-ink group-hover:text-forest transition-colors"
                          style={{
                            fontSize: "clamp(1.75rem, 3.4vw, 2.5rem)",
                            fontWeight: 500,
                            lineHeight: 1.1,
                            letterSpacing: "-0.015em",
                          }}
                        >
                          {insight.title}
                        </h2>
                        <p className="text-ink-muted text-[16px] leading-relaxed max-w-3xl">
                          {insight.excerpt}
                        </p>
                        <span className="font-mono text-[12px] text-forest mt-1 inline-flex items-center gap-1.5 group-hover:gap-3 transition-all">
                          Read the essay →
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        </section>
      </main>

      <Footer />
    </>
  );
}
