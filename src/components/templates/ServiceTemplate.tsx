import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

// Trang Dịch vụ — giới thiệu khung dịch vụ chung, chi tiết + phí (nếu có)
// trao đổi trực tiếp khi tư vấn. Không bịa cam kết lợi nhuận.
const SERVICES = [
  {
    id: "mua-de-o",
    no: "01",
    title: "Tư vấn mua để ở",
    description:
      "Cùng bạn xác định nhu cầu ở thực: vị trí đi làm, trường học, tiện ích — rồi rà soát từng dự án phù hợp về pháp lý, giá và tiến độ trước khi xuống tiền.",
  },
  {
    id: "dau-tu",
    no: "02",
    title: "Tư vấn đầu tư",
    description:
      "Phân tích dòng tiền cho thuê, tiềm năng tăng giá và rủi ro thanh khoản theo từng phân khúc Vũng Tàu — nói rõ cả mặt chưa tốt, không chỉ mặt sáng.",
  },
  {
    id: "kiem-chung",
    no: "03",
    title: "Kiểm chứng & đồng hành giao dịch",
    description:
      "Đọc kỹ hợp đồng mua bán, checklist pháp lý từng đợt đóng tiền và đồng hành tới lúc nhận nhà — để không có điều khoản nào bị bỏ sót.",
  },
  {
    id: "cho-thue",
    no: "04",
    title: "Tư vấn cho thuê",
    description:
      "Đánh giá tiềm năng cho thuê theo khu vực và phân khúc Vũng Tàu: giá thuê hợp lý, đối tượng khách thuê và những điểm cần làm rõ trước khi ký hợp đồng.",
  },
];

export function ServiceTemplate() {
  return (
    <div className="bg-page">
      <div className="section-pad">
        <Container>
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Dịch vụ" }]} />
          <div className="mt-8 mb-14">
            <Reveal>
              <SectionHeading
                kicker="Dịch vụ"
                title="Ngoan hỗ trợ bạn những gì"
                lede="Khung dịch vụ chung — phạm vi và chi phí cụ thể trao đổi trực tiếp khi tư vấn, tùy từng trường hợp."
              />
            </Reveal>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {SERVICES.map((s, i) => (
              <Reveal key={s.no} delay={i * 100}>
                <div id={s.id} className="bg-clean border border-soft rounded-2xl p-7 h-full scroll-mt-28">
                  <p className="font-display text-lg text-accent-hover mb-3">{s.no}</p>
                  <h2 className="type-h3 text-primary mb-3">{s.title}</h2>
                  <p className="type-small text-secondary leading-relaxed">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <div className="flex flex-col sm:flex-row items-center gap-4 rounded-2xl bg-ink text-ondark p-8">
              <p className="type-body flex-1">
                Kể Ngoan nghe nhu cầu của bạn — tư vấn bước đầu miễn phí.
              </p>
              <Link
                href="/lien-he"
                className="inline-flex min-h-[48px] items-center px-7 rounded-md bg-accent text-ink font-medium hover:bg-accent-hover transition-colors shrink-0"
              >
                Liên hệ tư vấn →
              </Link>
            </div>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}
