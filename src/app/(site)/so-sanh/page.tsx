import type { Metadata } from "next";
import { getAllComparisons } from "@/lib/content";
import { ComparisonListing } from "@/components/templates/ComparisonListing";

export const metadata: Metadata = {
  title: "So sánh",
  description: "So sánh các dự án BĐS Vũng Tàu theo tiêu chí pháp lý, giá, vị trí và đối tượng phù hợp.",
  alternates: { canonical: "/so-sanh" },
};

export default async function SoSanhPage() {
  const comparisons = await getAllComparisons();
  return <ComparisonListing comparisons={comparisons} />;
}
