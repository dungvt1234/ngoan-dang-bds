import type { Tag } from "@/types/content";

// Central tag registry — content chỉ được dùng tag có trong list này.
// Quy tắc: lowercase, không dấu, hyphen. Tối đa ~20 tag ở V1.
// Route /chu-de/[tag] chưa public (Phase 2-D4).
export const tags: Tag[] = [
  // chu-de
  { slug: "phap-ly", label: "Pháp lý", group: "chu-de" },
  { slug: "gia", label: "Giá", group: "chu-de" },
  { slug: "tai-chinh", label: "Tài chính", group: "chu-de" },
  { slug: "thanh-toan", label: "Thanh toán", group: "chu-de" },
  { slug: "tien-do", label: "Tiến độ", group: "chu-de" },
  { slug: "ban-giao", label: "Bàn giao", group: "chu-de" },
  { slug: "dau-tu", label: "Đầu tư", group: "chu-de" },
  // khu-vuc
  { slug: "vung-tau", label: "Vũng Tàu", group: "khu-vuc" },
  // doi-tuong
  { slug: "de-o", label: "Để ở", group: "doi-tuong" },
  { slug: "nha-dau-tu", label: "Nhà đầu tư", group: "doi-tuong" },
  { slug: "nghi-duong", label: "Nghỉ dưỡng", group: "doi-tuong" },
];

export const tagBySlug: Map<string, Tag> = new Map(tags.map((t) => [t.slug, t]));
