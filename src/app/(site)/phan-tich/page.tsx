import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Phân tích — Ngoan Đặng",
};

export default async function PhanTichPage() {
  const articles = await getArticlesByType("analysis");
  return <ArticleListing type="analysis" articles={articles} />;
}
