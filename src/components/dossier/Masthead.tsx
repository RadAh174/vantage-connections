import { Check } from "lucide-react";
import { Stamp } from "./Stamp";
import { OfferButton } from "./OfferButton";
import { masthead } from "@/lib/content";

/**
 * PAGE 1 of the dossier — the form header, the applicant's details, the
 * desk photo clipped to the folder, and the first rubber stamp.
 */
export function Masthead() {
  return (
    <section id="top" className="relative">
      {/* form header strip */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-dink px-5 pb-3 pt-6 sm:px-8 md:px-14">
        <p className="font-plex text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-dink">
          {masthead.formNo}
        </p>
        <p className="hidden font-plex text-[0.58rem] uppercase tracking-[0.2em] text-dink-3 sm:block">
          {masthead.formSub}
        </p>
      </div>

      {/* applicant fields */}
      <dl className="grid grid-cols-2 gap-x-6 gap-y-4 border-b border-dline px-5 py-5 sm:px-8 md:grid-cols-4 md:px-14">
        {masthead.fields.map((f) => (
          <div key={f.label}>
            <dt className="field-label">{f.label}</dt>
            <dd className="field-line mt-1.5 pb-1 font-plex text-[0.78rem] font-medium text-dink">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="grid items-center gap-10 px-5 py-12 sm:px-8 md:grid-cols-[1.15fr_0.85fr] md:px-14 md:py-16 lg:gap-14">
        {/* the ask */}
        <div>
          <h1 className="font-anton text-[clamp(3rem,8.5vw,6.2rem)] leading-[0.95] tracking-[0.005em] text-dink">
            HIRE THE
            <br />
            <span className="text-dred">OPERATOR.</span>
          </h1>

          <p className="mt-6 max-w-lg text-pretty text-[1.02rem] leading-relaxed text-dink-2">
            {masthead.intro}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={masthead.primary.href}
              className="rounded-sm bg-dink px-6 py-3.5 font-plex text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-dpaper transition-colors hover:bg-dred"
            >
              {masthead.primary.label} ↓
            </a>
            <OfferButton variant="link">
              {masthead.secondary.label} →
            </OfferButton>
          </div>

          <ul className="mt-9 flex flex-col gap-2.5">
            {masthead.checks.map((c) => (
              <li key={c} className="flex items-center gap-3 text-[0.9rem] text-dink-2">
                <span className="dossier-check">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {c}
              </li>
            ))}
          </ul>
        </div>

        {/* the clipped-in desk photo + first stamp */}
        <div className="relative mx-auto w-full max-w-md md:max-w-none">
          <figure className="exhibit-frame relative rotate-[1.5deg] p-3 pb-4">
            <span className="tape -top-3 left-8 rotate-[-4deg]" aria-hidden="true" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/media/masthead-desk.webp"
              alt="A rubber stamp, red ink pad, paperclips and blank application forms on a wooden desk."
              className="exhibit-media block w-full"
              loading="eager"
            />
            <figcaption className="mt-3 flex items-center justify-between font-plex text-[0.58rem] uppercase tracking-[0.2em] text-dink-3">
              <span>Fig. 1 — the hire, at work</span>
              <span>ATTACHED</span>
            </figcaption>
          </figure>

          <Stamp
            text={masthead.stamp}
            rot="-7deg"
            delay={350}
            className="absolute -bottom-6 -left-4 z-10 bg-dpaper text-[0.72rem] sm:text-[0.8rem]"
          />
        </div>
      </div>
    </section>
  );
}
