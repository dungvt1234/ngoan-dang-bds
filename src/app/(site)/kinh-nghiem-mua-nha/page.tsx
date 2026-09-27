import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { KinhNghiemListing } from "@/components/templates/KinhNghiemListing";

export const metadata: Metadata = {
  title: "Kinh nghiệm mua nhà — Ngoan Đặng",
  description:
    "Lộ trình mua nhà lần đầu tại Vũng Tàu: ngân sách, pháp lý, giá/m², đi xem thực tế và xuống tiền an toàn — nội dung chọn lọc từ Ngoan Đặng.",
  alternates: { canonical: "/kinh-nghiem-mua-nha" },
};

// Trang curated: dùng kho bài kiến thức nhưng trình bày theo hành trình
// người mua lần đầu (khác /kien-thuc là thư viện tổng hợp).
export default async function KinhNghiemPage() {
  const articles = await getArticlesByType("knowledge");
  const sorted = [...articles].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  return <KinhNghiemListing articles={sorted} />;
}
