import Image from "next/image";
import { Reveal } from "@/components/ui/Reveal";
import { featureRows } from "@/lib/content";

const dims: Record<string, { w: number; h: number }> = {
  storefront: { w: 1600, h: 900 },
  creative: { w: 1300, h: 1693 },
  studio: { w: 1600, h: 1195 },
};

export function FeatureRows() {
  return (
    <section id="capabilities" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <Reveal className="mb-16 max-w-2xl md:mb-24">
          <span className="kicker text-accent-deep">What you get</span>
          <h2 className="font-display mt-4 text-balance text-3xl font-medium leading-[1.06] tracking-[-0.018em] text-ink sm:text-4xl md:text-[2.9rem]">
            Four hires worth of work, in one teammate.
          </h2>
        </Reveal>

        <div className="space-y-20 md:space-y-40">
          {featureRows.map((row, i) => {
            const reversed = i % 2 === 1;
            const d = dims[row.id] ?? { w: 1600, h: 1195 };
            return (
              <div
                key={row.id}
                className="grid items-center gap-10 lg:grid-cols-12 lg:gap-6"
              >
                {/* Copy */}
                <Reveal
                  className={`lg:col-span-5 ${
                    reversed ? "lg:order-2 lg:col-start-8" : "lg:col-start-1"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="font-display text-[2.5rem] font-semibold leading-none text-accent/30">
                      0{i + 1}
                    </span>
                    <span className="kicker text-accent-deep">{row.kicker}</span>
                  </div>
                  <h3 className="font-display mt-6 text-balance text-[1.9rem] font-medium leading-[1.08] tracking-[-0.015em] text-ink sm:text-4xl md:text-[2.6rem]">
                    {row.title}
                  </h3>
                  <p className="mt-5 max-w-md text-pretty text-[1.05rem] leading-relaxed text-ink-soft">
                    {row.body}
                  </p>
                  <ul className="mt-7 flex flex-wrap gap-2.5">
                    {row.bullets.map((b) => (
                      <li
                        key={b}
                        className="rounded-full border border-line bg-paper-raised px-3.5 py-1.5 text-[0.82rem] text-ink"
                      >
                        {b}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                {/* Image */}
                <Reveal
                  delay={120}
                  className={`relative lg:col-span-6 ${
                    reversed ? "lg:order-1 lg:col-start-1" : "lg:col-start-7"
                  }`}
                >
                  {/* accent glow */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute -z-0 h-3/4 w-3/4 rounded-full opacity-50 blur-3xl ${
                      reversed ? "-left-10 bottom-0" : "-right-10 top-0"
                    }`}
                    style={{
                      background:
                        "radial-gradient(circle, rgba(var(--c-accent-rgb),0.25), transparent 70%)",
                    }}
                  />
                  <figure className="relative overflow-hidden rounded-[1.5rem] border border-line shadow-lift">
                    <Image
                      src={row.image}
                      alt={row.imageAlt}
                      width={d.w}
                      height={d.h}
                      sizes="(min-width: 1024px) 50vw, 92vw"
                      className="h-full w-full object-cover"
                      quality={78}
                    />
                  </figure>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
