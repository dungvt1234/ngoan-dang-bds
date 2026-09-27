import type { Article, Comparison, Project } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { absoluteUrl, SITE_NAME } from "@/lib/site";

// JSON-LD builders — render ở page level (Server Component), không đụng
// template skeleton. Mỗi builder trả object thuần để <JsonLd> stringify.

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const person = {
  "@type": "Person",
  name: SITE_NAME,
  url: absoluteUrl("/ve-ngoan"),
};

const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  url: absoluteUrl("/"),
};

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: absoluteUrl(it.path),
    })),
  };
}

export function projectJsonLd(p: Project) {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateListing",
    name: p.name,
    description: p.overview ?? `${p.name} — ${p.location_label}`,
    url: absoluteUrl(`/du-an/${p.slug}`),
    ...(p.cover ? { image: absoluteUrl(p.cover) } : {}),
    address: {
      "@type": "PostalAddress",
      addressLocality: p.location_label,
      addressRegion: "Bà Rịa - Vũng Tàu",
      addressCountry: "VN",
    },
    datePosted: p.published_at,
  };
}

export function projectFaqJsonLd(p: Project) {
  if (!p.faq || p.faq.length === 0) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: p.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function articleJsonLd(a: Article | Comparison) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.excerpt,
    url: absoluteUrl(contentPath(a.type, a.slug)),
    ...(a.cover ? { image: absoluteUrl(a.cover) } : {}),
    datePublished: a.published_at,
    dateModified: a.updated_at,
    author: person,
    publisher,
    inLanguage: "vi",
  };
}
