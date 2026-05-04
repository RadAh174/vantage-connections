"use client";

import { useState, type FormEvent } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { ColorWord } from "@/components/ui/ColorWord";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { LiveMockupViewport } from "@/components/contact/LiveMockupViewport";
import type { ProjectType as MockupProjectType } from "@/components/contact/mockups/types";

import { site } from "@/lib/content/site";

const PROJECT_TYPES = [
  "Marketing site",
  "E-commerce",
  "SaaS",
  "Other",
] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

/**
 * Map form-chip label → mockup style key. "Other" maps to the gallery
 * mockup since it's the most flexible/portfolio-like layout.
 */
const PROJECT_TYPE_TO_MOCKUP: Record<ProjectType, MockupProjectType> = {
  "Marketing site": "marketing",
  "E-commerce": "ecommerce",
  SaaS: "saas",
  Other: "brand",
};

const BUDGETS = ["<$5k", "$5–15k", "$15k+", "Not sure"] as const;
type Budget = (typeof BUDGETS)[number];

type FormErrors = Partial<{
  name: string;
  email: string;
  message: string;
}>;

export default function ContactPage() {
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [budget, setBudget] = useState<Budget | "">("");
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
      company: company.trim(),
      email: email.trim(),
      projectType,
      budget,
      message: message.trim(),
    };

    // TODO_CONTACT_SUBMIT: wire this to the real server action / Resend
    // endpoint in task #17. For now, log + show success state.
    // eslint-disable-next-line no-console
    console.log("[contact] payload (mock submit):", payload);

    setSubmitted(true);
  }

  return (
    <>
      <ScrollProgress />
      <Header />

      <main className="mx-auto max-w-[1320px] px-6 md:px-10">
        {/* ---------------- Hero ----------------
            Inner-page hero pattern (mirrors /work, /pricing, /blog):
            ~52dvh, no HeroFader, eyebrow + per-word `hero-word` cascade
            headline + lede. Italic gold ColorWord accent on "talk" — the
            verb that defines the page.
            DO NOT modify the form or LiveMockupViewport below — both are
            already polished. */}
        {(() => {
          // Word delay sequence (240ms step, mirrors home + /work):
          //   0:  Let's
          //   1:  talk. (accent)
          //   2:  About
          //   3:  the
          //   4:  project.
          const STEP_MS = 240;
          const LINE_2 = ["About", "the", "project."];
          const totalWords = 2 + LINE_2.length;
          const ledeDelayMs = (totalWords + 1) * STEP_MS;
          return (
            <section className="relative min-h-[52dvh] flex flex-col gap-7 pt-20 md:pt-28 pb-16 max-w-4xl">
              <Reveal>
                <Eyebrow color="forest">CONTACT · 24H REPLY</Eyebrow>
              </Reveal>

              <h1
                className="font-display text-headline"
                style={{
                  fontSize: "clamp(2.75rem, 5.5vw, 4.75rem)",
                  fontWeight: 500,
                  lineHeight: 1.15,
                  letterSpacing: "-0.018em",
                }}
              >
                {/* Line 1: "Let's talk." — italic gold accent on "talk" */}
                <span className="block">
                  <span
                    className="hero-word"
                    style={{ animationDelay: `0ms` }}
                  >
                    Let&apos;s{" "}
                  </span>
                  <span
                    className="hero-word"
                    style={{ animationDelay: `${STEP_MS}ms` }}
                  >
                    <ColorWord>talk</ColorWord>.
                  </span>
                </span>
                {/* Line 2: "About the project." */}
                <span className="block">
                  {LINE_2.map((word, i) => (
                    <span
                      key={`l2-${i}`}
                      className="hero-word"
                      style={{
                        animationDelay: `${(2 + i) * STEP_MS}ms`,
                      }}
                    >
                      {word}{" "}
                    </span>
                  ))}
                </span>
              </h1>

              <Reveal delay={ledeDelayMs}>
                <p className="max-w-[540px] text-[18px] leading-[1.55] text-ink-muted">
                  Tell us about the project. We respond to every honest
                  enquiry within 24 hours. No sales pressure, no overpromise.
                </p>
              </Reveal>
            </section>
          );
        })()}

        <AuroraHairline />

        {/* ---------------- Form + Live mockup ---------------- */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 pt-16 pb-24">
          {/* Form */}
          <div className="lg:col-span-7">
            {submitted ? (
              <Reveal>
                <div className="rounded-xl border border-line bg-surface-calm px-8 py-12 flex flex-col gap-5 items-start">
                  <Eyebrow color="forest">SENT</Eyebrow>
                  <h2
                    className="font-display text-ink"
                    style={{
                      fontSize: "clamp(2rem, 4vw, 3rem)",
                      fontWeight: 600,
                      lineHeight: 1.05,
                      letterSpacing: "-0.015em",
                    }}
                  >
                    Thanks{name ? `, ${name.split(" ")[0]}` : ""}.
                  </h2>
                  <p className="text-ink text-[17px] leading-relaxed max-w-md">
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
                        could look like (see the mockup).
                      </>
                    ) : (
                      "."
                    )}
                  </p>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setSubmitted(false);
                    }}
                  >
                    Send another →
                  </Button>
                </div>
              </Reveal>
            ) : (
              <form
                onSubmit={onSubmit}
                noValidate
                className="flex flex-col gap-7"
              >
                <Field
                  id="name"
                  label="Name"
                  required
                  error={errors.name}
                >
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={inputClass(!!errors.name)}
                  />
                </Field>

                <Field id="company" label="Company">
                  <input
                    id="company"
                    name="company"
                    type="text"
                    autoComplete="organization"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className={inputClass(false)}
                  />
                </Field>

                <Field
                  id="email"
                  label="Email"
                  required
                  error={errors.email}
                >
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass(!!errors.email)}
                  />
                </Field>

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

                <Field
                  id="message"
                  label="Message"
                  required
                  error={errors.message}
                >
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`${inputClass(!!errors.message)} resize-y min-h-[120px]`}
                  />
                </Field>

                <div className="flex items-center gap-4 pt-2">
                  <Button type="submit" variant="primary" size="lg">
                    Send message
                  </Button>
                  <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                    24h response · no sales spam
                  </span>
                </div>
              </form>
            )}
          </div>

          {/* Live mockup */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 self-start">
            <Reveal>
              <LiveMockupViewport
                companyName={company}
                projectType={
                  projectType ? PROJECT_TYPE_TO_MOCKUP[projectType] : "marketing"
                }
                submitted={submitted}
              />
            </Reveal>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
              ↑ live mockup — types your company name as you fill the form
            </p>
          </div>
        </section>

        {/* ---------------- Alt contact ---------------- */}
        <section className="py-16">
          <AuroraHairline />
          <Reveal className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-2">
              <Eyebrow color="forest">EMAIL</Eyebrow>
              {site.email ? (
                <a
                  href={`mailto:${site.email}`}
                  className="text-ink text-[17px] hover:text-forest transition-colors border-b border-current pb-0.5 self-start"
                >
                  {site.email}
                </a>
              ) : (
                <span className="font-mono text-[13px] text-ink-muted">
                  {/* TODO: set site.email in lib/content/site.ts */}
                  email: TODO
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Eyebrow color="forest">SCHEDULE</Eyebrow>
              {site.schedulingUrl ? (
                <a
                  href={site.schedulingUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-forest text-[17px] hover:text-ink transition-colors border-b border-current pb-0.5 self-start"
                >
                  Book a 30-min intro →
                </a>
              ) : (
                <span className="font-mono text-[13px] text-ink-muted">
                  {/* TODO: set site.schedulingUrl in lib/content/site.ts */}
                  scheduling link: TODO
                </span>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <Eyebrow color="forest">AVAILABILITY</Eyebrow>
              <span className="font-mono text-[13px] text-ink">
                {site.availability.bookingNote}
              </span>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </>
  );
}

function inputClass(invalid: boolean) {
  // Error border uses a hardcoded terracotta — coral is no longer a theme
  // token and we don't want errors reading as a positive forest signal.
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

function Field({
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
