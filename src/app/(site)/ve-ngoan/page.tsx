import type { Metadata } from "next";
import { AboutTemplate } from "@/components/templates/AboutTemplate";

export const metadata: Metadata = {
  title: "Về Ngoan — Ngoan Đặng",
};

export default function VeNgoanPage() {
  return <AboutTemplate />;
}
