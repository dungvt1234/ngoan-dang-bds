import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Case Study — Ngoan Đặng",
};

export default async function CaseStudyPage() {
  const articles = await getArticlesByType("case-study");
  return <ArticleListing type="case-study" articles={articles} />;
}
