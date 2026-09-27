"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/content";

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

// Traverse KHÔNG dùng GSAP pin (từng gây kẹt scroll + treo tab):
// section cao hơn viewport, khối sticky, translateX tính tay từ scrollY.
// Native scroll event + rAF, cleanup sạch, reduced-motion tắt hẳn.
export function PropertyGrid({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;
    if (window.matchMedia("(min-width: 768px)").matches === false) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const measure = () => {
      const max = Math.max(0, track.scrollWidth - window.innerWidth + 120);
      // Section cao = 1 viewport + quãng chạy (giới hạn để không quá dài).
      section.style.height = `calc(100vh + ${Math.min(max * 1.6, 2600)}px)`;
      return max;
    };

    let max = measure();
    let raf = 0;
    let lastIdx = -1;

    const update = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const total = section.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -rect.top / Math.max(1, total)));
      const x = progress * max;
      track.style.transform = `translate3d(${-x}px, 0, 0)`;

      // Tilt nền (card luôn nghiêng rõ như bản gốc) + tilt vị trí
      // (giữa thẳng, hai bên nghiêng). Tilt nền mờ dần theo tiến trình.
      const cx = window.innerWidth / 2;
      const cards = track.children;
      const baseTilt = (1 - progress) * 22;
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i] as HTMLElement;
        const r = card.getBoundingClientRect();
        const offset = (r.left + r.width / 2 - cx) / window.innerWidth;
        const clamped = Math.max(-0.5, Math.min(0.5, offset));
        card.style.transform = `perspective(1400px) rotateY(${(clamped * -28 - baseTilt).toFixed(2)}deg) rotateX(4deg)`;
      }

      const idx = Math.max(
        0,
        Math.min(cards.length - 1, Math.round(progress * (cards.length - 1)))
      );
      // Chỉ render lại khi đổi card — tránh re-render mỗi frame gây giật.
      if (idx !== lastIdx) {
        lastIdx = idx;
        setActive(idx);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      max = measure();
      update();
    };

    max = measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    // Ảnh về muộn đổi scrollWidth → đo lại để đoạn sticky đủ dài,
    // tránh deck chưa chạy hết đã hết đất cuộn.
    window.addEventListener("load", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [projects]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="portfolio-heading"
      className="relative bg-clean"
    >
      <div className="md:sticky md:top-0 md:h-screen flex flex-col justify-center py-24 md:py-0 px-6 md:px-12 lg:px-16 overflow-hidden">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:px-0 max-w-none">
          <div>
            <p className="type-kicker text-secondary mb-4">Dự án nổi bật</p>
            <h2 id="portfolio-heading" className="font-display text-primary font-semibold text-[1.65rem] md:text-[2.5rem] md:whitespace-nowrap leading-tight">
              Những dự án đang được quan tâm
            </h2>
          </div>
          <Link
            href="/du-an"
            className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors shrink-0"
          >
            Xem tất cả dự án →
          </Link>
        </div>

        <div className="mt-8 md:mt-10">
          <div
            ref={trackRef}
            data-lenis-prevent
            className="flex gap-6 md:gap-8 overflow-x-auto md:overflow-visible snap-x touch-[pan-x_pan-y] will-change-transform"
          >
            {projects.slice(0, 6).map((p) => (
              <Link
                key={p.slug}
                href={`/du-an/${p.slug}`}
                className="deck-card pointer-events-auto w-[78vw] sm:w-[400px] md:w-[400px] shrink-0 snap-center group bg-page rounded-2xl overflow-hidden border border-soft hover:shadow-xl transition-shadow"
                style={{ flex: "0 0 auto" }}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.cover_alt}
                    fill
                    sizes="(max-width: 768px) 78vw, 400px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-3">
                    <span className="type-caption font-medium text-accent-hover uppercase tracking-wider">
                      {SEGMENT_LABELS[p.segment]}
                    </span>
                    <span className="type-caption text-muted">· {STATUS_LABELS[p.status]}</span>
                  </div>
                  <h3 className="font-medium text-primary text-lg leading-snug mb-1 group-hover:text-accent-hover transition-colors">
                    {p.name}
                  </h3>
                  <p className="type-small text-secondary">{p.location_label}</p>
                </div>
              </Link>
            ))}

            <Link
              href="/du-an"
              className="deck-card pointer-events-auto w-[60vw] sm:w-[320px] shrink-0 snap-center flex items-center justify-center rounded-2xl bg-ink text-ondark group"
            >
              <div className="text-center p-8">
                <p className="text-accent text-sm tracking-widest uppercase mb-3">Xem tất cả</p>
                <h3 className="font-display text-3xl leading-tight mb-4">
                  Mọi phân tích
                  <br />
                  dự án
                </h3>
                <span className="inline-block border-b border-white/40 pb-0.5 group-hover:border-accent transition-colors duration-300">
                  Khám phá →
                </span>
              </div>
            </Link>
          </div>
        </div>

        <div className="hidden md:flex items-baseline gap-2 mt-8 text-primary/60">
          <span className="font-display text-lg tracking-[0.2em] text-primary">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-primary/25">/</span>
          <span className="font-display text-lg tracking-[0.2em] text-primary/40">
            {String(Math.min(projects.length, 6) + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="md:hidden flex items-center gap-2 text-secondary text-[11px] mt-4 tracking-widest uppercase">
          Vuốt để khám phá
        </div>
      </div>
    </section>
  );
}
