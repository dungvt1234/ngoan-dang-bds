import Image from "next/image";
import Link from "next/link";
import type { Article, Comparison, Project } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/ui/Reveal";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

const SEGMENT_LABELS: Record<Project["segment"], string> = {
  "nghi-duong": "Nghỉ dưỡng",
  "de-o": "Để ở",
  "do-thi": "Khu đô thị",
};

const STATUS_LABELS: Record<Project["status"], string> = {
  "sap-mo-ban": "Sắp mở bán",
  "dang-ban": "Đang bán",
  "da-ban-giao": "Đã bàn giao",
};

const LEGAL_LABELS: Record<NonNullable<Project["legal_status"]>, { label: string; tone: "ok" | "warn" | "risk" }> = {
  "ro-rang": { label: "Pháp lý rõ ràng", tone: "ok" },
  "dang-hoan-thien": { label: "Pháp lý đang hoàn thiện", tone: "warn" },
  "can-kiem-chung": { label: "Cần kiểm chứng pháp lý", tone: "risk" },
};

const ZALO_URL = "https://zalo.me/0906477923";

function fmtDate(d: unknown): string {
  if (typeof d === "string") return d.slice(0, 10);
  try {
    return new Date(d as string).toISOString().slice(0, 10);
  } catch {
    return String(d);
  }
}

function Section({
  id,
  kicker,
  title,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-label={title} className="scroll-mt-24 border-t border-soft py-10">
      <Reveal>
        <p className="type-kicker text-accent mb-2">{kicker}</p>
        <h2 className="type-h2 text-primary mb-6">{title}</h2>
        {children}
      </Reveal>
    </section>
  );
}

// ProjectDetail V2 — chỉ render section nào có dữ liệu, không nhãn debug.
// Stub Tier C (ít field) vẫn gọn gàng + CTA kiểm chứng.
export function ProjectDetail({
  project,
  related,
}: {
  project: Project;
  related: (Article | Comparison)[];
}) {
  const p = project;
  const legal = p.legal_status ? LEGAL_LABELS[p.legal_status] : null;

  const nav: { id: string; label: string }[] = [];
  if (p.overview) nav.push({ id: "tong-quan", label: "Tổng quan" });
  if (p.location_text || p.location_landmarks?.length || p.developer_name || p.map_embed_url)
    nav.push({ id: "vi-tri", label: "Vị trí" });
  if (p.price_table?.length || p.price_note || p.payment_text || p.payment_schedule?.length)
    nav.push({ id: "gia-thanh-toan", label: "Giá & thanh toán" });
  if (p.legal || p.progress_text || p.progress_milestones?.length)
    nav.push({ id: "phap-ly-tien-do", label: "Pháp lý & tiến độ" });
  if (p.product_text || p.unit_types?.length || p.gallery?.length)
    nav.push({ id: "san-pham", label: "Sản phẩm" });
  if (p.investment || p.ngoan_view_body || p.ngoan_view_verdict)
    nav.push({ id: "goc-nhin", label: "Góc nhìn Ngoan" });
  if (p.faq?.length) nav.push({ id: "hoi-dap", label: "Hỏi đáp" });

  const isStub = nav.length <= 1 && !p.ngoan_view_verdict;

  return (
    <div className="bg-page">
      {/* Hero ảnh phủ */}
      <div className="relative overflow-hidden bg-ink text-ondark">
        <div className="absolute inset-0" aria-hidden="true">
          <Image
            src={p.cover}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-ink/20" />
        </div>
        <Container className="relative">
          <div className="pt-6 pb-10 md:pt-8 md:pb-14">
            <Breadcrumb
              items={[
                { label: "Trang chủ", href: "/" },
                { label: "Dự án", href: "/du-an" },
                { label: p.name },
              ]}
            />
            <div className="mt-8 max-w-[800px]">
              <div className="mb-4 flex flex-wrap gap-2">
                <Badge tone="info">{SEGMENT_LABELS[p.segment]}</Badge>
                <Badge tone="neutral">{STATUS_LABELS[p.status]}</Badge>
                {legal && <Badge tone={legal.tone}>{legal.label}</Badge>}
              </div>
              <h1 className="font-display font-semibold text-[2.5rem] leading-tight md:text-[3.5rem]">
                {p.name}
              </h1>
              <p className="type-body mt-3 opacity-80">{p.location_label}</p>
              {p.price_range_text && (
                <p className="type-h3 mt-4">{p.price_range_text}</p>
              )}
              {p.ngoan_view_verdict && (
                <blockquote className="type-body mt-6 border-l-2 border-accent pl-4 opacity-90">
                  “{p.ngoan_view_verdict}”
                  <span className="type-small mt-1 block opacity-70">— Nhận định của Ngoan Đặng</span>
                </blockquote>
              )}
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href={ZALO_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-[48px] items-center rounded-full bg-ondark px-6 font-medium text-ink transition-opacity hover:opacity-90"
                >
                  Zalo: 0906 477 923
                </a>
                <Link
                  href="/lien-he"
                  className="inline-flex min-h-[48px] items-center rounded-full border border-ondark/40 px-6 font-medium transition-colors hover:border-ondark"
                >
                  Đặt lịch tư vấn
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Nav neo */}
      {nav.length > 1 && (
        <div className="sticky top-0 z-20 border-b border-soft bg-page/95 backdrop-blur">
          <Container>
            <nav aria-label="Mục lục dự án" className="flex gap-1 overflow-x-auto py-3">
              {nav.map((n) => (
                <a
                  key={n.id}
                  href={`#${n.id}`}
                  className="type-small whitespace-nowrap rounded-full px-4 py-2 font-medium text-secondary transition-colors hover:bg-dark/5 hover:text-primary"
                >
                  {n.label}
                </a>
              ))}
            </nav>
          </Container>
        </div>
      )}

      <div className="section-pad">
        <Container width="detail">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
            <div className="lg:col-span-2">
              {isStub && (
                <Reveal>
                  <div className="mb-4 rounded-2xl border border-soft bg-clean p-6">
                    <p className="type-body text-secondary">
                      Trang đang được Ngoan hoàn thiện và kiểm chứng từng mục.
                      Thông tin chi tiết (giá, pháp lý, tiến độ, phân tích) sẽ cập
                      nhật sau — đừng dùng bản nháp này để ra quyết định.
                    </p>
                  </div>
                </Reveal>
              )}

              {p.overview && (
                <Section id="tong-quan" kicker="Bức tranh chung" title="Tổng quan">
                  <p className="type-body whitespace-pre-line">{p.overview}</p>
                </Section>
              )}

              {(p.location_text || p.location_landmarks?.length || p.developer_name || p.map_embed_url) && (
                <Section id="vi-tri" kicker="Ở đâu, ai làm" title="Vị trí & chủ đầu tư">
                  {p.location_text && (
                    <p className="type-body whitespace-pre-line">{p.location_text}</p>
                  )}
                  {p.location_landmarks && p.location_landmarks.length > 0 && (
                    <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {p.location_landmarks.map((l) => (
                        <li
                          key={l.name}
                          className="flex items-center justify-between gap-3 rounded-xl border border-soft bg-clean px-4 py-3"
                        >
                          <span className="type-small font-medium text-primary">{l.name}</span>
                          <span className="type-small shrink-0 text-secondary">~{l.minutes} phút</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.developer_name && (
                    <div className="mt-6 rounded-2xl bg-dark/5 p-5">
                      <p className="type-small font-semibold text-primary">
                        Chủ đầu tư: {p.developer_name}
                      </p>
                      {p.developer_track_record && (
                        <p className="type-small text-secondary mt-2 whitespace-pre-line">
                          {p.developer_track_record}
                        </p>
                      )}
                    </div>
                  )}
                  {p.map_embed_url && (
                    <iframe
                      title={`Bản đồ ${p.name}`}
                      src={p.map_embed_url}
                      loading="lazy"
                      className="mt-6 h-[320px] w-full rounded-2xl border border-soft"
                    />
                  )}
                </Section>
              )}

              {(p.price_table?.length || p.price_note || p.payment_text || p.payment_schedule?.length) && (
                <Section id="gia-thanh-toan" kicker="Tiền nong rõ ràng" title="Giá & thanh toán">
                  {p.price_range_text && (
                    <p className="type-h3 text-primary mb-4">{p.price_range_text}</p>
                  )}
                  {p.price_table && p.price_table.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-soft">
                      <table className="type-small w-full">
                        <tbody>
                          {p.price_table.map((row) => (
                            <tr key={row.label} className="border-b border-soft last:border-0">
                              <td className="px-4 py-3 text-secondary">{row.label}</td>
                              <td className="px-4 py-3 text-right font-semibold text-primary">
                                {row.value}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {p.price_note && (
                    <p className="type-small text-secondary mt-3">{p.price_note}</p>
                  )}
                  {p.payment_text && (
                    <p className="type-body mt-6 whitespace-pre-line">{p.payment_text}</p>
                  )}
                  {p.payment_schedule && p.payment_schedule.length > 0 && (
                    <ol className="mt-6 flex flex-col gap-3">
                      {p.payment_schedule.map((s, i) => (
                        <li key={s.dot} className="flex gap-3">
                          <span
                            aria-hidden="true"
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-ondark"
                          >
                            {i + 1}
                          </span>
                          <div>
                            <p className="font-medium text-primary">{s.dot}</p>
                            <p className="type-small text-secondary">{s.note}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </Section>
              )}

              {(p.legal || p.progress_text || p.progress_milestones?.length) && (
                <Section id="phap-ly-tien-do" kicker="An tâm xuống tiền" title="Pháp lý & tiến độ">
                  {legal && (
                    <p className="mb-4">
                      <Badge tone={legal.tone}>{legal.label}</Badge>
                    </p>
                  )}
                  {p.legal && <p className="type-body whitespace-pre-line">{p.legal}</p>}
                  {p.progress_text && (
                    <p className="type-body mt-4 whitespace-pre-line">{p.progress_text}</p>
                  )}
                  {p.progress_milestones && p.progress_milestones.length > 0 && (
                    <ol className="mt-6 flex flex-col gap-0">
                      {p.progress_milestones.map((m) => (
                        <li key={`${m.date}-${m.label}`} className="relative flex gap-4 pb-6 last:pb-0">
                          <span
                            aria-hidden="true"
                            className={`mt-1 h-3 w-3 shrink-0 rounded-full ${
                              m.done ? "bg-ok" : "border-2 border-muted bg-transparent"
                            }`}
                          />
                          <div>
                            <p className="type-small font-semibold text-primary">
                              {fmtDate(m.date)} — {m.label}
                            </p>
                            <p className="type-caption text-muted">
                              {m.done ? "Đã hoàn thành" : "Chưa hoàn thành"}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </Section>
              )}

              {(p.product_text || p.unit_types?.length || p.gallery?.length) && (
                <Section id="san-pham" kicker="Có gì để chọn" title="Sản phẩm">
                  {p.product_text && (
                    <p className="type-body whitespace-pre-line">{p.product_text}</p>
                  )}
                  {p.unit_types && p.unit_types.length > 0 && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {p.unit_types.map((u) => (
                        <div key={u.name} className="rounded-2xl border border-soft bg-clean p-5">
                          <p className="font-medium text-primary">{u.name}</p>
                          <p className="type-small text-secondary mt-1">Diện tích: {u.area}</p>
                          <p className="type-small font-semibold text-primary mt-1">
                            Từ {u.price_from}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                  {p.gallery && p.gallery.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 gap-4">
                      {p.gallery.map((src) => (
                        <div key={src} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
                          <Image
                            src={src}
                            alt={`${p.name} — hình ảnh thực tế`}
                            fill
                            sizes="(max-width: 1024px) 50vw, 33vw"
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </Section>
              )}

              {(p.investment || p.ngoan_view_body || p.ngoan_view_verdict) && (
                <Section id="goc-nhin" kicker="Nói thẳng, nói thật" title="Góc nhìn của Ngoan">
                  {p.ngoan_view_verdict && (
                    <blockquote className="type-body rounded-2xl bg-dark/5 p-5 border-l-2 border-accent">
                      {p.ngoan_view_verdict}
                    </blockquote>
                  )}
                  {(p.ngoan_view_pros?.length || p.ngoan_view_cons?.length) && (
                    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {p.ngoan_view_pros && p.ngoan_view_pros.length > 0 && (
                        <div className="rounded-2xl border border-ok/30 bg-ok/5 p-5">
                          <p className="type-small mb-3 font-semibold uppercase tracking-[0.08em] text-ok">
                            Điểm cộng
                          </p>
                          <ul className="type-small flex flex-col gap-2 text-primary">
                            {p.ngoan_view_pros.map((pro) => (
                              <li key={pro} className="flex gap-2">
                                <span aria-hidden="true">+</span> {pro}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {p.ngoan_view_cons && p.ngoan_view_cons.length > 0 && (
                        <div className="rounded-2xl border border-risk/30 bg-risk/5 p-5">
                          <p className="type-small mb-3 font-semibold uppercase tracking-[0.08em] text-risk">
                            Điểm trừ
                          </p>
                          <ul className="type-small flex flex-col gap-2 text-primary">
                            {p.ngoan_view_cons.map((con) => (
                              <li key={con} className="flex gap-2">
                                <span aria-hidden="true">−</span> {con}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                  {p.ngoan_view_suitable_for && p.ngoan_view_suitable_for.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.ngoan_view_suitable_for.map((s) => (
                        <span
                          key={s}
                          className="inline-flex items-center rounded-full bg-dark/5 px-3 py-1 text-[13px] font-medium text-secondary"
                        >
                          Phù hợp: {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {p.ngoan_view_body && (
                    <p className="type-body mt-6 whitespace-pre-line">{p.ngoan_view_body}</p>
                  )}
                  {p.investment && (
                    <p className="type-body mt-4 whitespace-pre-line">{p.investment}</p>
                  )}
                </Section>
              )}

              {p.faq && p.faq.length > 0 && (
                <Section id="hoi-dap" kicker="Thắc mắc thường gặp" title="Hỏi đáp">
                  <div className="flex flex-col gap-3">
                    {p.faq.map((f) => (
                      <details
                        key={f.q}
                        className="group rounded-2xl border border-soft bg-clean px-5 py-4"
                      >
                        <summary className="cursor-pointer font-medium text-primary marker:text-accent">
                          {f.q}
                        </summary>
                        <p className="type-small text-secondary mt-2">{f.a}</p>
                      </details>
                    ))}
                  </div>
                </Section>
              )}

              {/* Nội dung liên quan */}
              <section aria-label="Nội dung liên quan" className="border-t border-soft py-10">
                <Reveal>
                  <p className="type-kicker text-accent mb-2">Đọc thêm</p>
                  <h2 className="type-h2 text-primary mb-6">Nội dung liên quan</h2>
                  {related.length === 0 ? (
                    <p className="type-small text-muted">Đang cập nhật thêm bài viết về dự án này.</p>
                  ) : (
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {related.slice(0, 4).map((r) => (
                        <li key={`${r.type}-${r.slug}`}>
                          <Link
                            href={contentPath(r.type, r.slug)}
                            className="group block h-full rounded-2xl border border-soft bg-clean p-5 transition-shadow hover:shadow-lg"
                          >
                            <p className="font-medium leading-snug text-primary transition-colors group-hover:text-accent-hover">
                              {r.title}
                            </p>
                            <p className="type-small text-secondary line-clamp-2 mt-2">{r.excerpt}</p>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </Reveal>
              </section>
            </div>

            {/* Sidebar */}
            <aside className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
              <Reveal>
                <section
                  aria-label="Thông tin nhanh"
                  className="rounded-2xl border border-soft bg-clean p-6"
                >
                  <h2 className="type-h3 text-primary mb-4">Thông tin nhanh</h2>
                  <dl className="type-small flex flex-col gap-3">
                    <div className="flex justify-between gap-3">
                      <dt className="text-secondary">Phân khúc</dt>
                      <dd className="font-medium text-primary">{SEGMENT_LABELS[p.segment]}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt className="text-secondary">Trạng thái</dt>
                      <dd className="font-medium text-primary">{STATUS_LABELS[p.status]}</dd>
                    </div>
                    {legal && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-secondary">Pháp lý</dt>
                        <dd className="font-medium text-primary">{legal.label}</dd>
                      </div>
                    )}
                    {p.price_range_text && (
                      <div className="flex justify-between gap-3">
                        <dt className="text-secondary">Khoảng giá</dt>
                        <dd className="font-medium text-primary">{p.price_range_text}</dd>
                      </div>
                    )}
                    <div className="flex justify-between gap-3">
                      <dt className="text-secondary">Cập nhật</dt>
                      <dd className="font-medium text-primary">{p.updated_at}</dd>
                    </div>
                  </dl>
                </section>
              </Reveal>

              <Reveal delay={80}>
                <section aria-label="Liên hệ tư vấn" className="rounded-2xl bg-ink p-6 text-ondark">
                  <h2 className="type-h3 mb-2">Muốn đi xem thực tế?</h2>
                  <p className="type-small mb-5 opacity-80">
                    Ngoan dẫn đi xem, đối chiếu pháp lý tại chỗ — miễn phí.
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
                      Để lại thông tin →
                    </Link>
                  </div>
                </section>
              </Reveal>

              {p.sources && p.sources.length > 0 && (
                <Reveal delay={120}>
                  <section
                    aria-label="Nguồn tham khảo"
                    className="rounded-2xl border border-soft bg-clean p-6"
                  >
                    <h2 className="type-h3 text-primary mb-3">Nguồn</h2>
                    <ul className="type-small flex flex-col gap-2 text-secondary">
                      {p.sources.map((s) => (
                        <li key={s.label}>
                          {s.url ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="underline underline-offset-4 hover:text-primary"
                            >
                              {s.label}
                            </a>
                          ) : (
                            s.label
                          )}{" "}
                          <span className="text-muted">({s.noted_at})</span>
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
