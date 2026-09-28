import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { translate } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  lang: "vi",
  path: "/",
  title: `Harnix — ${translate("vi", "heroH1")}`,
  description: translate("vi", "heroSub"),
});

export default function Page() {
  return <HomePage lang="vi" />;
}
