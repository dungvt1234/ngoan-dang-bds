import Link from "next/link";
import type { Article } from "@/types/content";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";
import { KinhNghiemFilter } from "./KinhNghiemFilter";

const ROADMAP = [
  { step: "1", title: "Xác định nhu cầu & ngân sách", desc: "Để ở, đầu tư hay nghỉ dưỡng? Khoảng giá chịu được?" },
  { step: "2", title: "Kiểm tra pháp lý", desc: "Sổ, chủ đầu tư, tiến độ — checklist trước khi cọc." },
  { step: "3", title: "Đọc hiểu giá/m²", desc: "Giá chào bán nói lên điều gì, so với khu vực ra sao?" },
  { step: "4", title: "Đi xem & kiểm chứng", desc: "Thực tế bàn giao, tiện ích, dân cư xung quanh." },
  { step: "5", title: "Xuống tiền an toàn", desc: "Hợp đồng, tiến độ thanh toán, đồng hành sau mua." },
];

const ZALO_URL = "https://zalo.me/0906477923";

// Trang curated: cùng kho bài "knowledge" với /kien-thuc nhưng sắp xếp
// theo hành trình người mua lần đầu + filter/search + sidebar lộ trình.
export function KinhNghiemListing({ articles }: { articles: Article[] }) {
  const latest = [...articles]
    .sort((a, b) => b.updated_at.localeCompare(a.updated_at))
    .slice(0, 3);

  return (
    <div className="bg-page">
      <div className="section-pad">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: "Kinh nghiệm mua nhà" }]}
          />

          <Reveal>
            <div className="mt-8 mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[640px]">
                <p className="type-kicker text-secondary mb-4 flex items-center gap-3">
                  <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
                  Mua nhà lần đầu cũng yên tâm
                </p>
                <h1 className="font-display text-primary font-semibold text-[2.5rem] leading-tight mb-4 md:text-[3.25rem]">
                  Kinh nghiệm mua nhà
                </h1>
                <p className="type-body text-secondary">
                  Nội dung chọn lọc từ kho Kiến thức, sắp xếp theo hành trình
                  người mua lần đầu — đọc từ trên xuống là đủ bộ.
                </p>
              </div>
              <p className="flex shrink-0 items-baseline gap-3">
                <span className="font-display text-5xl text-primary">{articles.length}</span>
                <span className="type-kicker text-muted">
                  Bài viết
                  <br />
                  chọn lọc
                </span>
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <KinhNghiemFilter articles={articles} />
            </div>

            <aside className="flex flex-col gap-6">
              <Reveal>
                <section
                  aria-labelledby="roadmap-heading"
                  className="rounded-2xl border border-soft bg-clean p-6"
                >
                  <h2 id="roadmap-heading" className="type-h3 text-primary mb-4">
                    Lộ trình 5 bước
                  </h2>
                  <ol className="flex flex-col gap-4">
                    {ROADMAP.map((r) => (
                      <li key={r.step} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-ondark"
                        >
                          {r.step}
                        </span>
                        <div>
                          <p className="font-medium leading-snug text-primary">{r.title}</p>
                          <p className="type-small text-secondary">{r.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </section>
              </Reveal>

              <Reveal delay={80}>
                <section
                  aria-labelledby="cta-heading"
                  className="rounded-2xl bg-ink p-6 text-ondark"
                >
                  <h2 id="cta-heading" className="type-h3 mb-2">
                    Còn phân vân một dự án?
                  </h2>
                  <p className="type-small mb-5 opacity-80">
                    Nhắn Ngoan qua Zalo, trả lời trong ngày — miễn phí, không ép mua.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a
                      href={ZALO_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-ondark px-6 font-medium text-ink transition-opacity hover:opacity-90"
                    >
                      Zalo: 0906 477 923
                    </a>
                    <Link
                      href="/lien-he"
                      className="type-small text-center font-medium underline underline-offset-8 opacity-90 hover:opacity-100"
                    >
                      Hoặc để lại thông tin liên hệ →
                    </Link>
                  </div>
                </section>
              </Reveal>

              {latest.length > 0 && (
                <Reveal delay={120}>
                  <section
                    aria-labelledby="latest-heading"
                    className="rounded-2xl border border-soft bg-clean p-6"
                  >
                    <h2 id="latest-heading" className="type-h3 text-primary mb-4">
                      Mới cập nhật
                    </h2>
                    <ul className="flex flex-col gap-4">
                      {latest.map((a) => (
                        <li key={`${a.type}-${a.slug}`}>
                          <Link href={`/kien-thuc/${a.slug}`} className="group block">
                            <p className="font-medium leading-snug text-primary transition-colors group-hover:text-accent-hover">
                              {a.title}
                            </p>
                            <p className="type-caption text-muted mt-1">{a.updated_at}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                </Reveal>
              )}
            </aside>
          </div>
        </Container>
      </div>
    </div>
  );
}
