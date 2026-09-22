import Link from "next/link";
import type { Article, ArticleType } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

const TITLES: Record<ArticleType, { listing: string; kicker: string }> = {
  knowledge: { listing: "Kiến thức", kicker: "Hiểu vấn đề" },
  analysis: { listing: "Phân tích", kicker: "Đánh giá + góc nhìn" },
  "case-study": { listing: "Case Study", kicker: "Tình huống thực tế" },
  "tin-tuc": { listing: "Tin tức & Sự kiện", kicker: "Cập nhật thị trường" },
};

// ArticleListing V1 — 1 template cho 3 loại bài. /so-sanh dùng riêng vì
// Comparison là model tách biệt (không ép thành Article).
export function ArticleListing({ type, articles }: { type: ArticleType; articles: Article[] }) {
  const meta = TITLES[type];
  return (
    <div className="section-pad">
      <Container>
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: meta.listing }]} />
        <div className="mt-8 mb-12">
          <Reveal>
          <SectionHeading kicker={meta.kicker} title={meta.listing} />
          </Reveal>
        </div>
        {articles.length === 0 ? (
          <p className="type-body text-secondary">Chưa có bài viết nào.</p>
        ) : (
          <ul className="space-y-8">
            {articles.map((a, i) => (
              <li key={a.slug} className="border-b border-soft pb-8">
                <Reveal delay={Math.min(i, 4) * 80}>
                <p className="type-kicker text-accent mb-2">{meta.kicker}</p>
                <h2 className="type-h3 mb-2">
                  <Link href={contentPath(a.type, a.slug)} className="hover:text-accent-hover transition-colors">
                    {a.title}
                  </Link>
                </h2>
                <p className="type-small text-secondary">{a.excerpt}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
