"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { openDemo } from "./DemoDialog";
import { enterprise } from "@/lib/content";

export function EnterpriseNav() {
  // Rides transparent over the dark hero, then turns into a light blurred bar
  // once the hero scrolls past — same behaviour as the homepage nav.
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let threshold = 0;
    const measure = () => {
      const hero = document.getElementById("top");
      threshold = hero ? hero.offsetHeight - 90 : window.innerHeight * 0.8;
    };
    const onScroll = () => setSolid(window.scrollY > threshold);
    measure();
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const light = solid || open;

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ease-out ${
          light
            ? "border-b border-line bg-paper/85 shadow-[0_10px_30px_-22px_rgba(var(--c-shade-rgb),0.5)] backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        }`}
      >
        <nav
          aria-label="Primary"
          className="container-page flex h-16 items-center justify-between md:h-[4.5rem]"
        >
          <a href="/" className="flex items-center gap-2.5" aria-label="Vantage home">
            <Wordmark tone={light ? "ink" : "paper"} />
            <span
              className={`hidden font-mono text-[0.62rem] uppercase tracking-[0.18em] sm:inline ${
                light ? "text-ink-muted" : "text-paper/55"
              }`}
            >
              Enterprise
            </span>
          </a>

          <div className="hidden items-center gap-9 md:flex">
            {enterprise.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`text-[0.92rem] transition-colors duration-200 ${
                  light
                    ? "text-ink-soft hover:text-ink"
                    : "text-paper/75 hover:text-paper"
                }`}
              >
                {l.label}
              </a>
            ))}
          </div>

          <div className="hidden md:block">
            <button
              type="button"
              onClick={() => openDemo()}
              className="btn-primary group inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-all duration-200 active:scale-[0.98]"
            >
              {enterprise.nav.cta}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full md:hidden ${
              light ? "text-ink" : "text-paper"
            }`}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </div>

      {/* Mobile sheet */}
      <div
        className={`md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-x-0 top-16 origin-top border-b border-line bg-paper px-6 pb-8 pt-2 transition-all duration-300 ease-out ${
            open ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          <div className="flex flex-col divide-y divide-line">
            {enterprise.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-4 font-display text-xl text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              openDemo();
            }}
            className="btn-primary mt-6 inline-flex w-full items-center justify-center rounded-full px-6 py-4 font-semibold"
          >
            {enterprise.nav.cta}
          </button>
        </div>
      </div>
    </header>
  );
}
