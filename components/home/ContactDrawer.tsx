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
      // zoneTop in document coords:
      const zoneTop = rect.top + window.scrollY;
      const zoneHeight = zone.offsetHeight || 1;
      const viewport = window.innerHeight;

      // Scroll progress through the zone, measured from "zone first
      // enters the viewport bottom" (rawT = 0) to "max scroll, zone
      // bottom at viewport bottom" (rawT = 1). This matches the
      // *available* scroll distance through the zone — using just
      // (scrollY - zoneTop) / zoneHeight caps out around `1 -
      // viewport/zoneHeight` ≈ 0.17 because you can only scroll INTO
      // the zone by `zoneHeight - viewport`.
      const rawT = (window.scrollY - zoneTop + viewport) / zoneHeight;
      const clamped = Math.max(0, Math.min(1, rawT));

      let next: number;
      if (reduced) {
        // Binary: closed until zone end, then snap open.
        next = clamped >= 1 ? 1 : 0;
      } else {
        // Scrub 0–0.85 → 0–1; hold 0.85–1 at 1 (the snap dwell region).
        const SNAP = 0.85;
        next = clamped < SNAP ? clamped / SNAP : 1;
      }
      setOpenness((prev) => (Math.abs(prev - next) < 0.001 ? prev : next));
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
    // Slide-up drawer. The outer wrapper is ALWAYS 100vh tall and
    // position-fixed to cover the full viewport. We translate it down by
    // `(1 - openness) * 100%` so at openness 0 it sits entirely below
    // the viewport, and at openness 1 it covers the screen. Sliding the
    // whole sheet keeps the form fixed inside it (no fade-in / no
    // crop-from-top).
    //
    // z-[60] sits ABOVE the sticky header (z-50) so the drawer covers
    // it when fully open — that's the "snaps full to the top and
    // sides" behavior the user asked for.
    <div
      aria-hidden={isClosed ? true : undefined}
      inert={isClosed}
      className="fixed inset-x-0 bottom-0 h-[100vh] z-[60] flex flex-col"
      style={{
        transform: `translate3d(0, ${(1 - openness) * 100}%, 0)`,
        pointerEvents: isClosed ? "none" : "auto",
        willChange: "transform",
      }}
    >
      {/* Gold gradient top border — signature treatment, matches the
          carousel cards' outer ring. Lives as the first flex child so
          it never gets covered by the body that follows. Bumped to 2px
          for visibility. */}
      <div
        aria-hidden="true"
        className="h-[2px] shrink-0"
        style={{
          backgroundImage:
            "linear-gradient(90deg, #8B6914 0%, #D4A12A 30%, #FFE49A 50%, #D4A12A 70%, #8B6914 100%)",
        }}
      />

      {/* Drawer body — solid bg-bg covers everything behind. */}
      <div className="relative flex-1 bg-bg overflow-hidden">
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

        {/* Centred form column — always at full opacity since the drawer
            slides as a unit. */}
        <div
          className="absolute inset-0 flex items-center justify-center px-6 md:px-10"
        >
          <div className="w-full max-w-[560px] flex flex-col gap-7 py-12">
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
