import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { FloatingDock } from "@/components/FloatingDock";
import { getArticlesByType, getFeaturedProjects } from "@/lib/content";

// Layout chung toàn site (trừ campaign): header + main + footer + dock nổi.
// Header nhận lists cho dropdown (query 1 lần ở đây).
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [projects, analyses, knowledges] = await Promise.all([
    getFeaturedProjects(6),
    getArticlesByType("analysis"),
    getArticlesByType("knowledge"),
  ]);
  return (
    <>
      <SiteHeader
        projects={projects}
        analyses={analyses.slice(0, 5).map((a) => ({ slug: a.slug, title: a.title }))}
        knowledges={knowledges.slice(0, 5).map((a) => ({ slug: a.slug, title: a.title }))}
      />
      {/* Đệm chiều cao header fixed — nếu không, breadcrumb/hero trên
          mobile bị header đè (section-pad mobile chỉ 64px < cao header). */}
      <div aria-hidden="true" className="h-[72px] md:h-[76px]" />
      <main>{children}</main>
      <SiteFooter />
      <FloatingDock />
    </>
  );
}
