import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Marginalia } from "@/components/ui/Marginalia";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { RotatingWord } from "@/components/ui/RotatingWord";
import { ProcessHorizontalScroll } from "@/components/home/ProcessHorizontalScroll";
import { WorkCarousel } from "@/components/home/WorkCarousel";
import { HeroFader } from "@/components/home/HeroFader";
import { ContactDrawerMount } from "@/components/home/ContactDrawerMount";
import { InlineContactForm } from "@/components/home/InlineContactForm";
import { PullQuote } from "@/components/home/PullQuote";

import { site } from "@/lib/content/site";
import { home } from "@/lib/content/home";

export default function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10 min-w-0">
        {/* ---------------- Mobile hero (from scratch, not a desktop
            squeeze) ----------------
            Left-aligned, top-loaded, single screen. Eyebrow → 2-line
            display headline ("Websites that / work.") → 1-paragraph
            promise → primary CTA. No HeroFader, no parallax, no
            rotating word, no scroll cue. The mobile message is "who
            we are / what we do / start a project" in that order, then
            the page scrolls naturally into the work below. */}
        <section className="md:hidden relative flex flex-col items-start gap-6 pt-[max(14vh,72px)] pb-14 min-h-[68dvh]">
          <Reveal>
            <Eyebrow color="forest">FREELANCE WEB STUDIO</Eyebrow>
          </Reveal>

          <Reveal delay={120}>
            <h1
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2.5rem, 12vw, 4rem)",
                fontWeight: 500,
                lineHeight: 1.04,
                letterSpacing: "-0.022em",
              }}
            >
              Websites that
              <br />
              <ColorWord italic={true}>work</ColorWord>.
            </h1>
          </Reveal>

          <Reveal delay={240}>
            <p className="text-[16px] leading-[1.55] text-ink-muted max-w-[34ch]">
              A boutique web studio. Real shipped sites that earn their keep —
              fast, focused, in production.
            </p>
          </Reveal>

          <Reveal delay={360}>
            {site.email ? (
              <a
                href={`mailto:${site.email}`}
                className="inline-flex items-center justify-center gap-2 mt-2 px-7 py-4 rounded-full font-medium text-[15px] text-[#0E0E10] shadow-[0_8px_32px_-8px_rgba(212,158,15,0.45)] active:scale-[0.98] transition-transform duration-150"
                style={{ backgroundImage: "var(--gold-grad)" }}
              >
                Start a project →
              </a>
            ) : (
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 mt-2 px-7 py-4 rounded-full font-medium text-[15px] text-[#0E0E10] shadow-[0_8px_32px_-8px_rgba(212,158,15,0.45)] active:scale-[0.98] transition-transform duration-150"
                style={{ backgroundImage: "var(--gold-grad)" }}
              >
                Start a project →
              </Link>
            )}
          </Reveal>
        </section>

        {/* ---------------- Desktop hero — minimal, fades on scroll ---
            Headline centered vertically + horizontally. Scroll cue
            anchored at the bottom edge of the viewport. Both wrapped in
            <HeroFader> so they lift away as the page scrolls. The
            <Header /> stays hidden until you scroll past ~60% of the
            viewport — see Header.tsx. */}
        {/* Section is 140dvh tall — first viewport holds the hero, next
            ~40dvh is intentional empty space so subsequent sections sit
            well below the fold. Inner wrapper is exactly one viewport
            tall and serves as the positioning context for the
            absolutely-anchored scroll cue. */}
        {(() => {
          // Hero text split into individual words for the staggered
          // per-word reveal. Each <span class="hero-word"> uses CSS
          // animation-delay so words cascade in. The rotating accent
          // word follows at the end with the same staggered delay.
          // Two-line hero: "Websites that put your" / "business in [rot]"
          // Per-word reveal cascades across both lines with the same
          // animation-delay sequence. STEP_MS doubled (140→280) so the
          // whole headline takes its time to land.
          const LINE_1 = ["Websites", "that", "put", "your"];
          const LINE_2 = ["business", "in"];
          const STEP_MS = 240;
          const totalWords = LINE_1.length + LINE_2.length + 1; // +1 = rotating word
          return (
            // Desktop only — the mobile hero above is a from-scratch
            // mobile-first build (left-aligned, single screen, no
            // parallax/fade/cascade). This block keeps the original
            // complex hero (rotating word, hero-word cascade, scroll
            // cue, HeroFader) for `md+` where it has room to land.
            <section className="hidden md:block relative md:min-h-[140dvh]">
              <HeroFader>
                <div
                  className="relative md:h-[100dvh] flex flex-col items-center justify-start px-6 text-center"
                  // pt clamps so landscape phones (where 100dvh ≈ 320px) don't
                  // push the headline below the fold. Floor 56px keeps the
                  // wordmark's safe-area-padding visible above; max 27dvh
                  // preserves the desktop hero proportions.
                  style={{
                    paddingTop:
                      "clamp(56px, 17dvh, calc(27dvh - env(safe-area-inset-top)))",
                  }}
                >
                  <h1
                    className="font-display text-headline max-w-full"
                    style={{
                      // Floor dropped from 2.75rem → 2rem so "business
                      // in [rotating]" line fits a 375px viewport. At
                      // the prior floor the rotating word's reserved
                      // 3.3em slot pushed line 2 past the viewport
                      // edge and `text-align: center` shifted the
                      // visible portion off the right.
                      fontSize: "clamp(2rem, 5.5vw, 4.75rem)",
                      fontWeight: 500,
                      lineHeight: 1.15,
                      letterSpacing: "-0.018em",
                    }}
                  >
                    {/* Line 1: "Websites that put your" */}
                    <span className="block">
                      {LINE_1.map((word, i) => (
                        <span
                          key={`l1-${i}`}
                          className="hero-word"
                          style={{ animationDelay: `${i * STEP_MS}ms` }}
                        >
                          {word}
                          {" "}
                        </span>
                      ))}
                    </span>
                    {/* Line 2: "business in [rotating word]" */}
                    <span className="block">
                      {LINE_2.map((word, i) => (
                        <span
                          key={`l2-${i}`}
                          className="hero-word"
                          style={{ animationDelay: `${(LINE_1.length + i) * STEP_MS}ms` }}
                        >
                          {word}
                          {" "}
                        </span>
                      ))}
                      <span
                        className="hero-word"
                        style={{ animationDelay: `${(LINE_1.length + LINE_2.length) * STEP_MS}ms` }}
                      >
                        <RotatingWord words={home.hero.rotatingWords} />
                      </span>
                    </span>
                  </h1>

                  {/* Scroll cue — not wrapped in <Reveal> so it's
                      visible immediately at scrollY=0 (it sits at the
                      viewport bottom edge, where Reveal's
                      "10% inside viewport" trigger wouldn't fire). */}
                  <div className="absolute bottom-24 left-0 right-0 flex justify-center">
                    <p
                      className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted hero-word"
                      style={{ animationDelay: `${(totalWords + 1) * STEP_MS}ms` }}
                    >
                      ↓ {home.hero.scrollCue}
                    </p>
                  </div>
                </div>
              </HeroFader>
            </section>
          );
        })()}

        {/* ---------------- Pull quote ----------------
            Mobile: a simple bordered card on the page flow. No full-
            bleed image, no scroll-velocity gymnastics, no scrim
            overlay — just the quote on a calm surface with a gold
            shadow. Desktop: the full-bleed cinematic PullQuote with
            the image + scroll-velocity zone. */}
        {/* Contained portrait card — aspect-[4/5] so it has poster
            presence on a phone without going edge-to-edge. Rounded +
            overflow-hidden contains the bg image. Dark gradient scrim
            sits over the image; quote + attribution stack at the
            bottom in white. The bg-image is the same one the desktop
            full-bleed PullQuote uses. */}
        {/* Edge-to-edge on mobile: break out of <main>'s 24px horizontal
            padding via the full-bleed pattern. `width: 100vw` plus
            `marginLeft: calc(50% - 50vw)` lands the section flush with
            the viewport edges regardless of <main>'s padding, with no
            rounded corners or shadow — the image is the section. */}
        <section
          className="md:hidden pt-24 pb-10 overflow-x-clip"
          style={{
            width: "100vw",
            marginLeft: "calc(50% - 50vw)",
          }}
        >
          <div className="relative w-full aspect-[4/5]">
            {/* Image + scrim layer. Masked top + bottom so the section
                fades into the page background instead of cutting off
                with a hard edge. The mask applies to this layer only —
                the text sits in a sibling on top, unmasked, fully
                legible. The bottom mask fade ends just below the text
                so the dark scrim still anchors the words. */}
            <div
              aria-hidden="true"
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to bottom, rgba(6,10,8,0.4) 0%, rgba(6,10,8,0.55) 45%, rgba(6,10,8,0.92) 100%), url('/images/2026-05-quote-perfection.webp')",
                backgroundSize: "cover, cover",
                backgroundPosition: "center, center",
                backgroundRepeat: "no-repeat, no-repeat",
                WebkitMaskImage:
                  "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
                maskImage:
                  "linear-gradient(to bottom, transparent 0%, black 12%, black 88%, transparent 100%)",
              }}
            />

            {/* Content stack — bottom-aligned. The quote anchors to
                the lower portion of the card; the image carries the
                upper portion. */}
            <div className="relative h-full flex flex-col justify-end gap-4 p-6">
              <p
                className="font-display text-white"
                style={{
                  fontSize: "clamp(1.05rem, 4.6vw, 1.375rem)",
                  fontWeight: 500,
                  lineHeight: 1.32,
                  letterSpacing: "-0.01em",
                  fontStyle: "italic",
                  wordBreak: "break-word",
                  hyphens: "auto",
                }}
              >
                <span className="text-white/55">&ldquo;</span>
                Perfection is achieved not when there is nothing more to
                add, but when there is{" "}
                {/* Plain inline span instead of <ColorWord> — ColorWord's
                    `display: inline-block` makes the phrase unwrappable
                    and pushes past the card on narrow phones. */}
                <span
                  style={{
                    backgroundImage: "var(--gold-grad)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  nothing left to take away
                </span>
                .<span className="text-white/55">&rdquo;</span>
              </p>
              <p className="font-mono text-[10.5px] uppercase tracking-[0.16em] text-white/65">
                — Antoine de Saint-Exupéry
              </p>
            </div>
          </div>
        </section>

        <div className="hidden md:block">
          <PullQuote />
        </div>

        {/* ---------------- Selected Work teaser ---------------- */}
        <section className="py-12 md:py-20">
          <AuroraHairline />
          <div className="pt-10 md:pt-14 flex flex-col gap-6 md:gap-8">
            <div className="flex items-end justify-between gap-6 flex-wrap">
              <Reveal className="flex flex-col gap-3">
                <Eyebrow color="forest">LIVE WORK · SHIPPED 2025–2026</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Out in the <ColorWord>wild</ColorWord>.
                </h2>
              </Reveal>
            </div>

            {home.featuredWork.length === 0 ? (
              <Reveal>
                <div className="rounded-xl border border-line bg-surface-calm px-8 py-14 flex flex-col gap-4 items-start max-w-2xl">
                  <Eyebrow color="ink-muted">EMPTY · TODO</Eyebrow>
                  <p
                    className="font-display text-[24px] leading-tight text-ink"
                    style={{ fontWeight: 500 }}
                  >
                    Selected work coming soon — we&apos;re shipping the first
                    cohort May 2026.
                  </p>
                  <p className="text-ink-muted text-[14px] font-mono">
                    {/* TODO_FEATURED_WORK: fill home.ts > featuredWork with
                        real shipped projects. NEVER invent client names. */}
                    Real projects only. No stock screenshots, no fake brands.
                  </p>
                  <Button href="/contact" variant="secondary" size="md">
                    Be the first
                  </Button>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <WorkCarousel items={home.featuredWork} />
              </Reveal>
            )}

            <Link
              href="/work"
              className="text-forest text-[14px] inline-flex items-center gap-1.5 self-start border-b border-current pb-0.5"
            >
              View all work →
            </Link>
          </div>
        </section>

        {/* ---------------- Process ----------------
            Mobile: simple stacked phase cards. No horizontal scroll,
            no pin/scrub, no full-bleed wrapper — just 4 cards on the
            page flow. Each card has the big gold number on the left
            and the phase name + brief blurb on the right. Reads top-
            to-bottom, fits a phone, stops trying to be a desktop
            timeline. Desktop: keeps the original full-bleed
            ProcessHorizontalScroll pattern. */}

        {/* MOBILE PROCESS */}
        <section className="md:hidden py-12">
          <AuroraHairline />
          <div className="pt-10 flex flex-col gap-3">
            <Eyebrow color="forest">PROCESS · ~14 DAYS</Eyebrow>
            <h2
              className="font-display"
              style={{
                fontSize: "clamp(1.875rem, 8vw, 2.5rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.018em",
              }}
            >
              How we <ColorWord>build</ColorWord>.
            </h2>
          </div>

          {/* Editorial row list — no card chrome, no border boxes. Each
              phase is a row with a small mono kicker (gold-gradient
              clipped), display-weight name, and a muted brief. Hairline
              divider between, no border on the last row. Reads like a
              list in a magazine, not a stack of widgets. */}
          <ol className="mt-8 flex flex-col">
            {home.phases.map((phase) => (
              <li
                key={phase.number}
                className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-1.5 py-5 border-b border-line/40 last:border-b-0"
              >
                <span
                  className="font-mono text-[11px] uppercase tracking-[0.22em] mt-[6px] self-start"
                  style={{
                    backgroundImage: "var(--gold-grad)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    color: "transparent",
                  }}
                >
                  {phase.number}
                </span>
                <h3
                  className="font-display text-ink min-w-0"
                  style={{
                    fontSize: "1.125rem",
                    fontWeight: 500,
                    lineHeight: 1.2,
                    letterSpacing: "-0.012em",
                  }}
                >
                  {phase.name}
                </h3>
                <p className="text-ink-muted text-[14px] leading-[1.55] col-start-2 min-w-0">
                  {phase.blurb}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-8">
            <Link
              href="/process"
              className="text-forest text-[14px] inline-flex items-center gap-1.5 border-b border-current pb-0.5"
            >
              Read the full process →
            </Link>
          </div>
        </section>

        {/* DESKTOP PROCESS (full-bleed horizontal scroll) */}
        <div className="hidden md:block">
          <section className="py-12 md:py-20">
            <AuroraHairline />
            <div className="pt-10 md:pt-14 flex flex-col gap-6 md:gap-8">
              <Reveal className="flex flex-col gap-3 max-w-2xl">
                <Eyebrow color="forest">PROCESS · ~14 DAYS</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2.25rem, 4vw, 3.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  How we <ColorWord>build</ColorWord>.
                </h2>
              </Reveal>
            </div>
          </section>

          <div
            className="relative w-screen"
            style={{ marginLeft: "calc(50% - 50vw)" }}
          >
            <ProcessHorizontalScroll />
          </div>

          <div aria-hidden style={{ height: "16vh" }} />

          <section className="pt-12 pb-20">
            <Link
              href="/process"
              className="text-forest text-[14px] inline-flex items-center gap-1.5 self-start border-b border-current pb-0.5"
            >
              Read the full process →
            </Link>
          </section>
        </div>

      </main>

      {/* ---------------- Closing + Contact ----------------
          Mobile (`md:hidden`): plain inline closing CTA followed by
          an inline contact form. No 300dvh pin runway, no slide-up
          drawer takeover — the form is just there, scrolls with the
          page. Mobile-native pattern.
          Desktop (`hidden md:block`): the closing CTA renders inside
          the slide-up drawer pattern (ContactDrawerMount provides the
          pin runway, ContactDrawer renders the modal sheet). */}

      {/* MOBILE PATH */}
      <div className="md:hidden">
        <section className="mx-auto max-w-[1320px] px-6 pt-12 pb-10">
          <AuroraHairline />
          <Reveal className="pt-10 flex flex-col gap-5 items-start">
            <h2
              className="font-display text-ink"
              style={{
                fontSize: "clamp(2rem, 7vw, 3rem)",
                fontWeight: 600,
                lineHeight: 1.05,
                letterSpacing: "-0.015em",
              }}
            >
              {home.closing.headline}{" "}
              <ColorWord>{home.closing.accent}</ColorWord>
              {home.closing.trailing}
            </h2>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
              {site.availability.bookingNote}
            </p>
          </Reveal>
        </section>

        <section className="mx-auto max-w-[1320px] px-6 pt-2 pb-16">
          <Reveal>
            <div className="flex items-center gap-3 mb-6">
              <Eyebrow color="forest">CONTACT · 24H REPLY</Eyebrow>
            </div>
            <InlineContactForm />
          </Reveal>
        </section>
      </div>

      {/* DESKTOP PATH */}
      <div className="hidden md:block">
        <ContactDrawerMount>
          <section className="mx-auto max-w-[1320px] px-6 md:px-10 pt-32 pb-56">
            <AuroraHairline />
            <Reveal className="pt-16 flex flex-col gap-7 items-start">
              <h2
                className="font-display text-ink"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                  fontWeight: 600,
                  lineHeight: 1.05,
                  letterSpacing: "-0.015em",
                }}
              >
                {home.closing.headline}{" "}
                <ColorWord>{home.closing.accent}</ColorWord>
                {home.closing.trailing}
              </h2>

              <Reveal stagger className="flex flex-wrap items-center gap-4">
                {site.email ? (
                  <Button
                    href={`mailto:${site.email}`}
                    variant="primary"
                    size="lg"
                    external
                  >
                    {site.email}
                  </Button>
                ) : (
                  <Button href="/contact" variant="primary" size="lg">
                    {/* TODO: set site.email so this becomes a mailto */}
                    Get in touch
                  </Button>
                )}
                {site.schedulingUrl ? (
                  <Button href={site.schedulingUrl} variant="ghost" external>
                    Schedule a 30-min intro →
                  </Button>
                ) : (
                  <span className="font-mono text-[12px] text-ink-muted">
                    {/* TODO: site.schedulingUrl */}
                    scheduling link: TODO
                  </span>
                )}
              </Reveal>

              <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
                {site.availability.bookingNote}
              </p>
            </Reveal>
          </section>
        </ContactDrawerMount>
      </div>

      <Footer />
    </>
  );
}
