import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Baloo_Da_2 } from "next/font/google";
import { site } from "@/content/site";
import "@/styles/globals.css";

/* The legacy site loaded Baloo Da 2 with a render-blocking @import. Self-hosting
   it through next/font removes that request from the critical path. The family
   covers both Bengali (bn) and Latin, so the identity stays intact. */
const baloo = Baloo_Da_2({
  subsets: ["bengali", "latin"],
  display: "swap",
  variable: "--font-baloo",
  fallback: ["system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: `${site.name} | ইসলামিক কোচিং সেন্টার`,
  description: site.description,
  applicationName: site.name,
  openGraph: {
    title: site.name,
    description: site.description,
    locale: "bn_BD",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1e8449",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    /* Legacy markup declared lang="ban", which is not a valid tag; Bengali is
       "bn". `dir` is set explicitly so the layout is ready for an RTL locale
       without restructuring (see docs/ARCHITECTURE.md §5). */
    <html lang="bn" dir="ltr" className={baloo.variable}>
      <body className="flex min-h-dvh flex-col antialiased">
        <a
          href="#home"
          className="focus:bg-brand-600 sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-[80] focus:rounded-sm focus:px-4 focus:py-2 focus:text-white"
        >
          মূল কনটেন্টে যান
        </a>
        {children}
      </body>
    </html>
  );
}
