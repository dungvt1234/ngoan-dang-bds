"use client";

import { useEffect, useRef, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FragmentRevealProps {
  children: ReactNode;
  /** Number of vertical cover slats that peel away */
  slats?: number;
  /** Color of the covering slats (should match section background) */
  coverColor?: string;
  className?: string;
}

/**
 * Cinematic "assemble" reveal — the image (child) is hidden behind a set of
 * opaque vertical slats that slide out staggered on scroll, so the image
 * appears to assemble from many fragments. Lightweight (no canvas).
 */
export function FragmentReveal({
  children,
  slats = 8,
  coverColor = "#EFEAE2",
  className = "",
}: FragmentRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      gsap.set(root.querySelectorAll(".frag-cover"), { autoAlpha: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      const covers = root.querySelectorAll<HTMLElement>(".frag-cover");
      gsap.to(covers, {
        autoAlpha: 0,
        y: (i: number) => (i % 2 === 0 ? -55 : 55),
        scaleY: 1.1,
        duration: 0.7,
        ease: "power3.out",
        stagger: {
          each: 0.05,
          from: "edges",
        },
        scrollTrigger: {
          trigger: root,
          start: "top 80%",
          once: true,
        },
      });
    }, root);

    return () => ctx.revert();
  }, [slats]);

  return (
    <div
      ref={rootRef}
      className={`fragment-reveal relative overflow-hidden ${className}`}
    >
      {/* The actual image/content (revealed beneath) */}
      <div className="relative z-0">{children}</div>

      {/* Cover slats that peel away */}
      <div
        className="absolute inset-0 z-10 grid w-full h-full pointer-events-none"
        style={{ gridTemplateColumns: `repeat(${slats}, 1fr)` }}
        aria-hidden="true"
      >
        {Array.from({ length: slats }).map((_, i) => (
          <div
            key={i}
            className="frag-cover h-full will-change-transform"
            style={{ backgroundColor: coverColor }}
          />
        ))}
      </div>
    </div>
  );
}
