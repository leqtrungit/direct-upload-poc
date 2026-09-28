"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircleIcon } from "@/components/icons";
import { useSite } from "@/components/providers";
import { Section, SectionHeading } from "@/components/ui";
import { postCopy, type Post } from "@/content/posts";
import { formatDate, type Lang } from "@/lib/copy";
import { localizeHref } from "@/lib/i18n";

type Status = "loading" | "loaded" | "empty" | "error";

function formatMeta(post: Post, lang: Lang, readingTime: string) {
  const reading = readingTime.replace("{N}", String(post.readingMinutes));
  return `${formatDate(post.date, lang)} · ${reading}`;
}

function Skeletons() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(250px,100%),1fr))] gap-[14px]">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="flex flex-col gap-[10px] rounded-xl border border-line bg-surface p-[18px]"
        >
          <div className="shim h-[10px] w-[40%] animate-shimmer rounded-[3px]" />
          <div className="shim h-4 w-[85%] animate-shimmer rounded" />
          <div className="shim h-3 w-[95%] animate-shimmer rounded-[3px]" />
          <div className="shim h-3 w-[60%] animate-shimmer rounded-[3px]" />
        </div>
      ))}
    </div>
  );
}

/**
 * `initialPosts` is the server's copy of the rows. Seeding with it puts the
 * post titles and excerpts in the first HTML response, where crawlers read
 * them without waiting on a client fetch — the rows are a static module, so
 * the round trip bought nothing. Pass `null` to fetch on mount instead; the
 * loading, empty, error and retry states are identical either way.
 */
export function Blog({ initialPosts = null }: { initialPosts?: Post[] | null }) {
  const { t, lang } = useSite();
  const [status, setStatus] = useState<Status>(() =>
    initialPosts ? (initialPosts.length ? "loaded" : "empty") : "loading",
  );
  const [posts, setPosts] = useState<Post[]>(initialPosts ?? []);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/posts");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { posts?: Post[] } = await res.json();
      const rows = data.posts ?? [];
      setPosts(rows);
      setStatus(rows.length ? "loaded" : "empty");
    } catch {
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    if (initialPosts) return;
    void load();
  }, [initialPosts, load]);

  return (
    <Section id="blog">
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <SectionHeading>{t("blogHead")}</SectionHeading>
        <a href={localizeHref(lang, "/blog")} className="link text-[14.5px]">
          {t("blogLink")}
        </a>
      </div>

      <div className="mt-6" aria-busy={status === "loading"}>
        {status === "loading" && (
          <>
            <span className="sr-only">{t("blogLoadingLabel")}</span>
            <Skeletons />
          </>
        )}

        {status === "loaded" && (
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
        )}

        {status === "empty" && (
          <div className="rounded-xl border border-dashed border-line2 bg-surface p-9 text-center">
            <div className="font-display text-[17px] font-semibold">
              {t("blogEmptyTitle")}
            </div>
            <div className="mt-[6px] text-[14.5px] text-text2">
              {t("blogEmptyBody")}
            </div>
          </div>
        )}

        {status === "error" && (
          <div
            role="alert"
            className="flex flex-wrap items-center gap-3 rounded-xl border border-[color-mix(in_oklab,var(--err)_45%,var(--line))] bg-surface p-6"
          >
            <span className="inline-flex items-center gap-[7px] text-[14.5px] text-err">
              <AlertCircleIcon size={16} />
              {t("blogErrorText")}
            </span>
            <button
              type="button"
              onClick={() => void load()}
              className="cursor-pointer rounded-lg border border-line2 bg-transparent px-[13px] py-2 text-[13.5px] font-semibold text-text"
            >
              {t("retryLabel")}
            </button>
          </div>
        )}
      </div>
    </Section>
  );
}
