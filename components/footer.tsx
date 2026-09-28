"use client";

import { Logo } from "@/components/logo";
import { useCopy, useSite } from "@/components/providers";
import { LangToggle, ThemeToggle } from "@/components/toggles";
import { siteConfig } from "@/lib/config";
import { localizeHref } from "@/lib/i18n";

function SocialLink({ label, href }: { label: string; href: string }) {
  const t = useCopy();

  if (!href) {
    return (
      <span aria-disabled="true" title={t("linkSoon")} className="text-text3">
        {label}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="link"
      rel="me noopener noreferrer"
      target="_blank"
    >
      {label}
    </a>
  );
}

export function Footer() {
  const { t, lang } = useSite();

  return (
    <footer className="mt-[72px] grid grid-cols-[repeat(auto-fit,minmax(min(200px,100%),1fr))] items-start gap-6 border-t border-line pt-8 pb-12">
      <div>
        <Logo markSize={22} wordSize={18} dotSize={4} dotRadius={1.2} />
        <div className="mt-[10px] max-w-[30ch] text-[13.5px] text-text2">
          {t("footTagline")}
        </div>
        <div className="mt-[14px] font-mono text-[11px] text-text3">
          © {new Date().getFullYear()} {siteConfig.name}
        </div>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <a href={localizeHref(lang, "/blog")} className="link">
          {t("navBlog")}
        </a>
        {siteConfig.docsUrl ? (
          <a href={siteConfig.docsUrl} className="link">
            {t("docsLabel")}
          </a>
        ) : (
          <span className="text-text3">{t("docsSoonLabel")}</span>
        )}
        <a href={localizeHref(lang, "/#partner")} className="link">
          {t("partnerHead")}
        </a>
      </div>

      <div className="flex flex-col gap-2 text-sm">
        <SocialLink label="LinkedIn" href={siteConfig.social.linkedin} />
        <SocialLink label="Facebook" href={siteConfig.social.facebook} />
        <SocialLink label="GitHub" href={siteConfig.social.github} />
        <a
          href={`mailto:${siteConfig.email}`}
          className="link font-mono text-[12.5px]"
        >
          {siteConfig.email}
        </a>
      </div>

      <div className="flex items-center gap-2">
        <LangToggle />
        <ThemeToggle size={32} />
      </div>
    </footer>
  );
}
