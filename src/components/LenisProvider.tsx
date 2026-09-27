"use client";

import { useEffect, ReactNode } from "react";
import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function LenisProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Tôn trọng prefers-reduced-motion: tắt smooth scroll, giữ scroll native.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    // Sync Lenis scroll to GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    // Chỉ dùng MỘT vòng raf (gsap.ticker). Vòng requestAnimationFrame riêng
    // trước đây khiến lenis.raf chạy 2 lần/frame → giật + nguy cơ treo tab.
    // Giữ đúng ref để cleanup gỡ chính nó (trước đây gỡ nhầm hàm khác
    // khiến raf rò rỉ, nhiều vòng raf đánh nhau → kẹt/giật khi chuyển trang).
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    // Anchor cùng trang (#id): để Lenis cuộn tới thay vì nhảy native —
    // nhảy native lệch khỏi trạng thái Lenis đang giữ → cảm giác kẹt/đứng.
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!a) return;
      const hash = a.getAttribute("href");
      if (!hash || hash.length < 2) return;
      const el = document.querySelector(hash);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el as HTMLElement, { offset: -72, duration: 1.1 });
      history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);

    // Ảnh/font về muộn đổi chiều cao trang → refresh trigger cho chắc.
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      document.removeEventListener("click", onClick);
      window.removeEventListener("load", onLoad);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
