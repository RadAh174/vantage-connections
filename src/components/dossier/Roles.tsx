"use client";

import { useEffect, useRef, useState } from "react";
import { Check, X } from "lucide-react";
import { roles } from "@/lib/content";

/**
 * SECTION 02 — the role. Six positions struck through in red, consolidated
 * into one. Then the memo: the stack you have vs the candidate.
 */
export function Roles() {
  const listRef = useRef<HTMLUListElement | null>(null);
  const [struckCount, setStruckCount] = useState(0);

  // Strike the roles one at a time once the list scrolls into view.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let timers: ReturnType<typeof setTimeout>[] = [];
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        io.disconnect();
        roles.replaced.forEach((_, i) => {
          timers.push(setTimeout(() => setStruckCount(i + 1), 350 + i * 280));
        });
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      timers.forEach(clearTimeout);
    };
  }, []);

  return (
    <section id="role" className="scroll-mt-16 px-5 py-14 sm:px-8 md:px-14 md:py-20">
      <div>
        <p className="field-label">{roles.label}</p>
        <h2 className="font-anton mt-3 max-w-3xl text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.02] text-dink">
          {roles.title}
        </h2>
        <p className="mt-5 max-w-2xl text-pretty text-[1rem] leading-relaxed text-dink-2">
          {roles.body}
        </p>
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        {/* the org chart, redacted */}
        <div className="border border-dline bg-dpaper-2/60 p-6 sm:p-8">
          <p className="field-label">POSITIONS ON FILE — SUPERSEDED</p>
          <ul ref={listRef} className="mt-5 flex flex-col gap-3.5">
            {roles.replaced.map((r, i) => (
              <li key={r} className="flex items-center justify-between gap-4">
                <span className="relative inline-block font-plex text-[0.95rem] font-medium text-dink-2">
                  {r}
                  <span
                    aria-hidden="true"
                    className={`absolute left-[-2%] top-[52%] block h-[2.5px] bg-dred ${
                      i < struckCount ? "strike-draw" : "w-0"
                    }`}
                  />
                </span>
                <span className="font-plex text-[0.58rem] uppercase tracking-[0.18em] text-dink-3">
                  role {String(i + 1).padStart(2, "0")}
                </span>
              </li>
            ))}
          </ul>
          <p
            className="marker-note mt-7 text-[1.1rem] leading-snug"
            style={{ ["--marker-rot" as string]: "-1.5deg" }}
          >
            consolidated into one position →
          </p>
        </div>

        {/* the memo */}
        <div className="flex flex-col gap-5">
          <div className="border border-dline p-6 sm:p-7">
            <p className="field-label">{roles.currentStack.title}</p>
            <ul className="mt-4 flex flex-col gap-3">
              {roles.currentStack.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.93rem] text-dink-2"
                >
                  <X className="mt-0.5 h-4 w-4 shrink-0 text-dink-3" strokeWidth={2.5} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-2 border-dink bg-dink p-6 text-dpaper shadow-[6px_6px_0_0_#cf3428] sm:p-7">
            <p className="font-plex text-[0.6rem] uppercase tracking-[0.22em] text-dpaper/60">
              {roles.oneOperator.title}
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              {roles.oneOperator.items.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 text-[0.93rem] font-medium"
                >
                  <span className="mt-0.5 inline-flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-[2px] border border-dpaper/40">
                    <Check className="h-2.5 w-2.5 text-dred" strokeWidth={3.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
