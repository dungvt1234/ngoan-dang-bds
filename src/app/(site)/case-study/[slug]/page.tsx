import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByType, getArticleBySlug, getRelatedProjects } from "@/lib/content";
import { ArticleDetail } from "@/components/templates/ArticleDetail";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { contentListingPath } from "@/lib/routes";

export async function generateStaticParams() {
  const articles = await getArticlesByType("case-study");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("case-study", slug);
  if (!article) return { title: "Case study" };
  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `/case-study/${article.slug}` },
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      ...(article.cover ? { images: [{ url: article.cover, alt: article.cover_alt }] } : {}),
    },
    robots: article.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug("case-study", slug);
  if (!article) notFound();
  const relatedProjects = await getRelatedProjects(slug);
  return (
    <>
      <JsonLd data={articleJsonLd(article)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Case study", path: contentListingPath("case-study") },
          { name: article.title, path: `/case-study/${article.slug}` },
        ])}
      />
      <ArticleDetail article={article} relatedProjects={relatedProjects} variant="case-study" />
    </>
  );
}
