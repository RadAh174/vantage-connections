import { Button } from "@/components/ui/Button";
import { ScrollVideo } from "@/components/ui/ScrollVideo";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="top"
      className="band-immersive grain relative pb-36 pt-28 text-paper md:pb-44 md:pt-36"
    >
      {/* soft light bloom lifting the headline off the gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[680px] w-[1100px] -translate-x-1/2 rounded-full opacity-70"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 32%, rgba(230,190,90,0.16), rgba(230,190,90,0) 70%)",
        }}
      />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-7">
            <span className="kicker text-accent-soft">{hero.kicker}</span>
          </div>

          <h1 className="font-display text-balance text-[2.6rem] font-medium leading-[1.04] tracking-[-0.02em] text-paper sm:text-6xl md:text-7xl">
            {hero.headlineLead}
            <br className="hidden sm:block" />{" "}
            <span className="relative whitespace-nowrap italic text-accent-soft">
              {hero.headlineEmph}
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
            {hero.sub}
          </p>

          <div className="mt-10 flex justify-center">
            <Button href={hero.primary.href} variant="primary" withArrow>
              {hero.primary.label}
            </Button>
          </div>
        </div>

        {/* Scroll-capture track for the video only: on md+ this block is
            ~2.2 viewports tall; the framed card sticks centered inside it
            while the scroll drives the full assembly, then releases. The
            headline above scrolls away naturally. Mobile keeps normal flow. */}
        <div id="hero-video-track" className="relative mt-16 md:mt-8 md:h-[220svh]">
          <div className="md:sticky md:top-[14svh]">
            {/* width capped so the pinned card always fits under its sticky
                offset: height <= ~72svh (16/9 => width <= 128svh) */}
            <div className="relative mx-auto max-w-6xl md:max-w-[min(72rem,128svh)]">
              {/* outer radius = inner radius (0.75rem) + frame padding, so the
                  two corners run concentric */}
              <div className="relative rounded-[1.25rem] border border-paper/15 bg-paper-raised p-2 shadow-lift md:rounded-[1.5rem] md:p-3">
                <div className="relative overflow-hidden rounded-xl">
                  <ScrollVideo
                    src="/media/hero-3.mp4"
                    poster="/media/hero-poster-3.webp"
                    mode="scrub"
                    trackId="hero-video-track"
                    scrubRange={0.82}
                    className="aspect-[16/9] w-full"
                  />
                  {/* subtle vignette for depth */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 rounded-xl"
                    style={{
                      boxShadow:
                        "inset 0 0 120px 8px rgba(var(--c-shade-rgb),0.12)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* fade the gradient into the cream canvas below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-28 bg-gradient-to-b from-transparent to-paper"
      />
    </section>
  );
}
