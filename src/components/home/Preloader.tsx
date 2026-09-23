"use client";

import { useEffect } from "react";
import { gsap } from "gsap";

// Preloader dùng chung cho hero (hiệu ứng chờ CSS + gỡ 3 lớp JS + CSS).
export function Preloader({ brand, sub }: { brand: string; sub: string }) {
  useEffect(() => {
    const dismiss = () => {
      const el = document.querySelector<HTMLElement>(".cine-preloader");
      if (el) el.style.display = "none";
    };
    try {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        dismiss();
        return;
      }
      const onLoad = () => window.setTimeout(dismiss, 3000);
      if (document.readyState === "complete") onLoad();
      else window.addEventListener("load", onLoad);
      const safety = window.setTimeout(dismiss, 6000);
      return () => {
        window.clearTimeout(safety);
        window.removeEventListener("load", onLoad);
      };
    } catch {
      dismiss();
    }
  }, []);

  return (
    <>
      <div className="cine-preloader cine-preloader-css fixed inset-0 z-[100] bg-ink text-ondark flex flex-col justify-between p-8 md:p-12">
        <div className="flex items-center justify-between">
          <span className="type-kicker preload-mark">{brand}</span>
          <span className="type-caption text-ondark/60">{sub}</span>
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
    </>
  );
}
