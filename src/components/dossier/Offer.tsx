import { OfferButton } from "./OfferButton";
import { Reveal } from "@/components/ui/Reveal";
import { offer } from "@/lib/content";

/**
 * FINAL SECTION — the decision. A signature block at the bottom of the
 * last page: the ask, the button, and the X____ line.
 */
export function Offer() {
  return (
    <section className="px-5 py-16 sm:px-8 md:px-14 md:py-24">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="field-label">{offer.label}</p>
        <h2 className="font-anton mt-4 text-[clamp(2.6rem,7vw,5rem)] leading-[0.98] text-dink">
          {offer.title}
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-pretty text-[1rem] leading-relaxed text-dink-2">
          {offer.body}
        </p>

        <div className="mt-9 flex flex-col items-center gap-3">
          <OfferButton className="px-8 py-4 text-[0.78rem]">
            {offer.cta} →
          </OfferButton>
          <p className="font-plex text-[0.62rem] uppercase tracking-[0.18em] text-dink-3">
            {offer.note}
          </p>
        </div>

        {/* signature block */}
        <div className="mx-auto mt-14 grid max-w-xl grid-cols-2 gap-10 text-left">
          <div>
            <p className="field-line pb-1.5 font-marker text-[1.3rem] text-dink/75">
              X&nbsp;&nbsp;
            </p>
            <p className="mt-2 font-plex text-[0.58rem] uppercase tracking-[0.2em] text-dink-3">
              Hiring manager (you)
            </p>
          </div>
          <div>
            <p className="field-line pb-1.5 font-marker text-[1.3rem] text-dink/75">
              Vantage
            </p>
            <p className="mt-2 font-plex text-[0.58rem] uppercase tracking-[0.2em] text-dink-3">
              The candidate
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
