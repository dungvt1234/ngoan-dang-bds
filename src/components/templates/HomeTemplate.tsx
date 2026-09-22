import type { Article, Comparison, Project } from "@/types/content";
import { HomeHero } from "@/components/home/HomeHero";
import { HomeTrust } from "@/components/home/HomeTrust";
import { Marquee } from "@/components/Marquee";
import { HomeSegments } from "@/components/home/HomeSegments";
import { PropertyGrid } from "@/components/PropertyGrid";
import { HomeKnowledge, type KnowledgeItem } from "@/components/home/HomeKnowledge";
import { HomeAbout } from "@/components/home/HomeAbout";
import { CTA } from "@/components/CTA";

function toKnowledgeItems(articles: (Article | Comparison)[]): KnowledgeItem[] {
  return articles.map((a) => ({
    type: a.type,
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    updated_at: a.updated_at,
    cover: a.cover,
    cover_alt: a.cover_alt,
  }));
}

// Homepage phong cách light editorial (theo mẫu đã duyệt).
// Data từ loader qua page boundary — không hard-code, không bịa content.
export function HomeTemplate({
  projects,
  articles,
}: {
  projects: Project[];
  articles: (Article | Comparison)[];
}) {
  return (
    <>
      <HomeHero
        kicker="Ngoan Đặng — BĐS dự án Vũng Tàu"
        headline="Đọc vị dự án trước khi bạn xuống tiền."
        subline="Căn hộ nghỉ dưỡng · Căn hộ để ở · Khu đô thị"
        supporting={["Thông tin thật.", "Phân tích độc lập.", "Quyết định có cơ sở."]}
        primaryCta={{ label: "Xem dự án đang phân tích", href: "/du-an" }}
        secondaryCta={{ label: "Vì sao tin Ngoan?", href: "/ve-ngoan" }}
        image={{
          src: "/images/stock-hero-villa.jpg",
          alt: "Biệt thự hiện đại lên đèn lúc chạng vạng (ảnh tạm)",
          credit: "Ảnh minh họa tạm (Unsplash License)",
        }}
      />
      <HomeTrust />
      <Marquee />
      <HomeSegments />
      <PropertyGrid projects={projects} />
      <HomeKnowledge items={toKnowledgeItems(articles)} />
      <HomeAbout />
      <CTA />
    </>
  );
}
