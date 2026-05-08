"use client";

import { useState, type FormEvent } from "react";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Chip } from "@/components/ui/Chip";
import { sendLead } from "@/app/actions/contact";

/**
 * Inline contact form for the home page on mobile.
 *
 * Why a separate file from `ContactDrawer`: the drawer is a desktop
 * design pattern — full-screen FLIP, 300dvh pin runway, slide-up
 * reveal. On mobile that whole sequence is hostile (huge empty
 * runway, then a takeover modal just to fill out a form). This
 * component renders the same form fields inline at the bottom of
 * the home page, scrolling normally with the rest of the content.
 *
 * Same submit pipeline as the drawer (`sendLead` server action),
 * same success/error states, same input shape — just no chrome.
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

export function InlineContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
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
      projectType: projectType || undefined,
      message: message.trim(),
      source: "home-mobile-inline",
    });

    setSending(false);

    if (!result.ok) {
      setSubmitError(result.error);
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-xl border border-line bg-surface-calm px-6 py-8 flex flex-col gap-4 items-start">
        <Eyebrow color="forest">SENT</Eyebrow>
        <p className="text-ink text-[16px] leading-relaxed">
          Got it{name ? `, ${name.split(" ")[0]}` : ""} — we&apos;ll respond
          within 24 hours.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
      <Field id="il-name" label="Name" required error={errors.name}>
        <input
          id="il-name"
          name="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass(!!errors.name)}
        />
      </Field>

      <Field id="il-email" label="Email" required error={errors.email}>
        <input
          id="il-email"
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

      <Field id="il-message" label="Message" required error={errors.message}>
        <textarea
          id="il-message"
          name="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className={`${inputClass(!!errors.message)} resize-y min-h-[96px]`}
        />
      </Field>

      {submitError && (
        <div
          role="alert"
          className="rounded-md border border-[#C04A2D]/40 bg-[#C04A2D]/10 p-3 text-[13px] text-[#C04A2D]"
        >
          {submitError}
        </div>
      )}

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={sending}
          className="w-full"
        >
          {sending ? "Sending…" : "Send →"}
        </Button>
      </div>
    </form>
  );
}

function inputClass(invalid: boolean) {
  return [
    "w-full bg-transparent",
    "border-0 border-b",
    invalid ? "border-[#C04A2D]" : "border-line",
    "px-0 py-3.5",
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

export default InlineContactForm;
