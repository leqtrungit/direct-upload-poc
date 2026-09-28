"use client";

import { useSite } from "@/components/providers";
import type { Post } from "@/content/posts";
import { formatDate } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

/**
 * `title` and `viOnly` are resolved server-side by `getPost` — this component
 * only owns presentation and the bits that are genuinely route-scoped client
 * state (theme-independent locale copy via `useSite`).
 */
export function PostHeader({
  post,
  title,
  viOnly,
}: {
  post: Post;
  title: string;
  viOnly: boolean;
}) {
  const { t, lang } = useSite();
  const reading = t("readingTime").replace("{N}", String(post.readingMinutes));

  return (
    <header>
      <a href={localizeHref(lang, "/blog")} className="link text-[14.5px]">
        {t("backToBlog")}
      </a>
      <div className="mt-4 font-mono text-[11px] text-text3">
        {formatDate(post.date, lang)} · {reading}
      </div>
      <h1 className="mt-2 font-display text-[clamp(28px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.03em] text-pretty">
        {title}
      </h1>
      {viOnly && (
        <p className="mt-3 text-[13.5px] text-text3">{t("blogViOnlyNote")}</p>
      )}
    </header>
  );
}
