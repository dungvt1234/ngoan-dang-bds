import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện — Ngoan Đặng",
};

export default async function TinTucPage() {
  const articles = await getArticlesByType("tin-tuc");
  return <ArticleListing type="tin-tuc" articles={articles} />;
}
