import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

const ZALO_URL = "https://zalo.me/0906477923";

const FIELDS = [
  {
    title: "Căn hộ nghỉ dưỡng",
    desc: "Đầu tư giá trị — trải nghiệm khác biệt tại Vũng Tàu.",
  },
  {
    title: "Căn hộ để ở",
    desc: "Không gian sống — giá trị bền vững cho gia đình.",
  },
  {
    title: "Khu đô thị",
    desc: "Hạ tầng đồng bộ — tiềm năng dài hạn.",
  },
  {
    title: "Cho thuê",
    desc: "Khai thác dòng tiền — vận hành hiệu quả.",
  },
];

const METHOD = [
  {
    step: "1",
    title: "Lắng nghe nhu cầu",
    desc: "Để ở, đầu tư hay nghỉ dưỡng? Ngân sách và khung thời gian của bạn là điểm bắt đầu.",
  },
  {
    step: "2",
    title: "Kiểm chứng thông tin",
    desc: "Pháp lý, chủ đầu tư, tiến độ — đối chiếu tại chỗ, không nghe kể.",
  },
  {
    step: "3",
    title: "Phân tích phù hợp",
    desc: "Điểm cộng, điểm trừ nói thẳng. Hợp thì tiến, không hợp thì dừng.",
  },
  {
    step: "4",
    title: "Đồng hành sau mua",
    desc: "Trước, trong và sau khi xuống tiền — vẫn có Ngoan bên cạnh.",
  },
];

const PRINCIPLES = [
  {
    title: "Nói thẳng điểm trừ",
    desc: "Dự án nào cũng có rủi ro. Ngoan chỉ chỗ chưa tốt trước khi khoe chỗ tốt.",
  },
  {
    title: "Không ép mua",
    desc: "Chưa phù hợp thì khuyên chờ. Quyết định là của bạn, Ngoan chỉ làm rõ.",
  },
  {
    title: "Dữ liệu trước lời khuyên",
    desc: "Giá/m², pháp lý, tiến độ — con số đi trước, cảm tính đi sau.",
  },
];

// AboutTemplate V2 — nội dung từ định vị & dịch vụ có sẵn trên site.
// Tuyệt đối không bịa năm kinh nghiệm/thương vụ: các ô số liệu thật được
// đánh dấu [CẦN BỔ SUNG] để chủ site điền sau.
export function AboutTemplate() {
  return (
    <div className="bg-page">
      {/* Hero */}
      <div className="section-pad">
        <Container width="detail">
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Về Ngoan" }]} />
          <div className="mt-8 grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
            <Reveal>
              <div className="relative mx-auto aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-2xl">
                <Image
                  src="/images/ngoandang.jmg.jpg"
                  alt="Ngoan Đặng — BĐS dự án Vũng Tàu"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div>
                <p className="type-kicker text-secondary mb-4 flex items-center gap-3">
                  <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
                  Về Ngoan
                </p>
                <h1 className="font-display text-primary font-semibold text-[2.5rem] leading-tight mb-4 md:text-[3.25rem]">
                  Ngoan Đặng
                </h1>
                <p className="type-h3 text-secondary mb-4">BĐS dự án Vũng Tàu</p>
                <p className="type-body text-secondary mb-6">
                  Ngoan đồng hành cùng khách hàng tìm hiểu, phân tích và lựa
                  chọn các dự án bất động sản tại Vũng Tàu — bằng thông tin
                  trung thực, góc nhìn chuyên sâu và tư vấn đúng nhu cầu thực tế
                  của mỗi người.
                </p>
                <figure className="border-l-2 border-accent pl-4 mb-8">
                  <blockquote className="type-body text-primary">
                    Một quyết định đúng hôm nay có thể tạo ra giá trị lớn cho
                    nhiều năm sau.
                  </blockquote>
                </figure>
                <div className="flex flex-wrap gap-3">
                  <a
                    href={ZALO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center rounded-full bg-ink px-6 font-medium text-ondark transition-opacity hover:opacity-90"
                  >
                    Zalo: 0906 477 923
                  </a>
                  <Link
                    href="/du-an"
                    className="inline-flex min-h-[48px] items-center rounded-full border border-primary/25 px-6 font-medium text-primary transition-colors hover:border-primary"
                  >
                    Xem dự án đang theo dõi
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </div>

      {/* Lĩnh vực */}
      <div className="bg-clean">
        <div className="section-pad">
          <Container>
            <Reveal>
              <p className="type-kicker text-secondary mb-4">Lĩnh vực tập trung</p>
              <h2 className="type-h2 text-primary mb-10 max-w-[720px]">
                Bốn phân khúc Ngoan tư vấn sâu
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {FIELDS.map((f, i) => (
                <Reveal key={f.title} delay={Math.min(i, 3) * 80}>
                  <div className="h-full rounded-2xl border border-soft bg-page p-6">
                    <p className="font-display text-4xl text-accent mb-3" aria-hidden="true">
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-medium text-primary text-lg mb-2">{f.title}</h3>
                    <p className="type-small text-secondary">{f.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* Phương pháp */}
      <div className="section-pad">
        <Container width="detail">
          <Reveal>
            <p className="type-kicker text-accent mb-2">Cách làm việc</p>
            <h2 className="type-h2 text-primary mb-10">Phương pháp 4 bước</h2>
          </Reveal>
          <ol className="flex flex-col gap-4">
            {METHOD.map((m, i) => (
              <Reveal key={m.step} delay={Math.min(i, 3) * 80}>
                <li className="flex gap-4 rounded-2xl border border-soft bg-clean p-6">
                  <span
                    aria-hidden="true"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-base font-semibold text-ondark"
                  >
                    {m.step}
                  </span>
                  <div>
                    <h3 className="font-medium text-primary text-lg">{m.title}</h3>
                    <p className="type-small text-secondary mt-1">{m.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </div>

      {/* Quan điểm */}
      <div className="bg-ink text-ondark">
        <div className="section-pad">
          <Container>
            <Reveal>
              <p className="type-kicker mb-2 opacity-70">Quan điểm nghề</p>
              <h2 className="type-h2 mb-10 max-w-[720px]">Ba điều Ngoan giữ khi tư vấn</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {PRINCIPLES.map((pr, i) => (
                <Reveal key={pr.title} delay={Math.min(i, 2) * 100}>
                  <div className="h-full rounded-2xl border border-ondark/20 p-6">
                    <h3 className="font-medium text-lg mb-2">{pr.title}</h3>
                    <p className="type-small opacity-80">{pr.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </div>
      </div>

      {/* Số liệu thật — chờ chủ site bổ sung */}
      <div className="section-pad">
        <Container width="detail">
          <Reveal>
            <p className="type-kicker text-accent mb-2">Bằng chứng</p>
            <h2 className="type-h2 text-primary mb-4">Con số nói thay lời</h2>
            <div className="mb-8 rounded-2xl border border-dashed border-soft bg-clean p-5">
              <p className="type-small text-secondary">
                [CẦN BỔ SUNG] Điền số liệu thật của Ngoan: năm kinh nghiệm, số
                giao dịch đã đồng hành, số dự án đang theo dõi. Không dùng số
                ước lượng — trang này là nơi tạo niềm tin.
              </p>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { value: "—", label: "Năm kinh nghiệm BĐS Vũng Tàu" },
              { value: "—", label: "Giao dịch đã đồng hành" },
              { value: "—", label: "Dự án đang theo dõi" },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="rounded-2xl border border-soft bg-clean p-6 text-center">
                  <p className="font-display text-5xl text-primary">{s.value}</p>
                  <p className="type-small text-secondary mt-2">{s.label}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>

      {/* CTA liên hệ */}
      <div className="section-pad pt-0">
        <Container width="detail">
          <Reveal>
            <section
              aria-label="Liên hệ Ngoan"
              className="rounded-2xl bg-ink p-8 text-center text-ondark md:p-12"
            >
              <h2 className="type-h2 mb-3">Cần trao đổi về một dự án?</h2>
              <p className="type-body mb-8 opacity-80">
                Ngoan sẵn sàng lắng nghe và hỗ trợ — miễn phí, không ép mua.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center rounded-full bg-ondark px-8 font-medium text-ink transition-opacity hover:opacity-90"
                >
                  Zalo: 0906 477 923
                </a>
                <Link
                  href="/lien-he"
                  className="inline-flex min-h-[48px] items-center rounded-full border border-ondark/40 px-8 font-medium transition-colors hover:border-ondark"
                >
                  Để lại thông tin
                </Link>
              </div>
              <p className="type-small mt-6 opacity-70">
                Điện thoại/Zalo: 0906 477 923 · Messenger: Ngoan Đặng · Vũng Tàu, Việt Nam
              </p>
            </section>
          </Reveal>
        </Container>
      </div>
    </div>
  );
}
