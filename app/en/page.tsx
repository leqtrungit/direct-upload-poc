import type { Metadata } from "next";
import { HomePage } from "@/components/pages/home";
import { translate } from "@/lib/copy";
import { buildPageMetadata } from "@/lib/seo";

export const metadata: Metadata = buildPageMetadata({
  lang: "en",
  path: "/",
  title: `Harnix — ${translate("en", "heroH1")}`,
  description: translate("en", "heroSub"),
});

export default function Page() {
  return <HomePage lang="en" />;
}
