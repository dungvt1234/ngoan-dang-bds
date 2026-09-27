import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByType, getArticleBySlug, getRelatedProjects } from "@/lib/content";
import { ArticleDetail } from "@/components/templates/ArticleDetail";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { contentListingPath } from "@/lib/routes";

export async function generateStaticParams() {
  const articles = await getArticlesByType("knowledge");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("knowledge", slug);
  if (!article) return { title: "Kiến thức" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/kien-thuc/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      ...(article.cover ? { images: [{ url: article.cover, alt: article.cover_alt }] } : {}),
    },
    robots: article.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function KienThucDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug("knowledge", slug);
  if (!article) notFound();
  const relatedProjects = await getRelatedProjects(slug);
  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Kiến thức", path: contentListingPath("knowledge") },
          { name: article.title, path: `/kien-thuc/${article.slug}` },
        ])}
      />
      <ArticleDetail article={article} relatedProjects={relatedProjects} />
    </>
  );
}
