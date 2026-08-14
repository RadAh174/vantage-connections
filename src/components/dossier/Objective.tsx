import { objective } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * The candidate's objective — one typed paragraph, red-pen annotation.
 */
export function Objective() {
  return (
    <section className="px-5 py-14 sm:px-8 md:px-14 md:py-20">
      <Reveal>
        <p className="field-label">{objective.label}</p>
        <p className="mt-5 max-w-4xl text-pretty text-[1.45rem] font-medium leading-[1.35] tracking-[-0.01em] text-dink md:text-[1.9rem]">
          “To take over the work that turns a good store into a great one —
          the site, the ads, the prices, the pictures — and to bring you{" "}
          <span className="pen-underline whitespace-nowrap text-dred">
            the decision
          </span>
          , never{" "}
          <span className="pen-underline whitespace-nowrap">the chore</span>.”
        </p>
        <p
          className="marker-note mt-6 inline-block text-[1.15rem]"
          style={{ ["--marker-rot" as string]: "-2deg" }}
        >
          {objective.markerNote}
        </p>
      </Reveal>
    </section>
  );
}
