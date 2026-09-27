import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByType, getArticleBySlug, getRelatedProjects } from "@/lib/content";
import { ArticleDetail } from "@/components/templates/ArticleDetail";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { contentListingPath } from "@/lib/routes";

export async function generateStaticParams() {
  const articles = await getArticlesByType("tin-tuc");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("tin-tuc", slug);
  if (!article) return { title: "Tin tức" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/tin-tuc/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      ...(article.cover ? { images: [{ url: article.cover, alt: article.cover_alt }] } : {}),
    },
    robots: article.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function TinTucDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug("tin-tuc", slug);
  if (!article) notFound();
  const relatedProjects = await getRelatedProjects(slug);
  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Tin tức", path: contentListingPath("tin-tuc") },
          { name: article.title, path: `/tin-tuc/${article.slug}` },
        ])}
      />
      <ArticleDetail article={article} relatedProjects={relatedProjects} />
    </>
  );
}
