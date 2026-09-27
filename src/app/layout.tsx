import type { Metadata, Viewport } from "next";
import { Playfair_Display, Be_Vietnam_Pro, Dancing_Script } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/LenisProvider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_TAGLINE } from "@/lib/site";

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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#17202A",
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://ngoandang.vn"),
  title: {
    default: `${SITE_NAME} — ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: SITE_NAME,
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
  },
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
