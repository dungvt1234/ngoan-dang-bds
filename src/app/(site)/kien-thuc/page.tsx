import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Kiến thức — Ngoan Đặng",
};

export default async function KienThucPage() {
  const articles = await getArticlesByType("knowledge");
  return <ArticleListing type="knowledge" articles={articles} />;
}
