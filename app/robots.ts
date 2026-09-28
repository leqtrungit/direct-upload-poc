import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config";

/**
 * The route handlers under /api are data endpoints, not pages — keeping them
 * out of the index avoids JSON showing up in results. Everything else is
 * crawlable; there is nothing gated on this site.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
