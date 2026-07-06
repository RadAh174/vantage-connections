import { TrendingUp, Sparkles, LayoutGrid, Wallet } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { capabilityCards } from "@/lib/content";

const icons: Record<string, LucideIcon> = {
  TrendingUp,
  Sparkles,
  LayoutGrid,
  Wallet,
};

export function CapabilityCards() {
  return (
    <section className="border-t border-line bg-paper-sunken/40 py-20 md:py-24">
      <div className="container-page">
        <Reveal className="mb-12 flex flex-col items-baseline justify-between gap-3 sm:flex-row">
          <h2 className="font-display max-w-md text-2xl font-medium leading-tight text-ink sm:text-3xl">
            And the quiet work that compounds in the background.
          </h2>
          <p className="kicker text-accent-deep">Always running</p>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilityCards.map((card, i) => {
            const Icon = icons[card.icon] ?? Sparkles;
            return (
              <Reveal
                key={card.title}
                delay={i * 80}
                className="group flex flex-col rounded-2xl border border-line bg-paper-raised p-6 transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-soft"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-paper-raised text-accent-deep transition-colors duration-300 group-hover:bg-accent/10">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <h3 className="font-display mt-5 text-lg font-medium text-ink">
                  {card.title}
                </h3>
                <p className="mt-2.5 text-[0.9rem] leading-relaxed text-ink-soft">
                  {card.desc}
                </p>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
