"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Container } from "@/components/ui/Container";

gsap.registerPlugin(ScrollTrigger);

// HomeHero cinematic: preloader CSS (thanh trượt + chữ thở, không đếm %)
// → màn kéo lên → ảnh reveal + copy stagger → parallax nhẹ.
// Gỡ màn 3 lớp: timeline xong / window load + 3s / CSS thuần 3.5s / tối đa 6s.
export interface HomeHeroProps {
  kicker: string;
  headline: string;
  subline: string;
  supporting: string[];
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image?: { src: string; alt: string; credit?: string };
}

export function HomeHero({
  kicker,
  headline,
  subline,
  supporting,
  primaryCta,
  secondaryCta,
  image,
}: HomeHeroProps) {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const dismiss = () => {
      const el = root.querySelector<HTMLElement>(".cine-preloader");
      if (el) el.style.display = "none";
    };

    try {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const q = gsap.utils.selector(root);
      const preloader = q(".cine-preloader");
      const media = q(".cine-media");
      const photo = q(".cine-photo");
      const lines = q(".cine-word");
      const masks = q(".cine-mask");
      const meta = q(".cine-meta");

      if (reduce) {
        dismiss();
        return;
      }

      const onLoad = () => window.setTimeout(dismiss, 3000);
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad);
      const safety = window.setTimeout(dismiss, 6000);

      const ctx = gsap.context(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        // 1. Chờ hiệu ứng CSS (~1.4s) rồi kéo màn lên.
        tl.to(preloader, { yPercent: -100, duration: 0.8, ease: "power4.inOut" }, "+=1.4")
          .set(preloader, { display: "none" })
          // 2. Ảnh reveal từ scale sâu + copy stagger lên
          .fromTo(
            photo,
            { scale: 1.15 },
            { scale: 1, duration: 1.6, ease: "power2.out" },
            "-=0.7"
          )
          .fromTo(
            media,
            { clipPath: "inset(8% 4% 8% 4% round 24px)" },
            { clipPath: "inset(0% 0% 0% 0% round 0px)", duration: 1.2 },
            "<"
          )
          .fromTo(
            lines,
            { yPercent: 110, rotate: 4, opacity: 0 },
            {
              yPercent: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.07,
              // Mở khung mask sau animation để dấu tiếng Việt không bao giờ bị cắt.
              onComplete: () => gsap.set(masks, { overflow: "visible" }),
            },
            "-=0.7"
          )
          .fromTo(
            meta,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
            "-=0.5"
          );

        // 3. Parallax nhẹ khi scroll — CHỈ desktop (mobile tắt để mượt + tiết kiệm pin).
        if (window.matchMedia("(min-width: 768px)").matches) {
          gsap.to(photo, {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true },
          });
        }
      }, root);

      return () => {
        window.clearTimeout(safety);
        window.removeEventListener("load", onLoad);
        ctx.revert();
      };
    } catch {
      dismiss();
    }
  }, []);

  return (
    <>
      {/* Preloader — hiệu ứng chờ thuần CSS, gỡ 3 lớp JS + 1 lớp CSS */}
      <div className="cine-preloader cine-preloader-css fixed inset-0 z-[100] bg-ink text-ondark flex flex-col justify-between p-8 md:p-12">
        <div className="flex items-center justify-between">
          <span className="type-kicker preload-mark">Ngoan Đặng</span>
          <span className="type-caption text-ondark/60">BĐS dự án Vũng Tàu</span>
        </div>
        <div className="flex flex-col items-center gap-6">
          <span className="font-display text-5xl md:text-6xl preload-mark" aria-hidden="true">
            N
          </span>
          <div className="w-40 md:w-56 h-px bg-white/10 overflow-hidden">
            <div className="preload-bar h-full w-1/3 bg-accent" />
          </div>
          <span className="type-caption text-ondark/60 tracking-[0.2em] uppercase">
            Đang chuẩn bị
          </span>
        </div>
        <div />
      </div>
      <noscript>
        <style>{`.cine-preloader{display:none}`}</style>
      </noscript>

      <section ref={rootRef} aria-labelledby="home-hero-heading" className="relative bg-ink text-ondark overflow-hidden">
        {image && (
          <div className="cine-media absolute inset-0">
            <div className="cine-photo relative w-full h-[115%]">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="100vw"
                className="object-cover hero-drift"
                priority
              />
            </div>
            <div className="absolute inset-0 bg-dark/20" />
            <div className="absolute inset-0 bg-gradient-to-tr from-ink/85 via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-ink/80 to-transparent" />
          </div>
        )}

        <div className="relative z-10 min-h-[100svh] flex items-end">
          <div className="w-full pb-20 md:pb-28 pt-40">
            <Container>
              <div className="max-w-[860px]">
                <p className="cine-meta type-kicker text-accent mb-6 flex items-center gap-3">
                  <span aria-hidden="true" className="hero-rule inline-block w-10 h-px bg-accent" />
                  {kicker}
                </p>
                <h1
                  id="home-hero-heading"
                  className="type-display mb-6 leading-[1.3] tracking-[0.005em] [text-shadow:0_2px_24px_rgba(0,0,0,0.45)]"
                >
                  <span className="cine-mask block overflow-hidden px-2 -mx-2 pt-3 -mt-3 pb-4 -mb-4" aria-hidden="true">
                    {headline.split(" ").map((word, i) => (
                      <span key={i} className="inline-block align-bottom">
                        <span className="cine-word inline-block will-change-transform">
                          {word}
                          {i < headline.split(" ").length - 1 ? " " : ""}
                        </span>
                      </span>
                    ))}
                  </span>
                </h1>
                <p className="cine-meta font-display text-xl md:text-2xl text-accent font-medium tracking-wide mb-8 [text-shadow:0_2px_16px_rgba(0,0,0,0.5)]">{subline}</p>
                {supporting.length > 0 && (
                <ul className="cine-meta flex flex-wrap gap-3 mb-10">
                  {supporting.map((line) => (
                    <li
                      key={line}
                      className="inline-flex items-center gap-2 rounded-full border border-accent/60 bg-white/10 backdrop-blur-sm px-5 py-2.5 text-[15px] md:text-base font-medium text-white [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]"
                    >
                      <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {line}
                    </li>
                  ))}
                </ul>
                )}
                <div className="cine-meta flex flex-col gap-4">
                  <Link
                    href={primaryCta.href}
                    className="flex items-center gap-3 w-full rounded-full bg-accent hover:bg-accent-hover transition-colors p-2 pl-6 md:pl-8"
                  >
                    <span className="flex-1 text-center text-ink font-medium text-[15px] md:text-base">
                      {primaryCta.label}
                    </span>
                    <span
                      aria-hidden="true"
                      className="w-12 h-12 md:w-14 md:h-14 shrink-0 grid place-items-center rounded-full bg-ink text-accent"
                    >
                      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M21 12a8 8 0 01-8 8H4l2.3-2.9A8 8 0 1121 12z" strokeLinejoin="round" />
                        <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
                        <circle cx="13" cy="12" r="1" fill="currentColor" stroke="none" />
                        <circle cx="17" cy="12" r="1" fill="currentColor" stroke="none" />
                      </svg>
                    </span>
                  </Link>
                  <Link
                    href={secondaryCta.href}
                    className="text-ondark/85 underline decoration-accent decoration-2 underline-offset-8 hover:text-accent transition-colors text-center sm:text-left min-h-[48px] inline-flex items-center justify-center sm:justify-start"
                  >
                    {secondaryCta.label}
                  </Link>
                </div>
                {image?.credit && (
                  <p className="cine-meta type-caption text-ondark/60 mt-8">{image.credit}</p>
                )}
                <div className="cine-meta mt-12 hidden md:flex items-center gap-3" aria-hidden="true">
                  <span className="type-caption text-ondark/60 tracking-[0.2em] uppercase">
                    Cuộn để khám phá
                  </span>
                  <span className="scroll-hint-line block w-px h-10 bg-white/15">
                    <span className="w-px h-full bg-accent" />
                  </span>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </section>
    </>
  );
}
