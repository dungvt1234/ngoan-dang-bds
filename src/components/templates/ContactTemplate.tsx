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
            lede="Điền form — tin nhắn chuyển thẳng tới Zalo Ngoan."
          />
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <Reveal>
          <div>
            <h2 className="type-h3 mb-4">Kênh liên hệ</h2>
            <ul className="space-y-3 type-body text-secondary">
              <li>
                <a href="tel:+84906477923" className="font-medium text-primary hover:text-accent-hover transition-colors">
                  Điện thoại/Zalo: 0906 477 923
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/ngoan.dang.739"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary hover:text-accent-hover transition-colors"
                >
                  Messenger: Ngoan Đặng
                </a>
              </li>
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
