import Link from "next/link";
import type { Comparison, Project } from "@/types/content";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

// ComparisonDetail V1 — skeleton đúng flow Phase 4.2 D.
// Không score, không ranking — verdict theo persona.
export function ComparisonDetail({
  comparison,
  projects,
}: {
  comparison: Comparison;
  projects: Project[];
}) {
  const c = comparison;
  const bySlug = new Map(projects.map((p) => [p.slug, p]));

  return (
    <div className="section-pad">
      <Container width="detail">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "So sánh", href: "/so-sanh" },
            { label: c.title },
          ]}
        />

        <Reveal>
        <p className="type-kicker text-accent mt-8 mb-4">ComparisonHero (placeholder)</p>
        <h1 className="type-h1 mb-4">{c.title}</h1>
        <p className="type-body text-secondary mb-10">{c.excerpt}</p>
        </Reveal>

        <p className="type-kicker text-accent mb-4">Context (placeholder)</p>
        <div
          className="type-body space-y-4 mb-10"
          dangerouslySetInnerHTML={{ __html: c.bodyHtml }}
        />

        <p className="type-kicker text-accent mb-4">CompareTable (skeleton)</p>
        <div className="overflow-x-auto mb-10">
          <table className="w-full type-small min-w-[480px]">
            <thead>
              <tr className="border-b border-soft text-left">
                <th className="py-3 pr-4 font-medium text-secondary">Tiêu chí</th>
                {c.projects.map((slug) => (
                  <th key={slug} className="py-3 pr-4 font-medium">
                    {bySlug.get(slug)?.name ?? slug}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.comparison.rows.map((row) => (
                <tr key={row.criterion} className="border-b border-soft">
                  <td className="py-3 pr-4 text-secondary">{row.criterion}</td>
                  {row.options.map((opt, i) => (
                    <td key={i} className="py-3 pr-4">
                      {opt}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="type-kicker text-accent mb-4">CriteriaAnalysis (placeholder — phase UI)</p>

        <p className="type-kicker text-accent mb-4">PersonaSuitability (skeleton)</p>
        <div className="space-y-4 mb-10">
          {c.comparison.verdicts.map((v) => (
            <div key={v.persona} className="border border-soft rounded-2xl p-6 bg-clean">
              <h2 className="type-h3 mb-2">{v.persona}</h2>
              <p className="type-body text-secondary">{v.text}</p>
            </div>
          ))}
        </div>

        {c.sources.length > 0 && (
          <section className="mb-10">
            <p className="type-kicker text-accent mb-4">Sources</p>
            <ul className="space-y-2">
              {c.sources.map((s) => (
                <li key={s.label} className="type-small text-secondary">
                  {s.label} ({s.noted_at})
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="flex flex-wrap gap-3 mb-10">
          {c.projects.map((slug) => (
            <Link
              key={slug}
              href={`/du-an/${slug}`}
              className="type-small underline decoration-accent decoration-2 underline-offset-4"
            >
              Xem {bySlug.get(slug)?.name ?? slug}
            </Link>
          ))}
        </div>

        <p className="type-kicker text-accent">CTA (placeholder — phase UI)</p>
      </Container>
    </div>
  );
}
