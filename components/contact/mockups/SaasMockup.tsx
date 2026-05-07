import type { MockupProps } from "./types";

/**
 * SaaS dashboard mockup — forest/green throughout.
 *
 * Generic SaaS chrome (Dashboard / Inbox / Projects / Reports /
 * Settings) is shape, not product copy. All numeric values are
 * em-dashes so we never fabricate a metric for a company we don't
 * know. Forest is the only accent color — no gold — to make this
 * style read distinctly from Luxury at a glance.
 */
export function SaasMockup({ companyName }: MockupProps) {
  const navItems = [
    { label: "Dashboard", active: true },
    { label: "Inbox", active: false },
    { label: "Projects", active: false },
    { label: "Reports", active: false },
    { label: "Settings", active: false },
  ];

  return (
    <div className="grid h-full grid-cols-[24%_1fr]">
      {/* Sidebar */}
      <aside className="flex flex-col justify-between border-r border-line bg-surface-calm px-3 py-3">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-1.5">
            <span
              aria-hidden="true"
              className="block h-2 w-2 rounded-full bg-forest"
            />
            <span className="font-display text-[11px] font-semibold text-ink truncate">
              {companyName}
            </span>
          </div>
          <ul className="flex flex-col gap-0.5">
            {navItems.map((n) => (
              <li
                key={n.label}
                className={`flex items-center gap-2 rounded px-1.5 py-1 text-[9.5px] leading-none ${
                  n.active
                    ? "bg-forest/10 text-forest font-medium"
                    : "text-ink-muted"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`block h-1 w-1 rounded-full ${
                    n.active ? "bg-forest" : "bg-line"
                  }`}
                />
                {n.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-1.5 border-t border-line pt-2">
          <span className="block h-3.5 w-3.5 rounded-full bg-forest/20" />
          <div className="flex flex-col">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ink">
              Account
            </span>
            <span className="font-mono text-[7px] uppercase tracking-[0.14em] text-ink-muted">
              Pro plan
            </span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <section className="flex flex-col gap-2.5 p-3.5">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex flex-col gap-0.5">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.18em] text-forest">
              Overview
            </span>
            <h3
              className="font-display text-[13px] text-ink leading-none"
              style={{ fontWeight: 600 }}
            >
              Welcome back
            </h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="rounded border border-line bg-surface px-2 py-1 font-mono text-[8.5px] text-ink-muted">
              ⌘K Search
            </span>
            <span className="block h-5 w-5 rounded-full border border-line bg-surface" />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { label: "Active", trend: 80 },
            { label: "This week", trend: 55 },
            { label: "Total", trend: 92 },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded border border-line bg-surface px-2 py-2 flex flex-col gap-1"
            >
              <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ink-muted">
                {s.label}
              </span>
              <span
                className="font-display text-[18px] text-ink leading-none"
                style={{ fontWeight: 600 }}
              >
                —
              </span>
              {/* Tiny progress bar */}
              <div className="h-0.5 w-full rounded-full bg-line/60 overflow-hidden">
                <div
                  className="h-full bg-forest"
                  style={{ width: `${s.trend}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Chart panel */}
        <div className="flex-1 rounded border border-line bg-surface px-2.5 pt-2 pb-1.5 flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[7.5px] uppercase tracking-[0.14em] text-ink-muted">
              Activity · last 30 days
            </span>
            <div className="flex items-center gap-1">
              <span className="block h-1.5 w-1.5 rounded-full bg-forest" />
              <span className="font-mono text-[7.5px] text-ink-muted">
                runs
              </span>
            </div>
          </div>
          <svg
            viewBox="0 0 200 60"
            preserveAspectRatio="none"
            className="h-full w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient
                id="saas-line-grad"
                x1="0"
                y1="0"
                x2="1"
                y2="0"
              >
                <stop offset="0%" stopColor="var(--color-forest)" />
                <stop offset="100%" stopColor="#5A9971" />
              </linearGradient>
              <linearGradient
                id="saas-fill-grad"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="var(--color-forest)"
                  stopOpacity="0.18"
                />
                <stop
                  offset="100%"
                  stopColor="var(--color-forest)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>
            {/* Filled area below the curve */}
            <path
              d="M0,45 C30,40 50,30 80,28 C110,26 130,18 160,14 C180,11 195,9 200,8 L200,60 L0,60 Z"
              fill="url(#saas-fill-grad)"
            />
            <path
              d="M0,45 C30,40 50,30 80,28 C110,26 130,18 160,14 C180,11 195,9 200,8"
              fill="none"
              stroke="url(#saas-line-grad)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Action row */}
        <div className="flex items-center gap-1.5">
          <span
            className="rounded bg-forest text-white px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em]"
            style={{ fontWeight: 500 }}
          >
            + New project
          </span>
          <span className="rounded border border-line bg-surface px-2 py-1 font-mono text-[8.5px] uppercase tracking-[0.12em] text-ink-muted">
            Invite team
          </span>
        </div>
      </section>
    </div>
  );
}

export default SaasMockup;
