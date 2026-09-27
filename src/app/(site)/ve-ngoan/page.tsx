import type { Metadata } from "next";
import { AboutTemplate } from "@/components/templates/AboutTemplate";

export const metadata: Metadata = {
  title: "Về Ngoan — Ngoan Đặng",
  description:
    "Ngoan Đặng — tư vấn BĐS dự án Vũng Tàu: thông tin trung thực, phân tích độc lập và đồng hành trước, trong, sau khi mua.",
  alternates: { canonical: "/ve-ngoan" },
};

export default function VeNgoanPage() {
  return <AboutTemplate />;
}
