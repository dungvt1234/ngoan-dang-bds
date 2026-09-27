import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Case study",
  description: "Câu chuyện thực tế về khách hàng mua BĐS dự án cùng Ngoan Đặng tại Vũng Tàu.",
  alternates: { canonical: "/case-study" },
};

export default async function CaseStudyPage() {
  const articles = await getArticlesByType("case-study");
  return <ArticleListing type="case-study" articles={articles} />;
}
