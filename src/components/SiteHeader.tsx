"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";
import type { Project } from "@/types/content";

const CTA_HREF = "/lien-he";

const SERVICE_LINKS = [
  { label: "Tư vấn mua để ở", href: "/dich-vu#mua-de-o" },
  { label: "Tư vấn đầu tư", href: "/dich-vu#dau-tu" },
  { label: "Kiểm chứng & đồng hành", href: "/dich-vu#kiem-chung" },
  { label: "Tư vấn cho thuê", href: "/dich-vu#cho-thue" },
];

// Header chung toàn site (trừ campaign layout dùng header rút gọn riêng).
// Nhận lists từ layout server cho các dropdown.
export function SiteHeader({
  projects = [],
  analyses = [],
  knowledges = [],
}: {
  projects?: Pick<Project, "slug" | "name">[];
  analyses?: { slug: string; title: string }[];
  knowledges?: { slug: string; title: string }[];
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Header luôn nền sáng đặc (không trong suốt) để đọc được trên mọi trang,
  // kể cả trang nền sáng. Hero tối vẫn ổn vì header tách nền riêng.
  const ink = "text-primary";

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 bg-page/90 backdrop-blur-md shadow-[0_1px_0_rgba(16,42,67,0.08)] py-3"
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Wordmark text (tạm thay logo ảnh) */}
        <Link href="/" className="flex flex-col gap-1 leading-none group" aria-label="Ngoan Đặng — trang chủ">
          <span
            className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 ${ink} group-hover:text-accent-hover`}
          >
            Ngoan Đặng
          </span>
          <span className="text-xs font-semibold tracking-[0.22em] uppercase transition-colors duration-500 text-accent-hover">
            Bất động sản Vũng Tàu
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Điều hướng chính">
          {navLinks.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const isProjects = link.href === "/du-an";
            const isServices = link.href === "/dich-vu";
            const isAnalysis = link.href === "/phan-tich";
            const isKnowledge = link.href === "/kinh-nghiem-mua-nha";
            if (!isProjects && !isServices && !isAnalysis && !isKnowledge) {
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`text-sm font-medium transition-colors duration-300 hover:opacity-70 text-primary ${active ? "underline decoration-accent decoration-2 underline-offset-8" : ""}`}
                >
                  {link.label}
                </Link>
              );
            }
            const items = isProjects
              ? [
                  { label: "Tất cả dự án", href: "/du-an" },
                  ...projects.map((p) => ({ label: p.name, href: `/du-an/${p.slug}` })),
                ]
              : isServices
                ? SERVICE_LINKS
                : isAnalysis
                  ? [
                      { label: "Tất cả phân tích", href: "/phan-tich" },
                      ...analyses.map((a) => ({ label: a.title, href: `/phan-tich/${a.slug}` })),
                    ]
                  : [
                      { label: "Tất cả bài viết", href: "/kinh-nghiem-mua-nha" },
                      ...knowledges.map((a) => ({ label: a.title, href: `/kien-thuc/${a.slug}` })),
                    ];
            return (
              <div key={link.href} className="relative group">
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  aria-haspopup="true"
                  className={`inline-flex items-center gap-1 py-2 text-sm font-medium transition-colors duration-300 hover:opacity-70 text-primary ${active ? "underline decoration-accent decoration-2 underline-offset-8" : ""}`}
                >
                  {link.label}
                  <span aria-hidden="true" className="text-xs text-secondary transition-transform duration-300 group-hover:rotate-180">
                    ▾
                  </span>
                </Link>
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 transition-all duration-300">
                  <ul className="w-64 rounded-xl border border-soft bg-clean shadow-xl p-2">
                    {items.map((item) => (
                      <li key={item.href + item.label}>
                        <Link
                          href={item.href}
                          className="block rounded-lg px-4 py-3 text-sm text-primary hover:bg-page hover:text-accent-hover transition-colors"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
          <Link
            href={CTA_HREF}
            className="ml-2 inline-flex min-h-[44px] items-center px-5 rounded-full text-sm font-medium transition-all duration-300 bg-accent text-ink hover:bg-accent-hover"
          >
            Liên hệ
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href={CTA_HREF}
            className="inline-flex min-h-[44px] items-center px-4 rounded-full text-sm font-medium transition-colors bg-accent text-ink"
          >
            Liên hệ
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Đóng menu" : "Mở menu"}
            className={`w-11 h-11 flex flex-col items-center justify-center gap-1.5 transition-colors ${ink}`}
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                mobileOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ${
          mobileOpen ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav
          className="bg-page mx-5 mt-4 p-6 rounded-2xl flex flex-col gap-1 border border-soft"
          aria-label="Điều hướng di động"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              aria-current={pathname === link.href ? "page" : undefined}
              className="text-primary text-lg font-medium py-3 min-h-[48px] flex items-center border-b border-soft last:border-0"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
