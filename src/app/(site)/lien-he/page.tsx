import type { Metadata } from "next";
import { ContactTemplate } from "@/components/templates/ContactTemplate";

export const metadata: Metadata = {
  title: "Liên hệ — Ngoan Đặng",
  description:
    "Liên hệ Ngoan Đặng qua Zalo 0906 477 923, điện thoại hay Messenger — tư vấn BĐS Vũng Tàu miễn phí, phản hồi trong 24 giờ.",
  alternates: { canonical: "/lien-he" },
};

export default function LienHePage() {
  return <ContactTemplate />;
}
