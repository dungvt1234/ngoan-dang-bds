import type { Article, Comparison, Project } from "@/types/content";
import { HomeProjectHero } from "@/components/home/HomeProjectHero";
import { HomeTrust } from "@/components/home/HomeTrust";
import { Marquee } from "@/components/Marquee";
import { HomeSegments } from "@/components/home/HomeSegments";
import { PropertyGrid } from "@/components/PropertyGrid";
import { HomeKnowledge, type KnowledgeItem } from "@/components/home/HomeKnowledge";
import { HomeNews } from "@/components/home/HomeNews";
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
  news,
}: {
  projects: Project[];
  articles: (Article | Comparison)[];
  news: Article[];
}) {
  return (
    <>
      <HomeProjectHero projects={projects} />
      <HomeTrust />
      <Marquee />
      <HomeSegments />
      <PropertyGrid projects={projects} />
      <HomeKnowledge items={toKnowledgeItems(articles)} />
      <HomeNews items={news} />
      <HomeAbout />
      <CTA />
    </>
  );
}
