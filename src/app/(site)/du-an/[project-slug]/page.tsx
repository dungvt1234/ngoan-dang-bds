import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProjectBySlug, getRelatedContent } from "@/lib/content";
import { ProjectDetail } from "@/components/templates/ProjectDetail";

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
  return { title: project ? `${project.name} — Ngoan Đặng` : "Dự án — Ngoan Đặng" };
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
  return <ProjectDetail project={project} related={related} />;
}
