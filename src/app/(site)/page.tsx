import type { Metadata } from "next";
import { getAllArticles, getAllComparisons, getFeaturedProjects } from "@/lib/content";
import { HomeTemplate } from "@/components/templates/HomeTemplate";

export const metadata: Metadata = {
  title: "Ngoan Đặng — BĐS dự án Vũng Tàu",
};

// Route / — Page orchestration: query loader → truyền typed props xuống template.
// Không markup, không hard-code data.
export default async function HomePage() {
  const projects = await getFeaturedProjects(4);
  const [articles, comparisons] = await Promise.all([getAllArticles(), getAllComparisons()]);
  return <HomeTemplate projects={projects} articles={[...articles, ...comparisons].slice(0, 4)} />;
}
