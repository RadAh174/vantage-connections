import { AmbientVideo } from "@/components/ui/AmbientVideo";
import { Reveal } from "@/components/ui/Reveal";
import { competencies } from "@/lib/content";

/**
 * SECTION 01 — qualifications. Each craft gets a typed dossier row and an
 * attached exhibit (the generated imagery, treated as clipped evidence).
 */
export function Competencies() {
  return (
    <section id="qualifications" className="scroll-mt-16 px-5 py-14 sm:px-8 md:px-14 md:py-20">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="field-label">{competencies.label}</p>
            <h2 className="font-anton mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-none text-dink">
              {competencies.title}
            </h2>
          </div>
          <p className="max-w-xs font-plex text-[0.66rem] uppercase leading-relaxed tracking-[0.14em] text-dink-3">
            {competencies.note}
          </p>
        </div>
      </Reveal>

      <div className="mt-12 flex flex-col gap-14 md:mt-16 md:gap-20">
        {competencies.items.map((item, i) => (
          <Reveal key={item.n}>
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              {/* typed row */}
              <div className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="flex items-baseline gap-4 border-b border-dline pb-3">
                  <span className="font-plex text-[0.72rem] font-semibold tracking-[0.2em] text-dred">
                    {item.n}
                  </span>
                  <span className="field-label">CERTIFIED SKILL</span>
                </div>
                <h3 className="font-anton mt-4 text-[clamp(1.7rem,3.4vw,2.5rem)] leading-tight text-dink">
                  {item.skill}
                </h3>
                <p className="mt-4 max-w-md text-pretty text-[0.98rem] leading-relaxed text-dink-2">
                  {item.desc}
                </p>

                {/* proficiency meter */}
                <div className="mt-6 flex items-center gap-3">
                  <span className="field-label">PROFICIENCY</span>
                  <span className="flex gap-1" aria-hidden="true">
                    {[0, 1, 2, 3, 4].map((b) => (
                      <span key={b} className="meter-block" />
                    ))}
                  </span>
                  <span className="font-plex text-[0.62rem] uppercase tracking-[0.16em] text-dink-2">
                    Expert
                  </span>
                </div>
              </div>

              {/* the exhibit */}
              <figure
                className={`exhibit-frame relative p-3 pb-4 ${
                  i % 2 === 1
                    ? "rotate-[-1.4deg] md:order-1"
                    : "rotate-[1.4deg]"
                }`}
              >
                <span
                  className={`tape -top-3 ${
                    i % 2 === 1 ? "right-8 rotate-[5deg]" : "left-8 rotate-[-5deg]"
                  }`}
                  aria-hidden="true"
                />
                <div className="relative overflow-hidden">
                  {item.video ? (
                    <AmbientVideo
                      src={item.video}
                      poster={item.poster}
                      mode="loop"
                      className="exhibit-media aspect-[3/2] w-full"
                    />
                  ) : (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.image}
                      alt={item.alt}
                      loading="lazy"
                      className="exhibit-media block aspect-[3/2] w-full object-cover"
                    />
                  )}
                  {/* red grease-pencil circle on the evidence */}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 120 80"
                    className="pointer-events-none absolute right-3 top-3 h-16 w-24 rotate-[-8deg] text-dred md:h-20 md:w-28"
                  >
                    <path
                      d="M14 44 C 8 18, 52 6, 84 10 C 112 14, 118 34, 106 52 C 92 72, 40 76, 20 62 C 8 54, 10 40, 22 34"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.85"
                    />
                  </svg>
                </div>
                <figcaption className="mt-3 flex items-center justify-between gap-3">
                  <span className="font-plex text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-dred">
                    {item.exhibit}
                  </span>
                  <span className="marker-note text-[0.95rem]">
                    {item.exhibitNote}
                  </span>
                </figcaption>
              </figure>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
