import type { Metadata } from "next";
import { getAllArticles, getAllComparisons, getAllProjects } from "@/lib/content";
import { HomeTemplate } from "@/components/templates/HomeTemplate";

export const metadata: Metadata = {
  title: "Ngoan Đặng — BĐS dự án Vũng Tàu",
};

// Route / — Page orchestration: query loader → truyền typed props xuống template.
// Ưu tiên dự án thật (slug không bắt đầu "demo-"), tối đa 4 cho khối traverse.
// Không markup, không hard-code data.
export default async function HomePage() {
  const all = await getAllProjects();
  const real = all.filter((p) => !p.slug.startsWith("demo-"));
  const projects = (real.length > 0 ? real : all).slice(0, 4);
  const [articles, comparisons] = await Promise.all([getAllArticles(), getAllComparisons()]);
  return <HomeTemplate projects={projects} articles={[...articles, ...comparisons].slice(0, 4)} />;
}
