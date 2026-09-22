import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { navLinks } from "@/lib/data";

// Footer chung toàn site. Thông tin liên hệ thật chưa có → ghi rõ
// "đang cập nhật", không bịa số điện thoại/email.
export function SiteFooter() {
  return (
    <footer className="bg-ink text-ondark py-16 md:py-20">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 mb-16">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="relative h-14 w-auto max-w-[220px] mb-6">
              <Image
                src="/images/logo.jpg"
                alt="Ngoan Đặng — Real Estate Analyst"
                fill
                sizes="220px"
                className="object-contain object-left"
              />
            </div>
            <p className="text-[11px] tracking-[0.18em] uppercase text-ondark/60 mb-6">
              BĐS dự án Vũng Tàu
            </p>
            <p className="text-ondark/60 text-sm leading-relaxed max-w-xs">
              Thông tin và phân tích độc lập về căn hộ nghỉ dưỡng, căn hộ để
              ở và khu đô thị tại Vũng Tàu.
            </p>
          </div>

          {/* Khám phá */}
          <nav aria-label="Khám phá">
            <h2 className="text-ondark/60 text-xs tracking-wider uppercase mb-6">
              Khám phá
            </h2>
            <ul className="space-y-3">
              {navLinks.slice(1).map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-ondark/70 hover:text-ondark text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Ngoan Đặng */}
          <nav aria-label="Về Ngoan Đặng">
            <h2 className="text-ondark/60 text-xs tracking-wider uppercase mb-6">
              Ngoan Đặng
            </h2>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/ve-ngoan"
                  className="text-ondark/70 hover:text-ondark text-sm transition-colors"
                >
                  Về Ngoan
                </Link>
              </li>
              <li>
                <Link
                  href="/lien-he"
                  className="text-ondark/70 hover:text-ondark text-sm transition-colors"
                >
                  Liên hệ
                </Link>
              </li>
              <li>
                <Link
                  href="/chinh-sach-bao-mat"
                  className="text-ondark/70 hover:text-ondark text-sm transition-colors"
                >
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </nav>

          {/* Liên hệ */}
          <div>
            <h2 className="text-ondark/60 text-xs tracking-wider uppercase mb-6">
              Liên hệ
            </h2>
            <ul className="space-y-3 text-sm text-ondark/70">
              <li>Vũng Tàu, Việt Nam</li>
              <li>
                <a href="tel:+84906477923" className="hover:text-ondark transition-colors">
                  Điện thoại/Zalo: 0906 477 923
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/ngoan.dang.739"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-ondark transition-colors"
                >
                  Messenger: Ngoan Đặng
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-ondark/60 text-sm">
            &copy; 2026 Ngoan Đặng. All rights reserved.
          </p>
          <Link
            href="/chinh-sach-bao-mat"
            className="text-ondark/60 hover:text-ondark text-sm transition-colors"
          >
            Chính sách bảo mật
          </Link>
        </div>
      </Container>
    </footer>
  );
}
