import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Phân tích",
  description: "Phân tích độc lập các dự án BĐS Vũng Tàu: vị trí, pháp lý, giá, tiến độ và tiềm năng đầu tư.",
  alternates: { canonical: "/phan-tich" },
};

export default async function PhanTichPage() {
  const articles = await getArticlesByType("analysis");
  return <ArticleListing type="analysis" articles={articles} />;
}
