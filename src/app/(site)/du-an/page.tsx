import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectListing } from "@/components/templates/ProjectListing";

export const metadata: Metadata = {
  title: "Dự án — Ngoan Đặng",
};

export default async function DuAnPage() {
  const projects = await getAllProjects();
  return <ProjectListing projects={projects} />;
}
