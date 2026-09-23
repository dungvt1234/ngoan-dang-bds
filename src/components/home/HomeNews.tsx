import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

// Khối Tin tức & Sự kiện homepage — list gọn 3 tin mới nhất từ loader.
export function HomeNews({ items }: { items: Article[] }) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="home-news-heading" className="bg-clean">
      <div className="section-pad">
        <Container>
          <Reveal>
            <p className="type-kicker text-secondary mb-4">Tin tức & Sự kiện</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <h2 id="home-news-heading" className="font-display text-primary font-semibold text-[2rem] md:text-[2.75rem] leading-tight">
                Cập nhật mới nhất
              </h2>
              <Link href="/tin-tuc" className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors shrink-0">
                Xem tất cả tin tức →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {items.slice(0, 3).map((a, i) => (
              <Reveal key={a.slug} delay={i * 100}>
                <Link
                  href={contentPath(a.type, a.slug)}
                  className="group block bg-page rounded-2xl overflow-hidden border border-soft hover:shadow-lg transition-shadow h-full"
                >
                  {a.cover && (
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={a.cover}
                        alt={a.cover_alt ?? a.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <p className="type-caption text-muted mb-2">{a.updated_at}</p>
                    <h3 className="font-medium text-primary leading-snug group-hover:text-accent-hover transition-colors">
                      {a.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </div>
    </section>
  );
}
