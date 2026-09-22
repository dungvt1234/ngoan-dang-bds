import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

// LegalTemplate V1 — prose tĩnh. Nội dung privacy thật do chủ site
// (hoặc tư vấn pháp lý) cung cấp ở phase content — không bịa điều khoản.
export function LegalTemplate() {
  return (
    <div className="section-pad">
      <Container width="prose">
        <Breadcrumb
          items={[{ label: "Trang chủ", href: "/" }, { label: "Chính sách bảo mật" }]}
        />
        <Reveal>
        <h1 className="type-h1 mt-8 mb-6">Chính sách bảo mật (placeholder)</h1>
        <div className="type-body text-secondary space-y-4">
          <p>
            Trang này sẽ trình bày cách website thu thập, sử dụng và bảo vệ
            thông tin liên hệ của khách hàng (form, analytics, marketing).
          </p>
          <p>Nội dung chính thức đang được soạn thảo — không áp dụng cho đến khi thay bằng văn bản thật.</p>
        </div>
        </Reveal>
      </Container>
    </div>
  );
}
