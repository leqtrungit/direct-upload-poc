import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { mdxComponents } from "@/components/mdx-components";
import { SkipLink } from "@/components/skip-link";
import { PostBody } from "@/components/sections/post-body";
import { PostHeader } from "@/components/sections/post-header";
import type { Lang } from "@/lib/copy";
import { getPost } from "@/lib/posts";

/** Shared shell for `/blog/[slug]` and `/en/blog/[slug]` — `getPost` resolves the right-language title/body, with a vi fallback baked in. */
export function BlogPostPage({ lang, slug }: { lang: Lang; slug: string }) {
  const result = getPost(slug, lang);
  if (!result) notFound();

  const { post, title, body, hasTranslation } = result;

  return (
    <>
      <SkipLink />
      <Header />
      <main id="top" className="mx-auto max-w-[1160px] px-6">
        <div className="mx-auto max-w-[680px] pb-24 pt-6">
          <PostHeader post={post} title={title} viOnly={!hasTranslation} />
          <PostBody>
            <MDXRemote source={body} components={mdxComponents} />
          </PostBody>
        </div>

        <Footer />
      </main>
    </>
  );
}
