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
import { FaqItem } from "@/components/ui/FaqItem";
import { FAQSchema } from "@/components/seo/StructuredData";
import { LiveMockupViewport } from "@/components/contact/LiveMockupViewport";
import type { ProjectType as MockupProjectType } from "@/components/contact/mockups/types";

import { sendLead } from "@/app/actions/contact";
import { site } from "@/lib/content/site";

/**
 * Answerable content for /contact — feeds the FAQPage schema below and
 * also renders visibly so AI/search surfaces (Google AI Overviews,
 * ChatGPT, Perplexity) have direct-answer text to extract. Without this
 * block the contact page is just a form, which is hard to surface in
 * answer-style results.
 */
const CONTACT_FAQS = [
  {
    q: "How quickly will I hear back?",
    a: "Within 24 hours Monday through Friday — often the same day. We sometimes reply on weekends but don't promise it. If you haven't heard from us by the next business day, check your spam folder and feel free to nudge.",
  },
  {
    q: "What should I include in the form?",
    a: "Your name and email are the only required fields. Useful extras: your business URL so we can read up before the call, what the website needs to do, rough timeline, and whether you're starting from scratch or replacing something existing. If you don't have a budget figured out, pick \"Not sure\" — we'll work through scope before pricing.",
  },
  {
    q: "What happens after I submit?",
    a: "We read your note, look at your business, and reply within 24 hours with a few clarifying questions or a calendar link for a 30-minute scoping call. The call is free, no pressure. After the call, we send a written scope, timeline, and quote within 48 hours. If you say yes, we kick off the project.",
  },
  {
    q: "Do you work with international clients?",
    a: "Yes. We're remote-first and have clients across the US, EU, and Asia. We sync schedules to find call times that work for both sides — the work itself is async-friendly so time-zone differences don't slow projects down.",
  },
  {
    q: "Can I skip the form and just talk?",
    a: "Yes. Email info@vantageconnections.com or call +1 (949) 966-9075 directly. The form helps us prep before the conversation, but it's not required.",
  },
  {
    q: "Do you ever turn down projects?",
    a: "Yes, occasionally. If the scope or timeline isn't realistic for the quality bar we want to hit, we'll say so on the call and recommend someone better suited. Honest no's save everyone time.",
  },
];

const NEXT_STEPS = [
  {
    num: "01",
    title: "We reply",
    body: "Within 24 hours Monday through Friday — usually the same day. You'll get a few clarifying questions or a calendar link for the next step.",
  },
  {
    num: "02",
    title: "30-minute scoping call",
    body: "Free, no pressure. We talk through what you need, what you're starting with, and what success looks like for the launch.",
  },
  {
    num: "03",
    title: "Written quote and ship date",
    body: "Within 48 hours of the call. Scope, timeline, and fee — all in writing before anything starts. No hidden line items.",
  },
  {
    num: "04",
    title: "Project kickoff",
    body: "You sign off, we kick off. From there it's our cadence — Discover, Design, Build, Launch — with weekly check-ins and a written ship date you can hold us to.",
  },
];

const PROJECT_TYPES = [
  "SaaS",
  "Luxury",
  "Marketing",
  "Portfolio",
] as const;
type ProjectType = (typeof PROJECT_TYPES)[number];

/**
 * Map form-chip label → mockup style key.
 */
const PROJECT_TYPE_TO_MOCKUP: Record<ProjectType, MockupProjectType> = {
  SaaS: "saas",
  Luxury: "luxury",
  Marketing: "marketing",
  Portfolio: "portfolio",
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
      source: "contact-page",
    });

    setSending(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

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
                        could look like.
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
                className="flex flex-col gap-5"
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

                <Field id="phone" label="Phone">
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass(false)}
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
                        className="mobile-tap-scale"
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
                        className="mobile-tap-scale"
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

          {/* Live mockup */}
          <div className="lg:col-span-5 lg:sticky lg:top-[120px] self-start">
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
              ↑ live mockup — TYPE YOUR COMPANY NAME TO SEE WHAT YOUR NEW WEBSITE WOULD LOOK LIKE
            </p>
          </div>
        </section>

        {/* ---------------- What happens next ----------------
            Adds answerable content the form alone doesn't provide —
            tells the prospect what the next ~3-day window looks like
            after they hit submit. Also gives Google AI Overviews +
            ChatGPT/Perplexity a clean direct-answer block to extract
            for "what happens when you contact a web studio" prompts. */}
        <section className="py-16 md:py-24">
          <AuroraHairline />
          <div className="pt-12 md:pt-16 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">WHAT HAPPENS NEXT</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(2rem, 4vw, 3.25rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  From form to <ColorWord>kickoff</ColorWord>.
                </h2>
                <p className="text-ink-muted text-[15px] leading-relaxed max-w-xs">
                  Most projects move from initial form to signed quote in
                  under a week.
                </p>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <ol className="flex flex-col">
                {NEXT_STEPS.map((step, i) => (
                  <Reveal
                    key={step.num}
                    delay={i * 80}
                    as="li"
                    className="border-b border-line last:border-b-0"
                  >
                    <div className="flex items-start gap-5 py-6">
                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-forest pt-1 w-10 shrink-0">
                        {step.num}
                      </span>
                      <div className="flex flex-col gap-2">
                        <h3
                          className="font-display text-[20px] md:text-[22px] text-ink"
                          style={{ fontWeight: 500 }}
                        >
                          {step.title}
                        </h3>
                        <p className="text-ink-muted text-[15px] md:text-[16px] leading-relaxed max-w-[640px]">
                          {step.body}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* ---------------- FAQ ----------------
            Direct-answer Q&A for the most common pre-contact questions.
            Rendered visibly + emitted as FAQPage JSON-LD via FAQSchema
            below so Google can surface as rich results and LLM
            crawlers can extract Q&A pairs. */}
        <section className="py-16 md:py-20">
          <AuroraHairline />
          <div className="pt-12 md:pt-14 grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-4">
              <Reveal className="flex flex-col gap-3 lg:sticky lg:top-28">
                <Eyebrow color="forest">FAQ</Eyebrow>
                <h2
                  className="font-display"
                  style={{
                    fontSize: "clamp(1.75rem, 3.2vw, 2.5rem)",
                    fontWeight: 600,
                    lineHeight: 1.05,
                    letterSpacing: "-0.015em",
                  }}
                >
                  Common <ColorWord>questions</ColorWord>.
                </h2>
              </Reveal>
            </div>
            <div className="lg:col-span-8">
              <ul className="flex flex-col">
                {CONTACT_FAQS.map((item, i) => (
                  <Reveal
                    key={item.q}
                    delay={i * 60}
                    as="li"
                    className="border-b border-line last:border-b-0"
                  >
                    <FaqItem q={item.q} a={item.a} />
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* FAQPage schema — emits a JSON-LD <script> with Q&A pairs
            for Google rich results + LLM citation extraction. */}
        <FAQSchema items={CONTACT_FAQS} />
      </main>

      <Footer />
    </>
  );
}

function inputClass(invalid: boolean) {
  // Slightly more visible than a pure underline-only field, without
  // committing to a full border: a subtle calm-surface fill plus a
  // bottom underline. Top corners gently rounded so the fill reads as a
  // contained shape. Error state swaps the underline to terracotta.
  return [
    "w-full",
    "bg-surface-calm/50",
    "border-0 border-b-[1.5px]",
    invalid ? "border-[#C04A2D]" : "border-line",
    "rounded-xl",
    // Mobile gets ~48px tap target (py-3 = 12px each side + 16px text);
    // `md:py-2.5` restores the prior desktop padding so the form rhythm
    // is unchanged at md+ breakpoints.
    "px-3.5 py-3 md:py-2.5",
    "text-ink text-[16px]",
    "placeholder:text-ink-muted",
    "focus:outline-none focus:border-forest focus:bg-surface-calm/80",
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
