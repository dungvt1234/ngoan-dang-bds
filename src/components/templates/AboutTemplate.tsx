import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

// AboutTemplate V1 — placeholder theo flow Phase 4.2 F.
// Không bịa bio/kinh nghiệm thật của Ngoan — content thật do chủ site cung cấp ở phase content.
const BLOCKS = [
  { kicker: "Person", title: "Ngoan là ai (placeholder)" },
  { kicker: "Experience", title: "Mốc kinh nghiệm (placeholder)" },
  { kicker: "Method", title: "Phương pháp tư vấn (placeholder)" },
  { kicker: "Point of View", title: "Quan điểm (placeholder)" },
  { kicker: "Evidence", title: "Bằng chứng / case (placeholder)" },
  { kicker: "Contact", title: "Liên hệ (placeholder)" },
];

export function AboutTemplate() {
  return (
    <div className="section-pad">
      <Container width="detail">
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Về Ngoan" }]} />
        <div className="mt-8 space-y-16">
          {BLOCKS.map((b, i) => (
            <Reveal key={b.kicker} delay={Math.min(i, 3) * 80}>
            <section>
              <SectionHeading kicker={b.kicker} title={b.title} />
            </section>
            </Reveal>
          ))}
        </div>
      </Container>
    </div>
  );
}
