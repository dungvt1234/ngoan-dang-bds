"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Project } from "@/types/content";

gsap.registerPlugin(ScrollTrigger);

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

// Portfolio traverse kiểu cinematic-estate: pin + scrub ngang (desktop),
// snap-scroll mobile. Data từ loader, card light theo style hiện tại.
export function PropertyGrid({ projects }: { projects: Project[] }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const getAmount = () =>
        Math.max(0, track.scrollWidth - window.innerWidth + 120);      const pinRange = () => ({
        trigger: root,
        start: "top top",
        // Kéo dài quãng ghim gấp ~3.2 lần để vuốt hết card mới nhả,
        // tránh cảm giác nhạy/cuộn lướt qua.
        end: () => `+=${getAmount() * 3.2}`,
      });

      const tween = gsap.to(track, {
        x: () => -getAmount(),
        ease: "none",
        scrollTrigger: {
          ...pinRange(),
          pin: true,
          scrub: 1.5,
          invalidateOnRefresh: true,
          anticipatePin: 1,
          onUpdate: (self) => {
            const total = track.children.length;
            const idx = Math.max(
              0,
              Math.min(total - 1, Math.round(self.progress * (total - 1)))
            );
            setActive(idx);
          },
        },
      });

      const cards = Array.from(
        track.querySelectorAll<HTMLElement>(".deck-card")
      );

      // Tilt hiện rõ suốt traverse, không mờ: card nghiêng mạnh lúc vào,
      // duỗi thẳng dần theo tiến trình pin.
      gsap.set(cards, {
        opacity: 1,
        rotateY: 32,
        rotateX: 10,
        y: 60,
        transformOrigin: "left center",
      });
      const straighten = gsap.to(cards, {
        opacity: 1,
        rotateY: 0,
        rotateX: 0,
        y: 0,
        ease: "none",
        stagger: 0.12,
        scrollTrigger: {
          ...pinRange(),
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      return () => {
        straighten.scrollTrigger?.kill();
        straighten.kill();
        tween.scrollTrigger?.kill();
        tween.kill();
      };
    });

    // Ảnh load sau làm track dài ra → đo lại để card cuối không bị cắt.
    const onLoad = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") onLoad();
    else window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, [projects]);

  return (
    <section
      ref={rootRef}
      aria-labelledby="portfolio-heading"
      className="relative bg-clean py-24 md:py-0 px-6 md:px-12 lg:px-16"
    >
      {/* Section Header (inside pinned area on desktop) */}
      <div className="mb-12 md:mb-0 md:absolute md:top-10 md:left-12 lg:left-16 md:right-12 lg:right-16 z-20 pr-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="max-w-none">
          <p className="type-kicker text-accent-hover mb-4">Dự án nổi bật</p>
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

      {/* 3D stage */}
      <div className="deck-stage pointer-events-none [perspective:1400px] mt-8 md:mt-0 md:h-screen md:flex md:items-center">
        <div
          ref={trackRef}
          data-lenis-prevent
          className="deck-track pointer-events-auto flex gap-6 md:gap-8 md:will-change-transform overflow-x-auto md:overflow-visible snap-x touch-[pan-x_pan-y]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {projects.slice(0, 6).map((p, i) => (
            <Link
              key={p.slug}
              href={`/du-an/${p.slug}`}
              className={`deck-card pointer-events-auto w-[78vw] sm:w-[400px] md:w-[400px] shrink-0 snap-center group bg-page rounded-2xl overflow-hidden border border-soft hover:shadow-xl transition-shadow ${
                i === 0 ? "md:ml-[30vw]" : ""
              }`}
              style={{ transformStyle: "preserve-3d", flex: "0 0 auto" }}
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

          {/* End card */}
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

        {/* HUD counter */}
        <div className="deck-hud absolute bottom-6 right-6 md:right-12 lg:right-16 z-20 hidden md:flex items-baseline gap-2">
          <span className="font-display text-lg tracking-[0.2em] text-primary">
            {String(active + 1).padStart(2, "0")}
          </span>
          <span className="text-primary/25">/</span>
          <span className="font-display text-lg tracking-[0.2em] text-primary/40">
            {String(Math.min(projects.length, 6) + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="md:hidden flex items-center gap-2 text-secondary text-[11px] mt-4 tracking-widest uppercase">
        Vuốt để khám phá
      </div>
    </section>
  );
}
