import type { Metadata } from "next";
import { BlogPostPage } from "@/components/pages/blog-post";
import { getAllSlugs, getPost } from "@/lib/posts";
import { buildPageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const result = getPost(slug, "en");
  if (!result) return {};

  return buildPageMetadata({
    lang: "en",
    path: `/blog/${slug}`,
    title: result.title,
    description: result.excerpt,
    type: "article",
    publishedTime: result.post.date,
  });
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  return <BlogPostPage lang="en" slug={slug} />;
}
