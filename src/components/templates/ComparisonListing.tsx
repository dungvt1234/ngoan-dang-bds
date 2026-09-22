import Link from "next/link";
import type { Comparison } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

// Listing /so-sanh — template riêng vì Comparison là model tách biệt,
// không ép thành Article (spec E).
export function ComparisonListing({ comparisons }: { comparisons: Comparison[] }) {
  return (
    <div className="section-pad">
      <Container>
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "So sánh" }]} />
        <div className="mt-8 mb-12">
          <Reveal>
          <SectionHeading
            kicker="Hỗ trợ lựa chọn"
            title="So sánh"
            lede="Mỗi bài so sánh trả lời: phương án nào phù hợp với hoàn cảnh nào."
          />
          </Reveal>
        </div>
        {comparisons.length === 0 ? (
          <p className="type-body text-secondary">Chưa có bài so sánh nào.</p>
        ) : (
          <ul className="space-y-8">
            {comparisons.map((c, i) => (
              <li key={c.slug} className="border-b border-soft pb-8">
                <Reveal delay={Math.min(i, 4) * 80}>
                <h2 className="type-h3 mb-2">
                  <Link href={contentPath("comparison", c.slug)} className="hover:text-accent-hover transition-colors">
                    {c.title}
                  </Link>
                </h2>
                <p className="type-small text-secondary">{c.excerpt}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
