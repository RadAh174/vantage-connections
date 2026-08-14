import { Check } from "lucide-react";
import { Stamp } from "./Stamp";
import { OfferButton } from "./OfferButton";
import { Reveal } from "@/components/ui/Reveal";
import { compensation } from "@/lib/content";

/**
 * SECTION 04 — compensation. The salary line ($0), the benefits package,
 * and the NO CARD REQUIRED stamp.
 */
export function Compensation() {
  return (
    <section id="compensation" className="scroll-mt-16 px-5 py-14 sm:px-8 md:px-14 md:py-20">
      <Reveal>
        <p className="field-label">{compensation.label}</p>
        <h2 className="font-anton mt-3 max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] text-dink">
          {compensation.title}
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-[1rem] leading-relaxed text-dink-2">
          {compensation.body}
        </p>
      </Reveal>

      <Reveal delay={120}>
        <div className="relative mt-10 border border-dline bg-dpaper-2/50 p-6 sm:p-10">
          <div className="grid gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-14">
            {/* salary line */}
            <div className="flex flex-col justify-between gap-8">
              <div>
                <p className="field-label">PROPOSED SALARY — {compensation.planName}</p>
                <p className="mt-3 flex items-end gap-4">
                  <span className="font-anton text-[clamp(4.5rem,10vw,7.5rem)] leading-none text-dink">
                    {compensation.salary}
                  </span>
                  <span className="pb-2 font-plex text-[0.66rem] uppercase leading-snug tracking-[0.16em] text-dink-2">
                    {compensation.salaryNote}
                  </span>
                </p>
              </div>
              <div>
                <OfferButton>{compensation.cta} →</OfferButton>
                <p className="mt-4 font-plex text-[0.62rem] uppercase tracking-[0.16em] text-dink-3">
                  {compensation.fine}
                </p>
              </div>
            </div>

            {/* benefits */}
            <div>
              <p className="field-label border-b border-dline pb-3">
                {compensation.benefitsTitle}
              </p>
              <ul className="mt-5 flex flex-col gap-3.5">
                {compensation.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[0.93rem] leading-snug text-dink">
                    <span className="dossier-check mt-0.5">
                      <Check className="h-3 w-3" strokeWidth={3.5} />
                    </span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Stamp
            text={compensation.stamp}
            rot="5deg"
            className="absolute -top-5 right-6 bg-dpaper text-[0.72rem] sm:right-10 sm:text-[0.8rem]"
          />
        </div>
      </Reveal>
    </section>
  );
}
