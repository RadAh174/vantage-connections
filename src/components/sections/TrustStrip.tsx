import { Check } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import { trust } from "@/lib/content";

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-paper-sunken/50">
      <div className="container-page py-12 md:py-16">
        <Reveal className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
          <p className="max-w-md text-pretty text-[1.02rem] font-medium text-ink">
            {trust.line}
          </p>
          <ul className="flex flex-col gap-x-8 gap-y-3 sm:flex-row sm:flex-wrap sm:justify-center">
            {trust.points.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2 text-sm text-ink-soft"
              >
                <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-accent/15">
                  <Check className="h-3 w-3 text-accent-deep" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
