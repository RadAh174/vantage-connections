"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { atWork } from "@/lib/content";

const SCENES = atWork.scenes;
const N = SCENES.length;

/**
 * Two renders of the same content:
 * - mobile/tablet (<lg): normal-flow stacked scenes — no pinning, no
 *   cross-fades. Scroll-driven opacity layering reads as double-exposed
 *   soup on a small screen, so each scene is simply its own block.
 * - desktop (lg+): the sticky scrollytelling with scroll-scrubbed scenes.
 */
export function OttoAtWork() {
  return (
    <section
      id="capabilities"
      aria-label="Vantage at work"
      className="grain band-soft relative scroll-mt-24 text-ink"
    >
      <MobileScenes />
      <DesktopScenes />
    </section>
  );
}

/* ── mobile: one column, every scene fully visible ── */
function MobileScenes() {
  return (
    <div className="container-page relative z-10 py-20 lg:hidden">
      <div className="mx-auto max-w-xl">
        <span className="kicker text-accent-deep">{atWork.kicker}</span>
        <div className="mt-10 space-y-16">
        {SCENES.map((s) => (
          <Reveal key={s.id} as="article">
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[1.5rem] border border-line bg-paper-raised shadow-lift">
              <SceneVisual id={s.id} active io />
            </div>
            <p className="mt-6 font-mono text-[0.74rem] uppercase tracking-[0.16em] text-ink-muted">
              {s.pain}
            </p>
            <h2 className="font-display mt-3 text-balance text-[2rem] font-medium leading-[1.06] tracking-[-0.02em] text-ink">
              {s.title}
            </h2>
            <p className="mt-3 text-pretty text-[1.02rem] leading-relaxed text-ink-soft">
              {s.sub}
            </p>
            <ul className="mt-5 flex flex-wrap gap-2">
              {s.bullets.map((b) => (
                <li
                  key={b}
                  className="rounded-full border border-line bg-paper-raised px-3.5 py-1.5 text-[0.82rem] text-ink"
                >
                  {b}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
        </div>
      </div>
    </div>
  );
}

/* ── desktop: sticky scrollytelling (unchanged behavior) ── */
function DesktopScenes() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) setReduce(true);

    let raf = 0;
    let running = false;
    const compute = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      if (scrollable <= 0) return 0;
      return Math.min(1, Math.max(0, -rect.top / scrollable));
    };
    const tick = () => {
      setProgress(compute());
      if (running) raf = requestAnimationFrame(tick);
    };
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries[0]?.isIntersecting;
        if (vis && !running) {
          running = true;
          raf = requestAnimationFrame(tick);
        } else if (!vis && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0 },
    );
    io.observe(track);
    return () => {
      io.disconnect();
      running = false;
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const active = reduce
    ? 0
    : Math.min(N - 1, Math.max(0, Math.floor(progress * N)));

  const sceneOpacity = (i: number) => {
    if (reduce) return i === 0 ? 1 : 0;
    const c = (i + 0.5) / N;
    let d = progress - c;
    if (i === 0 && d < 0) d = 0;
    if (i === N - 1 && d > 0) d = 0;
    const seg = 1 / N;
    return Math.min(1, Math.max(0, 1 - Math.abs(d) / (seg * 0.6)));
  };

  const goToScene = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const scrollable = rect.height - window.innerHeight;
    window.scrollTo({
      top: top + ((i + 0.5) / N) * scrollable,
      behavior: "smooth",
    });
  };

  return (
    <div
      ref={trackRef}
      className="relative hidden lg:block"
      style={{ height: `${reduce ? 100 : 100 + N * 85}vh` }}
    >
      {/* accent glow follows the active scene side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-1/4 h-[70vh] w-[60vw] rounded-full opacity-40"
        style={{
          background:
            "radial-gradient(50% 50% at 70% 40%, rgba(var(--c-accent-rgb),0.35), rgba(var(--c-accent-rgb),0) 70%)",
        }}
      />

      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="container-page relative z-10 w-full">
          <span className="kicker text-accent-deep">{atWork.kicker}</span>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            {/* TEXT — pain first, then the service, big */}
            <div className="order-2 lg:order-1">
              <div className="relative min-h-[380px] xl:min-h-[420px]">
                {SCENES.map((s, i) => (
                  <div
                    key={s.id}
                    className="absolute inset-0 flex flex-col justify-center"
                    style={{
                      opacity: sceneOpacity(i),
                      transform: reduce
                        ? undefined
                        : `translateY(${(progress - (i + 0.5) / N) * -90}px)`,
                      pointerEvents: sceneOpacity(i) > 0.5 ? "auto" : "none",
                    }}
                  >
                    <p className="font-mono text-[0.8rem] uppercase tracking-[0.16em] text-ink-muted">
                      {s.pain}
                    </p>
                    <h2 className="font-display mt-4 text-balance text-4xl font-medium leading-[1.02] tracking-[-0.02em] text-ink sm:text-5xl md:text-[3.75rem]">
                      {s.title}
                    </h2>
                    <p className="mt-5 max-w-md text-pretty text-[1.15rem] leading-relaxed text-ink-soft">
                      {s.sub}
                    </p>
                    <ul className="mt-5 flex max-w-md flex-wrap gap-2">
                      {s.bullets.map((b) => (
                        <li
                          key={b}
                          className="rounded-full border border-line bg-paper-raised px-3.5 py-1.5 text-[0.82rem] text-ink"
                        >
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* service progress nav */}
              <div className="mt-10 flex flex-wrap gap-2.5">
                {SCENES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goToScene(i)}
                    className={`rounded-full border px-4 py-2 text-[0.82rem] font-medium transition-all duration-300 ${
                      active === i
                        ? "border-accent/50 bg-accent/12 text-ink"
                        : "border-line text-ink-muted hover:text-ink"
                    }`}
                  >
                    {s.tab}
                  </button>
                ))}
              </div>
            </div>

            {/* VISUAL — big, free-form, no chrome */}
            <div className="order-1 lg:order-2">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[440px] overflow-hidden rounded-[1.75rem] border border-line bg-paper-raised shadow-lift lg:max-w-none">
                {SCENES.map((s, i) => (
                  <div
                    key={s.id}
                    className="absolute inset-0"
                    style={{
                      opacity: sceneOpacity(i),
                      pointerEvents: active === i ? "auto" : "none",
                    }}
                  >
                    <SceneVisual id={s.id} active={active === i && !reduce} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const SCENE_IMG: Record<string, string> = {
  storefront: "/media/scene-storefront-2.webp",
  studio: "/media/scene-studio-3.webp",
};

const SCENE_ALT: Record<string, string> = {
  storefront:
    "The same candle listing before and after Vantage rebuilds it — dim and stale on top, lit and bright with five gold stars below",
  studio:
    "A desk covered in freshly printed campaign photographs of one amber serum bottle in a dozen styles, the real bottle standing among its own imagery",
};

function SceneVisual({
  id,
  active,
  io = false,
}: {
  id: string;
  active: boolean;
  io?: boolean;
}) {
  if (id === "ads") return <AdsVisual active={active} io={io} />;
  if (id === "trends") return <TrendsVisual />;
  return (
    <Image
      src={SCENE_IMG[id] ?? "/media/feature-creative-3.webp"}
      alt={SCENE_ALT[id] ?? "Vantage-generated storefront and creative work"}
      fill
      sizes="(min-width:1024px) 44vw, 90vw"
      className="object-cover"
    />
  );
}

function TrendsVisual() {
  return (
    <Image
      src="/media/feature-trends-3.webp"
      alt="A sage tumbler surging in demand — echo copies receding behind it while order notifications spiral upward"
      fill
      sizes="(min-width:1024px) 44vw, 90vw"
      className="object-cover"
      quality={82}
    />
  );
}

function AdsVisual({ active, io = false }: { active: boolean; io?: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);

  // scrollytelling mode: driven by the active scene
  useEffect(() => {
    if (io) return;
    const v = ref.current;
    if (!v) return;
    if (active) void v.play().catch(() => {});
    else v.pause();
  }, [active, io]);

  // static-stack mode: ambient loop only while on screen (battery-friendly)
  useEffect(() => {
    if (!io) return;
    const v = ref.current;
    if (!v) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) void v.play().catch(() => {});
          else v.pause();
        }
      },
      { threshold: 0.2 },
    );
    obs.observe(v);
    return () => obs.disconnect();
  }, [io]);

  return (
    <video
      ref={ref}
      src="/media/ugc-2.mp4"
      poster="/media/ugc-poster-2.webp"
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="h-full w-full object-cover"
    />
  );
}
