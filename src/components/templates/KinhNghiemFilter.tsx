"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Article } from "@/types/content";
import { contentPath } from "@/lib/routes";
import { Reveal } from "@/components/ui/Reveal";

const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Meta({ a }: { a: Article }) {
  return (
    <p className="type-caption text-muted">
      {a.updated_at}
      {typeof a.reading_minutes === "number" ? ` · ${a.reading_minutes} phút đọc` : null}
    </p>
  );
}

function Card({ a, i }: { a: Article; i: number }) {
  return (
    <Reveal delay={Math.min(i, 5) * 60} className="h-full">
      <Link
        href={contentPath(a.type, a.slug)}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-soft bg-clean transition-shadow hover:shadow-lg"
      >
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
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
          {a.tags.length > 0 && (
            <p className="type-kicker text-accent mb-2">
              {a.tags.slice(0, 2).join(" · ")}
            </p>
          )}
          <h3 className="text-lg font-medium leading-snug text-primary transition-colors group-hover:text-accent-hover mb-2">
            {a.title}
          </h3>
          <p className="type-small text-secondary line-clamp-2 mb-3">{a.excerpt}</p>
          <div className="mt-auto">
            <Meta a={a} />
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

// Filter client-side: tìm kiếm không dấu + lọc theo tag.
// Khi chưa lọc: bài mới nhất lên featured, còn lại vào grid.
export function KinhNghiemFilter({ articles }: { articles: Article[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("all");

  const tags = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => a.tags.forEach((t) => set.add(t)));
    return ["all", ...[...set].sort()];
  }, [articles]);

  const filtered = useMemo(() => {
    const q = norm(query.trim());
    return articles.filter((a) => {
      if (tag !== "all" && !a.tags.includes(tag)) return false;
      if (q) {
        const hay = norm(`${a.title} ${a.excerpt} ${a.tags.join(" ")}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [articles, query, tag]);

  const isFiltering = query.trim() !== "" || tag !== "all";
  const featured = !isFiltering ? filtered[0] : undefined;
  const rest = !isFiltering ? filtered.slice(1) : filtered;

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <label className="block max-w-[480px]">
          <span className="mb-2 block text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary">
            Tìm bài viết
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pháp lý, giá/m², vay mua nhà... (gõ không dấu vẫn ra)"
            aria-label="Tìm bài viết kinh nghiệm mua nhà"
            className="type-small min-h-[48px] w-full rounded-xl border border-soft bg-clean px-4 text-primary placeholder:text-secondary focus:outline-none"
          />
        </label>
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary">
            Chủ đề
          </span>
          {tags.map((t) => {
            const active = t === tag;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTag(t)}
                aria-pressed={active}
                className={`min-h-[40px] rounded-full border px-4 text-sm font-medium transition-colors ${
                  active
                    ? "border-ink bg-ink text-ondark"
                    : "border-soft bg-clean text-secondary hover:border-primary"
                }`}
              >
                {t === "all" ? "Tất cả" : t}
              </button>
            );
          })}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-soft p-10 text-center">
          <p className="type-body text-secondary mb-4">
            {query.trim()
              ? `Không tìm thấy bài nào với "${query.trim()}". Thử từ khóa khác nhé.`
              : "Chưa có bài nào thuộc chủ đề này."}
          </p>
          <Link
            href="/lien-he"
            className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 transition-colors hover:text-accent-hover"
          >
            Hỏi Ngoan trực tiếp qua Zalo →
          </Link>
        </div>
      ) : (
        <>
          {featured && (
            <Reveal className="mb-8">
              <Link
                href={contentPath(featured.type, featured.slug)}
                className="group grid grid-cols-1 overflow-hidden rounded-2xl border border-soft bg-clean transition-shadow hover:shadow-lg sm:grid-cols-2"
              >
                <div className="relative aspect-[16/10] sm:aspect-auto sm:min-h-[260px]">
                  {featured.cover ? (
                    <Image
                      src={featured.cover}
                      alt={featured.cover_alt ?? featured.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-muted" aria-hidden="true" />
                  )}
                </div>
                <div className="flex flex-col justify-center p-6 md:p-8">
                  <p className="type-kicker text-accent mb-2">Nên đọc trước</p>
                  <h2 className="type-h3 text-primary mb-2 transition-colors group-hover:text-accent-hover">
                    {featured.title}
                  </h2>
                  <p className="type-small text-secondary line-clamp-3 mb-3">{featured.excerpt}</p>
                  <Meta a={featured} />
                </div>
              </Link>
            </Reveal>
          )}

          <div className="mb-8 flex items-baseline gap-3">
            <h2 className="font-display text-primary font-semibold text-[1.75rem] leading-tight md:text-[2.25rem]">
              {isFiltering ? "Kết quả" : "Tất cả bài viết"}
            </h2>
            <span className="type-small text-muted">{rest.length} bài</span>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {rest.map((a, i) => (
              <Card key={`${a.type}-${a.slug}`} a={a} i={i} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
