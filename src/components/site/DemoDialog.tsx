"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { X, ArrowRight, Check, ChevronDown } from "lucide-react";
import { enterprise } from "@/lib/content";

export const DEMO_EVENT = "otto:bookdemo";

/** Dispatch from any client component to open the "Book a demo" dialog. */
export function openDemo() {
  window.dispatchEvent(new CustomEvent(DEMO_EVENT));
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Lenient domain / URL check — accepts "brand.com", "www.brand.com/shop", "https://brand.com".
const URL_RE = /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/\S*)?$/i;

// Fields that must be valid before the form can submit. `volume` always has a
// value and `message` is optional, so neither gates submission.
const REQUIRED = ["name", "email", "company", "storeUrl"] as const;
type FieldKey = (typeof REQUIRED)[number];

function validateField(field: FieldKey, value: string): string {
  const v = value.trim();
  switch (field) {
    case "name":
      return v.length < 2 ? "Enter your name." : "";
    case "email":
      return EMAIL_RE.test(v) ? "" : "Enter a valid email address.";
    case "company":
      return v ? "" : "Tell us your company name.";
    case "storeUrl":
      if (!v) return "Add your website URL.";
      return URL_RE.test(v) ? "" : "Enter a valid URL.";
    default:
      return "";
  }
}

// Field shell + floating label. Label rests as a placeholder when empty, then
// scoots up and shrinks the moment the field has content or focus.
const inputShell =
  "peer w-full rounded-xl border bg-paper-sunken px-4 pb-2 pt-6 text-[0.95rem] text-ink focus-visible:outline-none";
const borderOk = "border-line-strong focus-visible:border-accent";
const borderBad = "border-cta focus-visible:border-cta";
const floatLabel =
  "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[0.95rem] transition-all duration-200 peer-focus:top-2 peer-focus:translate-y-0 peer-focus:text-[0.68rem] peer-focus:font-medium peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:text-[0.68rem] peer-[:not(:placeholder-shown)]:font-medium";

function Field({
  id,
  label,
  value,
  error,
  invalid,
  onChange,
  onBlur,
  type = "text",
  inputMode,
  autoComplete,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  error?: string;
  invalid: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  type?: string;
  inputMode?: "text" | "email" | "url";
  autoComplete?: string;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  return (
    <div>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder=" "
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          aria-invalid={invalid}
          aria-describedby={invalid ? `${id}-err` : undefined}
          className={`${inputShell} ${invalid ? borderBad : borderOk}`}
        />
        <label
          htmlFor={id}
          className={`${floatLabel} ${
            invalid ? "text-cta-deep" : "text-ink-muted peer-focus:text-accent-deep"
          }`}
        >
          {label}
        </label>
      </div>
      {invalid && (
        <p id={`${id}-err`} className="mt-1.5 pl-1 text-[0.78rem] text-cta-deep">
          {error}
        </p>
      )}
    </div>
  );
}

/** Custom dropdown (styled to match the inputs; native <select> can't be themed). */
function CustomSelect({
  value,
  options,
  onChange,
  id,
  label,
}: {
  value: string;
  options: readonly string[];
  onChange: (v: string) => void;
  id: string;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(() => Math.max(0, options.indexOf(value)));
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setActive(Math.max(0, options.indexOf(value)));
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open, options, value]);

  const choose = (v: string) => {
    onChange(v);
    setOpen(false);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (open) {
        e.preventDefault();
        e.stopPropagation();
        setOpen(false);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open) setOpen(true);
      else setActive((a) => Math.min(options.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) choose(options[active]);
      else setOpen(true);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={onKey}
        className={`relative w-full rounded-xl border bg-paper-sunken px-4 pb-2 pt-6 text-left text-[0.95rem] text-ink focus-visible:outline-none ${borderOk}`}
      >
        {/* persistent label — the dropdown always holds a value */}
        <span className="pointer-events-none absolute left-4 top-2 text-[0.68rem] font-medium text-ink-muted">
          {label}
        </span>
        <span className="flex items-center justify-between">
          <span>{value}</span>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-ink-muted transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-line-strong bg-paper-raised p-1 shadow-lift"
        >
          {options.map((o, i) => {
            const selected = o === value;
            return (
              <li
                key={o}
                role="option"
                aria-selected={selected}
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(o)}
                className={`flex cursor-pointer items-center justify-between rounded-lg px-3.5 py-2.5 text-[0.95rem] transition-colors ${
                  i === active ? "bg-paper-sunken text-ink" : "text-ink-soft"
                }`}
              >
                {o}
                {selected && (
                  <Check className="h-4 w-4 text-accent-deep" strokeWidth={2.5} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export function DemoDialog() {
  const [open, setOpen] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    storeUrl: "",
    volume: enterprise.form.volumeOptions[1] as string,
    message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<FieldKey, string>>>({});
  const [dirty, setDirty] = useState<Partial<Record<FieldKey, boolean>>>({});
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Whole-form validity gates the submit button — independent of "dirty",
  // so the button stays grayed out until every required field is actually good.
  const isValid = useMemo(
    () => REQUIRED.every((f) => validateField(f, form[f]) === ""),
    [form],
  );

  useEffect(() => {
    const onOpen = () => {
      setSent(false);
      setSubmitError("");
      setErrors({});
      setDirty({});
      setOpen(true);
    };
    window.addEventListener(DEMO_EVENT, onOpen);
    return () => window.removeEventListener(DEMO_EVENT, onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => inputRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Grade fields a short beat after typing stops (not only on submit).
  useEffect(() => {
    const t = setTimeout(() => {
      const next: Partial<Record<FieldKey, string>> = {};
      for (const f of REQUIRED) next[f] = validateField(f, form[f]);
      setErrors(next);
    }, 400);
    return () => clearTimeout(t);
  }, [form]);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = e.target.value;
      setForm((f) => ({ ...f, [k]: value }));
      if ((REQUIRED as readonly string[]).includes(k)) {
        setDirty((d) => (d[k as FieldKey] ? d : { ...d, [k]: true }));
      }
    };

  // Snappy feedback the moment a field loses focus.
  const blur = (k: FieldKey) => () => {
    setDirty((d) => ({ ...d, [k]: true }));
    setErrors((er) => ({ ...er, [k]: validateField(k, form[k]) }));
  };

  const invalidOf = (k: FieldKey) => Boolean(dirty[k] && errors[k]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) {
      // Reveal every outstanding field error at once.
      setDirty({ name: true, email: true, company: true, storeUrl: true });
      setErrors(() => {
        const next: Partial<Record<FieldKey, string>> = {};
        for (const f of REQUIRED) next[f] = validateField(f, form[f]);
        return next;
      });
      return;
    }
    setSubmitError("");
    setLoading(true);
    try {
      const res = await fetch("/api/enterprise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setSent(true);
      } else {
        setSubmitError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Book a Vantage enterprise demo"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
    >
      <button
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
        style={{ animation: "ottoFade 0.2s ease-out" }}
      />

      <div
        className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-line bg-paper-raised shadow-lift md:grid-cols-[1fr_1.15fr]"
        style={{ animation: "ottoPop 0.28s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* ── LEFT — the pitch ── */}
        <div
          className="band-immersive relative hidden flex-col gap-8 overflow-hidden p-8 text-paper sm:p-10 md:flex"
          style={{
            backgroundImage:
              "linear-gradient(150deg, #11332b 0%, #1c5447 58%, #246256 100%)",
          }}
        >
          <div className="grain absolute inset-0 opacity-30" />
          <div className="relative z-10">
            <span className="kicker text-accent-soft">
              {enterprise.hero.kicker}
            </span>
            <h2 className="font-display mt-3 text-[1.6rem] font-medium leading-[1.12] text-paper">
              {enterprise.demo.title}
            </h2>
            <p className="mt-3 text-[0.94rem] leading-relaxed text-paper/75">
              {enterprise.demo.body}
            </p>
          </div>
          <ul className="relative z-10 mt-auto space-y-2.5">
            {enterprise.hero.points.map((p) => (
              <li
                key={p}
                className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-paper/90"
              >
                <span className="mt-0.5 inline-flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full bg-paper/15">
                  <Check className="h-2.5 w-2.5 text-accent-soft" strokeWidth={3} />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT — the form ── */}
        <div className="relative flex flex-col justify-center p-8 sm:p-10">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-sunken hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>

          {sent ? (
            <div className="py-6 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-success-soft text-accent-deep">
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <h2 className="font-display mt-4 text-2xl font-medium text-ink">
                {enterprise.form.successTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">
                {enterprise.form.successBody}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="btn-primary mt-6 rounded-full px-6 py-2.5 text-sm font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-medium leading-tight text-ink">
                {enterprise.form.title}
              </h2>
              <p className="mt-2 text-[0.92rem] leading-relaxed text-ink-soft">
                {enterprise.form.subtitle}
              </p>

              <form onSubmit={submit} noValidate className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="d-name"
                    label="Your name"
                    autoComplete="name"
                    inputRef={inputRef}
                    value={form.name}
                    error={errors.name}
                    invalid={invalidOf("name")}
                    onChange={update("name")}
                    onBlur={blur("name")}
                  />
                  <Field
                    id="d-email"
                    label="Work email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={form.email}
                    error={errors.email}
                    invalid={invalidOf("email")}
                    onChange={update("email")}
                    onBlur={blur("email")}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    id="d-company"
                    label="Company"
                    autoComplete="organization"
                    value={form.company}
                    error={errors.company}
                    invalid={invalidOf("company")}
                    onChange={update("company")}
                    onBlur={blur("company")}
                  />
                  <Field
                    id="d-store"
                    label="Website URL"
                    inputMode="url"
                    value={form.storeUrl}
                    error={errors.storeUrl}
                    invalid={invalidOf("storeUrl")}
                    onChange={update("storeUrl")}
                    onBlur={blur("storeUrl")}
                  />
                </div>

                <CustomSelect
                  id="d-volume"
                  label="Annual store revenue"
                  value={form.volume}
                  options={enterprise.form.volumeOptions}
                  onChange={(v) => setForm((f) => ({ ...f, volume: v }))}
                />

                <div className="relative">
                  <textarea
                    id="d-message"
                    rows={4}
                    placeholder=" "
                    value={form.message}
                    onChange={update("message")}
                    className="peer w-full resize-none rounded-xl border border-line-strong bg-paper-sunken px-4 pb-3 pt-7 text-[0.95rem] text-ink focus-visible:border-accent focus-visible:outline-none"
                  />
                  <label
                    htmlFor="d-message"
                    className="pointer-events-none absolute left-4 top-4 text-[0.95rem] text-ink-muted transition-all duration-200 peer-focus:top-2 peer-focus:text-[0.68rem] peer-focus:font-medium peer-focus:text-accent-deep peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[0.68rem] peer-[:not(:placeholder-shown)]:font-medium"
                  >
                    Tell us a bit about how you hope to use Vantage
                  </label>
                </div>

                {submitError && (
                  <p role="alert" className="pl-1 text-[0.8rem] text-cta-deep">
                    {submitError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !isValid}
                  className={`group inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-medium transition-all duration-200 ${
                    loading || !isValid
                      ? "cursor-not-allowed bg-paper-edge text-ink-muted"
                      : "btn-primary active:scale-[0.985]"
                  }`}
                >
                  {loading ? "Sending…" : enterprise.form.cta}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
