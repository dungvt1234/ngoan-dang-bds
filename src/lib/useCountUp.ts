"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts from 0 to target when the element enters the viewport.
 * Uses requestAnimationFrame for a smooth, slow cinematic ease.
 */
export function useCountUp(target: number, duration = 1400) {
  const ref = useRef<number>(0);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [value, setValue] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            ref.current = Math.round(eased * target);
            setValue(ref.current);
            if (progress < 1) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return { rootRef, value };
}
