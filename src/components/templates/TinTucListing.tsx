import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Reveal } from "@/components/ui/Reveal";

const ZALO_URL = "https://zalo.me/0906477923";

// Listing tin tức: tính mới lên trước — tin mới nhất featured lớn,
// còn lại grid card ảnh + ngày + tóm tắt, kèm CTA theo dõi Zalo.
export function TinTucListing({ articles }: { articles: Article[] }) {
  const sorted = [...articles].sort((a, b) => b.updated_at.localeCompare(a.updated_at));
  const [featured, ...rest] = sorted;

  return (
    <div className="bg-page">
      <div className="section-pad">
        <Container>
          <Breadcrumb
            items={[{ label: "Trang chủ", href: "/" }, { label: "Tin tức & Sự kiện" }]}
          />

          <Reveal>
            <div className="mt-8 mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="max-w-[640px]">
                <p className="type-kicker text-secondary mb-4 flex items-center gap-3">
                  <span aria-hidden="true" className="inline-block h-px w-8 bg-accent" />
                  Cập nhật thị trường
                </p>
                <h1 className="font-display text-primary font-semibold text-[2.5rem] leading-tight mb-4 md:text-[3.25rem]">
                  Tin tức & Sự kiện
                </h1>
                <p className="type-body text-secondary">
                  Diễn biến thị trường, tiến độ dự án và sự kiện mở bán tại
                  Vũng Tàu — Ngoan kiểm chứng trước khi đăng.
                </p>
              </div>
              <p className="flex shrink-0 items-baseline gap-3">
                <span className="font-display text-5xl text-primary">{articles.length}</span>
                <span className="type-kicker text-muted">
                  Tin đã
                  <br />
                  đăng
                </span>
              </p>
            </div>
          </Reveal>

          {sorted.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-soft p-10 text-center">
              <p className="type-body text-secondary mb-4">
                Chưa có tin nào. Tin mới về thị trường Vũng Tàu sẽ lên sóng tại đây.
              </p>
              <a
                href={ZALO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent-hover"
              >
                Theo dõi qua Zalo để nhận tin sớm →
              </a>
            </div>
          ) : (
            <>
              {featured && (
                <Reveal className="mb-10">
                  <Link
                    href={contentPath(featured.type, featured.slug)}
                    className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-soft bg-clean transition-shadow hover:shadow-lg lg:grid-cols-5"
                  >
                    <div className="relative aspect-[16/9] lg:col-span-3 lg:aspect-auto lg:min-h-[320px]">
                      {featured.cover ? (
                        <Image
                          src={featured.cover}
                          alt={featured.cover_alt ?? featured.title}
                          fill
                          priority
                          sizes="(max-width: 1024px) 100vw, 60vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-muted" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex flex-col justify-center p-6 md:p-8 lg:col-span-2">
                      <p className="mb-2 flex items-center gap-2">
                        <span className="type-kicker text-accent">Mới nhất</span>
                        <span className="type-caption text-muted">· {featured.updated_at}</span>
                      </p>
                      <h2 className="type-h2 text-primary mb-3 transition-colors group-hover:text-accent-hover">
                        {featured.title}
                      </h2>
                      <p className="type-small text-secondary line-clamp-3">{featured.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              )}

              {rest.length > 0 && (
                <>
                  <div className="mb-8 flex items-baseline gap-3">
                    <h2 className="font-display text-primary font-semibold text-[1.75rem] leading-tight md:text-[2.25rem]">
                      Tin trước đó
                    </h2>
                    <span className="type-small text-muted">{rest.length} tin</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((a, i) => (
                      <Reveal key={`${a.type}-${a.slug}`} delay={Math.min(i, 5) * 60} className="h-full">
                        <Link
                          href={contentPath(a.type, a.slug)}
                          className="group flex h-full flex-col overflow-hidden rounded-2xl border border-soft bg-clean transition-shadow hover:shadow-lg"
                        >
                          <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                            {a.cover ? (
                              <Image
                                src={a.cover}
                                alt={a.cover_alt ?? a.title}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                              />
                            ) : (
                              <div className="absolute inset-0 bg-muted" aria-hidden="true" />
                            )}
                          </div>
                          <div className="flex flex-1 flex-col p-5">
                            <p className="type-caption text-muted mb-2">{a.updated_at}</p>
                            <h3 className="text-lg font-medium leading-snug text-primary transition-colors group-hover:text-accent-hover mb-2">
                              {a.title}
                            </h3>
                            <p className="type-small text-secondary line-clamp-2">{a.excerpt}</p>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </>
              )}

              <Reveal className="mt-12">
                <section
                  aria-label="Theo dõi tin mới"
                  className="rounded-2xl bg-ink p-8 text-center text-ondark md:p-10"
                >
                  <h2 className="type-h3 mb-2">Muốn nhận tin sớm?</h2>
                  <p className="type-small mb-6 opacity-80">
                    Tin mở bán, bảng hàng mới — Ngoan nhắn qua Zalo trước khi đăng web.
                  </p>
                  <a
                    href={ZALO_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[48px] items-center rounded-full bg-ondark px-8 font-medium text-ink transition-opacity hover:opacity-90"
                  >
                    Theo dõi qua Zalo
                  </a>
                </section>
              </Reveal>
            </>
          )}
        </Container>
      </div>
    </div>
  );
}
