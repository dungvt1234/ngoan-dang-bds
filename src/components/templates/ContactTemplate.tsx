import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactFormSkeleton } from "./ContactFormSkeleton";
import { Reveal } from "@/components/ui/Reveal";

const ZALO_URL = "https://zalo.me/0906477923";
const MESSENGER_URL = "https://www.facebook.com/ngoan.dang.739";

function ChannelIcon({ icon }: { icon: "chat" | "phone" | "send" }) {
  const cls = "w-7 h-7 text-accent-hover";
  if (icon === "phone")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
        <path
          d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.3 1.9.6 2.9.7a2 2 0 0 1 1.7 2z"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  if (icon === "send")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
        <path d="M22 2L11 13" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
      <path
        d="M21 11.5a8.4 8.4 0 0 1-8.5 8.4 8.6 8.6 0 0 1-3.8-.9L3 21l2-5.4a8.3 8.3 0 0 1-1-4.1A8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const CHANNELS = [
  {
    icon: "chat" as const,
    title: "Zalo",
    value: "0906 477 923",
    desc: "Nhanh nhất — Ngoan trả lời trong ngày.",
    href: ZALO_URL,
    external: true,
  },
  {
    icon: "phone" as const,
    title: "Gọi trực tiếp",
    value: "0906 477 923",
    desc: "Việc gấp, cần trao đổi ngay.",
    href: "tel:+84906477923",
    external: false,
  },
  {
    icon: "send" as const,
    title: "Messenger",
    value: "Ngoan Đặng",
    desc: "Quen dùng Facebook thì nhắn đây.",
    href: MESSENGER_URL,
    external: true,
  },
];

const COMMITMENTS = [
  { title: "Phản hồi trong 24 giờ", desc: "Ngày làm việc. Cuối tuần có thể chậm hơn chút." },
  { title: "Miễn phí, không ép mua", desc: "Chưa phù hợp thì Ngoan khuyên chờ, không chèo kéo." },
  { title: "Thông tin kiểm chứng", desc: "Pháp lý, giá, tiến độ — đối chiếu trước khi nói." },
];

const FAQS = [
  {
    q: "Tư vấn có mất phí không?",
    a: "Không. Mọi trao đổi qua Zalo, điện thoại hay đi xem thực tế đều miễn phí.",
  },
  {
    q: "Gửi form xong thì sao?",
    a: "Form mở Zalo với tin nhắn soạn sẵn tên + SĐT + nhu cầu của bạn. Bạn bấm Gửi trong Zalo là Ngoan nhận được ngay.",
  },
  {
    q: "Tôi chưa biết mua gì, chỉ tìm hiểu thôi có được không?",
    a: "Được, rất nên. Cứ nhắn nhu cầu chung chung, Ngoan gợi ý hướng đọc trước khi xuống tiền.",
  },
];

// ContactTemplate V2 — hero cam kết + 3 thẻ kênh + form chọn nhu cầu
// + cột cam kết + FAQ. Form vẫn đi Zalo thật (không backend).
export function ContactTemplate() {
  return (
    <div className="bg-page">
      <div className="section-pad">
        <Container width="detail">
          <Breadcrumb items={[{ label: "Trang chủ", href: "/" }, { label: "Liên hệ" }]} />

          <Reveal>
            <div className="mt-8 mb-12 max-w-[720px]">
              <p className="type-kicker text-secondary mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
                Liên hệ
              </p>
              <h1 className="font-display text-primary font-semibold leading-tight mb-4 text-[2rem] md:text-[3.25rem]">
                Nói chuyện với Ngoan
              </h1>
              <p className="type-body text-secondary">
                Chọn kênh bạn thích nhất, hoặc điền form 30 giây — tin nhắn
                chuyển thẳng tới Zalo Ngoan, không qua trung gian.
              </p>
            </div>
          </Reveal>

          <div className="mb-10 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {CHANNELS.map((c, i) => (
              <Reveal key={c.title} delay={i * 80}>
                <a
                  href={c.href}
                  {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex h-full items-center gap-4 rounded-2xl border border-soft bg-clean p-4 transition-shadow hover:shadow-lg sm:flex-col sm:items-start sm:p-6"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 sm:h-12 sm:w-12">
                    <ChannelIcon icon={c.icon} />
                  </div>
                  <div className="min-w-0">
                    <p className="type-kicker text-secondary mb-0.5">{c.title}</p>
                    <p className="text-lg font-semibold text-primary transition-colors group-hover:text-accent-hover sm:text-xl">
                      {c.value}
                    </p>
                    <p className="type-small text-secondary mt-1">{c.desc}</p>
                  </div>
                </a>
              </Reveal>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <Reveal className="lg:col-span-2">
              <ContactFormSkeleton />
            </Reveal>
            <aside className="flex flex-col gap-6">
              <Reveal delay={80}>
                <section
                  aria-label="Cam kết"
                  className="rounded-2xl border border-soft bg-clean p-6"
                >
                  <h2 className="type-h3 text-primary mb-4">Ngoan cam kết</h2>
                  <ul className="flex flex-col gap-4">
                    {COMMITMENTS.map((c, i) => (
                      <li key={c.title} className="flex gap-3">
                        <span
                          aria-hidden="true"
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-ondark"
                        >
                          {i + 1}
                        </span>
                        <div>
                          <p className="font-medium leading-snug text-primary">{c.title}</p>
                          <p className="type-small text-secondary">{c.desc}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </Reveal>
              <Reveal delay={120}>
                <section
                  aria-label="Địa điểm"
                  className="rounded-2xl bg-ink p-6 text-ondark"
                >
                  <h2 className="type-h3 mb-2">Gặp trực tiếp?</h2>
                  <p className="type-small opacity-80">
                    Ngoan ở Vũng Tàu — hẹn cà phê xem dự án thực tế, miễn phí.
                    Nhắn Zalo trước để xếp lịch nhé.
                  </p>
                </section>
              </Reveal>
            </aside>
          </div>

          <div className="mt-16">
            <Reveal>
              <p className="type-kicker text-accent mb-2">Thắc mắc thường gặp</p>
              <h2 className="type-h2 text-primary mb-6">Hỏi nhanh đáp gọn</h2>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {FAQS.map((f, i) => (
                <Reveal key={f.q} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-soft bg-clean p-6">
                    <h3 className="font-medium text-primary mb-2">{f.q}</h3>
                    <p className="type-small text-secondary">{f.a}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
