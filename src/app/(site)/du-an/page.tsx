import type { Metadata } from "next";
import { getAllProjects } from "@/lib/content";
import { ProjectListing } from "@/components/templates/ProjectListing";

export const metadata: Metadata = {
  title: "Dự án",
  description: "Danh sách dự án BĐS Vũng Tàu được Ngoan Đặng kiểm chứng: căn hộ nghỉ dưỡng, căn hộ để ở, khu đô thị.",
  alternates: { canonical: "/du-an" },
};

export default async function DuAnPage() {
  const projects = await getAllProjects();
  return <ProjectListing projects={projects} />;
}
