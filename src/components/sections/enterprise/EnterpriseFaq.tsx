"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { enterprise } from "@/lib/content";

export function EnterpriseFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="scroll-mt-24 py-24 md:py-32">
      <div className="container-page">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <span className="kicker text-accent-deep">Enterprise FAQ</span>
            <h2 className="font-display mt-4 text-balance text-3xl font-medium leading-[1.1] tracking-[-0.018em] text-ink sm:text-4xl">
              The things scaled brands ask.
            </h2>
            <p className="mt-5 text-pretty text-[1.02rem] leading-relaxed text-ink-soft">
              Pricing, control and onboarding for portfolios and high-volume
              stores. Start here, then book a demo.
            </p>
          </div>

          <Reveal className="divide-y divide-line border-t border-line">
            {enterprise.faqs.map((faq, i) => {
              const isOpen = open === i;
              return (
                <div key={faq.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-display text-[1.15rem] font-medium text-ink">
                      {faq.q}
                    </span>
                    <Plus
                      className={`h-5 w-5 shrink-0 text-accent-deep transition-transform duration-300 ease-out ${
                        isOpen ? "rotate-45" : "rotate-0"
                      }`}
                      strokeWidth={2}
                    />
                  </button>
                  <div
                    className="grid overflow-hidden transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: isOpen ? "1fr" : "0fr",
                      opacity: isOpen ? 1 : 0,
                    }}
                  >
                    <div className="min-h-0">
                      <p className="pb-6 pr-10 text-[0.98rem] leading-relaxed text-ink-soft">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
