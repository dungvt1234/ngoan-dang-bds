import type { Metadata } from "next";
import { Playfair_Display, Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";

// Serif editorial cho Display/H1/H2 — có subset Vietnamese đầy đủ.
const display = Playfair_Display({
  variable: "--font-display-face",
  subsets: ["vietnamese", "latin"],
  display: "swap",
});

// Sans nhân văn cho Body/UI — thiết kế riêng cho tiếng Việt.
const sans = Be_Vietnam_Pro({
  variable: "--font-sans-face",
  subsets: ["vietnamese", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// Chữ script cho điểm nhấn personal (label ảnh, chữ ký) — có Vietnamese.
const script = Dancing_Script({
  variable: "--font-script-face",
  subsets: ["vietnamese", "latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ngoan Đặng — BĐS dự án Vũng Tàu",
  description:
    "Ngoan Đặng — thông tin và phân tích độc lập về căn hộ nghỉ dưỡng, căn hộ để ở và khu đô thị tại Vũng Tàu.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${sans.variable} ${script.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-page text-primary">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
