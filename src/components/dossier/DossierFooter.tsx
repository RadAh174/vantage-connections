import { dossierFooter, footer } from "@/lib/content";

// Deterministic decorative barcode for the filing footer.
const BARS = [
  3, 1, 2, 1, 1, 3, 1, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 3, 1, 1, 1, 2, 1, 3,
  2, 1, 1, 1, 2, 1, 3, 1, 2, 1, 1, 1, 2, 3, 1,
];

/**
 * The filing footer — references line, link columns, barcode + form number.
 */
export function DossierFooter() {
  return (
    <footer className="px-5 pb-10 pt-12 sm:px-8 md:px-14">
      <div className="grid gap-10 border-t-2 border-dink pt-8 md:grid-cols-[1.2fr_1.6fr]">
        <div>
          <p className="font-plex text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-dink">
            {dossierFooter.references}
          </p>
          <p className="mt-4 max-w-sm text-[0.88rem] leading-relaxed text-dink-2">
            {dossierFooter.tagline}
          </p>
          <a
            href="https://www.instagram.com/vantage_connections/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block font-plex text-[0.66rem] uppercase tracking-[0.18em] text-dred underline decoration-dashed underline-offset-4 hover:text-dred-deep"
          >
            Instagram ↗
          </a>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {footer.columns.map((col) => (
            <div key={col.title}>
              <p className="field-label">{col.title}</p>
              <ul className="mt-3.5 flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      className="text-[0.88rem] text-dink-2 transition-colors hover:text-dred"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-end justify-between gap-6 border-t border-dline pt-6">
        <div>
          {/* barcode */}
          <svg
            aria-hidden="true"
            viewBox={`0 0 ${BARS.reduce((a, b) => a + b + 1, 0)} 28`}
            className="h-7 w-40 text-dink"
          >
            {(() => {
              let x = 0;
              return BARS.map((w, i) => {
                const bar = (
                  <rect key={i} x={x} y={0} width={w} height={28} fill="currentColor" />
                );
                x += w + 1;
                return bar;
              });
            })()}
          </svg>
          <p className="mt-2 font-plex text-[0.58rem] uppercase tracking-[0.24em] text-dink-3">
            {dossierFooter.formNo}
          </p>
        </div>
        <p className="font-plex text-[0.6rem] uppercase tracking-[0.18em] text-dink-3">
          © 2026 Vantage Connections. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
