import Link from "next/link";
import type { Article, Comparison, Project } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

// ProjectDetail V1 — skeleton 8 blocks đúng Phase 3C, nhận typed Project.
// Không đọc Markdown, không query. Related do page truyền vào.
function Block({
  index,
  name,
  fields,
  children,
}: {
  index: number;
  name: string;
  fields: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-t border-soft py-10">
      <Reveal>
      <p className="type-kicker text-accent mb-2">
        Block {index} — {name}
      </p>
      <p className="type-caption text-muted mb-6">Fields: {fields}</p>
      {children}
      </Reveal>
    </section>
  );
}

export function ProjectDetail({
  project,
  related,
}: {
  project: Project;
  related: (Article | Comparison)[];
}) {
  const p = project;
  return (
    <div className="section-pad">
      <Container width="detail">
        <Breadcrumb
          items={[
            { label: "Trang chủ", href: "/" },
            { label: "Dự án", href: "/du-an" },
            { label: p.name },
          ]}
        />

        <Block index={1} name="ProjectHero" fields="name, location_label, price_range_text, legal_status, status, verdict">
          <h1 className="type-h1 mb-4">{p.name}</h1>
          <p className="type-body text-secondary mb-4">{p.location_label}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge tone="info">{p.segment}</Badge>
            <Badge tone="neutral">{p.status}</Badge>
            {p.legal_status && (
              <Badge tone={p.legal_status === "ro-rang" ? "ok" : p.legal_status === "dang-hoan-thien" ? "warn" : "risk"}>
                {p.legal_status}
              </Badge>
            )}
          </div>
          {p.price_range_text && <p className="type-h3">{p.price_range_text}</p>}
          {p.ngoan_view_verdict && (
            <blockquote className="type-body mt-4 border-l-2 border-accent pl-4">
              {p.ngoan_view_verdict}
            </blockquote>
          )}
        </Block>

        <Block index={2} name="ProjectOverview" fields="overview">
          {p.overview ? (
            <p className="type-body whitespace-pre-line">{p.overview}</p>
          ) : (
            <p className="type-small text-muted">Tier {p.tier} — chưa có overview.</p>
          )}
        </Block>

        <Block index={3} name="ProjectPlace" fields="location_text, landmarks, map, developer">
          {p.location_text && <p className="type-body whitespace-pre-line">{p.location_text}</p>}
          {p.developer_name && <p className="type-small mt-4">Chủ đầu tư: {p.developer_name}</p>}
          {p.developer_track_record && (
            <p className="type-small text-secondary mt-2 whitespace-pre-line">{p.developer_track_record}</p>
          )}
        </Block>

        <Block index={4} name="ProjectMoney" fields="price_table, price_note, payment">
          {p.price_table && (
            <table className="w-full type-small">
              <tbody>
                {p.price_table.map((row) => (
                  <tr key={row.label} className="border-b border-soft">
                    <td className="py-2 pr-4 text-secondary">{row.label}</td>
                    <td className="py-2 font-medium">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {p.payment_text && <p className="type-body mt-4 whitespace-pre-line">{p.payment_text}</p>}
        </Block>

        <Block index={5} name="ProjectTrust" fields="legal, progress">
          {p.legal && <p className="type-body whitespace-pre-line">{p.legal}</p>}
          {p.progress_text && <p className="type-body mt-4 whitespace-pre-line">{p.progress_text}</p>}
        </Block>

        <Block index={6} name="ProjectProduct" fields="product_text, unit_types">
          {p.product_text && <p className="type-body whitespace-pre-line">{p.product_text}</p>}
        </Block>

        <Block index={7} name="ProjectVerdict" fields="investment, ngoan_view">
          {p.investment && <p className="type-body whitespace-pre-line">{p.investment}</p>}
          {p.ngoan_view_body && <p className="type-body mt-4 whitespace-pre-line">{p.ngoan_view_body}</p>}
        </Block>

        <Block index={8} name="ProjectClosing" fields="faq, related, CTA">
          {p.faq && (
            <div className="space-y-4 mb-8">
              {p.faq.map((f) => (
                <details key={f.q}>
                  <summary className="type-h3 cursor-pointer">{f.q}</summary>
                  <p className="type-body text-secondary mt-2">{f.a}</p>
                </details>
              ))}
            </div>
          )}
          <h2 className="type-h3 mb-4">Nội dung liên quan</h2>
          {related.length === 0 ? (
            <p className="type-small text-muted">Chưa có nội dung liên quan.</p>
          ) : (
            <ul className="space-y-2">
              {related.map((r) => (
                <li key={`${r.type}-${r.slug}`}>
                  <Link
                    href={contentPath(r.type, r.slug)}
                    className="type-small underline decoration-accent decoration-2 underline-offset-4"
                  >
                    {r.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Block>
      </Container>
    </div>
  );
}
