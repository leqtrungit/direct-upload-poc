"use client";

import { useSite } from "@/components/providers";
import { postCopy, type Post } from "@/content/posts";
import { formatDate } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

function formatMeta(post: Post, lang: "vi" | "en", readingTime: string) {
  const reading = readingTime.replace("{N}", String(post.readingMinutes));
  return `${formatDate(post.date, lang)} · ${reading}`;
}

/**
 * The full list, unlike the homepage's `Blog` section which only shows the
 * three most recent rows. `posts` is the server's copy, seeded the same way —
 * the titles and excerpts are in the first HTML response.
 */
export function BlogIndex({ posts }: { posts: Post[] }) {
  const { t, lang } = useSite();

  if (posts.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-line2 bg-surface p-9 text-center">
        <div className="font-display text-[17px] font-semibold">
          {t("blogEmptyTitle")}
        </div>
        <div className="mt-[6px] text-[14.5px] text-text2">
          {t("blogEmptyBody")}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-[14px]">
      {posts.map((post) => {
        const { title, excerpt } = postCopy(post, lang);
        return (
          <a
            key={post.slug}
            href={localizeHref(lang, post.url)}
            className="flex flex-col gap-2 rounded-xl border border-line bg-surface p-[18px] text-text no-underline hover:border-line2"
          >
            <div className="font-mono text-[11px] text-text3">
              {formatMeta(post, lang, t("readingTime"))}
            </div>
            <div className="font-display text-[17px] font-semibold tracking-[-0.015em]">
              {title}
            </div>
            <div className="text-sm text-text2">{excerpt}</div>
          </a>
        );
      })}
    </div>
  );
}
