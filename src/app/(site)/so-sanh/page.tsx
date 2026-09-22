import type { Metadata } from "next";
import { getAllComparisons } from "@/lib/content";
import { ComparisonListing } from "@/components/templates/ComparisonListing";

export const metadata: Metadata = {
  title: "So sánh — Ngoan Đặng",
};

export default async function SoSanhPage() {
  const comparisons = await getAllComparisons();
  return <ComparisonListing comparisons={comparisons} />;
}
