import Link from "next/link";
import type { Project } from "@/types/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

// ProjectListing V1 — skeleton: lấy từ getAllProjects, không hard-code.
// Card visual hoàn thiện ở phase UI (ProjectCard).
export function ProjectListing({ projects }: { projects: Project[] }) {
  return (
    <div className="section-pad">
      <Container>
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Dự án" }]} />
        <div className="mt-8 mb-12">
          <Reveal>
          <SectionHeading
            kicker="Dự án"
            title="Các dự án đang phân tích"
            lede="Danh sách skeleton — filter theo phân khúc làm ở phase UI."
          />
          </Reveal>
        </div>
        {projects.length === 0 ? (
          <p className="type-body text-secondary">Chưa có dự án nào.</p>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((p) => (
              <li key={p.slug} className="border border-soft rounded-2xl p-6 bg-clean">
                <div className="flex gap-2 mb-4">
                  <Badge tone="info">{p.segment}</Badge>
                  <Badge tone="neutral">{p.status}</Badge>
                </div>
                <h2 className="type-h3 mb-2">
                  <Link href={`/du-an/${p.slug}`} className="hover:text-accent-hover transition-colors">
                    {p.name}
                  </Link>
                </h2>
                <p className="type-small text-secondary">{p.location_label}</p>
                {p.price_range_text && (
                  <p className="type-small text-primary mt-2 font-medium">{p.price_range_text}</p>
                )}
              </li>
            ))}
          </ul>
        )}
      </Container>
    </div>
  );
}
