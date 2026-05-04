"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getInitial(): Theme {
  if (typeof window === "undefined") return "light";
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark"))
    return "dark";
  return "light";
}

export function ThemeToggle({ className = "" }: { className?: string }) {
  // Avoid hydration mismatch: don't render the icon until mounted.
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    setMounted(true);
    setTheme(getInitial());
  }, []);

  function apply(next: Theme) {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(next);
    root.style.colorScheme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {
      // ignore storage failure
    }
    setTheme(next);
  }

  function toggle() {
    apply(theme === "dark" ? "light" : "dark");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-full border border-line text-ink hover:text-forest hover:border-forest/40 transition-colors ${className}`}
    >
      {/* Reserve space pre-mount so layout doesn't shift */}
      <span className="block h-4 w-4" aria-hidden="true">
        {mounted && theme === "dark" ? <SunIcon /> : mounted ? <MoonIcon /> : null}
      </span>
    </button>
  );
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-4 w-4"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export default ThemeToggle;
