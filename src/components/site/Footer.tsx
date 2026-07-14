import { Wordmark } from "./Wordmark";
import { footer } from "@/lib/content";

// lucide dropped brand marks, so the social glyphs are inlined (24×24, filled).
const socials = [
  // X — account not live yet; restore when it is.
  // {
  //   label: "Vantage Connections on X",
  //   href: "#",
  //   path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  // },
  {
    label: "Vantage Connections on Instagram",
    href: "https://www.instagram.com/vantage_connections/",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C20.32 1.35 19.65.94 18.86.63 18.1.33 17.22.13 15.95.07 14.67.01 14.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-paper-sunken text-ink">
      <div className="grain absolute inset-0 opacity-40" />
      {/* warm gradient glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-32 h-[460px] w-[560px] rounded-full opacity-60"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(var(--c-accent-rgb),0.22), rgba(var(--c-accent-rgb),0) 70%)",
        }}
      />

      <div className="container-page relative z-10 pt-4 md:pt-6">
        {/* links + brand — the final ask lives in the FinalCTA section above */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 py-10 md:grid-cols-[1.6fr_1fr_1fr_1fr] md:gap-12 md:py-14">
          <div className="col-span-2 max-w-sm md:col-span-1">
            <Wordmark tone="ink" />
            <p className="mt-4 text-pretty text-[0.98rem] leading-relaxed text-ink-soft">
              {footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-2.5">
              {socials.map(({ label, href, path }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-paper-raised text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-deep"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-[1.05rem] w-[1.05rem]"
                  >
                    <path d={path} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {footer.columns.map((col) => (
            <div key={col.title}>
              <h3 className="kicker text-accent-deep">{col.title}</h3>
              <ul className="mt-3.5 space-y-2.5 md:mt-4 md:space-y-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="group inline-flex items-center text-[0.95rem] text-ink-soft transition-colors duration-200 hover:text-ink"
                    >
                      <span className="bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 group-hover:bg-[length:100%_1px] [background-image:linear-gradient(currentColor,currentColor)]">
                        {l.label}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* bottom bar */}
        <div className="flex flex-col items-start justify-between gap-3 border-t border-line pt-7 pb-[max(1.75rem,env(safe-area-inset-bottom))] text-[0.85rem] text-ink-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Vantage Connections. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
