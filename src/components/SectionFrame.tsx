"use client";

import { useEffect, useRef, ReactNode } from "react";

interface SectionFrameProps {
  children: ReactNode;
  className?: string;
}

export function SectionFrame({ children, className = "" }: SectionFrameProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const frame = el.querySelector<HTMLElement>(".sf-overlay");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!frame) return;
        if (entry.isIntersecting) {
          frame.classList.add("is-active");
        } else {
          frame.classList.remove("is-active");
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`relative ${className}`}>
      {/* Architectural frame overlay */}
      <div
        className="sf-overlay pointer-events-none absolute inset-0 z-20 opacity-0 scale-[0.985]
                   transition-opacity duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]
                   [transition:opacity_1.1s_cubic-bezier(0.22,1,0.36,1),transform_1.1s_cubic-bezier(0.22,1,0.36,1)]"
        aria-hidden="true"
      >
        {/* Outer hairline */}
        <div className="absolute inset-2 md:inset-4 border border-teal/35" />

        {/* Corner marks — architectural registration marks */}
        <div className="absolute top-4 left-4 md:top-6 md:left-6 w-8 h-px bg-accent origin-left scale-x-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute top-4 left-4 md:top-6 md:left-6 h-8 w-px bg-accent origin-top scale-y-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute top-4 right-4 md:top-6 md:right-6 w-8 h-px bg-accent origin-right scale-x-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute top-4 right-4 md:top-6 md:right-6 h-8 w-px bg-accent origin-top scale-y-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 w-8 h-px bg-accent origin-left scale-x-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 h-8 w-px bg-accent origin-bottom scale-y-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 w-8 h-px bg-accent origin-right scale-x-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
        <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 h-8 w-px bg-accent origin-bottom scale-y-0 transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)]" />
      </div>

      {/* Animate overlay children when active */}
      <style>{`
        .sf-overlay.is-active { opacity: 1; transform: scale(1); }
        .sf-overlay.is-active .absolute { transform: none; }
      `}</style>

      {children}
    </div>
  );
}
