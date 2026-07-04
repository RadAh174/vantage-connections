"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { atWork } from "@/lib/content";

const SCENES = atWork.scenes;
const N = SCENES.length;

export function OttoAtWork() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) setReduce(true);

    let raf = 0;
    let running = false;
    const compute = () => {
      const rect = section.getBoundingClientRect();
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
    io.observe(section);
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
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const scrollable = rect.height - window.innerHeight;
    window.scrollTo({
      top: top + ((i + 0.5) / N) * scrollable,
      behavior: "smooth",
    });
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Vantage at work"
      className="grain relative band-soft text-ink"
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
              <div className="relative min-h-[260px] sm:min-h-[300px]">
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
                    <p className="mt-6 max-w-md text-pretty text-[1.15rem] leading-relaxed text-ink-soft">
                      {s.sub}
                    </p>
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
    </section>
  );
}

const SCENE_IMG: Record<string, string> = {
  storefront: "/media/feature-storefront.webp",
  studio: "/media/feature-creative.webp",
};

const SCENE_ALT: Record<string, string> = {
  storefront:
    "A polished Shopify storefront built and maintained by Vantage, shown on desktop and mobile",
  studio:
    "Vantage-generated product photography styled like a professional studio shoot",
};

function SceneVisual({ id, active }: { id: string; active: boolean }) {
  if (id === "ads") return <AdsVisual active={active} />;
  if (id === "trends") return <TrendsVisual />;
  return (
    <Image
      src={SCENE_IMG[id] ?? "/media/feature-creative.webp"}
      alt={SCENE_ALT[id] ?? "Vantage-generated storefront and creative work"}
      fill
      sizes="(min-width:1024px) 44vw, 90vw"
      className="object-cover"
    />
  );
}

// Trends scene: a real viral product (Dubai chocolate) shot like a hero.
function TrendsVisual() {
  return (
    <Image
      src="/media/feature-trends.webp"
      alt="Dubai chocolate, a viral trending product, broken open to reveal its pistachio and kataifi filling"
      fill
      sizes="(min-width:1024px) 44vw, 90vw"
      className="object-cover"
      quality={82}
    />
  );
}

function AdsVisual({ active }: { active: boolean }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) void v.play().catch(() => {});
    else v.pause();
  }, [active]);
  return (
    <video
      ref={ref}
      src="/media/ugc.mp4"
      poster="/media/ugc-poster.webp"
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      className="h-full w-full object-cover"
    />
  );
}

