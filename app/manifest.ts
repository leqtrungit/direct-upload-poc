import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/**
 * Dark background and theme colour match the design's default palette, so an
 * installed shortcut opens on the same ink the site paints with.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — Giao việc cho AI. Nắm từng bước.`,
    short_name: siteConfig.name,
    description:
      "Harnix giúp doanh nghiệp đưa trợ lý AI vào app sẵn có, và thấy rõ từng câu trả lời.",
    lang: "vi",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0c0d",
    theme_color: "#0c0c0d",
    icons: [
      { src: "/icon", sizes: "32x32", type: "image/png" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
