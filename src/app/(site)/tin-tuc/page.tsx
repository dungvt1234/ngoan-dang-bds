import type { Metadata } from "next";
import { getArticlesByType } from "@/lib/content";
import { TinTucListing } from "@/components/templates/TinTucListing";

export const metadata: Metadata = {
  title: "Tin tức & Sự kiện",
  description: "Tin tức, sự kiện và cập nhật thị trường BĐS dự án Vũng Tàu từ Ngoan Đặng.",
  alternates: { canonical: "/tin-tuc" },
};

export default async function TinTucPage() {
  const articles = await getArticlesByType("tin-tuc");
  return <TinTucListing articles={articles} />;
}
