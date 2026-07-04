import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { problem } from "@/lib/content";

export function Problem() {
  return (
    <section className="relative py-24 md:py-32">
      <div className="container-page">
        <SectionHeading
          kicker={problem.kicker}
          title={problem.title}
          body={problem.body}
        />

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {problem.symptoms.map((s, i) => (
            <Reveal
              key={s.title}
              delay={i * 90}
              className="group relative bg-paper-raised p-7 transition-colors duration-300 hover:bg-paper-edge"
            >
              {/* index */}
              <span className="font-mono text-[0.7rem] tracking-widest text-ink-muted">
                0{i + 1}
              </span>
              <h3 className="font-display mt-4 text-xl font-medium text-ink">
                {s.title}
              </h3>
              <p className="mt-2.5 text-[0.92rem] leading-relaxed text-ink-soft">
                {s.desc}
              </p>
              {/* declining bar motif */}
              <div
                aria-hidden="true"
                className="mt-6 h-px w-full origin-left bg-gradient-to-r from-accent/60 to-transparent"
                style={{ transform: `scaleX(${1 - i * 0.22})` }}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
