import Link from "next/link";
import { AuroraHairline } from "@/components/ui/AuroraHairline";
import { Wordmark } from "./Wordmark";
import { site } from "@/lib/content/site";

export function Footer() {
  const year = new Date().getFullYear();
  const cityLine = site.city
    ? `based in ${site.city}.`
    : "based in [city TODO].";

  return (
    <footer className="mt-32">
      <AuroraHairline />
      <div className="mx-auto max-w-[1320px] px-6 md:px-10 py-12 grid gap-10 md:grid-cols-12">
        <div className="md:col-span-5 flex flex-col gap-3">
          <Wordmark />
          <p className="text-ink-muted text-[14px] max-w-sm">
            {site.tagline}
          </p>
        </div>

        <div className="md:col-span-4 flex flex-col gap-2">
          <span className="font-mono uppercase text-[11px] tracking-[0.18em] text-ink-muted mb-1">
            Sitemap
          </span>
          <ul className="flex flex-col gap-1.5 text-[14px]">
            {site.nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-forest transition-colors">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3 flex flex-col gap-2">
          <span className="font-mono uppercase text-[11px] tracking-[0.18em] text-ink-muted mb-1">
            Elsewhere
          </span>
          {site.socials.length === 0 ? (
            <span className="text-ink-muted text-[13px] font-mono">
              {/* TODO: add real social links to site.socials */}
              social links: TODO
            </span>
          ) : (
            <ul className="flex flex-col gap-1.5 text-[14px]">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="hover:text-forest transition-colors"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {site.email ? (
            <a
              href={`mailto:${site.email}`}
              className="text-[14px] hover:text-forest transition-colors"
            >
              {site.email}
            </a>
          ) : (
            <span className="text-ink-muted text-[13px] font-mono">
              {/* TODO: set site.email */}
              email: TODO
            </span>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-[1320px] px-6 md:px-10 pb-10">
        <p className="font-mono text-[11px] text-ink-muted">
          {site.brand} — {cityLine} © {year} — Built by hand.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
