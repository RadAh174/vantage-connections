"use client";

import { useState } from "react";
import { interview } from "@/lib/content";
import { Reveal } from "@/components/ui/Reveal";

/**
 * SECTION 05 — the interview. Questions and answers as a transcript:
 * red mono "Q." markers, answers indented under a hairline.
 */
export function Interview() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="interview" className="scroll-mt-16 px-5 py-14 sm:px-8 md:px-14 md:py-20">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="field-label">{interview.label}</p>
            <h2 className="font-anton mt-3 text-[clamp(2.2rem,5vw,3.6rem)] leading-none text-dink">
              {interview.title}
            </h2>
          </div>
          <p className="max-w-xs font-plex text-[0.66rem] uppercase leading-relaxed tracking-[0.14em] text-dink-3">
            {interview.note}
          </p>
        </div>
      </Reveal>

      <Reveal delay={100}>
        <ol className="mt-10 border-t border-dline">
          {interview.qs.map((item, i) => {
            const isOpen = open === i;
            return (
              <li key={item.q} className="border-b border-dline">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="group flex w-full items-start gap-4 py-6 text-left sm:gap-6"
                >
                  <span className="mt-0.5 font-plex text-[0.8rem] font-semibold text-dred">
                    Q{i + 1}.
                  </span>
                  <span className="flex-1 text-[1.05rem] font-semibold leading-snug text-dink transition-colors group-hover:text-dred md:text-[1.2rem]">
                    {item.q}
                  </span>
                  <span
                    className={`mt-0.5 font-plex text-[0.66rem] uppercase tracking-[0.16em] transition-colors ${
                      isOpen ? "text-dred" : "text-dink-3"
                    }`}
                  >
                    {isOpen ? "close" : "open"}
                  </span>
                </button>
                <div
                  className={`grid transition-all duration-300 ease-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="ml-9 max-w-3xl border-l-2 border-dred/40 pb-7 pl-5 text-pretty text-[0.95rem] leading-relaxed text-dink-2 sm:ml-12">
                      <span className="mr-2 font-plex text-[0.8rem] font-semibold text-dink">
                        A.
                      </span>
                      {item.a}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </Reveal>
    </section>
  );
}
