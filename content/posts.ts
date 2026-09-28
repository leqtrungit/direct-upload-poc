import type { Lang } from "@/lib/copy";

export type Post = {
  slug: string;
  /** ISO date — formatted for display at render time. */
  date: string;
  readingMinutes: number;
  /** Vietnamese, the language the posts are written in. */
  title: string;
  excerpt: string;
  url: string;
  /**
   * English rendering of the card. A post without it keeps its Vietnamese
   * title and excerpt in English mode rather than showing nothing — the post
   * itself is still Vietnamese, so that is the honest fallback.
   */
  en?: { title: string; excerpt: string };
};

export function postCopy(post: Post, lang: Lang) {
  if (lang === "en" && post.en) return post.en;
  return { title: post.title, excerpt: post.excerpt };
}
