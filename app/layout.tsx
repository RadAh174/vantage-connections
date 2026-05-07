import type { Metadata, Viewport } from "next";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/content/site";
import { RouteFade } from "@/components/layout/RouteFade";
import { AtmosphericBackground } from "@/components/layout/AtmosphericBackground";
import { SmoothScroll } from "@/components/layout/SmoothScroll";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://vantageconnections.com"),
  title: {
    default: `${site.brand} — ${site.tagline}`,
    template: `%s — ${site.brand}`,
  },
  description: site.description,
  applicationName: site.brand,
  authors: [{ name: site.brand }],
  openGraph: {
    type: "website",
    siteName: site.brand,
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
    // TODO: add /og-default.png when brand asset is finalized
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.brand} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Don't disable user scaling — accessibility requires it. Browsers
  // ignore `user-scalable=no` for SMB sites since 2023 anyway.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F8F5EE" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0E10" },
  ],
  colorScheme: "light dark",
};

// Inline before-paint script: read localStorage, apply class, no flash.
const themeBootstrap = `
(function() {
  try {
    var stored = localStorage.getItem('theme');
    var systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = stored ? stored : (systemDark ? 'dark' : 'light');
    var root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(resolved);
    root.style.colorScheme = resolved;
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      {/* The atmospheric glow stack lives in <AtmosphericBackground />
          (fixed, -z-10) so the body itself can stay transparent and the
          glows do not scroll with content. See that component for the
          per-glow rgba/blend-mode setup. */}
      <body className="min-h-full flex flex-col text-ink">
        <SmoothScroll />
        <AtmosphericBackground />
        <RouteFade>{children}</RouteFade>
      </body>
    </html>
  );
}
