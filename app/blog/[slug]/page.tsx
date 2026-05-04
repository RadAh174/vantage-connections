import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Chip } from "@/components/ui/Chip";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

import { posts } from "@/lib/content/blog";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatDate(iso: string) {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
}

export async function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

/**
 * Lightweight prose splitter. Body comes in as plain text — when real
 * content arrives we treat it like minimal markdown:
 *   - Fenced ```lang ... ``` blocks → code block
 *   - Paragraphs starting with "> " → pull-quote (Fraunces italic w/ gold curly mark)
 *   - Everything else → standard paragraph
 *
 * No content is invented; if the body is empty/missing this returns [].
 */
type Block =
  | { kind: "p"; text: string }
  | { kind: "quote"; text: string }
  | { kind: "code"; lang?: string; text: string };

function parseBody(body: string): Block[] {
  if (!body.trim()) return [];
  const blocks: Block[] = [];
  const lines = body.split("\n");
  let i = 0;
  let buffer: string[] = [];

  function flushParagraph() {
    if (!buffer.length) return;
    const joined = buffer.join("\n").trim();
    if (joined) {
      if (joined.startsWith("> ")) {
        blocks.push({
          kind: "quote",
          text: joined
            .split("\n")
            .map((l) => l.replace(/^>\s?/, ""))
            .join(" ")
            .trim(),
        });
      } else {
        blocks.push({ kind: "p", text: joined });
      }
    }
    buffer = [];
  }

  while (i < lines.length) {
    const line = lines[i];
    const fenceMatch = line.match(/^```(\w+)?\s*$/);
    if (fenceMatch) {
      flushParagraph();
      const lang = fenceMatch[1];
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !/^```\s*$/.test(lines[i])) {
        codeLines.push(lines[i]);
        i++;
      }
      blocks.push({ kind: "code", lang, text: codeLines.join("\n") });
      i++;
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      i++;
      continue;
    }

    buffer.push(line);
    i++;
  }
  flushParagraph();
  return blocks;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  const idx = posts.findIndex((p) => p.slug === post.slug);
  const prev = idx > 0 ? posts[idx - 1] : null;
  const next = idx < posts.length - 1 ? posts[idx + 1] : null;

  const blocks = parseBody(post.body);

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        <article className="mx-auto max-w-[720px] pt-20 md:pt-28 pb-24">
          {/* ---------------- Top metadata strip ----------------
              Mono `date · tag · readtime` per spec. */}
          <Reveal>
            <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              <time dateTime={post.date}>{formatDate(post.date)}</time>
              <span aria-hidden="true">·</span>
              <span>{post.tag}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readMinutes} min read</span>
            </div>
          </Reveal>

          {/* ---------------- Massive Fraunces title ----------------
              Uses text-headline like the home + inner-page heroes. */}
          <Reveal delay={80}>
            <h1
              className="font-display text-headline mt-6"
              style={{
                fontSize: "clamp(2.5rem, 5.5vw, 4.25rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              {post.title}
            </h1>
          </Reveal>

          {/* ---------------- Excerpt / dek ---------------- */}
          <Reveal delay={160}>
            <p className="mt-6 text-[18px] leading-[1.55] text-ink-muted">
              {post.excerpt}
            </p>
          </Reveal>

          <div className="mt-10">
            <AuroraHairline />
          </div>

          {/* ---------------- Body ----------------
              Inter 18px / 1.7. Pull-quotes get Fraunces italic with a
              gold curly quote mark. Code blocks render in JetBrains Mono
              against bg-surface-calm. Block kinds are detected from the
              plain-text body — no invented prose. */}
          <Reveal delay={240}>
            <div className="mt-10 flex flex-col gap-7">
              {blocks.map((b, i) => {
                if (b.kind === "p") {
                  return (
                    <p
                      key={i}
                      className="text-ink text-[18px] leading-[1.7]"
                    >
                      {b.text}
                    </p>
                  );
                }
                if (b.kind === "quote") {
                  return (
                    <blockquote
                      key={i}
                      className="relative pl-10 pr-2 py-2 my-2"
                    >
                      <span
                        aria-hidden="true"
                        className="font-display absolute left-0 top-[-0.1em] color-word color-word--has-fallback"
                        style={{
                          backgroundImage: "var(--gold-grad)",
                          fontSize: "3.5rem",
                          fontWeight: 600,
                          lineHeight: 1,
                        }}
                      >
                        “
                      </span>
                      <p
                        className="font-display italic text-ink text-[22px] leading-[1.5]"
                        style={{ fontWeight: 500 }}
                      >
                        {b.text}
                      </p>
                    </blockquote>
                  );
                }
                // code block
                return (
                  <pre
                    key={i}
                    className="rounded-lg border border-line bg-surface-calm px-5 py-4 overflow-x-auto"
                  >
                    <code className="font-mono text-[13.5px] leading-[1.7] text-ink whitespace-pre">
                      {b.text}
                    </code>
                  </pre>
                );
              })}
            </div>
          </Reveal>

          <div className="mt-14">
            <AuroraHairline />
          </div>

          {/* ---------------- Filed under ---------------- */}
          <div className="mt-10 flex items-center gap-3">
            <Eyebrow color="ink-muted">FILED UNDER</Eyebrow>
            <Chip>{post.tag}</Chip>
          </div>

          {/* ---------------- Prev / next nav ---------------- */}
          <nav className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-line pt-10">
            {prev ? (
              <Link
                href={`/blog/${prev.slug}`}
                className="group flex flex-col gap-1.5"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  ← <ColorWord italic={false}>Previous</ColorWord>
                </span>
                <span
                  className="font-display text-[20px] text-ink group-hover:text-forest transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  {prev.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                href={`/blog/${next.slug}`}
                className="group flex flex-col gap-1.5 md:items-end md:text-right"
              >
                <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                  <ColorWord italic={false}>Next</ColorWord> →
                </span>
                <span
                  className="font-display text-[20px] text-ink group-hover:text-forest transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  {next.title}
                </span>
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>
      </main>

      <Footer />
    </>
  );
}
