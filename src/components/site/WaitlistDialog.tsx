"use client";

import { useEffect, useRef, useState } from "react";
import { X, ArrowRight, Check } from "lucide-react";
import { waitlist } from "@/lib/content";

export const WAITLIST_EVENT = "otto:getstarted";

/** Dispatch from any client component to open the closed-beta dialog. */
export function openWaitlist(plan?: string, billing?: "monthly" | "annual") {
  window.dispatchEvent(
    new CustomEvent(WAITLIST_EVENT, { detail: { plan, billing } }),
  );
}

export function WaitlistDialog() {
  const [open, setOpen] = useState(false);
  const [plan, setPlan] = useState<string | undefined>();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { plan?: string; billing?: "monthly" | "annual" }
        | undefined;
      setPlan(detail?.plan);
      setSent(false);
      setError("");
      setOpen(true);
    };
    window.addEventListener(WAITLIST_EVENT, onOpen);
    return () => window.removeEventListener(WAITLIST_EVENT, onOpen);
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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, plan }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };
      if (res.ok && data.ok) {
        setSent(true);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  // One free beta plan, so no tier math — fold the clicked plan name into the
  // generic founding-access pitch.
  const perks = waitlist.perks;
  const panelKicker =
    plan && plan.toLowerCase() !== waitlist.kicker.toLowerCase()
      ? `${plan} · ${waitlist.kicker}`
      : waitlist.kicker;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Reserve your spot on the Vantage Connections waitlist"
      className="fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4"
    >
      {/* scrim — neutral dark, not teal-tinted */}
      <button
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-black/55 backdrop-blur-sm"
        style={{ animation: "ottoFade 0.2s ease-out" }}
      />

      <div
        className="relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto rounded-t-2xl border border-line bg-paper-raised shadow-lift sm:rounded-2xl md:min-h-[36rem] md:grid-cols-[1.04fr_1fr]"
        style={{ animation: "ottoPop 0.28s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* ── LEFT — what you're locking in (gradient panel). Desktop only:
            on a phone the sheet stays a single, thumb-sized ask. ── */}
        <div
          className="band-immersive relative hidden flex-col justify-center gap-8 overflow-hidden p-7 text-paper sm:p-9 md:flex"
          style={{
            backgroundImage:
              "linear-gradient(150deg, #0d2418 0%, #1a4d33 56%, #276b48 100%)",
          }}
        >
          <div className="grain absolute inset-0 opacity-30" />

          <div className="relative z-10">
            <span className="kicker text-accent-soft">{panelKicker}</span>
            <h2 className="font-display mt-3 text-[1.65rem] font-medium leading-[1.12] text-paper">
              {waitlist.title}
            </h2>
          </div>

          <ul className="relative z-10 space-y-3.5">
            {perks.map((p) => (
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

        {/* ── RIGHT — the form (the whole sheet on mobile) ── */}
        <div className="relative flex flex-col justify-center p-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] pt-9 sm:p-9">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-paper-sunken hover:text-ink"
          >
            <X className="h-4 w-4" />
          </button>

          {sent ? (
            <div className="py-6 text-center">
              <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-accent/12 text-accent-deep">
                <Check className="h-6 w-6" strokeWidth={2.5} />
              </span>
              <h2 className="font-display mt-4 text-2xl font-medium text-ink">
                You’re on the list.
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-ink-soft">
                Your spot and launch offer are locked in. We’ll reach out with
                access for your store soon.
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
              <h2 className="text-center font-display text-2xl font-medium leading-tight text-ink sm:text-[1.7rem]">
                {waitlist.formTitle}
              </h2>

              {/* mobile: the gradient panel is hidden, so the pitch is one
                  kicker line + three essentials */}
              <p className="mt-2.5 text-center font-mono text-[0.64rem] uppercase tracking-[0.16em] text-accent-deep md:hidden">
                {panelKicker} · free during beta
              </p>
              <ul className="mx-auto mt-6 w-fit space-y-2.5 md:hidden">
                {[perks[0], perks[2], perks[6]].map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-2.5 text-[0.92rem] leading-snug text-ink-soft"
                  >
                    <span className="mt-0.5 inline-flex h-[1.05rem] w-[1.05rem] shrink-0 items-center justify-center rounded-full bg-accent/12">
                      <Check
                        className="h-2.5 w-2.5 text-accent-deep"
                        strokeWidth={3}
                      />
                    </span>
                    {p}
                  </li>
                ))}
              </ul>

              <form onSubmit={submit} noValidate className="mt-7 md:mt-6">
                <label htmlFor="wl-email" className="sr-only">
                  Work email
                </label>
                <input
                  ref={inputRef}
                  id="wl-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="you@yourstore.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                  className="w-full rounded-full border border-line-strong bg-paper-sunken px-5 py-3.5 text-base text-ink placeholder:text-ink-muted focus-visible:border-accent focus-visible:outline-none"
                />
                {error && (
                  <p role="alert" className="mt-2 pl-3 text-[0.8rem] text-accent-deep">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary group mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-[0.95rem] font-medium transition-all duration-200 active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Reserving…" : waitlist.cta}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
                <p className="mt-3 text-center font-mono text-[0.66rem] uppercase tracking-[0.16em] text-ink-muted">
                  {waitlist.socialProof}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
