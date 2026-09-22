"use client";

import { useEffect, useRef, useState } from "react";

// Dải marquee mỏng nối hero tối → thân sáng. Chữ Ivory + gold,
// chạy CSS thuần, đứng yên khi reduced-motion hoặc hover.
const ITEMS = [
  "Vũng Tàu",
  "Vị trí",
  "Pháp lý",
  "Dòng tiền",
  "Tiến độ",
  "Phân tích",
  "Đồng hành",
  "Niềm tin",
];

export function Marquee() {
  const [paused, setPaused] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPaused(true);
    }
  }, []);

  return (
    <div
      className="bg-ink border-y border-white/10 py-4 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        ref={ref}
        className="flex whitespace-nowrap animate-marquee"
        style={paused ? { animationPlayState: "paused" } : undefined}
        aria-hidden="true"
      >
        {[...ITEMS, ...ITEMS].map((item, i) => (
          <span key={i} className="flex items-center">
            <span className="text-ondark/70 text-xs tracking-[0.2em] uppercase px-8">
              {item}
            </span>
            <span className="text-accent text-xs">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
