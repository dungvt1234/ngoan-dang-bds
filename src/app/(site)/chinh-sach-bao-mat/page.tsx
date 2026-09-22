import type { Metadata } from "next";
import { LegalTemplate } from "@/components/templates/LegalTemplate";

export const metadata: Metadata = {
  title: "Chính sách bảo mật — Ngoan Đặng",
};

export default function ChinhSachBaoMatPage() {
  return <LegalTemplate />;
}
