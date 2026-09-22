import type { Project } from "@/types/content";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { ProjectFilter } from "./ProjectFilter";

// Phase A — Listing skeleton: header + count + grid cơ bản từ loader.
// Phase B thêm filter, Phase C hoàn thiện card.
export function ProjectListing({ projects }: { projects: Project[] }) {
  return (
    <div className="bg-page">
      <div className="section-pad">
        <Container>
          <Reveal>
            <p className="type-kicker text-secondary mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="inline-block w-8 h-px bg-accent" />
              Dự án
            </p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
              <div className="max-w-[640px]">
                <h1 className="font-display text-primary font-semibold text-[2.5rem] md:text-[3.25rem] leading-tight mb-4">
                  Bất động sản Vũng Tàu
                </h1>
                <p className="type-body text-secondary">
                  Tổng hợp thông tin dự án, pháp lý, tiến độ và góc nhìn phân tích
                  để bạn có cái nhìn toàn diện trước khi quyết định.
                </p>
              </div>
              <p className="flex items-baseline gap-3 shrink-0">
                <span className="font-display text-5xl text-primary">{projects.length}</span>
                <span className="type-kicker text-muted">Dự án<br />đang theo dõi</span>
              </p>
            </div>
          </Reveal>
          <ProjectFilter projects={projects} />
        </Container>
      </div>
    </div>
  );
}
