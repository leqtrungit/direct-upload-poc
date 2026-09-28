import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { absoluteUrl } from "@/lib/seo";

/** Every static (non-post) route, as a canonical vi-rooted path. */
const STATIC_PATHS: { path: string; changeFrequency: "weekly" | "daily"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/blog", changeFrequency: "daily", priority: 0.7 },
];

/** Every page, in both locales — landing, blog index, and every post — with matching hreflang alternates. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getAllPosts();

  const entries: MetadataRoute.Sitemap = STATIC_PATHS.flatMap(({ path, changeFrequency, priority }) => {
    const languages = { vi: absoluteUrl("vi", path), en: absoluteUrl("en", path) };
    return [
      { url: languages.vi, lastModified: now, changeFrequency, priority, alternates: { languages } },
      { url: languages.en, lastModified: now, changeFrequency, priority, alternates: { languages } },
    ];
  });

  for (const post of posts) {
    const lastModified = new Date(post.date);
    const languages = { vi: absoluteUrl("vi", post.url), en: absoluteUrl("en", post.url) };
    entries.push(
      {
        url: languages.vi,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages },
      },
      {
        url: languages.en,
        lastModified,
        changeFrequency: "yearly",
        priority: 0.6,
        alternates: { languages },
      },
    );
  }

  return entries;
}
