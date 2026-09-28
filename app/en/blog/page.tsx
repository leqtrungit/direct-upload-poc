import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index";
import { translate } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  lang: "en",
  path: "/blog",
  title: translate("en", "blogIndexTitle"),
  description: translate("en", "blogIndexSub"),
});

export default function Page() {
  return <BlogIndexPage />;
}
