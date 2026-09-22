import type { ContentType } from "@/types/content";

// Mapping type → route segment duy nhất. Template/page dùng helper này,
// không hard-code "/kien-thuc" rải rác trong component.
const SEGMENTS: Record<ContentType, string> = {
  knowledge: "kien-thuc",
  analysis: "phan-tich",
  "case-study": "case-study",
  comparison: "so-sanh",
  "tin-tuc": "tin-tuc",
};

export function contentPath(type: ContentType, slug: string): string {
  return `/${SEGMENTS[type]}/${slug}`;
}

export function contentListingPath(type: ContentType): string {
  return `/${SEGMENTS[type]}`;
}
