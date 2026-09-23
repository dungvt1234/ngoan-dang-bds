import type { Metadata } from "next";
import { ServiceTemplate } from "@/components/templates/ServiceTemplate";

export const metadata: Metadata = {
  title: "Dịch vụ — Ngoan Đặng",
};

export default function DichVuPage() {
  return <ServiceTemplate />;
}
