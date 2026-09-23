import { NavLink } from "@/types";

// Navigation chính — dùng chung cho SiteHeader và SiteFooter.
// Data demo cũ (featuredProperties, collections, testimonials, services)
// đã xóa cùng các component cinematic không còn dùng (9/2026).
export const navLinks: NavLink[] = [
  { label: "Trang chủ", href: "/" },
  { label: "Dự án", href: "/du-an" },
  { label: "Kinh nghiệm mua nhà", href: "/kinh-nghiem-mua-nha" },
  { label: "Phân tích", href: "/phan-tich" },
  { label: "Dịch vụ", href: "/dich-vu" },
  { label: "Tin tức & Sự kiện", href: "/tin-tuc" },
  { label: "Về Ngoan", href: "/ve-ngoan" },
];
