"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Preloader } from "./Preloader";
import type { Project } from "@/types/content";

const AUTOPLAY_MS = 5000;

// Hero carousel 4 dự án trọng điểm: tự nhảy 6s, vuốt tay mobile,
// dots + nút chuyển, dừng khi hover/chạm. CSS crossfade (không GSAP).
export function HomeProjectHero({ projects }: { projects: Project[] }) {
  const items = projects.slice(0, 4);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);

  const goTo = useCallback(
    (i: number) => setIndex(((i % items.length) + items.length) % items.length),
    [items.length]
  );

  useEffect(() => {
    if (paused || items.length < 2) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => goTo(index + 1), AUTOPLAY_MS);
    return () => window.clearTimeout(t);
  }, [paused, index, items.length, goTo]);

  if (items.length === 0) return null;
  const p = items[index];

  return (
    <>
      <Preloader brand="Ngoan Đặng" sub="BĐS dự án Vũng Tàu" />
      <section
        aria-labelledby="project-hero-heading"
        aria-roledescription="carousel"
        className="relative bg-page text-primary pt-6 md:pt-8 pb-6 md:pb-8"
      >
        <Container>
          <div
            className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center rounded-[28px] border border-soft bg-clean p-6 md:p-10 shadow-xl overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => {
              setPaused(true);
              touchX.current = e.touches[0].clientX;
            }}
            onTouchEnd={(e) => {
              const start = touchX.current;
              touchX.current = null;
              if (start === null) return;
              const dx = e.changedTouches[0].clientX - start;
              if (Math.abs(dx) > 48) goTo(index + (dx < 0 ? 1 : -1));
              window.setTimeout(() => setPaused(false), 8000);
            }}
          >
            {/* Left — content (fade lại mỗi khi đổi slide) */}
            <div key={p.slug} className="animate-reveal max-w-[560px]">
              <p className="type-kicker text-accent-hover mb-4 flex items-center gap-3">
                <span aria-hidden="true" className="inline-block w-8 h-px bg-accent" />
                Dự án trọng điểm {index + 1}/{items.length}
              </p>
              <h1
                id="project-hero-heading"
                className="font-display text-primary font-semibold leading-[1.15] mb-4 text-[2.25rem] md:text-[3rem]"
              >
                {p.name}
              </h1>
              <p className="type-body text-secondary mb-5">{p.location_label}</p>
              <ul className="flex flex-wrap gap-2 mb-7" aria-label="Điểm nổi bật">
                {p.price_range_text && (
                  <li className="inline-flex items-center rounded-full bg-accent/15 border border-accent/50 px-4 py-1.5 type-small font-medium text-accent-hover">
                    {p.price_range_text}
                  </li>
                )}
                {p.legal_status && (
                  <li className="inline-flex items-center rounded-full bg-page border border-soft px-4 py-1.5 type-small font-medium text-secondary">
                    Pháp lý:{" "}
                    {p.legal_status === "ro-rang"
                      ? "Rõ ràng"
                      : p.legal_status === "dang-hoan-thien"
                        ? "Đang hoàn thiện"
                        : "Cần kiểm chứng"}
                  </li>
                )}
                {p.developer_name && (
                  <li className="inline-flex items-center rounded-full bg-page border border-soft px-4 py-1.5 type-small font-medium text-secondary">
                    {p.developer_name}
                  </li>
                )}
              </ul>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
                <Link
                  href={`/du-an/${p.slug}`}
                  className="inline-flex min-h-[48px] items-center justify-center px-7 rounded-md bg-accent text-ink font-medium hover:bg-accent-hover transition-colors"
                >
                  Xem phân tích chi tiết →
                </Link>
                <Link
                  href="/du-an"
                  className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors text-center sm:text-left"
                >
                  Tất cả dự án
                </Link>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => goTo(index - 1)}
                  aria-label="Dự án trước"
                  className="w-11 h-11 grid place-items-center rounded-full border border-primary/20 text-primary hover:border-primary transition-colors"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={() => goTo(index + 1)}
                  aria-label="Dự án tiếp"
                  className="w-11 h-11 grid place-items-center rounded-full border border-primary/20 text-primary hover:border-primary transition-colors"
                >
                  ›
                </button>
                <div className="flex gap-1 ml-2" role="tablist" aria-label="Chọn dự án">
                  {items.map((item, i) => (
                    <button
                      key={item.slug}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Xem ${item.name}`}
                      onClick={() => goTo(i)}
                      className="flex min-h-[44px] min-w-[44px] items-center justify-center"
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1 rounded-full transition-all duration-500 ${
                          i === index ? "w-8 bg-accent" : "w-4 bg-primary/20"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — image slider trượt ngang */}
            <div className="relative aspect-[16/11] overflow-hidden rounded-2xl bg-muted">
              <div
                className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {items.map((item, i) => (
                  <div key={item.slug} className="relative w-full h-full shrink-0" aria-hidden={i !== index}>
                    <Image
                      src={item.cover}
                      alt={i === index ? item.cover_alt : ""}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                      priority={i === 0}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
