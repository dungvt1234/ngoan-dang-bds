import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactFormSkeleton } from "./ContactFormSkeleton";
import { Reveal } from "@/components/ui/Reveal";

// ContactTemplate V1 — skeleton page, KHÔNG form handler/webhook.
// Form UI placeholder để kiểm tra layout; wiring ở phase sau.
export function ContactTemplate() {
  return (
    <div className="section-pad">
      <Container width="detail">
        <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]} />
        <div className="mt-8 mb-12">
          <Reveal>
          <SectionHeading
            kicker="Liên hệ"
            title="Nói chuyện với Ngoan"
            lede="Kênh liên hệ + form placeholder — handler ở phase sau."
          />
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Reveal>
          <div>
            <h2 className="type-h3 mb-4">Kênh liên hệ (placeholder)</h2>
            <ul className="space-y-2 type-body text-secondary">
              <li>Điện thoại: đang cập nhật</li>
              <li>Zalo: đang cập nhật</li>
            </ul>
          </div>
          </Reveal>
          <Reveal delay={120}>
          <ContactFormSkeleton />
          </Reveal>
        </div>
      </Container>
    </div>
  );
}
