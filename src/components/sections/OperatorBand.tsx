import {
  Check,
  X,
  Store,
  Megaphone,
  Tag,
  Image as ImageIcon,
} from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { operator } from "@/lib/content";

export function OperatorBand() {
  const { them, otto } = operator.contrast;
  return (
    <section
      id="operator"
      className="grain relative scroll-mt-24 overflow-hidden band-soft py-24 text-ink md:py-32"
    >
      {/* accent glow center */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[55vh] w-[55vw] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(var(--c-accent-rgb),0.3), rgba(var(--c-accent-rgb),0) 70%)",
        }}
      />

      <div className="container-page relative z-10">
        <SectionHeading
          kicker={operator.kicker}
          title={operator.title}
          body={operator.body}
        />

        {/* One brain → many outputs */}
        <Reveal delay={120} className="mx-auto mt-14 max-w-4xl">
          <OneBrainDiagram />
        </Reveal>

        {/* Contrast */}
        <div className="mx-auto mt-16 grid max-w-4xl gap-5 md:grid-cols-2">
          <Reveal className="rounded-2xl border border-line bg-paper-raised p-7 shadow-soft">
            <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-ink-muted">
              {them.label}
            </h3>
            <ul className="mt-5 space-y-3.5">
              {them.items.map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <X
                    className="mt-0.5 h-4 w-4 shrink-0 text-ink-muted"
                    strokeWidth={2.25}
                  />
                  <span className="text-[0.95rem] text-ink-soft">{it}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal
            delay={120}
            className="rounded-2xl border border-accent/40 bg-paper-raised bg-gradient-to-b from-accent/[0.07] to-transparent p-7 shadow-soft"
          >
            <h3 className="font-mono text-[0.72rem] uppercase tracking-[0.2em] text-accent-deep">
              {otto.label}
            </h3>
            <ul className="mt-5 space-y-3.5">
              {otto.items.map((it) => (
                <li key={it} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent-deep">
                    <Check
                      className="h-2.5 w-2.5 text-on-accent"
                      strokeWidth={3.5}
                    />
                  </span>
                  <span className="text-[0.95rem] text-ink">{it}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// One brain (left) distributes the SAME context out to four real outputs (right).
// Centers are in a 1000×620 design grid shared by the SVG beams and the HTML cards.
const OUTPUTS = [
  { label: "Storefront", desc: "Built & maintained", Icon: Store, y: 95 },
  { label: "Ads & UGC", desc: "Written & shot", Icon: Megaphone, y: 270 },
  { label: "Pricing", desc: "Tuned to the market", Icon: Tag, y: 440 },
  { label: "Imagery", desc: "Generated on demand", Icon: ImageIcon, y: 575 },
];

function OneBrainDiagram() {
  return (
    <figure
      role="img"
      aria-label="One Vantage brain learns your store, then produces your storefront, ads and UGC, pricing and imagery from the same context"
      className="rounded-3xl border border-line bg-paper-raised p-5 shadow-soft sm:p-7"
    >
      {/* ── md+ : full signal-flow schematic ── */}
      <div className="relative mx-auto hidden aspect-[1000/620] w-full max-w-3xl md:block">
        {/* beams (behind), aligned 1:1 with the % grid below */}
        <svg
          viewBox="0 0 1000 620"
          className="absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="beam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.15" />
            </linearGradient>
          </defs>
          {OUTPUTS.map((o, i) => {
            const path = `M330 310 C 480 310, 470 ${o.y}, 600 ${o.y}`;
            return (
              <g key={o.label}>
                <path
                  d={path}
                  fill="none"
                  stroke="url(#beam)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <circle r="4.5" fill="var(--color-accent)">
                  <animateMotion
                    dur="2.6s"
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                    path={path}
                    keyPoints="0;1"
                    keyTimes="0;1"
                    calcMode="spline"
                    keySplines="0.4 0 0.2 1"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;1;1;0"
                    keyTimes="0;0.1;0.8;1"
                    dur="2.6s"
                    begin={`${i * 0.45}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}
        </svg>

        {/* Otto core — gradient jewel */}
        <div
          className="otto-core absolute left-[25%] top-1/2 flex aspect-square w-[19%] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[1.4rem] border border-accent/30 text-center"
          style={{
            boxShadow:
              "0 0 0 8px rgba(var(--c-accent-rgb),0.08), 0 30px 70px -30px rgba(var(--c-shade-rgb),0.4)",
          }}
        >
          <span className="font-display text-[1.6rem] font-semibold leading-none text-paper">
            Vantage
          </span>
          <span className="mt-1.5 font-mono text-[0.52rem] uppercase tracking-[0.22em] text-accent-soft">
            One brain
          </span>
        </div>

        {/* output cards */}
        {OUTPUTS.map((o) => (
          <div
            key={o.label}
            className="absolute left-[60%] flex w-[34%] -translate-y-1/2 items-center gap-3 rounded-2xl border border-line bg-paper-raised px-4 py-3 shadow-soft"
            style={{ top: `${(o.y / 620) * 100}%` }}
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent/12 text-accent-deep">
              <o.Icon className="h-[1.05rem] w-[1.05rem]" strokeWidth={2} />
            </span>
            <span className="min-w-0">
              <span className="block text-[0.95rem] font-medium leading-tight text-ink">
                {o.label}
              </span>
              <span className="block font-mono text-[0.62rem] uppercase tracking-[0.12em] text-ink-muted">
                {o.desc}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* ── mobile : core chip + stacked outputs ── */}
      <div className="md:hidden">
        <div className="otto-core mx-auto flex w-fit flex-col items-center rounded-2xl border border-accent/30 px-7 py-4 text-center">
          <span className="font-display text-2xl font-semibold leading-none text-paper">
            Vantage
          </span>
          <span className="mt-1.5 font-mono text-[0.55rem] uppercase tracking-[0.22em] text-accent-soft">
            One brain
          </span>
        </div>
        <div className="mx-auto mt-2 h-6 w-px bg-gradient-to-b from-accent/60 to-accent/10" />
        <div className="grid grid-cols-2 gap-2.5">
          {OUTPUTS.map((o) => (
            <div
              key={o.label}
              className="flex items-center gap-2.5 rounded-xl border border-line bg-paper-raised px-3 py-2.5 shadow-soft"
            >
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent/12 text-accent-deep">
                <o.Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.85rem] font-medium leading-tight text-ink">
                  {o.label}
                </span>
                <span className="block font-mono text-[0.55rem] uppercase tracking-[0.1em] text-ink-muted">
                  {o.desc}
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <figcaption className="mt-5 text-center font-mono text-[0.66rem] uppercase tracking-[0.18em] text-ink-muted">
        Same context in. Every output on brand.
      </figcaption>
    </figure>
  );
}
