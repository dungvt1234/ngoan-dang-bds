import Image from "next/image";
import Link from "next/link";
import type { Article, Comparison } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";

const TYPE_LABELS: Record<string, string> = {
  knowledge: "Kiến thức",
  analysis: "Phân tích",
  "case-study": "Case Study",
  comparison: "So sánh",
};

export interface KnowledgeItem {
  type: string;
  slug: string;
  title: string;
  excerpt: string;
  updated_at: string;
  cover?: string;
  cover_alt?: string;
}

// Kiến thức & phân tích — 1 bài lớn + list nhỏ (theo mẫu), data từ loader.
export function HomeKnowledge({ items }: { items: KnowledgeItem[] }) {
  if (items.length === 0) return null;
  const [first, ...rest] = items;
  return (
    <section aria-labelledby="home-knowledge-heading" className="bg-page">
      <div className="section-pad">
        <Container>
          <Reveal>
            <p className="type-kicker text-accent-hover mb-4">Góc phân tích</p>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <h2 id="home-knowledge-heading" className="font-display text-primary font-semibold text-[2rem] md:text-[2.75rem] leading-tight">
                Kiến thức &amp; phân tích thị trường
              </h2>
              <Link href="/kien-thuc" className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors shrink-0">
                Xem tất cả bài viết →
              </Link>
            </div>
          </Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Bài lớn */}
            <Reveal delay={100}>
            <Link
              href={contentPath(first.type as Article["type"] | Comparison["type"], first.slug)}
              className="group grid grid-cols-1 sm:grid-cols-2 gap-5 bg-clean rounded-2xl overflow-hidden border border-soft hover:shadow-lg transition-shadow h-full"
            >
              <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-[240px]">
                {first.cover ? (
                  <Image
                    src={first.cover}
                    alt={first.cover_alt ?? first.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-muted" aria-hidden="true" />
                )}
              </div>
              <div className="p-6 flex flex-col justify-center">
                <p className="type-kicker text-accent-hover mb-2">{TYPE_LABELS[first.type] ?? first.type}</p>
                <h3 className="type-h3 text-primary mb-2 group-hover:text-accent-hover transition-colors">
                  {first.title}
                </h3>
                <p className="type-small text-secondary line-clamp-3 mb-3">{first.excerpt}</p>
                <p className="type-caption text-muted">{first.updated_at}</p>
              </div>
            </Link>
            </Reveal>
            {/* List nhỏ */}
            <ul className="flex flex-col justify-center gap-6">
              {rest.slice(0, 3).map((a, i) => (
                <li key={`${a.type}-${a.slug}`}>
                  <Reveal delay={i * 100}>
                  <Link href={contentPath(a.type as Article["type"] | Comparison["type"], a.slug)} className="group flex gap-4 items-start">
                    <div className="relative w-28 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                      {a.cover && (
                        <Image
                          src={a.cover}
                          alt=""
                          aria-hidden="true"
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-primary group-hover:text-accent-hover transition-colors leading-snug mb-1">
                        {a.title}
                      </h3>
                      <p className="type-caption text-muted">
                        {(TYPE_LABELS[a.type] ?? a.type).toUpperCase()} · {a.updated_at}
                      </p>
                    </div>
                  </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </div>
    </section>
  );
}
