import { Reveal } from "./Reveal";

type Props = {
  kicker: string;
  title: string;
  body?: string;
  align?: "left" | "center";
  tone?: "ink" | "paper";
  className?: string;
};

export function SectionHeading({
  kicker,
  title,
  body,
  align = "center",
  tone = "ink",
  className = "",
}: Props) {
  const isCenter = align === "center";
  return (
    <div
      className={`${isCenter ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <Reveal>
        <span
          className={`kicker ${tone === "paper" ? "text-accent-soft" : "text-accent-deep"}`}
        >
          {kicker}
        </span>
      </Reveal>
      <Reveal delay={80}>
        <h2
          className={`font-display mt-4 text-balance text-3xl font-medium leading-[1.08] tracking-[-0.018em] sm:text-4xl md:text-[2.85rem] ${
            tone === "paper" ? "text-paper" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {body && (
        <Reveal delay={150}>
          <p
            className={`mt-5 text-pretty text-[1.05rem] leading-relaxed ${
              isCenter ? "mx-auto" : ""
            } ${tone === "paper" ? "text-paper/70" : "text-ink-soft"}`}
          >
            {body}
          </p>
        </Reveal>
      )}
    </div>
  );
}
