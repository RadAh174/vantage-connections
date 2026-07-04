import { Wordmark } from "./Wordmark";
import { GetStartedButton } from "@/components/ui/GetStartedButton";
import { footer } from "@/lib/content";

// lucide dropped brand marks, so the social glyphs are inlined (24×24, filled).
const socials = [
  {
    label: "Vantage Connections onX",
    href: "#",
    path: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z",
  },
  {
    label: "Vantage Connections onInstagram",
    href: "#",
    path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.31-1.46.72-2.13 1.38C1.35 2.68.94 3.35.63 4.14.33 4.9.13 5.78.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.79.72 1.46 1.38 2.13.67.66 1.34 1.07 2.13 1.38.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56.79-.31 1.46-.72 2.13-1.38.66-.67 1.07-1.34 1.38-2.13.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91-.31-.79-.72-1.46-1.38-2.13C20.32 1.35 19.65.94 18.86.63 18.1.33 17.22.13 15.95.07 14.67.01 14.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 12 18.16 6.16 6.16 0 0 0 12 5.84zm0 10.16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.41-11.85a1.44 1.44 0 1 0 0 2.88 1.44 1.44 0 0 0 0-2.88z",
  },
  {
    label: "Vantage Connections onLinkedIn",
    href: "#",
    path: "M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z",
  },
  {
    label: "Vantage Connections onGitHub",
    href: "#",
    path: "M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.2 11.19.6.11.82-.25.82-.56v-2c-3.34.71-4.04-1.41-4.04-1.41-.55-1.37-1.33-1.74-1.33-1.74-1.09-.73.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.79 2.81 1.27 3.5.97.11-.76.42-1.27.76-1.56-2.67-.3-5.47-1.31-5.47-5.83 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 6 0c2.29-1.53 3.3-1.21 3.3-1.21.66 1.65.24 2.87.12 3.17.77.83 1.24 1.88 1.24 3.17 0 4.53-2.81 5.53-5.49 5.82.43.37.81 1.1.81 2.22v3.29c0 .31.22.68.83.56C20.57 21.91 24 17.5 24 12.29 24 5.78 18.63.5 12 .5z",
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

      <div className="container-page relative z-10 pt-16 md:pt-20">
        {/* mini call to action */}
        <div className="flex flex-col gap-6 border-b border-line pb-12 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <p className="font-display text-[1.9rem] font-medium leading-[1.1] tracking-[-0.01em] text-ink sm:text-[2.4rem]">
              Hire the operator your
              <br className="hidden sm:block" /> store has been missing.
            </p>
          </div>
          <GetStartedButton variant="primary" size="lg" withArrow>
            Join the waitlist
          </GetStartedButton>
        </div>

        {/* links + brand */}
        <div className="grid gap-12 py-14 md:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
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
                  rel="me noopener noreferrer"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper-raised text-ink-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent-deep"
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
              <ul className="mt-4 space-y-3">
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
        <div className="flex flex-col items-start justify-between gap-3 border-t border-line py-7 text-[0.85rem] text-ink-muted md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} Vantage Connections. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
