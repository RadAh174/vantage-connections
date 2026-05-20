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
        <div className="md:col-span-6 flex flex-col gap-3">
          <Wordmark />
          <p className="text-ink-muted text-[14px] max-w-sm">
            {site.tagline}
          </p>
          {site.email && (
            <a
              href={`mailto:${site.email}`}
              className="text-[14px] hover:text-forest transition-colors self-start border-b border-current pb-px"
            >
              {site.email}
            </a>
          )}
          <a
            href={`tel:${site.phoneE164}`}
            className="text-[14px] text-ink-muted hover:text-forest transition-colors self-start"
          >
            {site.phone}
          </a>
        </div>

        <div className="md:col-span-6 md:col-start-9 flex flex-col gap-2">
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
            {/* Quiet About link — kept out of primary nav but indexable
                and reachable, which preserves E-E-A-T + the Person entity
                signal LLMs use to verify founders are real. */}
            <li>
              <Link href="/about" className="hover:text-forest transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:text-forest transition-colors">
                Pricing
              </Link>
            </li>
          </ul>
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
