import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllComparisons, getComparisonBySlug, getProjectBySlug } from "@/lib/content";
import { ComparisonDetail } from "@/components/templates/ComparisonDetail";
import { JsonLd, articleJsonLd, breadcrumbJsonLd } from "@/lib/jsonld";
import { contentListingPath } from "@/lib/routes";

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
  if (!comparison) return { title: "So sánh" };
  return {
    title: comparison.title,
    description: comparison.excerpt,
    alternates: { canonical: `/so-sanh/${comparison.slug}` },
    openGraph: {
      type: "article",
      title: comparison.title,
      description: comparison.excerpt,
      ...(comparison.cover ? { images: [{ url: comparison.cover, alt: comparison.cover_alt }] } : {}),
    },
    robots: comparison.noindex ? { index: false, follow: false } : undefined,
  };
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
  return (
    <>
      <JsonLd data={articleJsonLd(comparison)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "So sánh", path: contentListingPath("comparison") },
          { name: comparison.title, path: `/so-sanh/${comparison.slug}` },
        ])}
      />
      <ComparisonDetail comparison={comparison} projects={projects} />
    </>
  );
}
