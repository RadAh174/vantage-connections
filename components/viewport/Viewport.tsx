"use client";

import { useEffect, useRef, type ReactNode } from "react";

export type ViewportState =
  | "wireframe"
  | "typography"
  | "color"
  | "polished";

type Props = {
  state?: ViewportState;
  /** Optional content for polished state. */
  content?: ReactNode;
  /** Optional content for wireframe state (e.g. live-typed company name). */
  wireframeContent?: ReactNode;
  /** URL bar text. Default empty. */
  url?: string;
  /** Enable mouse-aware tilt within ±4°. Default true. */
  tilt?: boolean;
  /** Base tilt before mouse interaction. Default -2deg. */
  baseTilt?: number;
  className?: string;
};

const STATES: ViewportState[] = ["wireframe", "typography", "color", "polished"];

/**
 * The signature device. Browser chrome with 3 dots, faint URL bar.
 * Default -2deg tilt, mouse-aware tilt within ±4° on hover.
 * Cross-fades between build states.
 */
export function Viewport({
  state = "polished",
  content,
  wireframeContent,
  url = "",
  tilt = true,
  baseTilt = -2,
  className = "",
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef({ x: baseTilt, y: 0 });
  const currentRef = useRef({ x: baseTilt, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (!tilt) return;
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    function loop() {
      // Spring/damp toward target
      const cur = currentRef.current;
      const tgt = targetRef.current;
      cur.x += (tgt.x - cur.x) * 0.08;
      cur.y += (tgt.y - cur.y) * 0.08;
      if (inner) {
        inner.style.transform = `perspective(1200px) rotateX(${cur.y.toFixed(2)}deg) rotateY(${cur.x.toFixed(2)}deg)`;
      }
      rafRef.current = requestAnimationFrame(loop);
    }
    rafRef.current = requestAnimationFrame(loop);

    function onMove(e: MouseEvent) {
      if (!wrap) return;
      const r = wrap.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = (e.clientX - cx) / (r.width / 2);
      const dy = (e.clientY - cy) / (r.height / 2);
      // Clamp to ±1 → map to ±4° around baseTilt
      const clampedX = Math.max(-1, Math.min(1, dx));
      const clampedY = Math.max(-1, Math.min(1, dy));
      targetRef.current.x = baseTilt + clampedX * 4;
      targetRef.current.y = -clampedY * 3;
    }

    function onLeave() {
      targetRef.current.x = baseTilt;
      targetRef.current.y = 0;
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [tilt, baseTilt]);

  return (
    <div
      ref={wrapRef}
      className={`relative w-full ${className}`}
      style={{ perspective: 1200 }}
    >
      <div
        ref={innerRef}
        className="relative w-full overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_60px_-30px_rgba(26,26,26,0.25),_0_2px_8px_rgba(26,26,26,0.06)] transition-shadow"
        style={{
          transform: `perspective(1200px) rotateY(${baseTilt}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Browser chrome — neutral traffic-light dots (palette has only 2 colors,
            and the chrome shouldn't fight for attention with real accent moments). */}
        <div className="flex items-center gap-2 border-b border-line bg-surface-calm px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <span className="block h-2.5 w-2.5 rounded-full bg-line" />
            <span className="block h-2.5 w-2.5 rounded-full bg-line" />
            <span className="block h-2.5 w-2.5 rounded-full bg-line" />
          </div>
          <div className="ml-3 flex-1 truncate rounded-md bg-bg px-3 py-1 font-mono text-[10.5px] text-ink-muted">
            {url || ""}
          </div>
        </div>

        {/* Content area: states stack and cross-fade */}
        <div className="relative aspect-[4/3] w-full">
          {STATES.map((s) => (
            <div
              key={s}
              className="absolute inset-0 transition-opacity duration-[600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
              style={{ opacity: state === s ? 1 : 0, pointerEvents: state === s ? "auto" : "none" }}
              aria-hidden={state !== s}
            >
              {s === "wireframe" && <WireframeState content={wireframeContent} />}
              {s === "typography" && <TypographyState />}
              {s === "color" && <ColorState />}
              {s === "polished" && <PolishedState content={content} />}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function WireframeState({ content }: { content?: ReactNode }) {
  if (content) {
    return <div className="h-full">{content}</div>;
  }
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="h-3 w-1/3 rounded bg-line" />
      <div className="h-8 w-2/3 rounded bg-line/90" />
      <div className="h-3 w-1/2 rounded bg-line" />
      <div className="mt-2 grid flex-1 grid-cols-3 gap-3">
        <div className="rounded bg-line/80" />
        <div className="rounded bg-line/60" />
        <div className="rounded bg-line/80" />
      </div>
      <div className="flex gap-2">
        <div className="h-6 w-20 rounded bg-line/80" />
        <div className="h-6 w-16 rounded bg-line/60" />
      </div>
    </div>
  );
}

function TypographyState() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
        Eyebrow label
      </div>
      <div className="font-display text-2xl leading-tight text-ink" style={{ fontWeight: 600 }}>
        Websites that put your business in view.
      </div>
      <p className="text-[13px] text-ink-muted leading-relaxed">
        Lede paragraph in Inter. Calm rhythm, generous tracking, just type
        carrying the page before color or imagery enters.
      </p>
      <div className="mt-auto flex gap-3">
        <span className="text-[12px] underline underline-offset-4">Primary action</span>
        <span className="text-[12px] text-ink-muted">Secondary →</span>
      </div>
    </div>
  );
}

function ColorState() {
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest">
        Eyebrow label
      </div>
      <div className="font-display text-2xl leading-tight text-ink" style={{ fontWeight: 600 }}>
        Websites that put your business{" "}
        <span
          className="color-word color-word--has-fallback italic"
          style={{ backgroundImage: "var(--gold-grad)" }}
        >
          in view
        </span>
        .
      </div>
      <div className="grid flex-1 grid-cols-3 gap-3">
        <div
          className="col-span-2 rounded"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(26,77,51,0.18), rgba(224,180,66,0.18))",
          }}
        />
        <div className="rounded bg-line/40" />
      </div>
      <div className="flex gap-2">
        <span
          className="rounded px-3 py-1 text-[11px] text-[#0E0E10]"
          style={{ backgroundImage: "var(--gold-grad)" }}
        >
          Primary
        </span>
        <span className="rounded border border-forest px-3 py-1 text-[11px] text-forest">
          Secondary
        </span>
      </div>
    </div>
  );
}

function PolishedState({ content }: { content?: ReactNode }) {
  if (content) {
    return <div className="h-full">{content}</div>;
  }
  return (
    <div className="flex h-full flex-col gap-3 p-5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-forest">
          Your sector · Your city
        </span>
        <span className="font-mono text-[10px] text-ink-muted">live</span>
      </div>
      <div
        className="font-display text-2xl leading-[1.1] text-ink"
        style={{ fontWeight: 600 }}
      >
        Calm websites that put{" "}
        <span
          className="color-word color-word--has-fallback italic"
          style={{ backgroundImage: "var(--gold-grad)" }}
        >
          your business
        </span>{" "}
        in view.
      </div>
      <p className="text-[13px] text-ink-muted leading-relaxed max-w-[36ch]">
        A real-feeling marketing hero — typography, color, image, and a
        clear next step. Same components used elsewhere on the site.
      </p>
      <div className="grid flex-1 grid-cols-3 gap-3">
        <div
          className="col-span-2 rounded"
          style={{
            backgroundImage:
              "linear-gradient(135deg, rgba(26,77,51,0.22), rgba(224,180,66,0.28))",
          }}
        />
        <div className="flex flex-col gap-2">
          <div className="flex-1 rounded bg-surface-calm border border-line" />
          <div className="flex-1 rounded bg-surface-calm border border-line" />
        </div>
      </div>
      <div className="flex gap-2">
        <span
          className="rounded px-3 py-1.5 text-[11px] text-[#0E0E10]"
          style={{ backgroundImage: "var(--gold-grad)" }}
        >
          See work
        </span>
        <span className="rounded border border-forest px-3 py-1.5 text-[11px] text-forest">
          Read process
        </span>
      </div>
    </div>
  );
}

export default Viewport;
