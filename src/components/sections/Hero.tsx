import { Button } from "@/components/ui/Button";
import { ScrollVideo } from "@/components/ui/ScrollVideo";
import { hero } from "@/lib/content";

export function Hero() {
  return (
    <section
      id="top"
      className="band-immersive grain relative overflow-hidden pb-24 pt-28 text-paper md:pb-28 md:pt-36"
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

        {/* Cinematic framed video */}
        <div className="relative mx-auto mt-16 max-w-6xl md:mt-20">
          <div className="relative rounded-2xl border border-paper/15 bg-paper-raised p-2 shadow-lift md:p-3">
            {/* accent corner ticks */}
            <CornerTicks />
            <div className="relative overflow-hidden rounded-xl">
              <ScrollVideo
                src="/media/hero.mp4"
                poster="/media/hero-poster.webp"
                mode="scrub"
                className="aspect-[16/9] w-full"
              />
              {/* subtle vignette for depth */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-xl"
                style={{
                  boxShadow: "inset 0 0 120px 8px rgba(var(--c-shade-rgb),0.12)",
                }}
              />
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

function CornerTicks() {
  const common =
    "absolute h-3.5 w-3.5 border-accent-soft/80 transition-opacity";
  return (
    <>
      <span className={`${common} left-1 top-1 border-l border-t`} />
      <span className={`${common} right-1 top-1 border-r border-t`} />
      <span className={`${common} bottom-1 left-1 border-b border-l`} />
      <span className={`${common} bottom-1 right-1 border-b border-r`} />
    </>
  );
}
