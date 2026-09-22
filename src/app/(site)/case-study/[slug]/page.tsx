import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByType, getArticleBySlug, getRelatedProjects } from "@/lib/content";
import { ArticleDetail } from "@/components/templates/ArticleDetail";

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
  return { title: article ? `${article.title} — Ngoan Đặng` : "Case Study — Ngoan Đặng" };
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
  return <ArticleDetail article={article} relatedProjects={relatedProjects} variant="case-study" />;
}
