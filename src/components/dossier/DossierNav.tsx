"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav } from "@/lib/content";
import { openWaitlist } from "@/components/site/WaitlistDialog";

/**
 * The dossier's filing-clerk bar — a slim typewritten strip pinned above
 * the desk, plus a floating "DRAFT OFFER" stamp-button once you've read
 * far enough to decide.
 */
export function DossierNav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.45);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-dline-2/60 bg-ddesk/90 backdrop-blur-sm">
        <nav
          aria-label="Primary"
          className="mx-auto flex h-12 max-w-[76rem] items-center justify-between px-4 sm:px-6"
        >
          <a
            href="#top"
            className="font-plex text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-dink"
          >
            Vantage<span className="text-dred">·</span>Connections
          </a>

          <div className="hidden items-center gap-7 md:flex">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-plex text-[0.66rem] uppercase tracking-[0.2em] text-dink-2 transition-colors hover:text-dred"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => openWaitlist()}
              className="rounded-sm bg-dred px-4 py-2 font-plex text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-dpaper transition-colors hover:bg-dred-deep"
            >
              {nav.cta.label}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-9 w-9 items-center justify-center text-dink md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {/* mobile sheet */}
        <div
          className={`absolute inset-x-0 top-12 border-b border-dline-2 bg-dpaper md:hidden ${
            open ? "block" : "hidden"
          }`}
        >
          <div className="flex flex-col px-6 py-4">
            {nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="border-b border-dline py-3.5 font-plex text-[0.72rem] uppercase tracking-[0.2em] text-dink last:border-0"
              >
                {l.label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                openWaitlist();
              }}
              className="mt-4 mb-2 rounded-sm bg-dred px-4 py-3 font-plex text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-dpaper"
            >
              {nav.cta.label}
            </button>
          </div>
        </div>
      </header>

      {/* floating stamp-button once the reader has scrolled deep */}
      <button
        type="button"
        onClick={() => openWaitlist()}
        aria-label="Draft the offer letter"
        className={`fixed bottom-6 right-6 z-40 flex h-20 w-20 items-center justify-center rounded-full border-[3px] border-dred bg-dpaper font-plex text-[0.56rem] font-semibold uppercase leading-tight tracking-[0.16em] text-dred shadow-[0_10px_24px_-10px_rgba(28,27,23,0.5)] transition-all duration-300 hover:scale-105 hover:bg-dred hover:text-dpaper ${
          scrolled
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-4 opacity-0"
        }`}
        style={{ transform: scrolled ? "rotate(-8deg)" : undefined }}
      >
        Draft
        <br />
        offer
      </button>
    </>
  );
}
