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

/**
 * FORM VC-002 — the offer letter. The waitlist capture as an employment
 * document: terms on the left, your signature (email) on the right, and a
 * HIRED stamp on success.
 */
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

  const perks = waitlist.perks;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="The Vantage Connections offer letter"
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 font-archivo"
    >
      {/* scrim — the desk, dimmed */}
      <button
        aria-label="Close"
        onClick={() => setOpen(false)}
        className="absolute inset-0 cursor-default bg-dink/60 backdrop-blur-[2px]"
        style={{ animation: "ottoFade 0.2s ease-out" }}
      />

      <div
        className="dossier-sheet relative grid max-h-[92dvh] w-full max-w-3xl overflow-y-auto border border-dline-2 text-dink md:min-h-[36rem] md:grid-cols-[1.04fr_1fr]"
        style={{ animation: "ottoPop 0.28s cubic-bezier(0.22,1,0.36,1)" }}
      >
        {/* ── LEFT — the terms of employment ── */}
        <div className="relative hidden flex-col border-r border-dline md:flex">
          <div className="border-b-2 border-dink px-7 pb-3 pt-5">
            <p className="font-plex text-[0.6rem] font-semibold uppercase tracking-[0.2em] text-dink">
              {waitlist.formNo}
            </p>
          </div>
          <div className="flex flex-1 flex-col justify-center gap-6 p-7">
            <h2 className="font-anton text-[1.9rem] leading-tight text-dink">
              {waitlist.title}
            </h2>
            <ul className="space-y-3">
              {perks.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-2.5 text-[0.88rem] leading-snug text-dink-2"
                >
                  <span className="dossier-check mt-0.5">
                    <Check className="h-2.5 w-2.5" strokeWidth={3.5} />
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <p className="font-plex text-[0.58rem] uppercase tracking-[0.18em] text-dink-3">
              {waitlist.fine}
            </p>
          </div>
        </div>

        {/* ── RIGHT — the signature ── */}
        <div className="relative flex flex-col justify-center p-7 sm:p-9">
          <button
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute right-4 top-4 z-20 inline-flex h-8 w-8 items-center justify-center text-dink-2 transition-colors hover:text-dred"
          >
            <X className="h-4 w-4" />
          </button>

          {sent ? (
            <div className="py-6 text-center">
              <span
                className="stamp inline-block text-[1.1rem]"
                style={{ ["--stamp-rot" as string]: "-8deg" }}
              >
                {waitlist.successStamp}
              </span>
              <h2 className="font-anton mt-6 text-3xl text-dink">
                {waitlist.successTitle}
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-[0.95rem] leading-relaxed text-dink-2">
                {waitlist.successBody}
              </p>
              <button
                onClick={() => setOpen(false)}
                className="mt-6 rounded-sm bg-dink px-6 py-2.5 font-plex text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-dpaper transition-colors hover:bg-dred"
              >
                File it away
              </button>
            </div>
          ) : (
            <>
              <p className="text-center font-plex text-[0.6rem] uppercase tracking-[0.2em] text-dink-3 md:hidden">
                {waitlist.formNo}
              </p>
              <h2 className="mt-2 text-center font-anton text-3xl leading-tight text-dink md:mt-0">
                Sign here.
              </h2>
              <p className="mx-auto mt-3 max-w-xs text-center text-[0.9rem] leading-relaxed text-dink-2">
                {waitlist.subtitle}
              </p>

              <form onSubmit={submit} noValidate className="mt-7">
                <label
                  htmlFor="wl-email"
                  className="field-label block text-center"
                >
                  Signature (work email)
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
                  className="field-line mt-2 w-full bg-transparent px-2 py-3 text-center font-plex text-[0.95rem] text-dink placeholder:text-dink-3 focus-visible:border-dred focus-visible:outline-none"
                />
                {error && (
                  <p role="alert" className="mt-2 text-center text-[0.8rem] text-dred">
                    {error}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="group mt-5 inline-flex w-full items-center justify-center gap-2 rounded-sm bg-dred px-6 py-3.5 font-plex text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-dpaper transition-all duration-200 hover:bg-dred-deep active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Filing…" : waitlist.cta}
                  {!loading && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </button>
                <p className="mt-4 text-center font-plex text-[0.6rem] uppercase tracking-[0.16em] text-dink-3">
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
