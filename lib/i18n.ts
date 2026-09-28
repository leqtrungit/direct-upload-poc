import type { Lang } from "@/lib/copy";

/**
 * `viPath` is always the canonical, Vietnamese-rooted path — "/", "/blog",
 * "/blog/some-slug", or a homepage anchor like "/#waitlist". Every link in the
 * app is written against that canonical form and localized at render time, so
 * there is exactly one place that knows the URL scheme for the English tree.
 */
export function localizeHref(lang: Lang, viPath: string): string {
  if (lang === "vi") return viPath;
  if (viPath === "/") return "/en";
  if (viPath.startsWith("/#")) return `/en${viPath.slice(1)}`;
  return `/en${viPath}`;
}

/** Inverse of `localizeHref`: strips a leading "/en" segment, if present. */
export function toViPath(pathname: string): string {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.slice(3);
  return pathname;
}
