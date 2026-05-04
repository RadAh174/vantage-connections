import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { featuredProjects } from "@/lib/content/work";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return featuredProjects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const project = featuredProjects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: `${project.title} — ${project.client}`,
    description: project.tagline ?? project.brief.slice(0, 160),
  };
}

/**
 * Per-section accent word — drives which word inside each body H2 title
 * renders as the gold-gradient italic ColorWord. Lets each section carry
 * the home's "[noun] [accent]." rhythm without inventing prose.
 */
const SECTION_ACCENTS: Record<"Brief" | "Approach" | "Results", string> = {
  Brief: "Brief",
  Approach: "Approach",
  Results: "Results",
};

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = featuredProjects.find((p) => p.slug === slug);
  if (!project) notFound();

  // Determine the next project for the closing card.
  const idx = featuredProjects.findIndex((p) => p.slug === project.slug);
  const next =
    featuredProjects[(idx + 1) % featuredProjects.length] ?? null;

  // Hero word-cascade. Title is user-supplied free-form prose, so we
  // split on whitespace and stagger the per-word reveal. STEP_MS matches
  // home (240ms) so case-study heros read in the same rhythm.
  const TITLE_WORDS = project.title.split(/\s+/);
  const STEP_MS = 240;

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero — no HeroFader. Eyebrow + per-word
            cascade on the project title (matches home's rhythm).
            Client name is shown above the title in mono so it reads
            as metadata, not headline. */}
        <section className="pt-20 md:pt-28 pb-16 max-w-4xl">
          <Reveal>
            <Eyebrow color="forest">CASE STUDY · {project.metadata.year}</Eyebrow>
          </Reveal>

          <Reveal delay={80}>
            <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted mt-5">
              {project.client}
            </p>
          </Reveal>

          <h1
            className="font-display text-headline mt-4"
            style={{
              fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
              fontWeight: 500,
              lineHeight: 1.15,
              letterSpacing: "-0.018em",
            }}
          >
            {TITLE_WORDS.map((word, i) => (
              <span
                key={i}
                className="hero-word"
                style={{ animationDelay: `${i * STEP_MS}ms` }}
              >
                {word}
                {i < TITLE_WORDS.length - 1 ? " " : ""}
              </span>
            ))}
          </h1>

          {project.tagline && (
            <Reveal delay={TITLE_WORDS.length * STEP_MS + 200}>
              <p className="text-[18px] leading-[1.55] text-ink-muted mt-7 max-w-[600px]">
                {project.tagline}
              </p>
            </Reveal>
          )}
        </section>

        <AuroraHairline />

        {/* ---------------- Body + sticky sidebar ---------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-16 pb-24">
          {/* Sidebar — sticky metadata. Vertical rhythm with bordered
              separators so each row reads as a discrete fact. */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 self-start flex flex-col text-[14px] divide-y divide-line border-y border-line">
            <SidebarRow label="Client" value={project.metadata.client} />
            <SidebarRow label="Year" value={project.metadata.year} />
            <SidebarRow label="Role" value={project.metadata.role} />
            <SidebarRow label="Scope" value={project.metadata.scope} />
            <div className="flex flex-col gap-2 py-4">
              <Eyebrow color="ink-muted">Services</Eyebrow>
              <div className="flex flex-wrap gap-2 pt-1">
                {project.metadata.services.map((s) => (
                  <Chip key={s}>{s}</Chip>
                ))}
              </div>
            </div>
            {project.metadata.liveUrl && (
              <div className="py-4">
                <a
                  href={project.metadata.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-forest text-[14px] inline-flex items-center gap-1.5 self-start border-b border-current pb-0.5"
                >
                  Visit live →
                </a>
              </div>
            )}
          </aside>

          {/* Body. Each section gets a hairline above it (except the
              first) so the reading flow matches the home's section
              rhythm. Reading width capped at 720px (text-[18px] leading
              ~1.65 fits ~58-66 chars per line). */}
          <div className="lg:col-span-8 flex flex-col">
            <BodySection
              title="Brief"
              accent={SECTION_ACCENTS.Brief}
              body={project.brief}
              first
            />

            <BodySection
              title="Approach"
              accent={SECTION_ACCENTS.Approach}
              body={project.approach}
            />

            {project.pullQuote && (
              <Reveal>
                <div className="pt-14 pb-2">
                  <AuroraHairline />
                  <figure className="relative pl-10 md:pl-14 pt-14">
                    {/* Pull-quote curly mark — gold gradient. Sized so it
                        sits above the quote's first line cap-height as a
                        decorative anchor, not a glyph in the text flow. */}
                    <span
                      aria-hidden="true"
                      className="color-word color-word--has-fallback absolute left-0 top-[1.5rem] font-display select-none"
                      style={{
                        fontSize: "5.5rem",
                        lineHeight: 1,
                        fontStyle: "italic",
                        fontWeight: 500,
                        backgroundImage: "var(--gold-grad)",
                      }}
                    >
                      &ldquo;
                    </span>
                    <blockquote
                      className="font-display italic text-ink max-w-[720px]"
                      style={{
                        fontSize: "clamp(1.75rem, 3.5vw, 3rem)",
                        fontWeight: 500,
                        lineHeight: 1.2,
                        letterSpacing: "-0.012em",
                      }}
                    >
                      {project.pullQuote.text}
                    </blockquote>
                    <figcaption className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted mt-6">
                      — {project.pullQuote.byline}
                    </figcaption>
                  </figure>
                </div>
              </Reveal>
            )}

            <BodySection
              title="Results"
              accent={SECTION_ACCENTS.Results}
              body={project.results}
            />
          </div>
        </section>

        {/* ---------------- Next project ----------------
            Only shown if there is more than one project — otherwise
            the "next" loop would point at the same slug. */}
        {next && next.slug !== project.slug && (
          <section className="py-20">
            <AuroraHairline />
            <Reveal className="pt-14 flex flex-col gap-5">
              <Eyebrow color="forest">NEXT PROJECT</Eyebrow>
              <Link
                href={`/work/${next.slug}`}
                className="group flex flex-col gap-3 max-w-3xl"
              >
                <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-ink-muted">
                  {next.client}
                </span>
                <h3
                  className="font-display text-headline group-hover:text-forest transition-colors"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.25rem)",
                    fontWeight: 500,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {next.title}{" "}
                  <span className="text-forest" aria-hidden="true">
                    →
                  </span>
                </h3>
                {/* Gold-gradient hairline accent — sits flush under the
                    card and brightens on hover via the parent group. */}
                <span
                  aria-hidden="true"
                  className="aurora-hairline h-px w-24 mt-2 opacity-70 group-hover:w-40 group-hover:opacity-100 transition-all duration-500"
                />
              </Link>
            </Reveal>
          </section>
        )}

        {/* ---------------- Closing CTA ---------------- */}
        <section className="py-20">
          <AuroraHairline />
          <Reveal className="pt-14 flex flex-col gap-5 items-start max-w-2xl">
            <Eyebrow color="forest">START A PROJECT</Eyebrow>
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: "-0.015em",
              }}
            >
              Have a project in <ColorWord>mind</ColorWord>?
            </h2>
            <Button href="/contact" variant="primary" size="lg">
              Start a project
            </Button>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function SidebarRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1.5 py-4">
      <Eyebrow color="ink-muted">{label}</Eyebrow>
      <span className="text-ink text-[15px]">{value || "—"}</span>
    </div>
  );
}

function BodySection({
  title,
  accent,
  body,
  first = false,
}: {
  title: string;
  accent: string;
  body: string;
  first?: boolean;
}) {
  // Split the heading at the accent word so we can wrap it in
  // <ColorWord> for the gold-gradient italic treatment. If the title
  // doesn't contain the accent (defensive), fall back to plain text.
  const renderHeading = () => {
    if (!accent || !title.includes(accent)) {
      return title;
    }
    const [before, after] = title.split(accent);
    return (
      <>
        {before}
        <ColorWord>{accent}</ColorWord>
        {after}
      </>
    );
  };

  return (
    <Reveal>
      <div className={`flex flex-col gap-6 ${first ? "" : "pt-14"}`}>
        {!first && <AuroraHairline />}
        <h2
          className={`font-display text-ink ${first ? "" : "pt-10"}`}
          style={{
            fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: "-0.01em",
          }}
        >
          {renderHeading()}
        </h2>
        <p
          className="text-ink text-[18px] leading-[1.65] max-w-[720px]"
          style={{ whiteSpace: "pre-line" }}
        >
          {body}
        </p>
      </div>
    </Reveal>
  );
}
