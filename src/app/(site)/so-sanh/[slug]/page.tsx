import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllComparisons, getComparisonBySlug, getProjectBySlug } from "@/lib/content";
import { ComparisonDetail } from "@/components/templates/ComparisonDetail";

export async function generateStaticParams() {
  const comparisons = await getAllComparisons();
  return comparisons.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  return { title: comparison ? `${comparison.title} — Ngoan Đặng` : "So sánh — Ngoan Đặng" };
}

export default async function SoSanhDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();
  const projects = (
    await Promise.all(comparison.projects.map((s) => getProjectBySlug(s)))
  ).filter((p) => p !== undefined);
  return <ComparisonDetail comparison={comparison} projects={projects} />;
}
