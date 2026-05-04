import type { MockupProps } from "./types";

/**
 * SaaS dashboard mockup — sidebar + dense main area.
 *
 * Generic SaaS nav items (Dashboard / Inbox / Projects / Reports /
 * Settings) are fine to ship — they're shape, not product copy. All
 * numeric stats are em-dashes so we never fabricate a metric for a
 * company we don't know.
 */
export function SaasMockup({ companyName }: MockupProps) {
  const navItems = ["Dashboard", "Inbox", "Projects", "Reports", "Settings"];

  return (
    <div className="grid h-full grid-cols-[22%_1fr]">
      {/* Sidebar */}
      <aside className="flex flex-col justify-between border-r border-line bg-surface-calm px-3 py-3">
        <div className="flex flex-col gap-3">
          <span className="font-display text-[11px] font-semibold text-ink truncate">
            {companyName}
          </span>
          <ul className="flex flex-col gap-1.5">
            {navItems.map((label, i) => (
              <li
                key={label}
                className={`text-[9.5px] leading-none ${
                  i === 0 ? "text-forest font-medium" : "text-ink-muted"
                }`}
              >
                {label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="block h-4 w-4 rounded-full bg-line" />
          <span className="font-mono text-[8.5px] uppercase tracking-[0.14em] text-ink-muted">
            Account
          </span>
        </div>
      </aside>

      {/* Main */}
      <section className="flex flex-col gap-3 p-4">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <h3
            className="font-display text-[13px] text-ink"
            style={{ fontWeight: 600 }}
          >
            Dashboard
          </h3>
          <div className="flex-1 max-w-[140px] rounded border border-line bg-surface px-2 py-1 font-mono text-[8.5px] text-ink-muted">
            Search…
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Active" },
            { label: "This week" },
            { label: "Total" },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded border border-line bg-surface px-2 py-2 flex flex-col gap-1"
            >
              <div className="flex items-center gap-1">
                <span className="block h-1.5 w-1.5 rounded-full bg-forest" />
                <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-ink-muted">
                  {s.label}
                </span>
              </div>
              <span
                className="font-display text-[16px] text-ink leading-none"
                style={{ fontWeight: 600 }}
              >
                —
              </span>
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 rounded border border-line bg-surface p-2">
          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="saas-line-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#E0B442" />
                <stop offset="100%" stopColor="#FADC85" />
              </linearGradient>
            </defs>
            <path
              d="M0,45 C30,40 50,30 80,28 C110,26 130,18 160,14 C180,11 195,9 200,8"
              fill="none"
              stroke="url(#saas-line-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </section>
    </div>
  );
}

export default SaasMockup;
