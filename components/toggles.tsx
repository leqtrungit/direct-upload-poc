"use client";

import { usePathname } from "next/navigation";
import { useSite } from "@/components/providers";
import { MoonIcon, SunIcon } from "@/components/icons";
import { segClass } from "@/components/ui";
import { LANGS } from "@/lib/copy";
import { localizeHref, toViPath } from "@/lib/i18n";

/**
 * Language is fixed per route (see `SiteProviders`), so this switches by
 * navigating to the equivalent URL in the other locale rather than mutating
 * state in place — a blog post's slug is preserved because `toViPath` /
 * `localizeHref` round-trip the full pathname, not just the origin.
 */
export function LangToggle() {
  const { lang, t } = useSite();
  const pathname = usePathname();
  const viPath = toViPath(pathname);

  return (
    <div
      role="group"
      aria-label={t("langLabel")}
      className="flex gap-[2px] rounded-full border border-line2 p-[2px] font-mono text-[10.5px]"
    >
      {LANGS.map((code) => {
        const isActive = lang === code;
        const href = localizeHref(code, viPath);
        return isActive ? (
          <span
            key={code}
            aria-current="true"
            className={`rounded-full px-[9px] py-[4px] ${segClass(true)}`}
          >
            {code.toUpperCase()}
          </span>
        ) : (
          <a
            key={code}
            href={href}
            className={`cursor-pointer rounded-full px-[9px] py-[4px] no-underline ${segClass(false)}`}
          >
            {code.toUpperCase()}
          </a>
        );
      })}
    </div>
  );
}

export function ThemeToggle({ size = 34 }: { size?: number }) {
  const { theme, toggleTheme, t } = useSite();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={t("themeLabel")}
      className="grid cursor-pointer place-items-center rounded-lg border border-line2 bg-transparent text-text2 hover:text-text"
      style={{ width: size, height: size }}
    >
      {theme === "dark" ? (
        <SunIcon size={size > 32 ? 16 : 15} />
      ) : (
        <MoonIcon size={size > 32 ? 16 : 15} />
      )}
    </button>
  );
}
