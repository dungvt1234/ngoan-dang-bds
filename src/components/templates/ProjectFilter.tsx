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
      <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary mr-2">{label}</span>
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

// Filter client-side: tìm kiếm + phân khúc + trạng thái + "Xem thêm".
// Nhận projects từ server boundary — không đọc loader trực tiếp.
const PAGE_SIZE = 8;

export function ProjectFilter({ projects }: { projects: Project[] }) {
  const [segment, setSegment] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(PAGE_SIZE);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (segment !== "all" && p.segment !== segment) return false;
      if (status !== "all" && p.status !== status) return false;
      if (q) {
        const hay = `${p.name} ${p.location_label} ${p.tags.join(" ")}`.toLowerCase();
        // Tìm không dấu cũng ra: chuẩn hóa cả 2 phía.
        const norm = (s: string) => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        if (!norm(hay).includes(norm(q))) return false;
      }
      return true;
    });
  }, [projects, segment, status, query]);

  const shown = filtered.slice(0, visible);

  const resetPage = () => setVisible(PAGE_SIZE);

  return (
    <div>
      <div className="flex flex-col gap-4 mb-8">
        <label className="block max-w-[480px]">
          <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-secondary block mb-2">Tìm kiếm dự án</span>
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetPage();
            }}
            placeholder="Tên dự án, khu vực... (gõ không dấu vẫn ra)"
            aria-label="Tìm kiếm dự án"
            className="w-full min-h-[48px] rounded-xl border border-soft bg-clean px-4 type-small text-primary placeholder:text-secondary focus:outline-none"
          />
        </label>
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between pb-8 border-b border-soft">
          <Pills
            label="Phân khúc"
            options={SEGMENTS}
            value={segment}
            onChange={(v) => {
              setSegment(v);
              resetPage();
            }}
          />
          <Pills
            label="Trạng thái"
            options={STATUSES}
            value={status}
            onChange={(v) => {
              setStatus(v);
              resetPage();
            }}
          />
        </div>
      </div>

      <p className="type-kicker text-secondary mb-4">Danh sách dự án</p>
      <div className="flex items-baseline gap-3 mb-8">
        <h2 className="font-display text-primary font-semibold text-[1.75rem] md:text-[2.25rem] leading-tight">
          {segment === "all" && status === "all" && !query.trim() ? "Tất cả dự án" : "Kết quả lọc"}
        </h2>
        <span className="type-small text-muted">
          {filtered.length} dự án
        </span>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-dashed border-soft rounded-2xl p-10 text-center">
          <p className="type-body text-secondary mb-4">
            {query.trim()
              ? `Không tìm thấy dự án nào với "${query.trim()}".`
              : "Chưa có dự án nào thuộc nhóm này."}
          </p>
          <Link
            href="/lien-he"
            className="type-small font-medium text-primary underline decoration-accent decoration-2 underline-offset-8 hover:text-accent-hover transition-colors"
          >
            Để lại nhu cầu — Ngoan báo khi có →
          </Link>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shown.map((p, i) => (
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
            {visible < filtered.length && (
              <div className="text-center mt-10">
                <button
                  type="button"
                  onClick={() => setVisible((v) => v + PAGE_SIZE)}
                  className="inline-flex min-h-[48px] items-center px-8 rounded-full border border-primary/25 text-primary font-medium hover:border-primary transition-colors"
                >
                  Xem thêm ({filtered.length - visible} dự án)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    );
  }
