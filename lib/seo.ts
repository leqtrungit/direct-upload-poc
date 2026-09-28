import type { Metadata, Viewport } from "next";
import type { Lang } from "@/lib/copy";
import { siteConfig } from "@/lib/config";
import { localizeHref } from "@/lib/i18n";

/** `viPath` is the canonical path, as in `localizeHref` — e.g. "/", "/blog", "/blog/slug". */
export function absoluteUrl(lang: Lang, viPath: string): string {
  const path = localizeHref(lang, viPath);
  return `${siteConfig.url}${path === "/" ? "" : path}`;
}

/**
 * The fields every page shares regardless of locale. Each root layout spreads
 * this in and adds its own localized `title`; each page then layers on its
 * own title/description/canonical via `buildPageMetadata`.
 */
export const baseMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.name, url: siteConfig.url }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export const siteViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0c0c0d" },
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
  ],
};

type PageMetadataInput = {
  lang: Lang;
  /** Canonical (Vietnamese-rooted) path this page lives at — see `localizeHref`. */
  path: string;
  title: string;
  description: string;
  type?: "website" | "article";
  /** ISO date, only meaningful when `type` is "article". */
  publishedTime?: string;
};

/**
 * Builds the per-page slice of metadata: a self-canonical URL, hreflang
 * alternates for both locales (plus `x-default` pointing at the Vietnamese
 * original, since that is the site's primary language), and matching
 * OpenGraph/Twitter cards in the page's own locale.
 */
export function buildPageMetadata({
  lang,
  path,
  title,
  description,
  type = "website",
  publishedTime,
}: PageMetadataInput): Metadata {
  const url = absoluteUrl(lang, path);
  const viUrl = absoluteUrl("vi", path);
  const enUrl = absoluteUrl("en", path);
  const fullTitle = `${title} — ${siteConfig.name}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: { vi: viUrl, en: enUrl, "x-default": viUrl },
    },
    openGraph: {
      type,
      locale: lang === "vi" ? "vi_VN" : "en_US",
      url,
      siteName: siteConfig.name,
      title: fullTitle,
      description,
      ...(type === "article" && publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    },
  };
}
