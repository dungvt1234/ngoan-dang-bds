import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, getRelatedContent } from "@/lib/content";
import { ProjectDetail } from "@/components/templates/ProjectDetail";
import { JsonLd, breadcrumbJsonLd, projectFaqJsonLd, projectJsonLd } from "@/lib/jsonld";

export async function generateStaticParams() {
  const projects = await getAllProjects();
  return projects.map((p) => ({ "project-slug": p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ "project-slug": string }>;
}): Promise<Metadata> {
  const { "project-slug": slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Dự án" };
  return {
    title: project.name,
    description: project.overview?.slice(0, 160) || `${project.name} tại ${project.location_label}.`,
    alternates: { canonical: `/du-an/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.name,
      description: project.overview?.slice(0, 200),
      ...(project.cover ? { images: [{ url: project.cover, alt: project.cover_alt }] } : {}),
    },
    robots: project.noindex ? { index: false, follow: false } : undefined,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ "project-slug": string }>;
}) {
  const { "project-slug": slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  const related = await getRelatedContent(slug);
  const faq = projectFaqJsonLd(project);
  return (
    <>
      <JsonLd data={projectJsonLd(project)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Trang chủ", path: "/" },
          { name: "Dự án", path: "/du-an" },
          { name: project.name, path: `/du-an/${project.slug}` },
        ])}
      />
      {faq && <JsonLd data={faq} />}
      <ProjectDetail project={project} related={related} />
    </>
  );
}
