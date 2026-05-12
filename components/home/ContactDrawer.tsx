"use client";

import {
  useEffect,
  useState,
  type FormEvent,
  type RefObject,
} from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { ColorWord } from "@/components/ui/ColorWord";
import { Chip } from "@/components/ui/Chip";
import { sendLead } from "@/app/actions/contact";
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

// Project type + budget options mirror /contact so the two surfaces
// read as the same brand language.
const PROJECT_TYPES = ["SaaS", "Luxury", "Marketing", "Portfolio"] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

const BUDGETS = ["<$5k", "$5–15k", "$15k+", "Not sure"] as const;
type Budget = (typeof BUDGETS)[number];

type FormErrors = Partial<{
  name: string;
  email: string;
  message: string;
}>;

type Props = {
  zoneRef: RefObject<HTMLDivElement | null>;
};

// Fallback header reservation used before the live <header> has been
// measured. The actual reserve is read from the rendered header via
// ResizeObserver below so the drawer top lands flush with the header
// bottom regardless of header content height.
const HEADER_RESERVE_PX = 88;

// Two-phase scroll progression through the pin runway (0 → 1):
//   0  → SLIDE_END   — slide. Drawer rises from below the viewport
//                      to its full unsnapped resting position
//                      (openness 0 → 1, transform 100% → 0%).
//   SLIDE_END → 1.0  — snap. Snap-zone properties (width, height,
//                      top corner radius, bottom border width) are
//                      lerped continuously per scroll tick — no dead
//                      zone, no CSS transition, no scroll-pull. Every
//                      wheel tick produces visible progress through
//                      the snap. Snap completes exactly at max scroll.
const SLIDE_END = 0.78;

export function ContactDrawer({ zoneRef }: Props) {
  // --- Scroll-driven progress (0 → 1 across the pin runway) ----------
  // Raw runway progress is the source of truth — `openness` (slide-Y
  // transform) and `snapProgress` (snap-zone lerps) are both derived
  // from it.
  const [progress, setProgress] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  useEffect(() => {
    setIsReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    );
  }, []);

  // Mobile-aware width: at < md the 85vw drawer leaves only 7.5vw on
  // each side, which combined with the form's `px-6` padding squeezes
  // inputs into ~30vw of usable width on iPhone SE. On mobile we
  // expand to full viewport width and use a smaller corner radius
  // (large radii at 100vw show too much page bg through the corners).
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Live header height — drawer's height is `100dvh - headerHeight` so
  // the drawer top lands flush against the header's bottom edge. The
  // header is `position: sticky`, so its rendered height drives this.
  // ResizeObserver catches font load shifts and any conditional padding
  // the header applies on scroll. Falls back to HEADER_RESERVE_PX
  // before first measurement.
  const [headerHeight, setHeaderHeight] = useState(HEADER_RESERVE_PX);
  useEffect(() => {
    const header = document.querySelector("header");
    if (!header) return;
    const update = () => {
      const h = header.getBoundingClientRect().height;
      if (h > 0) setHeaderHeight(h);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(header);
    return () => ro.disconnect();
  }, []);

  // Viewport dimensions in pixels — needed so the snap-zone properties
  // can be lerped between pre-snap and snap pixel values per scroll
  // tick. `full` = viewport including scrollbar gutter (for 85vw math);
  // `content` = viewport excluding scrollbar gutter (the actual width
  // a fixed element with `width: 100%` fills, also where the gold side
  // borders should sit so they don't hide behind the scrollbar).
  const [viewportPx, setViewportPx] = useState({
    full: 0,
    content: 0,
    height: 0,
  });
  useEffect(() => {
    const update = () =>
      setViewportPx({
        full: window.innerWidth,
        content: document.documentElement.clientWidth,
        height: window.innerHeight,
      });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = zone.getBoundingClientRect();
      const zoneTop = rect.top + window.scrollY;
      const zoneHeight = zone.offsetHeight || 1;
      const viewport = window.innerHeight;

      // Pin-and-scrub progress through the runway (= zoneHeight -
      // viewport). 0 = pin begins (closing CTA just hit viewport
      // bottom), 1 = pin ends. The slide / dwell / snap phases are
      // derived from this value below.
      const runway = Math.max(1, zoneHeight - viewport);
      const rawT = (window.scrollY - zoneTop) / runway;
      const clamped = Math.max(0, Math.min(1, rawT));

      setProgress((prev) =>
        Math.abs(prev - clamped) < 0.001 ? prev : clamped,
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

  // openness drives the slide-Y transform: progresses 0 → 1 across
  // the slide phase (0 → SLIDE_END of runway), then holds at 1 through
  // dwell + snap. Reduced-motion path skips the gradient and jumps to
  // open at the end of the runway.
  const openness = isReducedMotion
    ? progress >= 1
      ? 1
      : 0
    : Math.min(1, progress / SLIDE_END);

  // --- Form state (mirrors /contact field set 1:1) -------------------
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [budget, setBudget] = useState<Budget | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSending(true);
    setSubmitError(null);

    const result = await sendLead({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim() || undefined,
      company: company.trim() || undefined,
      projectType: projectType || undefined,
      budget: budget || undefined,
      message: message.trim(),
      source: "home-drawer",
    });

    setSending(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  // --- Derived display values -----------------------------------------
  const isClosed = openness < 0.05;

  // Snap progression: 0 throughout slide, then 0 → 1 linearly across
  // the runway from SLIDE_END to 1.0. Drives lerped values for the
  // snap-zone properties (width, height, top radius, bottom border).
  // Mobile stays at 0 — the mobile drawer is always in its "pre-snap"
  // 100vw + rounded-top layout, no snap progression.
  const snapProgress = isMobile
    ? 0
    : Math.max(0, Math.min(1, (progress - SLIDE_END) / (1 - SLIDE_END)));

  // Hint at the top — fades in proportionally to the snap, fully
  // visible only when the drawer is essentially fully snapped.
  const hintVisible = snapProgress > 0.85;

  // Lerped snap-zone values (all in pixels so they interpolate cleanly
  // between pre-snap and snap targets that are defined in mixed units —
  // 85vw vs 100% of content area, dvh-derived heights, etc).
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  // Width: pre-snap = 85% of viewport-with-scrollbar (matches 85vw);
  // snap = viewport content area (matches the prior 100% behavior so
  // gold side borders sit at the visible viewport edges, not behind
  // the scrollbar).
  const preSnapWidthPx = viewportPx.full * 0.85;
  const snapWidthPx = viewportPx.content;
  const widthPx = lerp(preSnapWidthPx, snapWidthPx, snapProgress);

  // maxWidth cap interpolates from 1400px (pre-snap cap that prevented
  // the drawer from getting absurdly wide on ultrawide displays) to
  // viewport content width (no cap effectively, snap claims it all).
  const maxWidthPx = lerp(1400, viewportPx.content, snapProgress);

  // Height: pre-snap = viewport - header - 11dvh inset above drawer top;
  // snap = viewport - header (drawer top flush against header bottom).
  const preSnapHeightPx =
    viewportPx.height - headerHeight - viewportPx.height * 0.11;
  const snapHeightPx = viewportPx.height - headerHeight;
  const heightPx = lerp(preSnapHeightPx, snapHeightPx, snapProgress);

  // Top corner radius: pre-snap = 40px rounded; snap = sharp square.
  const topCornerRadiusPx = lerp(40, 0, snapProgress);

  // Bottom border width: pre-snap = 0 (borderless against viewport
  // edge); snap = 2px gold (drawer becomes its own framed surface).
  const borderBottomPx = lerp(0, 2, snapProgress);

  return (
    // Continuous two-phase drawer (no discrete snap state, no CSS
    // transitions for snap properties):
    //   1. Slide (progress 0 → SLIDE_END) — drawer rises from below
    //      the viewport to its resting unsnapped position. Driven by
    //      translateY transform per scroll tick.
    //   2. Snap (progress SLIDE_END → 1.0) — width, height, top
    //      corner radius, and bottom border are lerped from
    //      unsnapped values to snapped values per scroll tick.
    //      snapProgress = (progress - SLIDE_END) / (1 - SLIDE_END).
    //      Every wheel tick produces visual change — no dead zone.
    //      Snap completes exactly at max scroll.
    //
    // z-40 stays under the z-50 sticky header at all times — header
    // remains visible even when the drawer is snapped to its widest.
    // The drawer is height-reserved so it never tries to claim the
    // header's strip.
    //
    // Min-width clamps the rendered width so the snap maxWidth lerp
    // (1400 → viewport.content) can't push the drawer narrower than
    // its current width at small viewports.
    <div
      aria-hidden={isClosed ? true : undefined}
      inert={isClosed}
      className="fixed bottom-0 left-1/2 z-40 flex flex-col"
      style={{
        // Pixel widths/heights interpolated in JS — see the lerp
        // block above for the per-property pre-snap → snap targets.
        // Mobile bypasses the snap interpolation entirely; it stays
        // in a full-width rounded-top layout.
        height: isMobile
          ? `calc(100dvh - ${headerHeight}px)`
          : `${heightPx}px`,
        width: isMobile ? "100vw" : `${Math.min(widthPx, maxWidthPx)}px`,
        transform: `translate3d(-50%, ${(1 - openness) * 100}%, 0)`,
        // Gradient-border-with-radius trick. Both layers MUST be
        // <bg-image> (a bare color isn't valid in the shorthand) — so
        // the dark fill is wrapped as a same-color linear-gradient.
        // Flatter gradient stops: when the drawer stretches to full
        // width, a long 135° gradient pushes the dark endpoints far
        // past the visible edges, killing the top/side border
        // visibility. Holding gold across 18–82% keeps every edge
        // visibly gold at both pre-snap and snap widths.
        background:
          "linear-gradient(var(--color-bg), var(--color-bg)) padding-box, " +
          "linear-gradient(135deg, #C99022 0%, #E8B948 18%, #FFE49A 50%, #E8B948 82%, #C99022 100%) border-box",
        borderTop: "2px solid transparent",
        borderLeft: "2px solid transparent",
        borderRight: "2px solid transparent",
        // Bottom border fades in 0 → 2px across snap; pre-snap is
        // borderless against the viewport edge.
        borderBottom: isMobile
          ? "none"
          : borderBottomPx > 0.05
            ? `${borderBottomPx}px solid transparent`
            : "none",
        // Top corners interpolate 40 → 0 across snap; bottom corners
        // stay sharp throughout.
        borderRadius: isMobile
          ? "24px 24px 0 0"
          : `${topCornerRadiusPx}px ${topCornerRadiusPx}px 0 0`,
        overflow: "hidden",
        boxShadow: "0 -24px 60px -20px rgba(0,0,0,0.55)",
        pointerEvents: isClosed ? "none" : "auto",
        willChange: "transform",
        // No CSS transitions: all snap-zone properties are scroll-
        // driven via lerp and update per frame. Transitions would
        // double-animate or lag behind the scroll.
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

        {/* Two-column body — LEFT (7/12) is the info column with room
            for the editorial headline + lede + direct contact channels
            to breathe. RIGHT (5/12) is the form, intentionally
            narrower so the eye lands on the brand voice first and the
            form reads as a clean action panel rather than dominating
            the drawer. Stacks at narrow widths.
            ---
            The inner content wrapper is locked to the pre-snap drawer
            width (via maxWidth) and vertically centered, so when the
            outer drawer grows during snap, the content stays the same
            size and the extra room appears as breathing room around
            it. The snap is a stage; the form is a fixed panel. */}
        <div className="absolute inset-0 flex items-center justify-center overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div
            className="w-full grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 px-8 md:px-12 lg:px-16 py-12"
            style={{
              maxWidth: `${Math.min(preSnapWidthPx, 1400)}px`,
            }}
          >
            {/* RIGHT — form column (5/12, the narrower share). DOM
                order puts it first so the form is keyboard-first;
                grid col-start places it visually right at lg+.
                On narrow stacks the info column appears above the
                form (info renders below in DOM but lg:row-start-1
                overrides only at lg). */}
            <div className="lg:col-span-5 lg:col-start-8 lg:row-start-1">
              {submitted ? (
                <div className="rounded-xl border border-line bg-surface-calm px-8 py-12 flex flex-col gap-5 items-start">
                  <Eyebrow color="forest">SENT</Eyebrow>
                  <h3
                    className="font-display text-ink"
                    style={{
                      fontSize: "clamp(1.75rem, 3vw, 2.5rem)",
                      fontWeight: 600,
                      lineHeight: 1.05,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Thanks{name ? `, ${name.split(" ")[0]}` : ""}.
                  </h3>
                  <p className="text-ink text-[16px] leading-relaxed max-w-md">
                    We&apos;ll respond within 24 hours
                    {company.trim() ? (
                      <>
                        {" "}— and we&apos;ve already started imagining what{" "}
                        <span
                          className="color-word color-word--has-fallback italic"
                          style={{ backgroundImage: "var(--gold-grad)" }}
                        >
                          {company.trim()}
                        </span>{" "}
                        could look like.
                      </>
                    ) : (
                      "."
                    )}
                  </p>
                  <Button variant="ghost" onClick={() => setSubmitted(false)}>
                    Send another →
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={onSubmit}
                  noValidate
                  className="flex flex-col gap-5"
                >
                  {/* Name + Company side-by-side, then Email + Phone —
                      compresses the contact page's stacked /contact
                      fields into 2-column rows so the drawer's vertical
                      space isn't overrun. */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                    <DrawerField id="drawer-company" label="Company">
                      <input
                        id="drawer-company"
                        name="company"
                        type="text"
                        autoComplete="organization"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        className={inputClass(false)}
                      />
                    </DrawerField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                    <DrawerField id="drawer-phone" label="Phone">
                      <input
                        id="drawer-phone"
                        name="phone"
                        type="tel"
                        autoComplete="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={inputClass(false)}
                      />
                    </DrawerField>
                  </div>

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

                  <fieldset className="flex flex-col gap-3">
                    <legend className="block">
                      <Eyebrow color="forest">BUDGET</Eyebrow>
                    </legend>
                    <div className="flex flex-wrap gap-2.5">
                      {BUDGETS.map((b) => (
                        <Chip
                          key={b}
                          as="button"
                          active={budget === b}
                          onClick={() => setBudget(b)}
                        >
                          {b}
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
                      className={`${inputClass(!!errors.message)} resize-y min-h-[110px]`}
                    />
                  </DrawerField>

                  <div className="flex flex-col gap-3 pt-2">
                    <div className="flex items-center gap-4 flex-wrap">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        disabled={sending}
                      >
                        {sending ? "Sending…" : "Send message"}
                      </Button>
                      <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                        24h response · no spam
                      </span>
                    </div>
                    {submitError && (
                      <p
                        role="alert"
                        className="font-mono text-[12px] text-[#C04A2D]"
                      >
                        Couldn&apos;t send: {submitError} Please try again or
                        email{" "}
                        <a
                          href={`mailto:${site.email}`}
                          className="underline"
                        >
                          {site.email}
                        </a>{" "}
                        directly.
                      </p>
                    )}
                  </div>
                </form>
              )}
            </div>

            {/* LEFT — info column (7/12, the wider share) */}
            <div className="lg:col-span-7 lg:col-start-1 lg:row-start-1 flex flex-col gap-10">
              <div className="flex flex-col gap-6">
                <Eyebrow color="forest">CONTACT · 24H REPLY</Eyebrow>
                <h2
                  className="font-display text-headline"
                  style={{
                    fontSize: "clamp(2.5rem, 4.4vw, 4.25rem)",
                    fontWeight: 500,
                    lineHeight: 1.04,
                    letterSpacing: "-0.022em",
                  }}
                >
                  Let&apos;s <ColorWord>talk</ColorWord>.
                  <br />
                  About the project.
                </h2>
                <p className="text-ink-muted text-[17px] leading-[1.55] max-w-[44ch]">
                  Tell us about the project. We respond to every honest
                  enquiry within 24 hours. No sales pressure, no
                  overpromise.
                </p>
              </div>

              {/* Direct contact channels — for people who'd rather
                  email/call than fill the form. Hairline divider sets
                  the info block apart from the headline. */}
              <div className="flex flex-col gap-3.5 pt-6 border-t border-line/40">
                {site.email && (
                  <a
                    href={`mailto:${site.email}`}
                    className="group inline-flex items-baseline gap-4 text-ink text-[17px] hover:text-forest transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted w-12">
                      Email
                    </span>
                    <span className="border-b border-line group-hover:border-forest transition-colors pb-px">
                      {site.email}
                    </span>
                  </a>
                )}
                <a
                  href="tel:+19499669075"
                  className="group inline-flex items-baseline gap-4 text-ink text-[17px] hover:text-forest transition-colors"
                >
                  <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted w-12">
                    Phone
                  </span>
                  <span className="border-b border-line group-hover:border-forest transition-colors pb-px">
                    +1.949.966.9075
                  </span>
                </a>
                {site.schedulingUrl && (
                  <a
                    href={site.schedulingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-baseline gap-4 text-ink text-[17px] hover:text-forest transition-colors"
                  >
                    <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-muted w-12">
                      Call
                    </span>
                    <span className="border-b border-line group-hover:border-forest transition-colors pb-px">
                      Schedule a 30-min intro →
                    </span>
                  </a>
                )}
              </div>

              <div className="flex flex-col gap-1.5 pt-2">
                <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-muted">
                  {site.availability.bookingNote}
                </p>
                {site.city && (
                  <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-muted/70">
                    Based in {site.city}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function inputClass(invalid: boolean) {
  // Matches /contact: subtle calm-surface fill + rounded-xl top + bottom
  // underline. Error state swaps the underline to terracotta. Keeps the
  // two contact surfaces visually consistent.
  return [
    "w-full",
    "bg-surface-calm/50",
    "border-0 border-b-[1.5px]",
    invalid ? "border-[#C04A2D]" : "border-line",
    "rounded-xl",
    "px-3.5 py-2.5",
    "text-ink text-[16px]",
    "placeholder:text-ink-muted",
    "focus:outline-none focus:border-forest focus:bg-surface-calm/80",
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
