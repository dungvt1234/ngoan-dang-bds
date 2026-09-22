"use client";

import { useCountUp } from "@/lib/useCountUp";
import { FragmentReveal } from "./FragmentReveal";

function StatCounter({
  value,
  suffix = "",
}: {
  value: number;
  suffix?: string;
}) {
  const { rootRef, value: count } = useCountUp(value);
  return (
    <span ref={rootRef} className="tabular-nums">
      {count}
      {suffix}
    </span>
  );
}

interface EditorialSectionProps {
  kicker?: string;
  title: string;
  content: string;
  image?: string;
  imagePosition?: "left" | "right";
  stats?: { value: number; suffix?: string; label: string }[];
}

export function EditorialSection({
  kicker,
  title,
  content,
  image,
  imagePosition = "left",
  stats,
}: EditorialSectionProps) {
  const isLeft = imagePosition === "left";

  return (
    <section id="about" className="py-28 md:py-40 px-6 md:px-12 lg:px-16 bg-muted">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Image — asymmetric: 5-6 cols */}
          {image && (
            <div
              className={`md:col-span-5 ${
                isLeft ? "md:order-1" : "md:order-2"
              }`}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[3/4] card-spatial">
                <FragmentReveal>
                  <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover aspect-[3/4]"
                    loading="lazy"
                  />
                </FragmentReveal>
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent pointer-events-none" />
              </div>
            </div>
          )}

          {/* Content — asymmetric: 6-7 cols */}
          <div
            className={`md:col-span-6 ${
              isLeft ? "md:col-start-7 md:order-2" : "md:col-start-1 md:order-1"
            }`}
          >
            {kicker && (
              <p className="text-kicker text-accent mb-5">{kicker}</p>
            )}
            <h2 className="text-display font-editorial text-primary mb-7 leading-[1.08]">
              {title}
            </h2>
            <p className="text-secondary text-lg leading-relaxed mb-10 max-w-lg">
              {content}
            </p>

            {/* Stats */}
            {stats && (
              <div className="flex gap-10 pt-8 border-t border-charcoal/10">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl md:text-4xl font-editorial font-semibold text-charcoal tracking-tight">
                      <StatCounter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-xs text-bluegray mt-1.5 uppercase tracking-wide">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
