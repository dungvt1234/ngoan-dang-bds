import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { ArticleListing } from "@/components/templates/ArticleListing";

export const metadata: Metadata = {
  title: "Kinh nghiệm mua nhà — Ngoan Đặng",
};

// Trang curated: dùng kho bài kiến thức, tiêu đề riêng.
export default async function KinhNghiemPage() {
  const articles = await getArticlesByType("knowledge");
  return (
    <ArticleListing
      type="knowledge"
      articles={articles}
      heading={{ kicker: "Mua nhà lần đầu cũng yên tâm", title: "Kinh nghiệm mua nhà" }}
    />
  );
}
