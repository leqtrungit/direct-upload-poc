"use client";

import { Logo } from "@/components/logo";
import { MobileMenu } from "@/components/mobile-menu";
import { useSite } from "@/components/providers";
import { LangToggle, ThemeToggle } from "@/components/toggles";
import type { CopyKey } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

/** Canonical (vi-rooted) hrefs — localized per-render against the active locale. */
const NAV: { href: string; key: CopyKey }[] = [
  { href: "/#how", key: "navHow" },
  { href: "/#demo", key: "navDemo" },
  { href: "/#dev", key: "navDev" },
  { href: "/blog", key: "navBlog" },
  { href: "/#faq", key: "navFaq" },
];

/**
 * One row at every width. Below 880px — measured as the narrowest width where
 * the full nav still fits on a single line — the links and the toggles move
 * into a slide-over panel, leaving the bar as logo, CTA and the menu button.
 */
export function Header() {
  const { t, lang } = useSite();
  const nav = NAV.map(({ href, key }) => ({ href: localizeHref(lang, href), key }));

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-[color-mix(in_oklab,var(--bg)_88%,transparent)] backdrop-blur-[10px]">
      <div className="mx-auto flex max-w-[1160px] items-center gap-2 px-6 py-[9px] nav:flex-wrap nav:gap-[18px] nav:py-3">
        <a
          href={localizeHref(lang, "/#top")}
          className="flex shrink-0 items-center gap-[9px] text-text no-underline"
        >
          <Logo markSize={26} wordSize={20} gap={1} />
        </a>

        <nav className="ml-3 hidden flex-1 flex-wrap items-center gap-1 nav:flex">
          {nav.map(({ href, key }) => (
            <a
              key={href}
              href={href}
              className="rounded-lg px-[10px] py-[7px] text-[14.5px] text-text2 no-underline hover:bg-surface2 hover:text-text"
            >
              {t(key)}
            </a>
          ))}
        </nav>

        {/* Pushes the actions right while the nav is collapsed. */}
        <div className="flex-1 nav:hidden" />

        <div className="flex items-center gap-2">
          <div className="hidden nav:flex">
            <LangToggle />
          </div>
          <div className="hidden nav:block">
            <ThemeToggle size={34} />
          </div>
          <a
            href={localizeHref(lang, "/#waitlist")}
            className="rounded-lg bg-accent px-[15px] py-[9px] text-sm font-semibold whitespace-nowrap text-accent-ink no-underline"
          >
            <span className="xs:hidden">{t("ctaJoinShort")}</span>
            <span className="hidden xs:inline">{t("ctaJoin")}</span>
          </a>
          <MobileMenu items={nav} />
        </div>
      </div>
    </header>
  );
}
