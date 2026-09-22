import type { Metadata } from "next";
import { ContactTemplate } from "@/components/templates/ContactTemplate";

export const metadata: Metadata = {
  title: "Liên hệ — Ngoan Đặng",
};

export default function LienHePage() {
  return <ContactTemplate />;
}
