import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Trust bar dưới hero (theo mẫu): 4 cam kết + mô tả ngắn, icon SVG gọn.
const ITEMS = [
  { title: "Phân tích chuyên sâu", description: "Nhìn đúng tiềm năng và rủi ro", icon: "chart" },
  { title: "Kiểm chứng thông tin", description: "Pháp lý, chủ đầu tư, tiến độ", icon: "shield" },
  { title: "Tư vấn theo nhu cầu", description: "Để ở, đầu tư, nghỉ dưỡng", icon: "users" },
  { title: "Đồng hành dài hạn", description: "Trước, trong và sau khi mua", icon: "compass" },
] as const;

function TrustIcon({ icon }: { icon: (typeof ITEMS)[number]["icon"] }) {
  const cls = "w-7 h-7 text-accent-hover";
  if (icon === "chart")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
        <path d="M4 20V10M10 20V4M16 20v-8M22 20H2" strokeLinecap="round" />
      </svg>
    );
  if (icon === "shield")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
        <path d="M12 3l7 3v5c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-3z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (icon === "users")
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
        <circle cx="9" cy="8" r="3.5" />
        <path d="M2.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.5" />
        <path d="M16 14.6c2.9.4 5 2.5 5 5.4" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={cls} aria-hidden="true">
      <circle cx="12" cy="12" r="9" />
      <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" strokeLinejoin="round" />
    </svg>
  );
}

export function HomeTrust() {
  return (
    <section aria-label="Cam kết" className="bg-clean border-b border-soft">
      <Container>
        <dl className="grid grid-cols-2 lg:grid-cols-4 gap-8 py-8 md:py-10">
          {ITEMS.map((t, i) => (
            <Reveal key={t.title} delay={i * 80}>
              <div className="flex gap-4 items-start">
                <TrustIcon icon={t.icon} />
                <div>
                  <dt className="font-medium text-primary mb-1">{t.title}</dt>
                  <dd className="type-small text-secondary">{t.description}</dd>
                </div>
              </div>
            </Reveal>
          ))}
        </dl>
      </Container>
    </section>
  );
}
