// Site-wide constants — nguồn duy nhất cho URL/brand dùng trong
// metadata, sitemap, robots, JSON-LD. Đổi domain production ở env.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://ngoandang.vn"
).replace(/\/$/, "");

export const SITE_NAME = "Ngoan Đặng";
export const SITE_TAGLINE = "BĐS dự án Vũng Tàu";
export const SITE_DESCRIPTION =
  "Ngoan Đặng — thông tin và phân tích độc lập về căn hộ nghỉ dưỡng, căn hộ để ở và khu đô thị tại Vũng Tàu.";

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
