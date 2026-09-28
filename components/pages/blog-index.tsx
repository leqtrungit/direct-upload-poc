import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { SkipLink } from "@/components/skip-link";
import { BlogIndex } from "@/components/sections/blog-index";
import { BlogIndexHeader } from "@/components/sections/blog-index-header";
import { getAllPosts } from "@/lib/posts";

/** Shared shell for `/blog` and `/en/blog` — locale comes from route-scoped context. */
export function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <>
      <SkipLink />
      <Header />
      <main id="top" className="mx-auto max-w-[1160px] px-6">
        <BlogIndexHeader />

        <div className="mt-6 pb-20">
          <BlogIndex posts={posts} />
        </div>

        <Footer />
      </main>
    </>
  );
}
