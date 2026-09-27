import type { MetadataRoute } from "next";
import { getAllProjects, getAllArticles, getAllComparisons } from "@/lib/content";
import { contentPath } from "@/lib/routes";
import { absoluteUrl } from "@/lib/site";

// Dynamic sitemap — tự cập nhật theo content store mỗi build.
// noindex=true (content quyết định) thì không đưa vào sitemap.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, articles, comparisons] = await Promise.all([
    getAllProjects(),
    getAllArticles(),
    getAllComparisons(),
  ]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/du-an"), changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/phan-tich"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/kien-thuc"), changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/kinh-nghiem-mua-nha"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/so-sanh"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/case-study"), changeFrequency: "monthly", priority: 0.7 },
    { url: absoluteUrl("/tin-tuc"), changeFrequency: "weekly", priority: 0.7 },
    { url: absoluteUrl("/dich-vu"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/ve-ngoan"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/lien-he"), changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/chinh-sach-bao-mat"), changeFrequency: "yearly", priority: 0.3 },
  ];

  const projectPages: MetadataRoute.Sitemap = projects
    .filter((p) => !p.noindex)
    .map((p) => ({
      url: absoluteUrl(`/du-an/${p.slug}`),
      lastModified: new Date(p.updated_at),
      changeFrequency: "weekly" as const,
      priority: p.tier === "A" ? 0.9 : p.tier === "B" ? 0.8 : 0.6,
    }));

  const articlePages: MetadataRoute.Sitemap = articles
    .filter((a) => !a.noindex)
    .map((a) => ({
      url: absoluteUrl(contentPath(a.type, a.slug)),
      lastModified: new Date(a.updated_at),
      changeFrequency: "monthly" as const,
      priority: a.type === "knowledge" || a.type === "analysis" ? 0.8 : 0.6,
    }));

  const comparisonPages: MetadataRoute.Sitemap = comparisons
    .filter((c) => !c.noindex)
    .map((c) => ({
      url: absoluteUrl(contentPath("comparison", c.slug)),
      lastModified: new Date(c.updated_at),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...projectPages, ...articlePages, ...comparisonPages];
}
