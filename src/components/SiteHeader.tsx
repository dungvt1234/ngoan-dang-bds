"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/data";

const CTA_HREF = "/lien-he";

// Header chung toàn site (trừ campaign layout dùng header rút gọn riêng).
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onTop = !scrolled && !mobileOpen;
  const ink = onTop ? "text-white" : "text-primary";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || mobileOpen
          ? "bg-page/90 backdrop-blur-md py-3 shadow-[0_1px_0_rgba(16,42,67,0.08)]"
          : "bg-transparent py-6"
      }`}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-8 flex items-center justify-between">
        {/* Wordmark — text, chưa có logo chính thức */}
        <Link href="/" className="flex flex-col gap-1 leading-none group" aria-label="Ngoan Đặng — trang chủ">
          <span
            className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 ${ink} group-hover:text-accent-hover`}
          >
            Ngoan Đặng
          </span>
          <span
            className={`text-xs font-semibold tracking-[0.22em] uppercase transition-colors duration-500 ${
              onTop ? "text-accent" : "text-accent-hover"
            }`}
          >
            Bất động sản Vũng Tàu
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7" aria-label="Điều hướng chính">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm font-medium transition-colors duration-300 hover:opacity-70 ${
                  onTop ? "text-white/90" : "text-primary"
                } ${active ? "underline decoration-accent decoration-2 underline-offset-8" : ""}`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            href={CTA_HREF}
            className={`ml-2 inline-flex min-h-[44px] items-center px-5 rounded-full text-sm font-medium transition-all duration-300 ${
              onTop
                ? "bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
                : "bg-accent text-ink hover:bg-accent-hover"
            }`}
          >
            Liên hệ
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Link
            href={CTA_HREF}
            className={`inline-flex min-h-[44px] items-center px-4 rounded-full text-sm font-medium transition-colors ${
              onTop ? "bg-white/10 text-white" : "bg-accent text-ink"
            }`}
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
