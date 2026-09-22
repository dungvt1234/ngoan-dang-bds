"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/types/content";
import { Reveal } from "@/components/ui/Reveal";

const SEGMENTS = [
  { value: "all", label: "Tất cả" },
  { value: "nghi-duong", label: "Nghỉ dưỡng" },
  { value: "de-o", label: "Để ở" },
  { value: "do-thi", label: "Khu đô thị" },
] as const;

const STATUSES = [
  { value: "all", label: "Tất cả" },
  { value: "sap-mo-ban", label: "Sắp mở bán" },
  { value: "dang-ban", label: "Đang bán" },
  { value: "da-ban-giao", label: "Đã bàn giao" },
] as const;

function Pills<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="type-kicker text-muted mr-2">{label}</span>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`min-h-[40px] px-4 rounded-full text-sm font-medium border transition-colors ${
              active
                ? "bg-ink text-ondark border-ink"
                : "bg-clean text-secondary border-soft hover:border-primary"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

// Filter client-side 2 chiều (phân khúc + trạng thái).
// Nhận projects từ server boundary — không đọc loader trực tiếp.
export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [segment, setSegment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(
    () =>
      projects.filter(
        (p) =>
          (segment === "all" || p.segment === segment) &&
          (status === "all" || p.status === status)
      ),
    [projects, segment, status]
  );

  return (
    <div>
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between mb-10 pb-8 border-b border-soft">
        <Pills label="Phân khúc" options={SEGMENTS} value={segment} onChange={setSegment} />
        <Pills label="Trạng thái" options={STATUSES} value={status} onChange={setStatus} />
      </div>

      <p className="type-kicker text-secondary mb-4">Danh sách dự án</p>
      <h2 className="font-display text-primary font-semibold text-[1.75rem] md:text-[2.25rem] leading-tight mb-8">
        {segment === "all" && status === "all" ? "Tất cả dự án" : "Kết quả lọc"}
      </h2>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-soft rounded-2xl p-10 text-center">
          <p className="type-body text-secondary mb-4">
            Chưa có dự án nào thuộc nhóm này.
          </p>
          <Link
            href="/lien-he"
            className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors"
          >
            Để lại nhu cầu — Ngoan báo khi có →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filtered.map((p, i) => (
            <Reveal key={p.slug} delay={Math.min(i, 4) * 60}>
              <Link
                href={`/du-an/${p.slug}`}
                className="group block bg-clean rounded-2xl overflow-hidden border border-soft hover:shadow-lg transition-shadow h-full"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={p.cover}
                    alt={p.cover_alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3 className="font-medium text-primary text-lg leading-snug mb-1 group-hover:text-accent-hover transition-colors">
                    {p.name}
                  </h3>
                  <p className="type-small text-secondary">{p.location_label}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
