import { getFaqs, translate, type Lang } from "@/lib/copy";
import { siteConfig } from "@/lib/config";
import { absoluteUrl } from "@/lib/seo";

/**
 * JSON-LD for the homepage, in the locale it was rendered at. Three graph
 * nodes, cross-referenced by `@id` so crawlers read them as one entity rather
 * than three loose objects:
 *
 * - Organization — who is behind the site, for the knowledge panel. Global,
 *   not locale-scoped: there is one company regardless of which language
 *   page a crawler lands on.
 * - WebSite — the site itself, scoped to this locale's homepage URL.
 * - FAQPage — the accordion further down. The answers are already on the page
 *   in full, which is what makes them eligible; the markup only labels them.
 *
 * Keep `faqs` in `lib/copy.ts` the single source: editing a question there
 * updates both the rendered accordion and this markup.
 */
export function StructuredData({ lang }: { lang: Lang }) {
  const faqs = getFaqs(lang);
  const inLanguage = lang === "vi" ? "vi-VN" : "en-US";
  const pageUrl = absoluteUrl(lang, "/");

  const organizationId = `${siteConfig.url}/#organization`;
  const websiteId = `${pageUrl}/#website`;

  const socials = [
    siteConfig.social.linkedin,
    siteConfig.social.facebook,
    siteConfig.social.github,
  ].filter(Boolean);

  const graph = [
    {
      "@type": "Organization",
      "@id": organizationId,
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      description: translate(lang, "footTagline"),
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/apple-icon`,
        width: 180,
        height: 180,
      },
      ...(socials.length ? { sameAs: socials } : {}),
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: pageUrl,
      name: siteConfig.name,
      inLanguage,
      publisher: { "@id": organizationId },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}/#faq`,
      isPartOf: { "@id": websiteId },
      inLanguage,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // The payload is built from local modules, never user input.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({ "@context": "https://schema.org", "@graph": graph }),
      }}
    />
  );
}
