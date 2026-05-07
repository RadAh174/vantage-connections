"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import Link from "next/link";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Chip } from "@/components/ui/Chip";
import { site } from "@/lib/content/site";

/**
 * Scroll-driven contact drawer.
 *
 * Behaviour:
 *   1. The home page renders a 120vh `<div ref={zoneRef} />` after the
 *      closing-CTA section. That div is this drawer's "zone" — its top
 *      and height drive how open the drawer is.
 *   2. We listen to `scroll` + `resize` (passive, RAF-throttled) and
 *      compute:
 *        rawT    = (scrollY - zoneTop) / zoneHeight     // 0 → ~1.0+
 *        clamped = clamp(rawT, 0, 1)
 *        openness = clamped < 0.85 ? clamped / 0.85 : 1
 *      The 0–0.85 sub-range scrubs height 0 → 100vh; the last 15% holds
 *      at full height (the "snap" / dwell region) so the form feels
 *      settled before the user keeps scrolling.
 *   3. Lenis writes its lerped scroll target into window.scrollY each
 *      frame, so a plain `scroll` listener already gets the smoothed
 *      value — no need to import Lenis directly.
 *
 * Reduced-motion path: openness flips binary (0 until scrollY ≥
 * zoneEnd, then 1). No gradual scrub.
 *
 * Accessibility:
 *   - When openness < 0.05 the drawer's content gets `aria-hidden` and
 *     the React-19 `inert` attribute, so keyboard tab nav skips it and
 *     screen-readers ignore it.
 *   - It's not a dialog — there's no focus trap. The drawer is reached
 *     by scroll, dismissed by scroll, no focus management beyond the
 *     normal page flow.
 */

const PROJECT_TYPES = [
  "Marketing site",
  "E-commerce",
  "SaaS",
  "Other",
] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

type FormErrors = Partial<{
  name: string;
  email: string;
  message: string;
}>;

type Props = {
  zoneRef: RefObject<HTMLDivElement | null>;
};

// Header reservation — drawer top sits just below the header so it
// snaps "up to the header, not over it." Tune this if the header
// height changes.
const HEADER_RESERVE_PX = 88;

// Two-phase animation:
//   0 → SLIDE_END  — slide-up (drawer rises from below the viewport)
//   SLIDE_END → 1.0 — dwell (drawer holds at rest; further scroll is
//                    absorbed without visual change)
// The slide completing IS the "snap" — no separate width-expansion
// phase, no easing tail.
const SLIDE_END = 0.35;

export function ContactDrawer({ zoneRef }: Props) {
  // --- Scroll-driven openness (0 → 1) -------------------------------
  const [openness, setOpenness] = useState(0);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = zone.getBoundingClientRect();
      const zoneTop = rect.top + window.scrollY;
      const zoneHeight = zone.offsetHeight || 1;
      const viewport = window.innerHeight;

      // Pin-and-scrub progress through the runway (= zoneHeight -
      // viewport). 0 = pin begins (closing CTA just hit viewport
      // bottom), 1 = pin ends.
      const runway = Math.max(1, zoneHeight - viewport);
      const rawT = (window.scrollY - zoneTop) / runway;
      const clamped = Math.max(0, Math.min(1, rawT));

      let nextOpen: number;
      if (reduced) {
        nextOpen = clamped >= 1 ? 1 : 0;
      } else if (clamped < SLIDE_END) {
        nextOpen = clamped / SLIDE_END;
      } else {
        nextOpen = 1;
      }
      setOpenness((prev) =>
        Math.abs(prev - nextOpen) < 0.001 ? prev : nextOpen,
      );
    };

    const onScroll = () => {
      if (raf === 0) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf !== 0) cancelAnimationFrame(raf);
    };
  }, [zoneRef]);

  // --- Form state (mirrors /contact field set, simpler shape) ---------
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validate(): FormErrors {
    const errs: FormErrors = {};
    if (!name.trim()) errs.name = "Please tell us your name.";
    if (!email.trim()) {
      errs.email = "We need an email to respond.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "That doesn't look like a valid email.";
    }
    if (!message.trim()) errs.message = "Tell us a little about the project.";
    return errs;
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const payload = {
      name: name.trim(),
      email: email.trim(),
      projectType,
      message: message.trim(),
    };
    // TODO_CONTACT_SUBMIT: same stub as /contact — wire to real server
    // action when task #17 lands.
    // eslint-disable-next-line no-console
    console.log("[contact-drawer] payload (mock submit):", payload);
    setSubmitted(true);
  }

  // --- Derived display values -----------------------------------------
  const isClosed = openness < 0.05;
  // Hint at the very top of the drawer — only visible when essentially
  // fully open (the snap-dwell region).
  const hintVisible = openness >= 0.9;

  return (
    // Two-phase drawer:
    //   1. Slide phase (openness 0 → 1) — drawer rises from below the
    //      viewport to its resting position just under the header.
    //   2. Snap phase (snapness 0 → 1) — drawer holds open while width
    //      expands from 85vw to 100vw. The snap is the magnetic
    //      "settle" moment.
    //
    // The drawer never covers the header: height = 100vh -
    // HEADER_RESERVE_PX, anchored to bottom-0, so its top edge lands
    // just below the header at full openness.
    //
    // Gold gradient border all-around via the standard
    // gradient-border-with-radius trick: bg has two layers — gradient
    // on border-box, dark fill on padding-box — combined with a
    // transparent solid border. Border-radius applies to all four
    // corners.
    //
    // z-40 keeps the drawer below the sticky header (z-50) so the
    // header always paints on top, even if the drawer's geometry
    // overlaps via shadow.
    <div
      aria-hidden={isClosed ? true : undefined}
      inert={isClosed}
      className="fixed bottom-0 left-1/2 z-40 flex flex-col"
      style={{
        height: `calc(100vh - ${HEADER_RESERVE_PX}px)`,
        width: "85vw",
        maxWidth: "1400px",
        transform: `translate3d(-50%, ${(1 - openness) * 100}%, 0)`,
        // Gradient-border-with-radius trick. Both layers MUST be
        // <bg-image> (a bare color isn't valid in the shorthand) — so
        // the dark fill is wrapped as a same-color linear-gradient.
        // Order: padding-box layer first = top, covers interior; the
        // border-box gradient underneath shows only in the 2px border
        // ring.
        background:
          "linear-gradient(var(--color-bg), var(--color-bg)) padding-box, " +
          "linear-gradient(135deg, #8B6914 0%, #D4A12A 25%, #FFE49A 50%, #FADC85 60%, #D4A12A 80%, #8B6914 100%) border-box",
        border: "2px solid transparent",
        // Only round the top corners — the drawer is anchored at
        // viewport bottom, so rounded bottom corners would clip into
        // the viewport edge and look like cut-off curves.
        borderRadius: "40px 40px 0 0",
        overflow: "hidden",
        boxShadow: "0 -24px 60px -20px rgba(0,0,0,0.55)",
        pointerEvents: isClosed ? "none" : "auto",
        willChange: "transform",
      }}
    >
      {/* Drawer body — fills the space inside the gradient border. */}
      <div className="relative flex-1">
        {/* Top hint — "scroll up to dismiss". Pinned to drawer top, fades
            in only when the drawer is essentially fully open. */}
        <div
          className="absolute left-0 right-0 top-0 flex justify-center pt-5 transition-opacity duration-300 pointer-events-none"
          style={{ opacity: hintVisible ? 1 : 0 }}
          aria-hidden="true"
        >
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-muted">
            ↑ scroll up to dismiss
          </span>
        </div>

        {/* Form column — top-aligned with generous top padding so the
            heading breathes from the drawer's top edge. */}
        <div
          className="absolute inset-0 flex items-start justify-center px-6 md:px-10 pt-24 pb-12"
        >
          <div className="w-full max-w-[560px] flex flex-col gap-7">
            <div className="flex flex-col gap-4">
              <Eyebrow color="forest">CONTACT · 24H REPLY</Eyebrow>
              <h2
                className="font-display text-headline"
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 500,
                  lineHeight: 1.1,
                  letterSpacing: "-0.018em",
                }}
              >
                Let&apos;s <ColorWord>talk</ColorWord>.
              </h2>
            </div>

            {submitted ? (
              <div className="rounded-xl border border-line bg-surface-calm px-7 py-9 flex flex-col gap-4 items-start">
                <Eyebrow color="forest">SENT</Eyebrow>
                <p className="text-ink text-[17px] leading-relaxed">
                  Got it{name ? `, ${name.split(" ")[0]}` : ""} — we&apos;ll
                  respond within 24 hours.
                </p>
                <Button
                  variant="ghost"
                  onClick={() => setSubmitted(false)}
                >
                  Send another →
                </Button>
              </div>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-6"
              >
                <DrawerField
                  id="drawer-name"
                  label="Name"
                  required
                  error={errors.name}
                >
                  <input
                    id="drawer-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass(!!errors.name)}
                  />
                </DrawerField>

                <DrawerField
                  id="drawer-email"
                  label="Email"
                  required
                  error={errors.email}
                >
                  <input
                    id="drawer-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass(!!errors.email)}
                  />
                </DrawerField>

                <fieldset className="flex flex-col gap-3">
                  <legend className="block">
                    <Eyebrow color="forest">PROJECT TYPE</Eyebrow>
                  </legend>
                  <div className="flex flex-wrap gap-2.5">
                    {PROJECT_TYPES.map((t) => (
                      <Chip
                        key={t}
                        as="button"
                        active={projectType === t}
                        onClick={() => setProjectType(t)}
                      >
                        {t}
                      </Chip>
                    ))}
                  </div>
                </fieldset>

                <DrawerField
                  id="drawer-message"
                  label="Message"
                  required
                  error={errors.message}
                >
                  <textarea
                    id="drawer-message"
                    name="message"
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClass(!!errors.message)} resize-y min-h-[96px]`}
                  />
                </DrawerField>

                <div className="flex flex-col gap-3 pt-2">
                  <Button type="submit" variant="primary" size="lg">
                    Send →
                  </Button>
                  {site.email ? (
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                      or email us at{" "}
                      <a
                        href={`mailto:${site.email}`}
                        className="text-ink hover:text-forest transition-colors border-b border-current pb-px"
                      >
                        {site.email}
                      </a>
                    </span>
                  ) : (
                    <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                      or use the{" "}
                      <Link
                        href="/contact"
                        className="text-ink hover:text-forest transition-colors border-b border-current pb-px"
                      >
                        contact page →
                      </Link>
                    </span>
                  )}
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(invalid: boolean) {
  // Mirrors /contact: bottom-border-only, transparent bg, forest focus.
  return [
    "w-full bg-transparent",
    "border-0 border-b",
    invalid ? "border-[#C04A2D]" : "border-line",
    "px-0 py-2.5",
    "text-ink text-[16px]",
    "placeholder:text-ink-muted",
    "focus:outline-none focus:border-forest",
    "transition-colors",
  ].join(" ");
}

function DrawerField({
  id,
  label,
  children,
  required = false,
  error,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="block">
        <Eyebrow color={error ? "coral" : "forest"}>
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </Eyebrow>
      </label>
      {children}
      {error && (
        <span
          role="alert"
          className="font-mono text-[11.5px] text-[#C04A2D] mt-0.5"
        >
          {error}
        </span>
      )}
    </div>
  );
}

export default ContactDrawer;
