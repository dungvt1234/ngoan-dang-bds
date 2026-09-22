import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getArticlesByType, getArticleBySlug, getRelatedProjects } from "@/lib/content";
import { ArticleDetail } from "@/components/templates/ArticleDetail";

export async function generateStaticParams() {
  const articles = await getArticlesByType("analysis");
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug("analysis", slug);
  return { title: article ? `${article.title} — Ngoan Đặng` : "Phân tích — Ngoan Đặng" };
}

export default async function PhanTichDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getArticleBySlug("analysis", slug);
  if (!article) notFound();
  const relatedProjects = await getRelatedProjects(slug);
  return <ArticleDetail article={article} relatedProjects={relatedProjects} variant="analysis" />;
}
