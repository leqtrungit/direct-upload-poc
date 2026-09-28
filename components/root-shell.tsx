import type { ReactNode } from "react";
import { JetBrains_Mono, Public_Sans, Space_Grotesk } from "next/font/google";
import { SiteProviders } from "@/components/providers";
import type { Lang } from "@/lib/copy";
import { THEME_STORAGE_KEY } from "@/lib/storage";
import "@/app/globals.css";

const publicSans = Public_Sans({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-public-sans",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin", "vietnamese"],
  weight: ["500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

/**
 * The design specified Azeret Mono, but that face has no Vietnamese coverage —
 * even upstream it maps 2 of the 90 characters in U+1EA0–1EF9 — so every
 * Vietnamese label set in it rendered half in Azeret and half in the system
 * fallback. JetBrains Mono is the nearest geometric substitute that ships the
 * language.
 */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

/**
 * Applies the stored theme before first paint so the page never flashes the
 * wrong palette. Dark is the design's default and stays the default
 * regardless of the OS setting — only an explicit choice here switches it.
 * Language is not read here: it is fixed by which locale's root layout
 * rendered the page, not by a client-side preference.
 */
const bootstrap = `(function(){try{
var d=document.documentElement;
var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});
d.dataset.theme=(t==='light'||t==='dark')?t:'dark';
}catch(e){}})();`;

/**
 * The shared `<html>`/`<body>` shell for both locale root layouts
 * (`app/(vi)/layout.tsx` and `app/en/layout.tsx`). Next.js allows multiple
 * root layouts as long as each lives under its own top-level segment with no
 * shared `app/layout.tsx` above it — that's what lets `<html lang>` differ
 * per locale while the markup itself stays in one place.
 */
export function RootShell({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <html
      lang={lang}
      data-theme="dark"
      className={`${publicSans.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body>
        <script dangerouslySetInnerHTML={{ __html: bootstrap }} />
        <SiteProviders lang={lang}>{children}</SiteProviders>
      </body>
    </html>
  );
}
