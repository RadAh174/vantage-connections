import { Check } from "lucide-react";
import { Stamp } from "./Stamp";
import { Reveal } from "@/components/ui/Reveal";
import { supervision } from "@/lib/content";

/**
 * SECTION 03 — terms of supervision. A contract clause box with the
 * APPROVAL REQUIRED stamp slammed across its corner.
 */
export function Supervision() {
  return (
    <section className="px-5 py-14 sm:px-8 md:px-14 md:py-20">
      <Reveal>
        <div className="relative border-2 border-dink p-6 sm:p-10 md:p-12">
          {/* clause number, contract style */}
          <div className="flex flex-wrap items-baseline justify-between gap-3 border-b border-dline pb-5">
            <p className="field-label">{supervision.label}</p>
            <p className="font-plex text-[0.6rem] uppercase tracking-[0.2em] text-dink-3">
              CLAUSE 3.1 — CONTROL OF WORK
            </p>
          </div>

          <h2 className="font-anton mt-7 max-w-3xl text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.02] text-dink">
            {supervision.title}
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-[1rem] leading-relaxed text-dink-2">
            {supervision.body}
          </p>

          <ul className="mt-8 grid gap-3 sm:grid-cols-3 sm:gap-6">
            {supervision.points.map((p) => (
              <li key={p} className="flex items-start gap-3 text-[0.9rem] leading-snug text-dink">
                <span className="dossier-check mt-0.5">
                  <Check className="h-3 w-3" strokeWidth={3.5} />
                </span>
                {p}
              </li>
            ))}
          </ul>

          <Stamp
            text={supervision.stamp}
            rot="-8deg"
            className="absolute -top-6 right-6 bg-dpaper text-[0.72rem] sm:right-10 sm:text-[0.85rem]"
          />
        </div>
      </Reveal>
    </section>
  );
}
