import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Kiến thức",
  description: "Kiến thức pháp lý, giá cả, tài chính và kinh nghiệm mua bất động sản dự án tại Vũng Tàu.",
  alternates: { canonical: "/kien-thuc" },
};

export default async function KienThucPage() {
  const articles = await getArticlesByType("knowledge");
  return <ArticleListing type="knowledge" articles={articles} />;
}
