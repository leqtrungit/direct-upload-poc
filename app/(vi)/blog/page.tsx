import type { Metadata } from "next";
import { BlogIndexPage } from "@/components/pages/blog-index";
import { translate } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  lang: "vi",
  path: "/blog",
  title: translate("vi", "blogIndexTitle"),
  description: translate("vi", "blogIndexSub"),
});

export default function Page() {
  return <BlogIndexPage />;
}
