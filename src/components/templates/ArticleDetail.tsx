import Link from "next/link";
import type { Article, Project } from "@/types/content";
import { contentListingPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Tag } from "@/components/ui/Tag";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

const CRUMBS = {
  knowledge: "Kiến thức",
  analysis: "Phân tích",
  "case-study": "Case Study",
  "tin-tuc": "Tin tức & Sự kiện",
} as const;

// ArticleDetail V1 — skeleton: hero, metadata, TOC placeholder, prose,
// sources, related, CTA placeholder. Variant analysis/case-study thêm block riêng.
export function ArticleDetail({
  article,
  relatedProjects,
  variant = "default",
}: {
  article: Article;
  relatedProjects: Project[];
  variant?: "default" | "analysis" | "case-study";
}) {
  const a = article;
  return (
    <div className="section-pad">
      <Container width="prose">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: CRUMBS[a.type], href: contentListingPath(a.type) },
            { label: a.title },
          ]}
        />

        <Reveal>
        <p className="type-kicker text-accent mt-8 mb-4">ArticleHero (placeholder)</p>
        <h1 className="type-h1 mb-4">{a.title}</h1>
        <p className="type-body text-secondary mb-6">{a.excerpt}</p>
        </Reveal>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          <Badge tone="neutral">{a.type}</Badge>
          {a.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        <p className="type-caption text-muted mb-10">
          Metadata (placeholder) — Ngoan Đặng · Cập nhật: {a.updated_at}
        </p>

        {variant === "analysis" && (
          <aside className="border-l-2 border-accent pl-4 mb-10">
            <p className="type-kicker text-accent mb-2">Verdict box (placeholder — phase UI)</p>
          </aside>
        )}

        <p className="type-kicker text-accent mb-2">TOC (placeholder — phase UI)</p>

        <Reveal>
        <div
          className="type-body space-y-4 mb-10"
          dangerouslySetInnerHTML={{ __html: a.bodyHtml }}
        />
        </Reveal>

        {variant === "case-study" && a.type === "case-study" && (
          <section className="border border-soft rounded-2xl p-6 mb-10 bg-clean">
            <p className="type-kicker text-accent mb-4">CaseBox — Problem → Solution → Result</p>
            <h2 className="type-h3 mb-2">Vấn đề</h2>
            <p className="type-body text-secondary mb-4">{a.case.problem}</p>
            <h2 className="type-h3 mb-2">Giải pháp</h2>
            <p className="type-body text-secondary mb-4">{a.case.solution}</p>
            <h2 className="type-h3 mb-2">Kết quả</h2>
            <p className="type-body text-secondary">{a.case.result}</p>
          </section>
        )}

        {a.sources.length > 0 && (
          <section className="mb-10">
            <p className="type-kicker text-accent mb-4">SourceList (placeholder)</p>
            <ul className="space-y-2">
              {a.sources.map((s) => (
                <li key={s.label} className="type-small text-secondary">
                  {s.label} ({s.noted_at})
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-10">
          <p className="type-kicker text-accent mb-4">RelatedContent (placeholder)</p>
          {relatedProjects.length === 0 ? (
            <p className="type-small text-muted">Chưa có dự án liên quan.</p>
          ) : (
            <ul className="space-y-2">
              {relatedProjects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/du-an/${p.slug}`}
                    className="type-small underline decoration-accent decoration-2 underline-offset-4"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>

        <p className="type-kicker text-accent">CTA (placeholder — phase UI)</p>
      </Container>
    </div>
  );
}
